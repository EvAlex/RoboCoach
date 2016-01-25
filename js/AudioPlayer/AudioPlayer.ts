
require("url-loader?mimetype=audio/mpeg!./prepare.mp3");
require("url-loader?mimetype=audio/mpeg!./start.mp3");
require("url-loader?mimetype=audio/mpeg!./finish.mp3");

export class AudioPlayer {
    public playPrepare(): void {
        console.log("=======> prepare");
    }

    public playStart(): void {
        console.log("=======> start");
    }

    public playFinish(): void {
        console.log("=======> finish");
    }
}

export default new AudioPlayer();
