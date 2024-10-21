"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventRelay = void 0;
const perf_hooks_1 = require("perf_hooks");
const eventTypes_1 = require("./eventTypes");
const eventUtils_1 = require("./eventUtils");
/**
 * Relays Discord events to the appropriate plugins.
 * Guild events are a subset of all events, that apply to a specific guild.
 */
class EventRelay {
    constructor(client, profiler) {
        this.client = client;
        this.profiler = profiler;
        this.guildListeners = new Map();
        this.anyListeners = new Map();
        this.registeredRelays = new Set();
    }
    onGuildEvent(guildId, ev, listener) {
        if (!this.guildListeners.has(guildId)) {
            this.guildListeners.set(guildId, new Map());
        }
        const guildListeners = this.guildListeners.get(guildId);
        if (!guildListeners.has(ev)) {
            guildListeners.set(ev, new Set());
        }
        guildListeners.get(ev).add(listener);
        this.registerEventRelay(ev);
    }
    offGuildEvent(guildId, ev, listener) {
        this.guildListeners
            .get(guildId)
            ?.get(ev)
            ?.delete(listener);
    }
    onAnyEvent(ev, listener) {
        if (!this.anyListeners.has(ev)) {
            this.anyListeners.set(ev, new Set());
        }
        this.anyListeners.get(ev).add(listener);
        this.registerEventRelay(ev);
    }
    offAnyEvent(ev, listener) {
        if (!this.anyListeners.has(ev)) {
            return;
        }
        this.anyListeners.get(ev).delete(listener);
    }
    registerEventRelay(ev) {
        if (this.registeredRelays.has(ev)) {
            return;
        }
        this.registeredRelays.add(ev);
        this.client.on(ev, (...args) => {
            this.relayEvent(ev, args);
        });
    }
    relayEvent(ev, args) {
        const convertedArgs = eventTypes_1.fromDjsArgs[ev]?.(...args);
        if ((0, eventTypes_1.isGuildEvent)(ev)) {
            // Only guild events are passed to guild listeners, and only to the matching guild
            const guild = eventUtils_1.eventToGuild[ev]?.(convertedArgs);
            if (guild && this.guildListeners.get(guild.id)?.has(ev)) {
                for (const listener of this.guildListeners.get(guild.id).get(ev).values()) {
                    const startTime = perf_hooks_1.performance.now();
                    const result = listener(convertedArgs);
                    void Promise.resolve(result).then(() => {
                        this.profiler.addDataPoint(`event:${ev}:${listener.profilerContext ?? "unknown"}`, perf_hooks_1.performance.now() - startTime);
                    });
                }
            }
        }
        // Guild events and global events are both passed to "any listeners"
        if (this.anyListeners.has(ev)) {
            for (const listener of this.anyListeners.get(ev).values()) {
                const startTime = perf_hooks_1.performance.now();
                const result = listener(convertedArgs);
                void Promise.resolve(result).then(() => {
                    this.profiler.addDataPoint(`event:${ev}`, perf_hooks_1.performance.now() - startTime);
                });
            }
        }
    }
}
exports.EventRelay = EventRelay;
