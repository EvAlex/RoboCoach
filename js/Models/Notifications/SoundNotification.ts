/// <reference path="./INotification.d.ts" />
import audioPlayer from "../../AudioPlayer/AudioPlayer";
import {IAudioFile} from "../../AudioPlayer/AudioPlayer";

export default class SoundNotification implements INotification {
    private pTime: number;
    private pIsCompleted: boolean;
    private audioFile: IAudioFile;

    constructor(time: number, audioFile: IAudioFile) {
        this.pTime = time;
        this.audioFile = audioFile;
        this.pIsCompleted = false;
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
        audioPlayer.play(this.audioFile);
    }
}
