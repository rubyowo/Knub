import { Locale, Permissions } from "discord.js";
import { AnyPluginData, GlobalPluginData, GuildPluginData } from "../../plugins/PluginData";
import { BasePluginType } from "../../plugins/pluginTypes";
import { SlashCommandBlueprint } from "./slashCommandBlueprint";
export type SlashGroupBlueprint<TPluginData extends AnyPluginData<any>> = {
    type: "slash-group";
    name: string;
    nameLocalizations?: Record<Locale, string>;
    description: string;
    descriptionLocalizations?: Record<Locale, string>;
    defaultMemberPermissions?: Permissions;
    allowDms?: boolean;
    subcommands: Array<SlashCommandBlueprint<TPluginData, any> | SlashGroupBlueprint<TPluginData>>;
};
type SlashGroupBlueprintCreator<TPluginData extends AnyPluginData<any>> = (blueprint: Omit<SlashGroupBlueprint<TPluginData>, "type">) => SlashGroupBlueprint<TPluginData>;
/**
 * Helper function that creates a blueprint for a guild slash group.
 *
 * To specify `TPluginType` for additional type hints, use:
 * `guildPluginSlashGroup<TPluginType>()(blueprint)`
 */
export declare function guildPluginSlashGroup(blueprint: Omit<SlashGroupBlueprint<GuildPluginData<any>>, "type">): SlashGroupBlueprint<GuildPluginData<any>>;
/**
 * Specify `TPluginType` for type hints and return self
 */
export declare function guildPluginSlashGroup<TPluginType extends BasePluginType>(): SlashGroupBlueprintCreator<GuildPluginData<TPluginType>>;
/**
 * Helper function that creates a blueprint for a guild slash group.
 *
 * To specify `TPluginType` for additional type hints, use:
 * `globalPluginSlashGroup<TPluginType>()(blueprint)`
 */
export declare function globalPluginSlashGroup(blueprint: Omit<SlashGroupBlueprint<GlobalPluginData<any>>, "type">): SlashGroupBlueprint<GlobalPluginData<any>>;
/**
 * Specify `TPluginType` for type hints and return self
 */
export declare function globalPluginSlashGroup<TPluginType extends BasePluginType>(): SlashGroupBlueprintCreator<GlobalPluginData<TPluginType>>;
export {};
