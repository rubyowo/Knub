"use strict";
/**
 * @file Internal utility functions/types
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.notCallable = exports.indexBy = exports.typedKeys = exports.noop = exports.getRoleId = exports.getChannelId = exports.getUserId = exports.snowflakeRegex = exports.roleMentionRegex = exports.channelMentionRegex = exports.userMentionRegex = exports.get = void 0;
function get(obj, path, def) {
    let cursor = obj;
    if (cursor === undefined)
        return def;
    if (cursor == null)
        return null;
    const pathParts = path.split(".");
    for (const part of pathParts) {
        const value = cursor[part];
        if (value === undefined)
            return def;
        if (value == null)
            return null;
        cursor = value;
    }
    return cursor;
}
exports.get = get;
exports.userMentionRegex = /^<@!?([0-9]+)>$/;
exports.channelMentionRegex = /^<#([0-9]+)>$/;
exports.roleMentionRegex = /^<@&([0-9]+)>$/;
exports.snowflakeRegex = /^[1-9][0-9]{5,19}$/;
function getUserId(str) {
    str = str.trim();
    if (str.match(exports.snowflakeRegex)) {
        // User ID
        return str;
    }
    const mentionMatch = str.match(exports.userMentionRegex);
    if (mentionMatch) {
        return mentionMatch[1];
    }
    return null;
}
exports.getUserId = getUserId;
function getChannelId(str) {
    str = str.trim();
    if (str.match(exports.snowflakeRegex)) {
        // Channel ID
        return str;
    }
    const mentionMatch = str.match(exports.channelMentionRegex);
    if (mentionMatch) {
        return mentionMatch[1];
    }
    return null;
}
exports.getChannelId = getChannelId;
function getRoleId(str) {
    str = str.trim();
    if (str.match(exports.snowflakeRegex)) {
        // Role ID
        return str;
    }
    const mentionMatch = str.match(exports.roleMentionRegex);
    if (mentionMatch) {
        return mentionMatch[1];
    }
    return null;
}
exports.getRoleId = getRoleId;
const noop = () => { };
exports.noop = noop;
exports.typedKeys = Object.keys;
function indexBy(arr, key) {
    return arr.reduce((map, obj) => {
        map.set(obj[key], obj);
        return map;
    }, new Map());
}
exports.indexBy = indexBy;
function notCallable(message) {
    return () => {
        throw new Error(message);
    };
}
exports.notCallable = notCallable;
