"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultGetEnabledGuildPlugins = exports.defaultGetConfig = exports.isGlobalBlueprintByContext = exports.isGuildBlueprintByContext = exports.isGlobalContext = exports.isGuildContext = exports.getMemberLevel = exports.getMemberRoles = void 0;
function getMemberRoles(member) {
    return Array.isArray(member.roles) ? member.roles : Array.from(member.roles.cache.values()).map((r) => r.id);
}
exports.getMemberRoles = getMemberRoles;
function getMemberLevel(levels, member, guild) {
    const memberId = "id" in member ? member.id : member.user.id;
    if (guild.ownerId === memberId) {
        return 99999;
    }
    const roles = getMemberRoles(member);
    for (const [id, level] of Object.entries(levels)) {
        if (memberId === id || roles.includes(id)) {
            return level;
        }
    }
    return 0;
}
exports.getMemberLevel = getMemberLevel;
function isGuildContext(ctx) {
    return ctx.guildId != null;
}
exports.isGuildContext = isGuildContext;
function isGlobalContext(ctx) {
    return !isGuildContext(ctx);
}
exports.isGlobalContext = isGlobalContext;
function isGuildBlueprintByContext(_ctx, _blueprint) {
    return true;
}
exports.isGuildBlueprintByContext = isGuildBlueprintByContext;
function isGlobalBlueprintByContext(_ctx, _blueprint) {
    return true;
}
exports.isGlobalBlueprintByContext = isGlobalBlueprintByContext;
/**
 * By default, return an empty config for all guilds and the global config
 */
function defaultGetConfig() {
    return {};
}
exports.defaultGetConfig = defaultGetConfig;
/**
 * By default, load all available guild plugins
 */
function defaultGetEnabledGuildPlugins(ctx, guildPlugins) {
    return Array.from(guildPlugins.keys());
}
exports.defaultGetEnabledGuildPlugins = defaultGetEnabledGuildPlugins;
