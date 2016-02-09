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

}

var instance: GoogleApi = new GoogleApi();

// window["GoogleApi"] = instance;

export default instance;
