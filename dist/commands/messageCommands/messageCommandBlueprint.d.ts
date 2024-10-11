import { AnyPluginData, GlobalPluginData, GuildPluginData } from "../../plugins/PluginData";
import { BasePluginType } from "../../plugins/pluginTypes";
import { CommandFn, MessageCommandSignatureOrArray, PluginCommandConfig } from "./messageCommandUtils";
type CommandSource = "guild" | "dm";
export interface MessageCommandBlueprint<TPluginData extends AnyPluginData<any>, _TSignature extends MessageCommandSignatureOrArray<TPluginData["_pluginType"]>> {
    type: "message";
    trigger: string | string[];
    signature?: _TSignature;
    run: CommandFn<TPluginData, _TSignature>;
    config?: PluginCommandConfig;
    permission: string | null;
    source?: CommandSource | CommandSource[];
    locks?: string | string[];
    cooldown?: number | {
        amount: number;
        permission: string;
    };
    description?: string;
    usage?: string;
}
type CommandBlueprintCreator<TPluginData extends AnyPluginData<any>> = <TSignature extends MessageCommandSignatureOrArray<TPluginData>>(blueprint: Omit<MessageCommandBlueprint<TPluginData, TSignature>, "type">) => MessageCommandBlueprint<TPluginData, TSignature>;
/**
 * Helper function that creates a command blueprint for a guild command.
 *
 * To specify `TPluginType` for additional type hints, use:
 * `guildCommand<TPluginType>()(blueprint)`
 */
export declare function guildPluginMessageCommand<TSignature extends MessageCommandSignatureOrArray<any>>(blueprint: Omit<MessageCommandBlueprint<GuildPluginData<any>, TSignature>, "type">): MessageCommandBlueprint<GuildPluginData<any>, TSignature>;
/**
 * Specify `TPluginType` for type hints and return self
 */
export declare function guildPluginMessageCommand<TPluginType extends BasePluginType>(): CommandBlueprintCreator<GuildPluginData<TPluginType>>;
/**
 * Helper function that creates a command blueprint for a global command.
 *
 * To specify `TPluginType` for additional type hints, use:
 * `globalCommand<TPluginType>()(blueprint)`
 */
export declare function globalPluginMessageCommand<TSignature extends MessageCommandSignatureOrArray<any>>(blueprint: Omit<MessageCommandBlueprint<GlobalPluginData<any>, TSignature>, "type">): MessageCommandBlueprint<GlobalPluginData<any>, TSignature>;
/**
 * Specify `TPluginType` for type hints and return self
 */
export declare function globalPluginMessageCommand<TPluginType extends BasePluginType>(): CommandBlueprintCreator<GlobalPluginData<TPluginType>>;
export {};
