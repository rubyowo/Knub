/// <reference types="node" />
type InternalQueueFn = () => Promise<void>;
type AnyFn = (...args: any[]) => any;
export declare class Queue<TQueueFunction extends AnyFn = AnyFn> {
    protected running: boolean;
    protected queue: InternalQueueFn[];
    protected timeout: number;
    protected activeTimeout: NodeJS.Timeout | null;
    protected destroyed: boolean;
    protected current: Promise<void>;
    constructor(timeout?: number);
    add(fn: TQueueFunction): Promise<void>;
    protected next(): void;
    clear(): void;
    destroy(): void;
    waitToFinish(): Promise<void>;
}
export {};
