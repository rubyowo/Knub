"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuildPluginEventManager = void 0;
const BasePluginEventManager_1 = require("./BasePluginEventManager");
const eventFilters_1 = require("./eventFilters");
class GuildPluginEventManager extends BasePluginEventManager_1.BasePluginEventManager {
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
                // @ts-ignore TS is having trouble inferring this correctly. We know TPluginData extends GuildPluginData, which
                // means that args should be GuildEventArguments[T["event"]], which it is as per the type annotation above.
                args,
                pluginData: this.pluginData,
            });
        };
        this.listeners.get(blueprint.event).add(wrappedListener);
        wrappedListener.profilerContext = this.pluginData.pluginName;
        this.eventRelay.onGuildEvent(this.pluginData.guild.id, blueprint.event, wrappedListener);
        return wrappedListener;
    }
    off(event, listener) {
        if (!this.listeners.has(event)) {
            return;
        }
        this.listeners.get(event).delete(listener);
        this.eventRelay.offGuildEvent(this.pluginData.guild.id, event, listener);
    }
    on(event, listener, opts) {
        return this.registerEventListener({
            ...opts,
            event,
            listener,
        });
    }
}
exports.GuildPluginEventManager = GuildPluginEventManager;
