"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isGlobalPluginData = exports.isGuildPluginData = void 0;
function isGuildPluginData(pluginData) {
    return "context" in pluginData && pluginData.context === "guild";
}
exports.isGuildPluginData = isGuildPluginData;
function isGlobalPluginData(pluginData) {
    return "context" in pluginData && pluginData.context === "global";
}
exports.isGlobalPluginData = isGlobalPluginData;
