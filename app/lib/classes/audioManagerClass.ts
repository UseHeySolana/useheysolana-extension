import { Connection } from "@solana/web3.js";
import { processAudio } from "../helpers/ai";
import { playText, transcribeAudio } from "../helpers/deepgram";
import { SpeechHelper } from "./speechHelperBlob";
import { UserDetails } from "@/context/UserSettingsProvider";

// AudioManager.ts
export class AudioManager {
    private speechHelper: SpeechHelper | null = null;
    private isListening: boolean = false;
    public isAIPlaying: boolean = false;
    public callbacks: {
        onSpeechStart: () => void;
        onSpeechEnd: () => void;
        onProcessingStart: () => void;
        onProcessingEnd: () => void;
        onAiSpeakingStart: () => void;
        onAiSpeakingEnd: () => void;
    };

    constructor(
        public connection: Connection,
        public userDetails: UserDetails,
        callbacks: {
            onSpeechStart: () => void;
            onSpeechEnd: () => void;
            onProcessingStart: () => void;
            onProcessingEnd: () => void;
            onAiSpeakingStart: () => void;
            onAiSpeakingEnd: () => void;
        }) {
        this.callbacks = callbacks;
    }

    updateUserDetails(connection: Connection, userDetails: UserDetails) {
        this.connection = connection;
        this.userDetails = userDetails;
    }
    async initialize() {
        this.speechHelper = new SpeechHelper(20, 1000, 200);
        await this.speechHelper.initialize();
    }

    async startListeningToUser(): Promise<any> {
        // Don't start listening if AI is playing audio
        if (this.isListening || this.isAIPlaying) return;

        if (!this.speechHelper) {
            await this.initialize();
        }
        this.speechHelper?.startListening(
            () => {
                // Speech started callback
                this.callbacks.onSpeechStart();
                console.log("speaking called");
                this.isListening = true;
            },
            async (audio: any) => {
                this.stopListening();
                this.callbacks.onSpeechEnd();
                this.callbacks.onProcessingStart()
                const transcribeText = await transcribeAudio(audio);
                await this.convertAudioAndRespond(transcribeText);
                this.isListening = false;
            }
        )
    }

    async convertAudioAndRespond(text: string,): Promise<any> {
        const feedback = await processAudio(this, text);
        const audioFeedback = await playText(this, feedback, true)
    }

    async afterAudio() {
        setTimeout(async () => {
            console.log("Audio has ended here");
            this.callbacks.onAiSpeakingEnd();
            const file = await this.initialize();
            const file2 = await this.startListeningToUser();
        }, 1000);
    }

    stopListening() {
        if (!this.isListening) return;
        this.speechHelper?.stopListening();
        console.log("Stopped Listening");
        this.isListening = false;
        this.callbacks.onSpeechEnd();
    }

    cleanup() {
        this.stopListening();
        this.speechHelper = null;
    }
}