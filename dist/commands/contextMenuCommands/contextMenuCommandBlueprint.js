"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalPluginUserContextMenuCommand = exports.guildPluginUserContextMenuCommand = exports.globalPluginMessageContextMenuCommand = exports.guildPluginMessageContextMenuCommand = void 0;
function messageContextMenuCommand(...args) {
    if (args.length === 1) {
        return {
            ...args[0],
            type: "message-context-menu",
        };
    }
    if (args.length === 0) {
        return messageContextMenuCommand;
    }
    throw new Error(`No signature of guildMessageContextMenuCommand() takes ${args.length} arguments`);
}
function guildPluginMessageContextMenuCommand(...args) {
    return messageContextMenuCommand(...args);
}
exports.guildPluginMessageContextMenuCommand = guildPluginMessageContextMenuCommand;
function globalPluginMessageContextMenuCommand(...args) {
    return messageContextMenuCommand(...args);
}
exports.globalPluginMessageContextMenuCommand = globalPluginMessageContextMenuCommand;
function userContextMenuCommand(...args) {
    if (args.length === 1) {
        return {
            ...args[0],
            type: "user-context-menu",
        };
    }
    if (args.length === 0) {
        return userContextMenuCommand;
    }
    throw new Error(`No signature of guildUserContextMenuCommand() takes ${args.length} arguments`);
}
function guildPluginUserContextMenuCommand(...args) {
    return userContextMenuCommand(...args);
}
exports.guildPluginUserContextMenuCommand = guildPluginUserContextMenuCommand;
function globalPluginUserContextMenuCommand(...args) {
    return userContextMenuCommand(...args);
}
exports.globalPluginUserContextMenuCommand = globalPluginUserContextMenuCommand;
