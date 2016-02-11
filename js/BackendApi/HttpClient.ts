import * as Promise from "bluebird";

export default class HttpClient implements IHttpClient {

    public get<T>(url: string): Promise<T> {
        var d: Promise.Resolver<T> = Promise.defer<T>(),
            xhr: XMLHttpRequest = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.responseType = "json";
        xhr.onload = e => {
            let response: T = <T> xhr.response;
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    d.resolve(response);
                } else {
                    d.reject(xhr);
                }
            }
        };
        xhr.send();
        return d.promise;
    }
}
