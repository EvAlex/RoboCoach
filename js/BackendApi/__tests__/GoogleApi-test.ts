import {GoogleApi} from "../GoogleApi";
import MockHttpClient from "./MockHttpClient";

describe("GoogleApi", () => {
    it("getVideoInfo(videoId)", (done) => {
        // arrange
        var httpClient: MockHttpClient = new MockHttpClient(),
            api: GoogleApi = new GoogleApi(httpClient),
            actualUrl: string;
        httpClient.whenGet<GoogleApi.IVideoListResponse>(
            /https:\/\/www\.googleapis\.com\/youtube\/v3\/videos\?(id=\w+)&(key=[^&]*)&(part=[^&]*)/,
            (url, params) => {
                actualUrl = url;
                return {
                    "kind": "youtube#videoListResponse",
                    "etag": "\"DsOZ7qVJA4mxdTxZeNzis6uE6ck/-mChYiS436sn_tc5Lrrh1Widilw\"",
                    "pageInfo": {
                        "totalResults": 1,
                        "resultsPerPage": 1
                    },
                    "items": [
                        {
                            "kind": "youtube#video",
                            "etag": "\"DsOZ7qVJA4mxdTxZeNzis6uE6ck/0UPDnV8X6-WNw4CHQ4GSiu_S4uQ\"",
                            "id": "6fN4IP30bnk",
                            "snippet": {
                                "publishedAt": "2011-03-04T07:48:31.000Z",
                                "channelId": "UCNAjjkbNbaVeH4o617fTC4g",
                                "title": "8 Min Abs Workout - Level 3 - P4P Music",
                                "description": "Abs workout \"8 Min Abs Workout - Level 3\" is the third level of most famous abdominal training of the web.\r\nSee our abs workout level 1 (for beginners): http://www.youtube.com/watch?v=vkKCVCZe474\r\nView abdominal workout level 2 (advanced): http://www.youtube.com/watch?v=44mgUselcDU",
                                "thumbnails": {
                                    "default": {
                                        "url": "https://i.ytimg.com/vi/6fN4IP30bnk/default.jpg",
                                        "width": 120,
                                        "height": 90
                                    },
                                    "medium": {
                                        "url": "https://i.ytimg.com/vi/6fN4IP30bnk/mqdefault.jpg",
                                        "width": 320,
                                        "height": 180
                                    },
                                    "high": {
                                        "url": "https://i.ytimg.com/vi/6fN4IP30bnk/hqdefault.jpg",
                                        "width": 480,
                                        "height": 360
                                    }
                                },
                                "channelTitle": "Passion4Profession",
                                "tags": [
                                    "p4p_en",
                                    "howto",
                                    "abs",
                                    "workout",
                                    "level 3",
                                    "8 min abs",
                                    "abs workout",
                                    "abdominal exercises",
                                    "abs exercises",
                                    "training",
                                    "six pack abs",
                                    "6 pack",
                                    "muscle exercises",
                                    "fitness training",
                                    "flat abs",
                                    "best abs exercises",
                                    "lower abs",
                                    "upper abs",
                                    "gym workouts",
                                    "workout plans",
                                    "workout programs",
                                    "bodybuilding",
                                    "routines",
                                    "six pack abs workout",
                                    "home fitness",
                                    "at home",
                                    "home workout routines",
                                    "weight loss",
                                    "stomach",
                                    "fat loss",
                                    "toning",
                                    "sexy",
                                    "women",
                                    "core exercises",
                                    "wellness",
                                    "gym",
                                    "wii fit",
                                    "Xbox Kinect",
                                    "iphone",
                                    "passion4profession"
                                ],
                                "categoryId": "26",
                                "liveBroadcastContent": "none",
                                "localized": {
                                    "title": "8 Min Abs Workout - Level 3 - P4P Music",
                                    "description": "Abs workout \"8 Min Abs Workout - Level 3\" is the third level of most famous abdominal training of the web.\r\nSee our abs workout level 1 (for beginners): http://www.youtube.com/watch?v=vkKCVCZe474\r\nView abdominal workout level 2 (advanced): http://www.youtube.com/watch?v=44mgUselcDU"
                                }
                            },
                            "contentDetails": {
                                "duration": "PT12M31S",
                                "dimension": "2d",
                                "definition": "hd",
                                "caption": "false",
                                "licensedContent": true
                            },
                            "status": {
                                "uploadStatus": "processed",
                                "privacyStatus": "public",
                                "license": "youtube",
                                "embeddable": true,
                                "publicStatsViewable": true
                            },
                            "statistics": {
                                "viewCount": "3240894",
                                "likeCount": "11209",
                                "dislikeCount": "366",
                                "favoriteCount": "0",
                                "commentCount": "2204"
                            }
                        }
                    ]
                };
            });

        // act
        var videoPromise = api.getVideoInfo("6fN4IP30bnk");

        // assert
        videoPromise.then(v => {
            expect(actualUrl).toEqual("https://www.googleapis.com/youtube/v3/videos?id=6fN4IP30bnk&key=AIzaSyAjZR9S-arLFPrYa4_ysyoA9kfztIfCtZY&part=snippet,contentDetails,statistics,status");
            expect(v.id).toEqual("6fN4IP30bnk");
            expect(v.contentDetails).toBeDefined();
            expect(v.snippet).toBeDefined();
            expect(v.status).toBeDefined();
            expect(v.statistics).toBeDefined();
            done();
        });
    });
});
