"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalPluginSlashCommand = exports.guildPluginSlashCommand = void 0;
function slashCommand(...args) {
    if (args.length === 1) {
        // (blueprint)
        // Return command blueprint
        return {
            ...args[0],
            type: "slash",
        };
    }
    if (args.length === 0) {
        // No arguments, with TPluginType - return self
        return slashCommand;
    }
    throw new Error(`No signature of command() takes ${args.length} arguments`);
}
function guildPluginSlashCommand(...args) {
    return slashCommand(...args);
}
exports.guildPluginSlashCommand = guildPluginSlashCommand;
function globalPluginSlashCommand(...args) {
    return slashCommand(...args);
}
exports.globalPluginSlashCommand = globalPluginSlashCommand;
