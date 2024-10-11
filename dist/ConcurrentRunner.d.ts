type FnToRun = () => void | Promise<void>;
export declare class ConcurrentRunner {
    #private;
    constructor(maxConcurrent: number);
    run(fn: FnToRun): Promise<void>;
}
export {};
