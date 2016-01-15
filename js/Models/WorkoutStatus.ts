
export default class WorkoutStatus {

    private startTime: Date = null;
    private endTime: Date = null;

    constructor(startTime: Date = null, endTime: Date = null) {
        this.startTime = startTime instanceof Date ? startTime : null;
        this.endTime = endTime instanceof Date ? endTime : null;
    }

    isRunning(): boolean {
        return this.startTime !== null && this.endTime === null;
    }

    isFinished(): boolean {
        return this.startTime !== null && this.endTime !== null;
    }

    start(): void {
        this.startTime = new Date();
    }
}
