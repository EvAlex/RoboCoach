import * as Promise from "bluebird";

export interface IMockRequestHandler<T> {
    (url: string, params?: string[]): T;
}

enum HttpMethod {
    get,
    put,
    post,
    delete,
    options,
    patch
}

interface IMockExpectation<T> {
    url: string|RegExp;
    method: HttpMethod;
    implementation: IMockRequestHandler<T>;
}

export default class MockHttpClient implements IHttpClient {
    private expectations: IMockExpectation<any>[] = [];

    get<T>(url: string): Promise<T> {
        var e: IMockExpectation<T> = this.matchExpectation<T>(url, HttpMethod.get);
        return this.runExpectation<T>(url, e);
    }

    whenGet<T>(url: string|RegExp, implementation: IMockRequestHandler<T>): void {
        this.setExpectation(url, HttpMethod.get, implementation);
    }

    private setExpectation<T>(url: string|RegExp, method: HttpMethod, implementation: IMockRequestHandler<T>): void {
        var match = this.expectations.filter(e => e.url == url)[0];
        if (match) {
            this.expectations[this.expectations.indexOf(match)].implementation = implementation;
        } else {
            this.expectations.push({ url: url, method: method, implementation: implementation});
        }
    }

    private matchExpectation<T>(url: string, method: HttpMethod): IMockExpectation<T> {
        var expectations: IMockExpectation<T>[] = this.expectations.filter(e => e.method === method),
            res: IMockExpectation<T> = null;
        for (let e of expectations) {
            if (e.url instanceof RegExp && (<RegExp>e.url).test(url) || e.url == url) {
                res = e;
                break;
            }
        }
        return res;
    }

    private runExpectation<T>(url: string, expectation: IMockExpectation<T>): Promise<T> {
        var params: string[],
            d: Promise.Resolver<T> = Promise.defer<T>();
        if (expectation.url instanceof RegExp) {
            params = (<RegExp>expectation.url).exec(url).slice(1);
        }
        d.resolve(expectation.implementation(url, params));
        return d.promise;
    }
}
