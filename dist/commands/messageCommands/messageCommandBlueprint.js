"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalPluginMessageCommand = exports.guildPluginMessageCommand = void 0;
function command(...args) {
    if (args.length === 1) {
        // (blueprint)
        // Return command blueprint with proper type
        return {
            ...args[0],
            type: "message",
        };
    }
    if (args.length === 0) {
        // No arguments, with TPluginType - return self
        return command;
    }
    throw new Error(`No signature of command() takes ${args.length} arguments`);
}
function guildPluginMessageCommand(...args) {
    return command(...args);
}
exports.guildPluginMessageCommand = guildPluginMessageCommand;
function globalPluginMessageCommand(...args) {
    return command(...args);
}
exports.globalPluginMessageCommand = globalPluginMessageCommand;
