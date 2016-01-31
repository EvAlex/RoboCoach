/// <reference path="./INotification.d.ts" />
import audioPlayer from "../../AudioPlayer/AudioPlayer";
import {IAudioFile} from "../../AudioPlayer/AudioPlayer";

export default class SoundNotification implements INotification {
    private _time: number;
    private _isCompleted: boolean;
    private audioFile: IAudioFile;

    constructor(time: number, audioFile: IAudioFile) {
        this._time = time;
        this.audioFile = audioFile;
        this._isCompleted = false;
    }

    public get time(): number {
        return this._time;
    }

    public get isCompleted():boolean {
        return this._isCompleted;
    }

    public set isCompleted(isCompleted: boolean){
        this._isCompleted = isCompleted;
    }

    public play(): void {
        audioPlayer.play(this.audioFile);
    }
}
