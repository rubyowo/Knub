"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginError = void 0;
const util_1 = __importDefault(require("util"));
/**
 * Errors in plugins (commands, event handlers, etc.) are re-thrown as this
 * class *in production mode* (NODE_ENV=production) so they can be handled
 * gracefully in e.g. a global error handler.
 *
 * In development, plugin errors are not rethrown as it can cause issues when
 * using a debugger. Specifically, the call stack when pausing on the re-thrown
 * error would not match that of the original error, presumably because
 * Promise.catch() is handled separately.
 */
class PluginError extends Error {
    constructor(message) {
        if (message instanceof Error) {
            super(`${message.name}: ${message.message}`);
            this.stack = message.stack;
            this.originalError = message;
        }
        else {
            super(message);
        }
    }
    [util_1.default.inspect.custom](_depth, _options) {
        return `PluginError: ${this.stack ?? "<no stack>"}`;
    }
}
exports.PluginError = PluginError;
