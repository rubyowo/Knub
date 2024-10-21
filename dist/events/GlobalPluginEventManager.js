"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalPluginEventManager = void 0;
const BasePluginEventManager_1 = require("./BasePluginEventManager");
const eventFilters_1 = require("./eventFilters");
class GlobalPluginEventManager extends BasePluginEventManager_1.BasePluginEventManager {
    registerEventListener(blueprint) {
        if (!this.listeners.has(blueprint.event)) {
            this.listeners.set(blueprint.event, new Set());
        }
        const filters = blueprint.filters || [];
        if (!blueprint.allowSelf) {
            filters.unshift((0, eventFilters_1.ignoreSelf)());
        }
        if (!blueprint.allowBots) {
            filters.unshift((0, eventFilters_1.ignoreBots)());
        }
        const filteredListener = (0, eventFilters_1.withFilters)(blueprint.event, blueprint.listener, filters);
        const wrappedListener = (args) => {
            return filteredListener({
                // @ts-ignore TS is having trouble inferring this correctly. We know TPluginData extends GlobalPluginData, which
                // means that args should be EventArguments[T["event"]], which it is as per the type annotation above.
                args,
                pluginData: this.pluginData,
            });
        };
        this.listeners.get(blueprint.event).add(wrappedListener);
        this.eventRelay.onAnyEvent(blueprint.event, wrappedListener);
        return wrappedListener;
    }
    off(event, listener) {
        if (!this.listeners.has(event)) {
            return;
        }
        this.listeners.get(event).delete(listener);
        this.eventRelay.offAnyEvent(event, listener);
    }
    on(event, listener, opts) {
        return this.registerEventListener({
            ...opts,
            event,
            listener,
        });
    }
}
exports.GlobalPluginEventManager = GlobalPluginEventManager;
