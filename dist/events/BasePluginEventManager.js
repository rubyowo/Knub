"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasePluginEventManager = void 0;
/**
 * A wrapper for the d.js event emitter that passes plugin data to the listener
 * functions and, by default, restricts events to the plugin's guilds.
 */
class BasePluginEventManager {
    constructor(eventRelay) {
        this.eventRelay = eventRelay;
        this.listeners = new Map();
    }
    setPluginData(pluginData) {
        if (this.pluginData) {
            throw new Error("Plugin data already set");
        }
        this.pluginData = pluginData;
    }
    getListenerCount() {
        let count = 0;
        for (const listeners of this.listeners.values()) {
            count += listeners.size;
        }
        return count;
    }
    clearAllListeners() {
        for (const [event, listeners] of this.listeners.entries()) {
            for (const listener of listeners) {
                this.off(event, listener);
            }
        }
    }
    destroy() {
        this.clearAllListeners();
    }
}
exports.BasePluginEventManager = BasePluginEventManager;
