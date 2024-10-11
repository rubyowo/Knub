"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Queue = void 0;
const DEFAULT_TIMEOUT = 10 * 1000;
class Queue {
    constructor(timeout = DEFAULT_TIMEOUT) {
        this.running = false;
        this.queue = [];
        this.activeTimeout = null;
        this.destroyed = false;
        this.current = Promise.resolve();
        this.timeout = timeout;
    }
    add(fn) {
        if (this.destroyed) {
            return Promise.resolve();
        }
        const promise = new Promise((resolve, reject) => {
            this.queue.push(async () => {
                await Promise.resolve(fn()).then(resolve).catch(reject);
            });
            if (!this.running)
                this.next();
        });
        return promise;
    }
    next() {
        if (this.destroyed) {
            return;
        }
        this.running = true;
        if (this.queue.length === 0) {
            this.running = false;
            return;
        }
        const fn = this.queue.shift();
        this.current = new Promise((resolve) => {
            // Either fn() completes or the timeout is reached
            void fn().then(resolve);
            this.activeTimeout = setTimeout(resolve, this.timeout);
        }).then(() => {
            if (this.activeTimeout) {
                clearTimeout(this.activeTimeout);
            }
            return this.next();
        });
    }
    clear() {
        this.queue.splice(0, this.queue.length);
    }
    destroy() {
        this.clear();
        if (this.activeTimeout) {
            clearTimeout(this.activeTimeout);
        }
    }
    async waitToFinish() {
        while (true) {
            await this.current;
            if (this.queue.length === 0) {
                break;
            }
        }
    }
}
exports.Queue = Queue;
