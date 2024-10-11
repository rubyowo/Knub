"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _ConcurrentRunner_instances, _ConcurrentRunner_maxConcurrent, _ConcurrentRunner_running, _ConcurrentRunner_queue, _ConcurrentRunner_next;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConcurrentRunner = void 0;
class ConcurrentRunner {
    constructor(maxConcurrent) {
        _ConcurrentRunner_instances.add(this);
        _ConcurrentRunner_maxConcurrent.set(this, void 0);
        _ConcurrentRunner_running.set(this, 0);
        _ConcurrentRunner_queue.set(this, []);
        __classPrivateFieldSet(this, _ConcurrentRunner_maxConcurrent, maxConcurrent, "f");
    }
    run(fn) {
        return new Promise((resolve, reject) => {
            __classPrivateFieldGet(this, _ConcurrentRunner_queue, "f").push(() => {
                var _a;
                __classPrivateFieldSet(this, _ConcurrentRunner_running, (_a = __classPrivateFieldGet(this, _ConcurrentRunner_running, "f"), _a++, _a), "f");
                Promise.resolve(fn())
                    .then(() => resolve())
                    .catch((err) => reject(err))
                    .finally(() => {
                    var _a;
                    __classPrivateFieldSet(this, _ConcurrentRunner_running, (_a = __classPrivateFieldGet(this, _ConcurrentRunner_running, "f"), _a--, _a), "f");
                    __classPrivateFieldGet(this, _ConcurrentRunner_instances, "m", _ConcurrentRunner_next).call(this);
                });
            });
            __classPrivateFieldGet(this, _ConcurrentRunner_instances, "m", _ConcurrentRunner_next).call(this);
        });
    }
}
exports.ConcurrentRunner = ConcurrentRunner;
_ConcurrentRunner_maxConcurrent = new WeakMap(), _ConcurrentRunner_running = new WeakMap(), _ConcurrentRunner_queue = new WeakMap(), _ConcurrentRunner_instances = new WeakSet(), _ConcurrentRunner_next = function _ConcurrentRunner_next() {
    if (__classPrivateFieldGet(this, _ConcurrentRunner_running, "f") >= __classPrivateFieldGet(this, _ConcurrentRunner_maxConcurrent, "f")) {
        return;
    }
    if (__classPrivateFieldGet(this, _ConcurrentRunner_queue, "f").length === 0) {
        return;
    }
    __classPrivateFieldGet(this, _ConcurrentRunner_queue, "f").shift()();
};
