"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginLoadError = void 0;
const pluginUtils_1 = require("./pluginUtils");
class PluginLoadError extends Error {
    constructor(pluginName, ctx, originalError) {
        super(`PluginLoadError (${pluginName}): ${originalError.message}`);
        this.stack = originalError.stack;
        this.pluginName = pluginName;
        if ((0, pluginUtils_1.isGuildContext)(ctx)) {
            this.guildId = ctx.guildId;
        }
    }
}
exports.PluginLoadError = PluginLoadError;
