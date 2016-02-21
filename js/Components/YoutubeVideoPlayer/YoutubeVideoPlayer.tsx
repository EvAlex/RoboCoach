import React = require("react");
import Promise = require("bluebird");
import GoogleApi from "../../BackendApi/GoogleApi";
import Navbar from "../Navbar/Navbar";

export interface IYoutubeVideoPlayerProps {
    url: string;
}

export default class YoutubeVideoPlayer extends React.Component<IYoutubeVideoPlayerProps, {}> {
    private videoPlayer: YoutubePlayer;

    constructor() {
        super();
        this.videoPlayer = new YoutubePlayer();
    }

    render(): React.ReactElement<{}> {
        return <div></div>;
    }

    componentWillMount(): void {
        this.processUrl(this.props.url);
    }

    componentWillReceiveProps(nextProps: IYoutubeVideoPlayerProps): void {
        if (nextProps.url !== this.props.url) {
            this.processUrl(nextProps.url);
        }
    }

    componentWillUnmount(): void {
        this.videoPlayer.stop();
    }

    private processUrl(url: string): void {
        if (url) {
            var videoId: string = GoogleApi.findYoutubeVideoId(url);
            if (videoId) {
                this.videoPlayer.play(videoId);
            } else {
                this.videoPlayer.stop();
            }
        } else {
            this.videoPlayer.stop();
        }
    }
}

class YoutubePlayer {
    private static playerFactory: YoutubePlayerElementFactory;
    private currentVideoId: string = null;

    constructor() {
        if (!YoutubePlayer.playerFactory) {
            YoutubePlayer.playerFactory = new YoutubePlayerElementFactory();
        }
    }

    public play(videoId: string): void {
        if (this.currentVideoId === videoId) {
            return;
        }
        var prevVideoId: string = this.currentVideoId;
        this.currentVideoId = videoId;
        YoutubePlayer.playerFactory.getPlayer().then(p => {
            if (prevVideoId) {
                p.stopVideo();
            }
            YoutubePlayer.playerFactory.show();
            p.cueVideoById(videoId);
            p.playVideo();
        });
    }

    public stop(): void {
        var prevVideoId: string = this.currentVideoId;
        this.currentVideoId = null;
        YoutubePlayer.playerFactory.getPlayer().then(p => {
            if (prevVideoId) {
                p.stopVideo();
            }
            YoutubePlayer.playerFactory.hide();
        });
    }
}

class YoutubePlayerElementFactory {
    private apiLoader: YoutubeIframeApiLoader;
    private playerPromise: Promise<YT.Player>;

    constructor() {
        this.apiLoader = new YoutubeIframeApiLoader();
        this.playerPromise = this.apiLoader.load().then(() => this.createYoutubePlayer());
    }

    public show(): void {
        this.getPlayerContainerWrap().style.display = "block";
        this.getPlayerContainerWrap().style.zIndex = "9000";
    }

    public hide(): void {
        this.getPlayerContainerWrap().style.display = "none";
        this.getPlayerContainerWrap().style.zIndex = "-1";
    }

    public getPlayer(): Promise<YT.Player> {
        return this.playerPromise;
    }

    private createYoutubePlayer(): Promise<YT.Player> {
        let d: Promise.Resolver<YT.Player> = Promise.defer<YT.Player>(),
            playerCont: HTMLElement = this.getPlayerContainer();
        let opts: YT.PlayerOptions = {
            height: window.innerHeight - Navbar.height - 3, // magic 3px to prevent scrollbar appearance
            width: window.innerWidth,
            videoId: "M7lc1UVf-VE",
            events: {}
        },
            player: YT.Player;
        opts.events.onReady = () => {
            d.resolve(player);
        };
        player = new YT.Player(playerCont.id, opts);
        return d.promise;
    }

    private getPlayerContainerWrap(): HTMLElement {
        var id: string = "video-player-wrap",
            res: HTMLElement = document.getElementById(id);
        if (!res) {
            res = document.createElement("div");
            res.id = id;
            res.style.position = "absolute";
            res.style.top = `${Navbar.height}px`;
            res.style.right = "0";
            res.style.bottom = "0";
            res.style.left = "0";
            res.style.display = "none";
            document.body.appendChild(res);
        }
        return res;
    }

    private getPlayerContainer(): HTMLElement {
        var id: string = "video-player",
            res: HTMLElement = document.getElementById(id);
        if (!res) {
            res = document.createElement("div");
            res.id = id;
            this.getPlayerContainerWrap().appendChild(res);
        }
        return res;
    }
}

class YoutubeIframeApiLoader {
    private loadPromise: Promise<void> = null;

    public load(): Promise<void> {
        if (this.loadPromise === null) {
            var d: Promise.Resolver<void> = Promise.defer<void>();
            this.loadPromise = d.promise;
            if (typeof YT === "undefined") {
                var tag: HTMLScriptElement = document.createElement("script");
                tag.src = "https://www.youtube.com/iframe_api";
                var firstScriptTag: HTMLScriptElement = document.getElementsByTagName("script")[0];
                firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
                window["onYouTubeIframeAPIReady"] = () => {
                    d.resolve();
                };
            } else {
                // someone else loaded the script. No way to determine whether it have already
                // called onYouTubeIframeAPIReady() or not. Let's be optimistic.
                d.resolve();
            }
        }
        return this.loadPromise;
    }
}
