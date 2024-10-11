import { Client, Message } from "discord.js";
import { AnyPluginData } from "../../plugins/PluginData";
import { MessageCommandBlueprint } from "./messageCommandBlueprint";
import { MessageCommandSignatureOrArray, PluginCommandDefinition } from "./messageCommandUtils";
export interface PluginCommandManagerOpts {
    prefix?: string | RegExp;
}
/**
 * A module to manage and run commands for a single instance of a plugin
 */
export declare class PluginMessageCommandManager<TPluginData extends AnyPluginData<any>> {
    private pluginData;
    private manager;
    private handlers;
    constructor(client: Client, opts?: PluginCommandManagerOpts);
    setPluginData(pluginData: TPluginData): void;
    add<TSignature extends MessageCommandSignatureOrArray<TPluginData["_pluginType"]>>(blueprint: MessageCommandBlueprint<TPluginData, TSignature>): void;
    remove(id: number): void;
    getAll(): PluginCommandDefinition[];
    runFromMessage(msg: Message): Promise<void>;
    private runCommand;
}
