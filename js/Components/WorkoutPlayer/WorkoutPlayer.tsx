import React = require("react");
import Promise = require("bluebird");

/* tslint:disable:no-any */
//var youtubePlayer: any = require("youtube-player");
const styles: any = require("./WorkoutPlayer.module.less");
/* tslint:enable:no-any */

import * as Utils from "../../Utils";
import Workout from "../../Models/Workout";
import NotificationsBuilder from "../../Models/Notifications/NotificationsBuilder";
import PrepareToExerciseNotificationScenario from "../../Models/Notifications/PrepareToExerciseNotificationScenario";
import ExerciseEndNotificationScenario from "../../Models/Notifications/ExerciseEndNotificationScenario";
import ExerciseStartNotificationScenario from "../../Models/Notifications/ExerciseStartNotificationScenario";
import NotificationsPlayer from "../../Models/Notifications/NotificationsPlayer";
import sleepPreventer from "../../SleepPreventer/SleepPreventer";
import GoogleApi from "../../BackendApi/GoogleApi";

export interface IWorkoutPlayerProps {
    workout: Workout;
}

export default class WorkoutPlayer extends React.Component<IWorkoutPlayerProps, {}> {
    private shouldTimerWork: boolean = false;
    private fps: number = 60;
    private lastRenderTime: number = new Date().getTime();
    private notifications: INotification[];
    private notificationsPlayer: NotificationsPlayer;
    private videoPlayer: YoutubePlayer = new YoutubePlayer();

    componentWillMount(): void {
        var builder: NotificationsBuilder = new NotificationsBuilder;
        var scenarios: INotificationScenario[] = [
            new PrepareToExerciseNotificationScenario(),
            new ExerciseEndNotificationScenario(),
            new ExerciseStartNotificationScenario()];

        this.notifications = builder.createNotifications(this.props.workout, scenarios);
        this.notificationsPlayer = new NotificationsPlayer(this.notifications);
    }

    componentDidMount(): void {
        this.shouldTimerWork = true;
        window.requestAnimationFrame(t => this.onAminationFrame(t));
        sleepPreventer.prevent();
    }

    componentWillUnmount(): void {
        sleepPreventer.allow();
        this.shouldTimerWork = false;
        this.videoPlayer.stop();
    }

    componentDidUpdate(): void {
        this.lastRenderTime = new Date().getTime();
    }

    onAminationFrame(time: number): void {
        if (this.shouldTimerWork) {
            if (new Date().getTime() - this.lastRenderTime > 1000 / this.fps) {
                this.forceUpdate();
            }
            this.shouldTimerWork = this.shouldTimerWork && this.props.workout.isInProgress;

            if (!this.shouldTimerWork) {
                this.forceUpdate();
            }

            window.requestAnimationFrame(t => this.onAminationFrame(t));
        }
    }

    render(): React.ReactElement<{}> {
        return (
            <div className={styles["workout-player"]}>
                {
                    this.props.workout.isInProgress
                        ? this.renderProgress()
                        : this.renderComplete()
                }
            </div>
        );
    }

    private renderProgress(): React.ReactElement<{}> {
        let action: IExercisePlanAction | IRestPlanAction = this.props.workout.getAction(new Date()),
            elapsedMiliseconds: number = new Date().getTime() - this.props.workout.startTime.getTime();

        this.notificationsPlayer.play(elapsedMiliseconds);
        return this.props.workout.isActionRest(action)
            ? this.renderRestProgress(action)
            : this.renderExerciseProgress(action);
    }

    private renderRestProgress(action: IExercisePlanAction | IRestPlanAction): React.ReactElement<{}> {
        let left: number = this.props.workout.getTimeLeftForAction(action),
            i: number = this.props.workout.actions.indexOf(action),
            next: IExercisePlanAction | IRestPlanAction = this.props.workout.actions[i + 1];
        return (
            <div className={styles["rest-progress"]}>
                { this.renderTimeLeft(left) }
                { next
                    ? <h1 className={styles["action-name"]}>{next["exercise"].name}</h1>
                    : "" }
            </div>
        );
    }

    private renderExerciseProgress(action: IExercisePlanAction | IRestPlanAction): React.ReactElement<{}> {
        let left: number = this.props.workout.getTimeLeftForAction(action),
            exercise: IExercise = action["exercise"];
        if (action.exercise.mediaUrl) {
            var videoId: string = GoogleApi.findYoutubeVideoId(action.exercise.mediaUrl);
            if (videoId) {
                this.videoPlayer.play(videoId);
            }
        }
        return (
            <div className={styles["exercise-progress"]}>
                { this.renderTimeLeft(left) }
                <h1 className={styles["action-name"]}>{exercise.name}</h1>
            </div>
        );
    }

    private renderTimeLeft(timeLeft: number): React.ReactElement<{}> {
        let min: number = Math.floor(timeLeft / 1000 / 60),
            sec: number = Math.floor(timeLeft / 1000 - min * 60),
            ms: number = timeLeft - min * 60 * 1000 - sec * 1000;
        return (
            <h1 className={styles["time-left"]}>
                <span className={styles.min}>{Utils.padNumber(min, 2) }</span>
                :
                <span className={styles.sec}>{Utils.padNumber(sec, 2) }</span>
                .
                <span className={styles.ms}>{Utils.padNumber(ms, 3) }</span>
            </h1>
        );
    }
    private renderComplete(): React.ReactElement<{}> {
        let elapsedMiliseconds: number = new Date().getTime() - this.props.workout.startTime.getTime();
        this.notificationsPlayer.play(elapsedMiliseconds);

        return (
            <h1 className={styles["action-name"]}>Workout complete!</h1>
        );
    }
}

class YoutubePlayer {
    private playerPromise: Promise<YT.Player>;
    private videoIdPlaying: string = null;

    constructor() {
        this.playerPromise = this.createYoutubePlayer();
    }

    public play(videoId: string): void {
        if (this.videoIdPlaying === videoId) {
            return;
        }
        this.videoIdPlaying = videoId;
        this.playerPromise.then(p => {
            if (this.videoIdPlaying) {
                p.stopVideo();
            }

            this.findPlayerWrap().style.zIndex = "9000";
            p.cueVideoById(videoId);
            p.playVideo();
        });
    }

    public stop(): void {
        this.playerPromise.then(p => {
            p.stopVideo();
            this.findPlayerWrap().style.zIndex = "-1";
        });
    }

    private findPlayerWrap(): HTMLElement {
        return document.getElementById("video-player-wrap");
    }

    private createYoutubePlayer(): Promise<YT.Player> {
        var d: Promise.Resolver<YT.Player> = Promise.defer<YT.Player>();
        if (typeof YT === "undefined") {
            var tag: HTMLScriptElement = document.createElement("script");
            tag.src = "https://www.youtube.com/iframe_api";
            var firstScriptTag: HTMLScriptElement = document.getElementsByTagName("script")[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
            window["onYouTubeIframeAPIReady"] = () => {
                console.log("onYouTubeIframeAPIReady");
                this.createYoutubePlayerWhenApiReady().then(p => d.resolve(p), e => d.reject(e));
            };
        } else {
            this.createYoutubePlayerWhenApiReady().then(p => d.resolve(p), e => d.reject(e));
        }
        return d.promise;
    }

    private createYoutubePlayerWhenApiReady(): Promise<YT.Player> {
        let d: Promise.Resolver<YT.Player> = Promise.defer<YT.Player>(),
            playerId: string = "video-player",
            cont: HTMLElement = document.getElementById(playerId);
        if (!cont) {
            var wrap: HTMLElement = document.createElement("div"),
                topOffset: number = 51;
            wrap.setAttribute("id", "video-player-wrap");
            wrap.style.position = "absolute";
            wrap.style.top = `${topOffset}px`;
            wrap.style.left = wrap.style.right = wrap.style.bottom = "0";
            document.body.appendChild(wrap);
            cont = document.createElement("div");
            cont.setAttribute("id", playerId);
            wrap.appendChild(cont);
        }
        let opts: YT.PlayerOptions = {
            height: window.innerHeight - topOffset - 3, // yo magic
            width: window.innerWidth,
            videoId: "M7lc1UVf-VE",
            events: {}
        },
            player: YT.Player;
        opts.events.onReady = () => {
            d.resolve(player);
        };
        player = new YT.Player(playerId, opts);
        return d.promise;
    }
}
