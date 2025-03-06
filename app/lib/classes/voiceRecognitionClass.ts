class VoiceRecognition {
    private recognition: any | null = null;
    private isSpeaking: boolean = false;

    constructor(private onCommand: (command: string) => void) {
        const SpeechRecognition =
            (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (SpeechRecognition) {
            this.recognition = new SpeechRecognition();
            this.recognition.lang = "en-US";
            this.recognition.continuous = true; // Enable long speech support
            this.recognition.interimResults = true; // Capture partial results

            this.recognition.onresult = (event: any) => {
                let transcript = "";
                for (let i = 0; i < event.results.length; i++) {
                    transcript += event.results[i][0].transcript;
                }
                this.onCommand(transcript);
                console.log(`Transcript: ${transcript}`);
            };

            this.recognition.onerror = (event: any) => {
                console.error("SpeechRecognition Error:", event.error);
                this.isSpeaking = false;
            };

            this.recognition.onstart = () => {
                console.log("Listening started");
                this.isSpeaking = true;
            };

            this.recognition.onspeechend = () => {
                console.log("Speech ended");
            };

            this.recognition.onend = () => {
                console.log("Listening stopped. Restarting...");
                this.isSpeaking = false;
                if (this.recognition) {
                    this.recognition.start(); // Restart listening
                }
            };
        } else {
            console.error("Speech Recognition API not supported in this browser.");
        }
    }

    public startListening(): void {
        if (this.recognition) {
            try {
                this.recognition.start();
            } catch (error) {
                console.error("Error starting recognition:", error);
            }
        } else {
            console.error("SpeechRecognition instance is not initialized.");
        }
    }

    public isCurrentlySpeaking(): boolean {
        return this.isSpeaking;
    }
}
