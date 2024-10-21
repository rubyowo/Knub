export type ProfilerData = {
    [key: string]: {
        totalTime: number;
        averageTime: number;
        count: number;
    };
};
export declare class Profiler {
    protected data: ProfilerData;
    addDataPoint(key: string, time: number): void;
    getData(): ProfilerData;
}
