import { Locale, MessageContextMenuCommandInteraction, Permissions, UserContextMenuCommandInteraction } from "discord.js";
import { AnyPluginData, GlobalPluginData, GuildPluginData } from "../../plugins/PluginData";
import { BasePluginType } from "../../plugins/pluginTypes";
export interface BaseContextMenuCommandBlueprint {
    name: string;
    nameLocalizations?: Record<Locale, string>;
    descriptionLocalizations?: Record<Locale, string>;
    defaultMemberPermissions?: Permissions;
    configPermission?: string;
    allowDms?: boolean;
}
export interface MessageContextMenuCommandBlueprint<TPluginData extends AnyPluginData<any>> extends BaseContextMenuCommandBlueprint {
    type: "message-context-menu";
    run: (meta: MessageContextMenuCommandMeta<TPluginData>) => void | Promise<void>;
}
export type MessageContextMenuCommandMeta<TPluginData extends AnyPluginData<any>> = {
    pluginData: TPluginData;
    interaction: MessageContextMenuCommandInteraction;
};
type MessageContextMenuCommandCreator<TPluginData extends AnyPluginData<any>> = (blueprint: Omit<MessageContextMenuCommandBlueprint<TPluginData>, "type">) => MessageContextMenuCommandBlueprint<TPluginData>;
export declare function guildPluginMessageContextMenuCommand(blueprint: Omit<MessageContextMenuCommandBlueprint<GuildPluginData<any>>, "type">): MessageContextMenuCommandBlueprint<GuildPluginData<any>>;
export declare function guildPluginMessageContextMenuCommand<TPluginType extends BasePluginType>(): MessageContextMenuCommandCreator<GuildPluginData<TPluginType>>;
export declare function globalPluginMessageContextMenuCommand(blueprint: Omit<MessageContextMenuCommandBlueprint<GlobalPluginData<any>>, "type">): MessageContextMenuCommandBlueprint<GlobalPluginData<any>>;
export declare function globalPluginMessageContextMenuCommand<TPluginType extends BasePluginType>(): MessageContextMenuCommandCreator<GlobalPluginData<TPluginType>>;
export interface UserContextMenuCommandBlueprint<TPluginData extends AnyPluginData<any>> extends BaseContextMenuCommandBlueprint {
    type: "user-context-menu";
    run: (meta: UserContextMenuCommandMeta<TPluginData>) => void | Promise<void>;
}
export type UserContextMenuCommandMeta<TPluginData extends AnyPluginData<any>> = {
    pluginData: TPluginData;
    interaction: UserContextMenuCommandInteraction;
};
type UserContextMenuCommandCreator<TPluginData extends AnyPluginData<any>> = (blueprint: Omit<UserContextMenuCommandBlueprint<TPluginData>, "type">) => UserContextMenuCommandBlueprint<TPluginData>;
export declare function guildPluginUserContextMenuCommand(blueprint: Omit<UserContextMenuCommandBlueprint<GuildPluginData<any>>, "type">): UserContextMenuCommandBlueprint<GuildPluginData<any>>;
export declare function guildPluginUserContextMenuCommand<TPluginType extends BasePluginType>(): UserContextMenuCommandCreator<GuildPluginData<TPluginType>>;
export declare function globalPluginUserContextMenuCommand(blueprint: Omit<UserContextMenuCommandBlueprint<GlobalPluginData<any>>, "type">): UserContextMenuCommandBlueprint<GlobalPluginData<any>>;
export declare function globalPluginUserContextMenuCommand<TPluginType extends BasePluginType>(): UserContextMenuCommandCreator<GlobalPluginData<TPluginType>>;
export {};
