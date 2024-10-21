"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkCommandLocks = exports.checkCommandCooldown = exports.checkCommandPermission = exports.restrictCommandSource = exports.getMessageCommandSignature = exports.getDefaultMessageCommandPrefix = void 0;
const discord_js_1 = require("discord.js");
const knub_command_manager_1 = require("knub-command-manager");
const helpers_1 = require("../../helpers");
function getDefaultMessageCommandPrefix(client) {
    return new RegExp(`<@!?${client.user.id}> `);
}
exports.getDefaultMessageCommandPrefix = getDefaultMessageCommandPrefix;
/**
 * Returns a readable command signature string for the given command.
 * Trigger is passed as a string instead of using the "triggers" property of the command to allow choosing which
 * trigger of potentially multiple ones to show and in what format.
 */
function getMessageCommandSignature(command, overrideTrigger, overrideSignature) {
    const signature = (0, knub_command_manager_1.toSafeSignature)(overrideSignature || command.signatures[0] || {});
    const signatureEntries = Object.entries(signature);
    const parameters = signatureEntries.filter(([_, param]) => param.option !== true);
    const options = signatureEntries.filter(([_, opt]) => opt.option === true);
    const paramStrings = parameters.map(([name, param]) => {
        return param.required ? `<${name}>` : `[${name}]`;
    });
    const optStrings = options.map(([name, _opt]) => {
        return `[-${name}]`;
    });
    const prefix = command.originalPrefix != null
        ? typeof command.originalPrefix === "string"
            ? command.originalPrefix
            : command.originalPrefix.source
        : null;
    const trigger = overrideTrigger != null
        ? overrideTrigger
        : typeof command.originalTriggers[0] === "string"
            ? command.originalTriggers[0]
            : command.originalTriggers[0].source;
    const usageLine = `${String(prefix)}${trigger} ${paramStrings.join(" ")} ${optStrings.join(" ")}`
        .replace(/\s+/g, " ")
        .trim();
    return usageLine;
}
exports.getMessageCommandSignature = getMessageCommandSignature;
/**
 * Command pre-filter to restrict the command to the plugin's guilds, unless
 * allowed for DMs
 */
function restrictCommandSource(cmd, context) {
    let source = cmd.config.extra?.blueprint.source ?? "guild";
    if (!Array.isArray(source))
        source = [source];
    if (context.message.channel.type === discord_js_1.ChannelType.DM && source.includes("dm")) {
        return true;
    }
    if (context.message.channel.type !== discord_js_1.ChannelType.DM && source.includes("guild")) {
        return true;
    }
    return false;
}
exports.restrictCommandSource = restrictCommandSource;
/**
 * Command pre-filter to restrict the command by specifying a required
 * permission
 */
async function checkCommandPermission(cmd, context) {
    const permission = cmd.config.extra?.blueprint.permission;
    // No permission defined, default to "no permission"
    // If types are checked, this condition should never be true, but it's a safeguard
    if (permission === undefined)
        return false;
    // If permission isn't set to a `null`, check it matches
    if (permission) {
        const config = await context.pluginData.config.getForMessage(context.message);
        if (!(0, helpers_1.hasPermission)(config, permission)) {
            return false;
        }
    }
    return true;
}
exports.checkCommandPermission = checkCommandPermission;
/**
 * Command post-filter to check if the command's on cooldown and, if not, to put
 * it on cooldown
 */
async function checkCommandCooldown(cmd, context) {
    if (cmd.config.extra?.blueprint.cooldown) {
        const cdKey = `${cmd.id}-${context.message.author.id}`;
        const cdValue = typeof cmd.config.extra.blueprint.cooldown === "object"
            ? cmd.config.extra.blueprint.cooldown.amount
            : cmd.config.extra.blueprint.cooldown;
        const cdPermission = typeof cmd.config.extra.blueprint.cooldown === "object" ? cmd.config.extra.blueprint.cooldown.permission : null;
        let cdApplies = true;
        if (cdPermission) {
            const config = await context.pluginData.config.getForMessage(context.message);
            cdApplies = (0, helpers_1.hasPermission)(config, cdPermission);
        }
        if (cdApplies && context.pluginData.cooldowns.isOnCooldown(cdKey)) {
            // We're on cooldown
            return false;
        }
        context.pluginData.cooldowns.setCooldown(cdKey, cdValue);
    }
    return true;
}
exports.checkCommandCooldown = checkCommandCooldown;
/**
 * Command post-filter to wait for and trigger any locks the command has, and to
 * interrupt command execution if the lock gets interrupted before it
 */
async function checkCommandLocks(cmd, context) {
    if (!cmd.config?.extra?.blueprint.locks) {
        return true;
    }
    const lock = await context.pluginData.locks.acquire(cmd.config.extra.blueprint.locks);
    cmd.config.extra._lock = lock;
    return !lock.interrupted;
}
exports.checkCommandLocks = checkCommandLocks;
