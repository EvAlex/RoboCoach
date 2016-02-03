/// <reference path="./INotification.d.ts" />
import audioPlayer from "../../AudioPlayer/AudioPlayer";
import {IAudioFile} from "../../AudioPlayer/AudioPlayer";
import speechSynthesiser from "../../AudioPlayer/SpeechSynthesiser";

export default class SoundAndTextNotification implements INotification {
    private pTime: number;
    private pIsCompleted: boolean;
    private audioFile: IAudioFile;
    private pText: string;
    private pSpeechDelay: number;

    constructor(time: number, audioFile: IAudioFile, text: string, speechDelay: number) {
        this.pTime = time;
        this.audioFile = audioFile;
        this.pIsCompleted = false;
        this.pText = text;
        this.pSpeechDelay = speechDelay;
    }

    public get time(): number {
        return this.pTime;
    }

    public get isCompleted(): boolean {
        return this.pIsCompleted;
    }

    public set isCompleted(isCompleted: boolean){
        this.pIsCompleted = isCompleted;
    }

    public play(): void {

        function say(): void {
            speechSynthesiser.say(this.pText);
        }

        if (this.pSpeechDelay === -1) {
            audioPlayer
                .play(this.audioFile)
                .then(say.bind(this));
        } else {
            audioPlayer.play(this.audioFile);
            window.setTimeout(say.bind(this), this.pSpeechDelay);
        }
    }
}
