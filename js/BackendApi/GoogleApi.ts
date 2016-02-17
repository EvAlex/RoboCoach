const config: IRoboCoachConfig = require("RoboCoachConfig");
import HttpClient from "./HttpClient";

export class GoogleApi {
    private apiUrl: string = "https://www.googleapis.com/youtube/v3/";
    private httpClient: IHttpClient;

    constructor(httpClient: IHttpClient = new HttpClient()) {
        this.httpClient = httpClient;
    }

    public getVideoInfo(videoId: string): Promise<GoogleApi.IVideo> {
        var url: string = `${this.apiUrl}videos?id=${videoId}&key=${config.googleApiKey}&part=snippet,contentDetails,statistics,status`;
        return this.httpClient
            .get<GoogleApi.IVideoListResponse>(url)
            .then(r => r.items[0]);
    }

    /**
     * JavaScript function to match (and return) the video Id
     * of any valid Youtube Url, given as input string.
     * @author: Stephan Schmitz <eyecatchup@gmail.com>
     * @url: http://stackoverflow.com/a/10315969/624466
     */
    public findYoutubeVideoId(url): string {
        /* tslint:disable:max-line-length */
        var p: RegExp = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
        /* tslint:enable:max-line-length */
        return (url.match(p)) ? RegExp.$1 : null;
    }
}

var instance: GoogleApi = new GoogleApi();

// window["GoogleApi"] = instance;

export default instance;
