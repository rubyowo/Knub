"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LockManager = exports.Lock = void 0;
const utils_1 = require("../utils");
const DEFAULT_LOCK_TIMEOUT = 10 * 1000;
const LOCK_GC_TIMEOUT = 120 * 1000;
class Lock {
    constructor(oldLocks = [], lockTimeout = DEFAULT_LOCK_TIMEOUT) {
        this.unlocked = false;
        this.unlockTimeout = null;
        this.resolve = utils_1.noop;
        this.reject = utils_1.noop;
        // A new lock can be built by combining the state from previous locks
        // For now, this means if any of the old locks was interrupted, the new one is as well
        this.interrupted = oldLocks.some((l) => l?.interrupted);
        this.unlockPromise = new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });
        this.unlockTimeout = setTimeout(() => this.unlock(), lockTimeout);
    }
    unlock() {
        if (this.unlockTimeout) {
            clearTimeout(this.unlockTimeout);
        }
        this.unlocked = true;
        this.resolve(this);
    }
    interrupt() {
        this.interrupted = true;
        this.unlock();
    }
    destroy() {
        if (this.unlocked) {
            return;
        }
        if (this.unlockTimeout) {
            clearTimeout(this.unlockTimeout);
        }
        this.reject(new Error("Lock was destroyed"));
    }
}
exports.Lock = Lock;
class LockManager {
    constructor(lockTimeout = DEFAULT_LOCK_TIMEOUT) {
        this.lockPromises = new Map();
        this.acquiredLocks = new Map();
        this.lockTimeout = lockTimeout;
        this.lockGCTimeouts = new Map();
    }
    acquire(keys, lockTimeout) {
        if (!Array.isArray(keys))
            keys = [keys];
        if (lockTimeout == null)
            lockTimeout = this.lockTimeout;
        for (const key of keys) {
            clearTimeout(this.lockGCTimeouts.get(key));
            this.lockGCTimeouts.delete(key);
        }
        // To acquire a lock, we must first wait for all matching old locks to resolve
        const oldLockPromises = keys.reduce((lockPromises, key) => {
            if (this.lockPromises.has(key)) {
                lockPromises.push(this.lockPromises.get(key));
            }
            return lockPromises;
        }, []);
        const newLockPromise = Promise.all(oldLockPromises)
            .then((oldLocks) => {
            // And then we have to wait for these old locks to unlock as well
            return Promise.all(oldLocks.map((l) => l.unlockPromise));
        })
            .then((unlockedOldLocks) => {
            // And *then* we can return a new lock
            for (const key of keys) {
                if (this.lockGCTimeouts.has(key)) {
                    clearTimeout(this.lockGCTimeouts.get(key));
                }
                this.lockGCTimeouts.set(key, setTimeout(() => {
                    this.lockPromises.delete(key);
                    this.lockGCTimeouts.delete(key);
                    this.acquiredLocks.delete(key);
                }, LOCK_GC_TIMEOUT));
            }
            const newLock = new Lock(unlockedOldLocks, lockTimeout);
            for (const key of keys) {
                this.acquiredLocks.set(key, newLock);
            }
            return newLock;
        });
        for (const key of keys) {
            this.lockPromises.set(key, newLockPromise);
        }
        return newLockPromise;
    }
    setLockTimeout(ms) {
        this.lockTimeout = ms;
    }
    async destroy() {
        for (const [key, lock] of this.acquiredLocks) {
            lock.destroy();
            this.acquiredLocks.delete(key);
        }
        for (const [key, timeout] of this.lockGCTimeouts) {
            clearTimeout(timeout);
            this.lockGCTimeouts.delete(key);
        }
    }
}
exports.LockManager = LockManager;
