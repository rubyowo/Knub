/// <reference types="node" />
import Timeout = NodeJS.Timeout;
type ResolveFn = (...args: any[]) => any;
export declare class Lock {
    unlockPromise: Promise<Lock>;
    unlocked: boolean;
    interrupted: boolean;
    unlockTimeout: NodeJS.Timeout | null;
    protected resolve: ResolveFn;
    protected reject: (reason: any) => void;
    constructor(oldLocks?: Lock[], lockTimeout?: number);
    unlock(): void;
    interrupt(): void;
    destroy(): void;
}
export declare class LockManager {
    protected lockPromises: Map<string, Promise<Lock>>;
    protected acquiredLocks: Map<string, Lock>;
    protected lockTimeout: number;
    protected lockGCTimeouts: Map<string, Timeout>;
    constructor(lockTimeout?: number);
    acquire(keys: string | string[], lockTimeout?: number): Promise<Lock>;
    setLockTimeout(ms: number): void;
    destroy(): Promise<void>;
}
export {};
