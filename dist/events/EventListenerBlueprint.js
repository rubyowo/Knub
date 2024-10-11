"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalPluginEventListener = exports.guildPluginEventListener = void 0;
function eventListener(...args) {
    if (args.length === 1) {
        // (blueprint)
        // Return event listener blueprint
        return args[0];
    }
    if (args.length === 0) {
        // No arguments, with TPluginType - return self
        return eventListener;
    }
    throw new Error(`No signature of eventListener() takes ${args.length} arguments`);
}
function guildPluginEventListener(...args) {
    return eventListener(...args);
}
exports.guildPluginEventListener = guildPluginEventListener;
function globalPluginEventListener(...args) {
    return eventListener(...args);
}
exports.globalPluginEventListener = globalPluginEventListener;
