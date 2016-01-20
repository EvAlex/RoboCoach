
export default class RoboCoachError implements IRoboCoachError {

    private errorMessage: string;
    private errorName: string;
    private errorStack: string;
    private innerError: Error;

    static parseError(error: string | Error | Object): Error {
        var res: Error;
        if (typeof error === "string") {
            res = new Error(error);
        } else if (error instanceof Error) {
            res = error;
        } else if (typeof error === "object") {
            res = new Error();
            if ("message" in error) {
                res.message = error["message"];
            }
            if ("name" in error) {
                res.name = error["name"];
            }
            if ("stack" in error) {
                res.stack = error["stack"];
            }
        } else if (error === undefined || error === null) {
            res = new Error("Unknown error.");
        }
        return res;
    }

    constructor(
        errorMessage: string,
        errorName: string,
        errorStack?: string,
        innerError?: Error) {
        this.errorMessage = errorMessage;
        this.errorName = errorName;
        this.errorStack = errorStack;
        this.innerError = innerError;
    }

    public get message(): string {
        return this.errorMessage;
    }

    public get name(): string {
        return this.errorName;
    }

    public get stack(): string {
        return this.errorStack;
    }

    public get InnerError(): Error {
        return this.innerError;
    }

    toString(): string {
        return `${this.errorName}: ${this.errorMessage}`;
    }
}
