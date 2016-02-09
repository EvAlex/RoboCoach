
declare module GoogleApi {
    interface IVideoListResponse extends GoogleApi.IResponse {
        items: GoogleApi.IVideo[];
        pageInfo: GoogleApi.IPageInfo;
    }
}
