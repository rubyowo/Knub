"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalPlugin = exports.guildPlugin = void 0;
function pluginCreator(...args) {
    if (args.length === 1) {
        // (blueprint)
        // Return blueprint
        return args[0];
    }
    if (args.length === 0) {
        // No arguments, with TPluginType - return self
        return pluginCreator;
    }
    throw new Error(`No signature of plugin() takes ${args.length} arguments`);
}
function guildPlugin(...args) {
    return pluginCreator(...args);
}
exports.guildPlugin = guildPlugin;
function globalPlugin(...args) {
    return pluginCreator(...args);
}
exports.globalPlugin = globalPlugin;
