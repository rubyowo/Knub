"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalPluginSlashGroup = exports.guildPluginSlashGroup = void 0;
function slashGroup(...args) {
    if (args.length === 1) {
        // (blueprint)
        // Return group blueprint
        return {
            ...args[0],
            type: "slash-group",
        };
    }
    if (args.length === 0) {
        // No arguments, with TPluginType - return self
        return slashGroup;
    }
    throw new Error(`No signature of slashGroup() takes ${args.length} arguments`);
}
function guildPluginSlashGroup(...args) {
    return slashGroup(...args);
}
exports.guildPluginSlashGroup = guildPluginSlashGroup;
function globalPluginSlashGroup(...args) {
    return slashGroup(...args);
}
exports.globalPluginSlashGroup = globalPluginSlashGroup;
