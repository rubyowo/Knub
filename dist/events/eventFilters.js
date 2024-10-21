"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.locks = exports.ignoreSelf = exports.ignoreBots = exports.requirePermission = exports.cooldown = exports.onlyDM = exports.onlyGuild = exports.withAnyFilter = exports.withFilters = void 0;
const discord_js_1 = require("discord.js");
const helpers_1 = require("../helpers");
const PluginData_1 = require("../plugins/PluginData");
const eventUtils_1 = require("./eventUtils");
/**
 * Runs the specified event listener if the event passes ALL of the specified
 * filters
 */
function withFilters(event, listener, filters) {
    const wrapped = async (meta) => {
        for (const filter of filters) {
            const filterResult = await filter(event, meta);
            if (!filterResult)
                return;
        }
        return listener(meta);
    };
    return wrapped;
}
exports.withFilters = withFilters;
/**
 * Runs the specified event listener if the event passes ANY of the specified
 * filters
 */
function withAnyFilter(event, listener, filters) {
    const wrapped = async (meta) => {
        for (const filter of filters) {
            const filterResult = await filter(event, meta);
            if (filterResult) {
                return listener(meta);
            }
        }
        return;
    };
    return wrapped;
}
exports.withAnyFilter = withAnyFilter;
function onlyGuild() {
    return (event, { args, pluginData }) => {
        if (!(0, PluginData_1.isGuildPluginData)(pluginData)) {
            return false;
        }
        const guild = eventUtils_1.eventToGuild[event]?.(args) ?? null;
        return Boolean(guild && pluginData.guild === guild);
    };
}
exports.onlyGuild = onlyGuild;
function onlyDM() {
    return (event, { args }) => {
        const channel = eventUtils_1.eventToChannel[event]?.(args) ?? null;
        return Boolean(channel && channel instanceof discord_js_1.DMChannel);
    };
}
exports.onlyDM = onlyDM;
let evCdKeyNum = 1;
function cooldown(timeMs, permission) {
    const cdKey = `event-${evCdKeyNum++}`;
    return async (event, { args, pluginData }) => {
        let cdApplies = true;
        if (permission) {
            const user = eventUtils_1.eventToUser[event]?.(args);
            const channel = eventUtils_1.eventToChannel[event]?.(args);
            const msg = eventUtils_1.eventToMessage[event]?.(args);
            const config = await pluginData.config.getMatchingConfig({
                channelId: channel?.id,
                userId: user?.id,
                message: msg,
            });
            cdApplies = !config || (0, helpers_1.hasPermission)(config, permission);
        }
        if (cdApplies && pluginData.cooldowns.isOnCooldown(cdKey)) {
            // We're on cooldown
            return false;
        }
        pluginData.cooldowns.setCooldown(cdKey, timeMs);
        return true;
    };
}
exports.cooldown = cooldown;
function requirePermission(permission) {
    return async (event, { args, pluginData }) => {
        const user = eventUtils_1.eventToUser[event]?.(args) ?? null;
        const member = user && (0, PluginData_1.isGuildPluginData)(pluginData) ? pluginData.guild.members.resolve(user.id) : null;
        const config = member
            ? await pluginData.config.getForMember(member)
            : user
                ? await pluginData.config.getForUser(user)
                : pluginData.config.get();
        return (0, helpers_1.hasPermission)(config, permission);
    };
}
exports.requirePermission = requirePermission;
function ignoreBots() {
    return (event, { args }) => {
        const user = eventUtils_1.eventToUser[event]?.(args) ?? null;
        return !user || !user.bot;
    };
}
exports.ignoreBots = ignoreBots;
function ignoreSelf() {
    return (event, { args, pluginData }) => {
        const user = eventUtils_1.eventToUser[event]?.(args) ?? null;
        return !user || user.id !== pluginData.client.user.id;
    };
}
exports.ignoreSelf = ignoreSelf;
function locks(locksToAcquire) {
    return async (event, meta) => {
        const lock = await meta.pluginData.locks.acquire(locksToAcquire);
        if (lock.interrupted)
            return false;
        meta.lock = lock;
        return true;
    };
}
exports.locks = locks;
