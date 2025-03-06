import { UserDetails } from "@/context/UserSettingsProvider";
import { toolFunctions } from "./functions";
import { Connection } from "@solana/web3.js";

class SessionManager {
    private isSessionActive: boolean;
    private events: any[];
    private dataChannel: RTCDataChannel | null;
    private peerConnection: RTCPeerConnection | null;
    private audioElement: HTMLAudioElement | null;
    private memory: any[];
    private memoryLimit: number = 7;
    private storageKey: string = "ai_session_memory";
    private systemInstructions: string = "";
    private availableFunctions: any[] = [];

    constructor(public userDetails: UserDetails, public connection: Connection) {
        this.isSessionActive = false;
        this.events = [];
        this.memory = this.loadMemory();
        this.dataChannel = null;
        this.peerConnection = null;
        this.audioElement = null;
        this.registerFunctions(toolFunctions(this))
    }

    async startSession(systemInstructions?: string): Promise<void> {
        // Set system instructions if provided
        if (systemInstructions) {
            this.systemInstructions = systemInstructions;
        }

        const tokenResponse = await fetch("/api/open-token");
        const data = await tokenResponse.json();
        const EPHEMERAL_KEY: string = data.client_secret.value;

        this.peerConnection = new RTCPeerConnection();

        if (!this.audioElement) {
            this.audioElement = document.createElement("audio");
            this.audioElement.autoplay = true;
            this.audioElement.controls = true;
            // this.audioElement.playsInline = true;
            document.body.appendChild(this.audioElement);
        }

        this.peerConnection.ontrack = (event: RTCTrackEvent) => {
            if (event.streams && event.streams[0] && this.audioElement) {
                this.audioElement.srcObject = event.streams[0];
            }
        };

        const ms = await navigator.mediaDevices.getUserMedia({ audio: true });
        ms.getTracks().forEach(track => this.peerConnection!.addTrack(track, ms));

        this.dataChannel = this.peerConnection.createDataChannel("oai-events");

        const offer = await this.peerConnection.createOffer();
        await this.peerConnection.setLocalDescription(offer);

        const baseUrl = "https://api.openai.com/v1/realtime";
        const model = "gpt-4o-realtime-preview-2024-12-17";
        const sdpResponse = await fetch(`${baseUrl}?model=${model}`, {
            method: "POST",
            body: offer.sdp,
            headers: {
                Authorization: `Bearer ${EPHEMERAL_KEY}`,
                "Content-Type": "application/sdp",
            },
        });

        const answer: RTCSessionDescriptionInit = { type: "answer", sdp: await sdpResponse.text() };
        await this.peerConnection.setRemoteDescription(answer);

        this.dataChannel.addEventListener("message", (e: MessageEvent) => {
            const message = JSON.parse(e.data);
            this.events.unshift(message);
            this.updateMemory(message);


            if (message.type === "response.audio_transcript.done") {
                console.log(message.transcript)
            }
            // Handle function calls from the model
            if (message.type === "response.done" &&
                message.response?.output &&
                message.response.output.length > 0 &&
                message.response.output[0].type === "function_call") {
                console.log("function call");
                this.handleFunctionCall(message.response.output[0]);
            }
        });

        this.dataChannel.addEventListener("open", () => {
            this.isSessionActive = true;
            this.events = [];
            // Send system instructions when connection opens
            if (this.systemInstructions) {
                this.updateSystemInstructions(this.systemInstructions);
            }

            // Register available functions if any
            if (this.availableFunctions.length > 0) {
                this.registerFunctions(this.availableFunctions);
            }
        });

        console.log("Session started and ready for audio streaming.");
    }

    stopSession(): void {
        if (this.dataChannel) this.dataChannel.close();
        if (this.peerConnection) {
            this.peerConnection.getSenders().forEach((sender) => sender.track?.stop());
            this.peerConnection.close();
        }
        this.isSessionActive = false;
        this.dataChannel = null;
        this.peerConnection = null;
    }

    sendClientEvent(message: any): void {
        if (this.dataChannel) {
            message.event_id = message.event_id || crypto.randomUUID();
            this.dataChannel.send(JSON.stringify(message));
            this.events.unshift(message);
            this.updateMemory(message);
        } else {
            console.error("No data channel available", message);
        }
    }

    sendTextMessage(message: string): void {
        const event = {
            type: "conversation.item.create",
            item: {
                type: "message",
                role: "user",
                content: [{ type: "input_text", text: message }],
            },
            memory: this.memory,
        };
        this.sendClientEvent(event);
        this.sendClientEvent({ type: "response.create" });
    }

    /**
     * Updates the system instructions for the session
     */
    updateSystemInstructions(instructions: string): void {
        this.systemInstructions = instructions;

        if (this.isSessionActive) {
            const event = {
                type: "session.update",
                session: {
                    instructions: instructions
                }
            };
            this.sendClientEvent(event);
        }
    }

    /**
     * Registers functions that the model can call
     */
    registerFunctions(functions: any[]): void {
        this.availableFunctions = functions;
        console.log(functions);

        if (this.isSessionActive) {
            const event = {
                type: "session.update",
                session: {
                    tools: functions.map(fn => ({
                        type: "function",
                        name: fn.name,
                        description: fn.description,
                        parameters: fn.parameters
                    })),
                    tool_choice: "auto"
                }
            };
            this.sendClientEvent(event);
        }
    }

    /**
     * Handles a function call from the model
     */
    private async handleFunctionCall(functionCall: any): Promise<void> {
        const { name, arguments: argsJson, call_id } = functionCall;
        console.log(`Function call received: ${name}`, argsJson);

        try {
            // Find the registered function handler
            const functionDef = this.availableFunctions.find(fn => fn.name === name);

            if (!functionDef || !functionDef.handler) {
                throw new Error(`No handler found for function: ${name}`);
            }

            // Parse arguments
            const args = JSON.parse(argsJson);

            // Execute the function
            const result = await functionDef.handler(args);

            // Send the result back to the model
            const resultEvent = {
                type: "conversation.item.create",
                item: {
                    type: "function_call_output",
                    call_id: call_id,
                    output: JSON.stringify(result)
                }
            };

            this.sendClientEvent(resultEvent);

            // Trigger a new response
            this.sendClientEvent({ type: "response.create" });

        } catch (error: any) {
            console.error(`Error executing function ${name}:`, error);

            // Send error back to the model
            const errorEvent = {
                type: "conversation.item.create",
                item: {
                    type: "function_call_output",
                    call_id: call_id,
                    output: JSON.stringify({ error: `Error executing function: ${error.message}` })
                }
            };

            this.sendClientEvent(errorEvent);
            this.sendClientEvent({ type: "response.create" });
        }
    }

    /**
     * Add a single function to the available functions
     */
    addFunction(name: string, description: string, parameters: any, handler: Function): void {
        const functionDef = {
            name,
            description,
            parameters,
            handler
        };

        this.availableFunctions.push(functionDef);

        // If session is active, update the available tools
        if (this.isSessionActive) {
            this.registerFunctions(this.availableFunctions);
        }
    }

    private updateMemory(message: any): void {
        this.memory.unshift(message);
        if (this.memory.length > this.memoryLimit) {
            this.memory.pop();
        }
        localStorage.setItem(this.storageKey, JSON.stringify(this.memory));
    }

    private loadMemory(): any[] {
        const storedMemory = localStorage.getItem(this.storageKey);
        return storedMemory ? JSON.parse(storedMemory) : [];
    }
}

export default SessionManager;



// class SessionManager {
//     private isSessionActive: boolean;
//     private events: any[];
//     private dataChannel: RTCDataChannel | null;
//     private peerConnection: RTCPeerConnection | null;
//     private audioElement: HTMLAudioElement | null;
//     private memory: any[];
//     private memoryLimit: number = 5;
//     private storageKey: string = "ai_session_memory";
//     private systemInstructions: string = "";
//     private availableFunctions: any[] = [];
//     private voiceId: string = "nova"; // Default voice

//     constructor() {
//         this.isSessionActive = false;
//         this.events = [];
//         this.memory = this.loadMemory();
//         this.dataChannel = null;
//         this.peerConnection = null;
//         this.audioElement = null;
//     }

//     /**
//      * Sets the voice to use for the AI's responses
//      * @param voiceId The ID of the voice to use (e.g., "alloy", "echo", "fable", "onyx", "nova", "shimmer")
//      */
//     setVoice(voiceId: string): void {
//         this.voiceId = voiceId;

//         // If session is already active, update the voice preference
//         if (this.isSessionActive) {
//             this.updateVoicePreference();
//         }
//     }

//     /**
//      * Updates the voice preference for the current session
//      */
//     private updateVoicePreference(): void {
//         if (this.isSessionActive) {

//             const event = {
//                 type: "session.update",
//                 session: {
//                     output_format: {
//                         type: "speech",
//                         voice: this.voiceId
//                     }
//                 }
//             };
//             this.sendClientEvent(event);
//             console.log("set voice",this.voiceId) 
//         }
//     }

//     async startSession(systemInstructions?: string): Promise<void> {
//         // Set system instructions if provided
//         if (systemInstructions) {
//             this.systemInstructions = systemInstructions;
//         }

//         const tokenResponse = await fetch("/api/open-token");
//         const data = await tokenResponse.json();
//         const EPHEMERAL_KEY: string = data.client_secret.value;

//         this.peerConnection = new RTCPeerConnection();

//         if (!this.audioElement) {
//             this.audioElement = document.createElement("audio");
//             this.audioElement.autoplay = true;
//             this.audioElement.controls = true;
//             // this.audioElement.playsInline = true;
//             document.body.appendChild(this.audioElement);
//         }

//         this.peerConnection.ontrack = (event: RTCTrackEvent) => {
//             if (event.streams && event.streams[0] && this.audioElement) {
//                 this.audioElement.srcObject = event.streams[0];
//             }
//         };

//         const ms = await navigator.mediaDevices.getUserMedia({ audio: true });
//         ms.getTracks().forEach(track => this.peerConnection!.addTrack(track, ms));

//         this.dataChannel = this.peerConnection.createDataChannel("oai-events");

//         const offer = await this.peerConnection.createOffer();
//         await this.peerConnection.setLocalDescription(offer);

//         const baseUrl = "https://api.openai.com/v1/realtime";
//         const model = "gpt-4o-realtime-preview-2024-12-17";
//         const sdpResponse = await fetch(`${baseUrl}?model=${model}`, {
//             method: "POST",
//             body: offer.sdp,
//             headers: {
//                 Authorization: `Bearer ${EPHEMERAL_KEY}`,
//                 "Content-Type": "application/sdp",
//             },
//         });

//         const answer: RTCSessionDescriptionInit = { type: "answer", sdp: await sdpResponse.text() };
//         await this.peerConnection.setRemoteDescription(answer);

//         this.dataChannel.addEventListener("message", (e: MessageEvent) => {
//             const message = JSON.parse(e.data);
//             this.events.unshift(message);
//             this.updateMemory(message);

//             // Handle function calls from the model
//             if (message.type === "response.done" &&
//                 message.response?.output &&
//                 message.response.output.length > 0 &&
//                 message.response.output[0].type === "function_call") {
//                 this.handleFunctionCall(message.response.output[0]);
//             }
//         });

//         this.dataChannel.addEventListener("open", () => {
//             this.isSessionActive = true;
//             this.events = [];

//             // Set initial configuration for voice, system instructions, and functions
//             this.setupInitialSessionConfig();
//         });

//         console.log("Session started and ready for audio streaming.");
//     }

//     /**
//      * Sets up the initial session configuration including voice, system instructions, and functions
//      */
//     private setupInitialSessionConfig(): void {
//         // Set voice preference first
//         // this.updateVoicePreference();

//         // Send system instructions when connection opens
//         if (this.systemInstructions) {
//             this.updateSystemInstructions(this.systemInstructions);
//         }

//         // Register available functions if any
//         if (this.availableFunctions.length > 0) {
//             this.registerFunctions(this.availableFunctions);
//         }
//     }

//     /**
//      * Gets a list of available voices
//      */
//     getAvailableVoices(): string[] {
//         // Return the list of voices available in OpenAI's API
//         return [
//             "alloy",    // Neutral/versatile
//             "echo",     // Male
//             "fable",    // Male with accents
//             "onyx",     // Male with deep voice
//             "nova",     // Female
//             "shimmer"   // Female with higher pitch
//         ];
//     }

//     stopSession(): void {
//         if (this.dataChannel) this.dataChannel.close();
//         if (this.peerConnection) {
//             this.peerConnection.getSenders().forEach((sender) => sender.track?.stop());
//             this.peerConnection.close();
//         }
//         this.isSessionActive = false;
//         this.dataChannel = null;
//         this.peerConnection = null;
//     }

//     sendClientEvent(message: any): void {
//         if (this.dataChannel) {
//             message.event_id = message.event_id || crypto.randomUUID();
//             this.dataChannel.send(JSON.stringify(message));
//             this.events.unshift(message);
//             this.updateMemory(message);
//         } else {
//             console.error("No data channel available", message);
//         }
//     }

//     sendTextMessage(message: string): void {
//         const event = {
//             type: "conversation.item.create",
//             item: {
//                 type: "message",
//                 role: "user",
//                 content: [{ type: "input_text", text: message }],
//             },
//             memory: this.memory,
//         };
//         this.sendClientEvent(event);
//         this.sendClientEvent({ type: "response.create" });
//     }

//     /**
//      * Updates the system instructions for the session
//      */
//     updateSystemInstructions(instructions: string): void {
//         this.systemInstructions = instructions;

//         if (this.isSessionActive) {
//             const event = {
//                 type: "session.update",
//                 session: {
//                     instructions: instructions
//                 }
//             };
//             this.sendClientEvent(event);
//         }
//     }

//     /**
//      * Registers functions that the model can call
//      */
//     registerFunctions(functions: any[]): void {
//         this.availableFunctions = functions;

//         if (this.isSessionActive) {
//             const event = {
//                 type: "session.update",
//                 session: {
//                     tools: functions.map(fn => ({
//                         type: "function",
//                         name: fn.name,
//                         description: fn.description,
//                         parameters: fn.parameters
//                     })),
//                     tool_choice: "auto"
//                 }
//             };
//             this.sendClientEvent(event);
//         }
//     }

//     /**
//      * Handles a function call from the model
//      */
//     private async handleFunctionCall(functionCall: any): Promise<void> {
//         const { name, arguments: argsJson, call_id } = functionCall;
//         console.log(`Function call received: ${name}`, argsJson);

//         try {
//             // Find the registered function handler
//             const functionDef = this.availableFunctions.find(fn => fn.name === name);

//             if (!functionDef || !functionDef.handler) {
//                 throw new Error(`No handler found for function: ${name}`);
//             }

//             // Parse arguments
//             const args = JSON.parse(argsJson);

//             // Execute the function
//             const result = await functionDef.handler(args);

//             // Send the result back to the model
//             const resultEvent = {
//                 type: "conversation.item.create",
//                 item: {
//                     type: "function_call_output",
//                     call_id: call_id,
//                     output: JSON.stringify(result)
//                 }
//             };

//             this.sendClientEvent(resultEvent);

//             // Trigger a new response
//             this.sendClientEvent({ type: "response.create" });

//         } catch (error: any) {
//             console.error(`Error executing function ${name}:`, error);

//             // Send error back to the model
//             const errorEvent = {
//                 type: "conversation.item.create",
//                 item: {
//                     type: "function_call_output",
//                     call_id: call_id,
//                     output: JSON.stringify({ error: `Error executing function: ${error.message}` })
//                 }
//             };

//             this.sendClientEvent(errorEvent);
//             this.sendClientEvent({ type: "response.create" });
//         }
//     }

//     /**
//      * Add a single function to the available functions
//      */
//     addFunction(name: string, description: string, parameters: any, handler: Function): void {
//         const functionDef = {
//             name,
//             description,
//             parameters,
//             handler
//         };

//         this.availableFunctions.push(functionDef);

//         // If session is active, update the available tools
//         if (this.isSessionActive) {
//             this.registerFunctions(this.availableFunctions);
//         }
//     }

//     private updateMemory(message: any): void {
//         this.memory.unshift(message);
//         if (this.memory.length > this.memoryLimit) {
//             this.memory.pop();
//         }
//         localStorage.setItem(this.storageKey, JSON.stringify(this.memory));
//     }

//     private loadMemory(): any[] {
//         const storedMemory = localStorage.getItem(this.storageKey);
//         return storedMemory ? JSON.parse(storedMemory) : [];
//     }
// }

// export default SessionManager;