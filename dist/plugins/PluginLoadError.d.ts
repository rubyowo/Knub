import { AnyContext } from "../types";
export declare class PluginLoadError extends Error {
    pluginName: string;
    guildId?: string;
    constructor(pluginName: string, ctx: AnyContext, originalError: Error);
}
