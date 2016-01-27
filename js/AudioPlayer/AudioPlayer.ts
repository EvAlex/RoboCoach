
interface IResource<T> {
    url: string;
    data: T;
}

interface IAudioFileMetadata {
    /** Duration, in milliseconds */
    duration: number;
    /** Delay before any sounds appear in audio file playback, in milliseconds */
    playbackStart: number;
    /**
     * Delay before playback median in audio file is reached, in milliseconds.
     * By playback median I simply mean "the most interesting part", the thing,
     * that is the main in the whole audio track, the apogee.
     */
    playbackMedian: number;
    /** End of the sound in the playback, in milliseconds */
    playbackEnd: number;
}

interface IAudioFile extends IResource<AudioBuffer> {
    audioMetadata: IAudioFileMetadata;
}

interface IAudioPlayerResources {
    prepare: IAudioFile;
    start: IAudioFile;
    finish: IAudioFile;
}

interface IAudioFilePlayer {
    file: IAudioFile;
    play(): Promise<void>;
    stop(): void;
}

interface IGetFilePlayersResult {
    prepare: IAudioFilePlayer;
    start: IAudioFilePlayer;
}

export class AudioPlayer {
    private resources: IAudioPlayerResources;
    private context: AudioContext;
    private currentPlayer: IAudioFilePlayer = null;

    constructor(resources: IAudioPlayerResources) {
        this.resources = resources;
        this.loadResources();
        this.context = new AudioContext();
    }

    public getFiles(): IAudioPlayerResources {
        return this.resources;
    }

    public play(file: IAudioFile): Promise<void> {
        if (this.currentPlayer !== null) {
            this.currentPlayer.stop();
        }
        this.currentPlayer = new AudioFilePlayer(file, this.context);
        return this.currentPlayer.play();
    }

    public stop(): void {
        if (this.currentPlayer !== null) {
            this.currentPlayer.stop();
        }
    }

    private loadResources(): Promise<any> {
        return Promise.all([
            this.loadResource(this.resources.prepare.url)
                .then(d => this.decodeResource(d))
                .then(d => this.resources.prepare.data = d),
            this.loadResource(this.resources.start.url)
                .then(d => this.decodeResource(d))
                .then(d => this.resources.start.data = d),
            this.loadResource(this.resources.finish.url)
                .then(d => this.decodeResource(d))
                .then(d => this.resources.finish.data = d),
        ]);
    }

    private loadResource(url: string): Promise<ArrayBuffer> {
        var d: Promise.Resolver<ArrayBuffer> = Promise.defer<ArrayBuffer>(),
            xhr: XMLHttpRequest = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.responseType = "arraybuffer";
        xhr.onload = e => {
            if (xhr.readyState === 4) {
                d.resolve(xhr.response);
            }
        };
        xhr.send();
        return d.promise;
    }

    private decodeResource(audioData: ArrayBuffer): Promise<AudioBuffer> {
        var d: Promise.Resolver<AudioBuffer> = Promise.defer<AudioBuffer>();
        this.context.decodeAudioData(
            audioData,
            decodedAudioData => d.resolve(decodedAudioData),
            () => {
                let error: string = "Error decoding audio file.";
                console.error("Error decoding audio file.", error);
                d.reject(error);
            });
        return d.promise;
    }
}

class AudioFilePlayer implements IAudioFilePlayer {

    constructor(file: IAudioFile, context: AudioContext) {
        this.file = file;
        this.context = context;
        this.playResolver = null;
    }

    public file: IAudioFile;

    private context: AudioContext;
    private source: AudioBufferSourceNode;
    private playResolver: Promise.Resolver<void>;

    play(): Promise<void> {
        if (this.playResolver === null) {
            this.playResolver = Promise.defer<void>();

            this.source = this.context.createBufferSource();
            this.source.buffer = this.file.data;
            var destination: AudioDestinationNode = this.context.destination;
            this.source.connect(destination);
            this.source.start(
                this.context.currentTime,
                this.file.audioMetadata.playbackStart / 1000,
                this.file.audioMetadata.duration / 1000);

            this.source.onended = e => {
                if (this.playResolver !== null) {
                    this.playResolver.resolve();
                    this.playResolver = null;
                }
            };
        }
        return this.playResolver.promise;
    }

    stop(): void {
        this.source.stop(this.context.currentTime);
        if (this.playResolver !== null) {
            this.playResolver.reject("Stopped by calling AudioFilePlayer.stop()");
            this.playResolver = null;
        }
    }
}

function getCorrectUrl(relativeOrAbsolute: string): string {
    "use strict";
    return relativeOrAbsolute.indexOf("http") === -1
        ? relativeOrAbsolute.indexOf("/") === 0
            ? relativeOrAbsolute
            : "/" + relativeOrAbsolute
        : relativeOrAbsolute;
}

var player: AudioPlayer = new AudioPlayer({
    prepare: {
        url: getCorrectUrl(require("./prepare.mp3")),
        data: null,
        audioMetadata: {
            duration: 3240,
            playbackStart: 730,
            playbackMedian: 990,
            playbackEnd: 2100
        }
    },
    start: {
        url: getCorrectUrl(require("./start.mp3")),
        data: null,
        audioMetadata: {
            duration: 1410,
            playbackStart: 160,
            playbackMedian: 260,
            playbackEnd: 830
        }
    },
    finish: {
        url: getCorrectUrl(require("./finish.mp3")),
        data: null,
        audioMetadata: {
            duration: 2190,
            playbackStart: 100,
            playbackMedian: 210,
            playbackEnd: 1360
        }
    }
});

// Test: window["AudioPlayer"] = player;

export default player;
