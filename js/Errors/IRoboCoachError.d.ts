
interface IRoboCoachError extends Error {
    InnerError?: Error;
    toString(): string;
}
