import { APIInteractionGuildMember, Guild, GuildMember, PartialGuildMember } from "discord.js";
import { PermissionLevels } from "../config/configTypes";
import { AnyContext, GlobalContext, GuildContext, GuildPluginMap } from "../types";
import { KeyOfMap } from "../utils";
import { AnyGlobalPluginBlueprint, AnyGuildPluginBlueprint, AnyPluginBlueprint, BasePluginBlueprint } from "./PluginBlueprint";
export declare function getMemberRoles(member: GuildMember | PartialGuildMember | APIInteractionGuildMember): string[];
export declare function getMemberLevel(levels: PermissionLevels, member: GuildMember | PartialGuildMember | APIInteractionGuildMember, guild: Guild): number;
export declare function isGuildContext(ctx: AnyContext): ctx is GuildContext;
export declare function isGlobalContext(ctx: AnyContext): ctx is GuildContext;
export declare function isGuildBlueprintByContext(_ctx: GuildContext, _blueprint: AnyPluginBlueprint): _blueprint is AnyGuildPluginBlueprint;
export declare function isGlobalBlueprintByContext(_ctx: GlobalContext, _blueprint: AnyPluginBlueprint): _blueprint is AnyGlobalPluginBlueprint;
export type PluginPublicInterface<T extends BasePluginBlueprint<any, any>> = NonNullable<T["public"]> extends (...args: any[]) => infer R ? R : null;
/**
 * By default, return an empty config for all guilds and the global config
 */
export declare function defaultGetConfig(): {};
/**
 * By default, load all available guild plugins
 */
export declare function defaultGetEnabledGuildPlugins(ctx: AnyContext, guildPlugins: GuildPluginMap): Array<KeyOfMap<GuildPluginMap>>;
