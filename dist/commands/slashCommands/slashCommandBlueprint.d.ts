import { Locale, Permissions } from "discord.js";
import { AnyPluginData, GlobalPluginData, GuildPluginData } from "../../plugins/PluginData";
import { BasePluginType } from "../../plugins/pluginTypes";
import { BaseSlashCommandOption } from "./slashCommandOptions";
import { SlashCommandFn, SlashCommandSignature } from "./slashCommandUtils";
export type AnySlashCommandSignature = Array<BaseSlashCommandOption<any, any>>;
export type SlashCommandBlueprint<TPluginData extends AnyPluginData<any>, TSignature extends AnySlashCommandSignature> = {
    type: "slash";
    name: string;
    nameLocalizations?: Record<Locale, string>;
    description: string;
    descriptionLocalizations?: Record<Locale, string>;
    defaultMemberPermissions?: Permissions;
    configPermission?: string;
    allowDms?: boolean;
    signature: TSignature;
    run: SlashCommandFn<TPluginData, TSignature>;
};
type SlashCommandBlueprintCreator<TPluginData extends AnyPluginData<any>> = <TSignature extends SlashCommandSignature>(blueprint: Omit<SlashCommandBlueprint<TPluginData, TSignature>, "type">) => SlashCommandBlueprint<TPluginData, TSignature>;
/**
 * Helper function that creates a command blueprint for a guild slash command.
 *
 * To specify `TPluginType` for additional type hints, use:
 * `guildCommand<TPluginType>()(blueprint)`
 */
export declare function guildPluginSlashCommand<TSignature extends SlashCommandSignature>(blueprint: Omit<SlashCommandBlueprint<GuildPluginData<any>, TSignature>, "type">): SlashCommandBlueprint<GuildPluginData<any>, TSignature>;
/**
 * Specify `TPluginType` for type hints and return self
 */
export declare function guildPluginSlashCommand<TPluginType extends BasePluginType>(): SlashCommandBlueprintCreator<GuildPluginData<TPluginType>>;
/**
 * Helper function that creates a command blueprint for a guild slash command.
 *
 * To specify `TPluginType` for additional type hints, use:
 * `guildCommand<TPluginType>()(blueprint)`
 */
export declare function globalPluginSlashCommand<TSignature extends SlashCommandSignature>(blueprint: Omit<SlashCommandBlueprint<GlobalPluginData<any>, TSignature>, "type">): SlashCommandBlueprint<GlobalPluginData<any>, TSignature>;
/**
 * Specify `TPluginType` for type hints and return self
 */
export declare function globalPluginSlashCommand<TPluginType extends BasePluginType>(): SlashCommandBlueprintCreator<GlobalPluginData<TPluginType>>;
export {};
