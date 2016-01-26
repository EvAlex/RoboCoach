
interface IResource<T> {
    url: string;
    data: T;
}

interface IAudioPlayerResources {
    prepare: IResource<AudioBuffer>;
    start: IResource<AudioBuffer>;
    finish: IResource<AudioBuffer>;
}

export class AudioPlayer {
    private resources: IAudioPlayerResources;
    private context: AudioContext;

    constructor(resources: IAudioPlayerResources) {
        this.resources = resources;
        this.loadResources();
        this.context = new AudioContext();
    }

    public playPrepare(): void {
        this.playAudio(this.resources.prepare);
    }

    public playStart(): void {
        this.playAudio(this.resources.start);
    }

    public playFinish(): void {
        this.playAudio(this.resources.finish);
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

    private playAudio(resource: IResource<AudioBuffer>): void {
        var source: AudioBufferSourceNode = this.context.createBufferSource();
        source.buffer = resource.data;
        var destination: AudioDestinationNode = this.context.destination;
        source.connect(destination);
        source.start(0);
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

export default new AudioPlayer({
    prepare: {
        url: getCorrectUrl(require("./prepare.mp3")),
        data: null
    },
    start: {
        url: getCorrectUrl(require("./start.mp3")),
        data: null
    },
    finish: {
        url: getCorrectUrl(require("./finish.mp3")),
        data: null
    }
});
