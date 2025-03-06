export class SpeechHelper {
    private audioContext: AudioContext | null = null;
    private analyser: AnalyserNode | null = null;
    private dataArray: Uint8Array | null = null;
    private mediaStream: MediaStream | null = null;
    private recorder: MediaRecorder | null = null;
    private audioChunks: Blob[] = [];
    private silenceTimer: NodeJS.Timeout | null = null;
    private isListening: boolean = false;
    public isAiSpeaking: boolean = false;
    private noiseFloor: number = 0;
    private volumeHistory: number[] = [];
    private readonly HISTORY_SIZE = 50;  // Keep track of last 50 volume readings

    constructor(
        private threshold: number = 20,
        private silenceDelay: number = 2000,
        private minSpeechDuration: number = 300  // Minimum duration to consider as speech
    ) { }

    async initialize() {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        this.mediaStream = await navigator.mediaDevices.getUserMedia({
            audio: {
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true
            }
        });
        const source = this.audioContext.createMediaStreamSource(this.mediaStream);

        // Create and configure nodes
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 2048;
        this.analyser.smoothingTimeConstant = 0.8;

        // Enhanced filter chain with more aggressive noise filtering
        const preGain = this.audioContext.createGain();
        preGain.gain.setValueAtTime(1.5, this.audioContext.currentTime);

        // High-pass filter (remove more low frequency noise)
        const highPassFilter = this.audioContext.createBiquadFilter();
        highPassFilter.type = 'highpass';
        highPassFilter.frequency.setValueAtTime(200, this.audioContext.currentTime);
        highPassFilter.Q.setValueAtTime(1.5, this.audioContext.currentTime);

        // Low-pass filter (remove more high frequency noise)
        const lowPassFilter = this.audioContext.createBiquadFilter();
        lowPassFilter.type = 'lowpass';
        lowPassFilter.frequency.setValueAtTime(3500, this.audioContext.currentTime);
        lowPassFilter.Q.setValueAtTime(1.5, this.audioContext.currentTime);

        // Dynamic compressor to handle sudden volume changes
        const compressor = this.audioContext.createDynamicsCompressor();
        compressor.threshold.setValueAtTime(-24, this.audioContext.currentTime);
        compressor.knee.setValueAtTime(30, this.audioContext.currentTime);
        compressor.ratio.setValueAtTime(12, this.audioContext.currentTime);
        compressor.attack.setValueAtTime(0.003, this.audioContext.currentTime);
        compressor.release.setValueAtTime(0.25, this.audioContext.currentTime);

        // Connect the audio processing chain
        source
            .connect(preGain)
            .connect(highPassFilter)
            .connect(lowPassFilter)
            .connect(compressor)
            .connect(this.analyser)
        // .connect(this.audioContext.destination);

        this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);

        // Initialize MediaRecorder with optimal settings for speech
        this.recorder = new MediaRecorder(this.mediaStream, {
            mimeType: 'audio/webm;codecs=opus',
            bitsPerSecond: 24000 // Reduced bitrate optimized for speech
        });

        this.recorder.ondataavailable = (event) => this.audioChunks.push(event.data);
    }

    private calculateWeightedAverage(data: Uint8Array): number {
        // Give more weight to frequencies in the speech range (300-3000 Hz)
        let weightedSum = 0;
        let weightSum = 0;

        for (let i = 0; i < data.length; i++) {
            // Calculate approximate frequency for this bin
            const freq = (i * this.audioContext!.sampleRate) / (2 * data.length);
            let weight = 1;

            if (freq >= 300 && freq <= 3000) {
                weight = 2;  // Double weight for speech frequencies
                if (freq >= 1000 && freq <= 2000) {
                    weight = 3;  // Triple weight for core speech frequencies
                }
            }

            weightedSum += data[i] * weight;
            weightSum += weight;
        }

        return weightedSum / weightSum;
    }

    startListening(onStart: () => void, onStop: (audioBlob: Blob) => void) {
        if (!this.analyser || !this.dataArray || !this.recorder) {
            throw new Error('SpeechHelper is not initialized. Call initialize() first.');
        }

        let speechStartTime = 0;

        const detectSpeech = () => {
            this.analyser!.getByteFrequencyData(this.dataArray!);
            const weightedVolume = this.calculateWeightedAverage(this.dataArray!);

            // Update volume history
            this.volumeHistory.push(weightedVolume);
            if (this.volumeHistory.length > this.HISTORY_SIZE) {
                this.volumeHistory.shift();
            }

            // Calculate moving average
            const movingAverage = this.volumeHistory.reduce((sum, vol) => sum + vol, 0) /
                this.volumeHistory.length;

            if (weightedVolume > this.threshold && movingAverage > (this.noiseFloor * 1.5)) {
                // i don't want it to start listening if it is speaking
                if (!this.isListening) {
                    speechStartTime = Date.now();
                    this.isListening = true;
                    console.log('Speech detected:', weightedVolume, 'vs threshold:', this.threshold);
                    this.audioChunks = [];
                    this.recorder!.start();
                    onStart();
                }
                if (this.silenceTimer) {
                    clearTimeout(this.silenceTimer);
                    this.silenceTimer = null;
                }
            } else if (this.isListening) {
                if (!this.silenceTimer) {
                    this.silenceTimer = setTimeout(() => {
                        const speechDuration = Date.now() - speechStartTime;

                        if (speechDuration >= this.minSpeechDuration) {
                            this.isListening = false;
                            console.log('Speech ended. Duration:', speechDuration, 'ms');
                            this.recorder!.stop();
                            this.recorder!.onstop = () => {
                                const audioBlob = new Blob(this.audioChunks, { type: 'audio/mp3' });
                                onStop(audioBlob);
                            };
                        } else {
                            console.log('Ignored short speech segment:', speechDuration, 'ms');
                            this.isListening = false;
                            this.audioChunks = [];
                        }
                    }, this.silenceDelay);
                }
            }

            requestAnimationFrame(detectSpeech);
        };

        detectSpeech();
    }

    aiSpeaking() {
        this.isAiSpeaking = true;
    }
    aiStoppedSpeaking() {
        this.isAiSpeaking = false;
    }
    stopListening() {
        if (this.mediaStream) {
            this.mediaStream.getTracks().forEach((track) => track.stop());
        }
        if (this.audioContext) {
            this.audioContext.close();
        }
        if (this.silenceTimer) {
            clearTimeout(this.silenceTimer);
        }
        this.isListening = false;
    }
}