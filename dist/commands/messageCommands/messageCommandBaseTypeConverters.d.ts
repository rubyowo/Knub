import { Channel, GuildMember, GuildTextBasedChannel, Role, User, VoiceChannel } from "discord.js";
import { AnyPluginData } from "../../plugins/PluginData";
import { CommandContext } from "./messageCommandUtils";
export declare const messageCommandBaseTypeConverters: {
    boolean: (value: any, context: any) => boolean;
    number(value: string): number;
    user(value: string, { pluginData: { client } }: CommandContext<AnyPluginData<any>>): User;
    member(value: string, { message, pluginData: { client } }: CommandContext<AnyPluginData<any>>): GuildMember;
    channel(value: string, { message }: CommandContext<AnyPluginData<any>>): Channel;
    textChannel(value: string, { message }: CommandContext<AnyPluginData<any>>): GuildTextBasedChannel;
    voiceChannel(value: string, { message }: CommandContext<AnyPluginData<any>>): VoiceChannel;
    role(value: string, { message }: CommandContext<AnyPluginData<any>>): Role;
    userId(value: string): string;
    channelId(value: string): string;
    string(value: any, context: any): string;
    bool(value: any, context: any): boolean;
};
export declare const baseCommandParameterTypeHelpers: {
    string: <T extends import("knub-command-manager").TTypeHelperOpts>(opts?: T | undefined) => import("knub-command-manager").TTypeHelperResult<T, string>;
    bool: <T_1 extends import("knub-command-manager").TTypeHelperOpts>(opts?: T_1 | undefined) => import("knub-command-manager").TTypeHelperResult<T_1, boolean>;
    switchOption: <T_2 extends Pick<import("knub-command-manager").TOption<any>, "def" | "shortcut">>(opts?: T_2 | undefined) => T_2 & {
        type: import("knub-command-manager").TTypeConverterFn<boolean, any>;
    } & {
        option: true;
        isSwitch: true;
    };
    number: <T_3 extends import("knub-command-manager").TTypeHelperOpts>(opts?: T_3 | undefined) => import("knub-command-manager").TTypeHelperResult<T_3, number>;
    user: <T_4 extends import("knub-command-manager").TTypeHelperOpts>(opts?: T_4 | undefined) => import("knub-command-manager").TTypeHelperResult<T_4, User>;
    member: <T_5 extends import("knub-command-manager").TTypeHelperOpts>(opts?: T_5 | undefined) => import("knub-command-manager").TTypeHelperResult<T_5, GuildMember>;
    channel: <T_6 extends import("knub-command-manager").TTypeHelperOpts>(opts?: T_6 | undefined) => import("knub-command-manager").TTypeHelperResult<T_6, Channel>;
    textChannel: <T_7 extends import("knub-command-manager").TTypeHelperOpts>(opts?: T_7 | undefined) => import("knub-command-manager").TTypeHelperResult<T_7, GuildTextBasedChannel>;
    voiceChannel: <T_8 extends import("knub-command-manager").TTypeHelperOpts>(opts?: T_8 | undefined) => import("knub-command-manager").TTypeHelperResult<T_8, VoiceChannel>;
    role: <T_9 extends import("knub-command-manager").TTypeHelperOpts>(opts?: T_9 | undefined) => import("knub-command-manager").TTypeHelperResult<T_9, Role>;
    userId: <T_10 extends import("knub-command-manager").TTypeHelperOpts>(opts?: T_10 | undefined) => import("knub-command-manager").TTypeHelperResult<T_10, string>;
    channelId: <T_10 extends import("knub-command-manager").TTypeHelperOpts>(opts?: T_10 | undefined) => import("knub-command-manager").TTypeHelperResult<T_10, string>;
};
