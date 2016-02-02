/// <reference path="../../typings/tsd.d.ts" />

import * as uuid from "node-uuid";

export default class BaseStore {

    private listeners: { [key: string]: () => void };

    constructor() {
        this.listeners = {};
    }

    addListener(listener: () => void): string {
        var listenerId: string = uuid.v4();
        this.listeners[listenerId] = listener;
        return listenerId;
    }

    removeListener(listenerId: string): void {
        if (listenerId in this.listeners) {
            delete this.listeners[listenerId];
        } else {
            throw new Error("Listener with specified id not registered. Cannot remove listener.");
        }
    }

    protected emitChange(): void {
        for (let key in this.listeners) {
            if (this.listeners.hasOwnProperty(key)) {
                this.listeners[key]();
            }
        }
    }
}
