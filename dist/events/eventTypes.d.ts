import { AnnouncementChannel, AnyThreadChannel, ApplicationCommandPermissionsUpdateData, AutoModerationActionExecution, AutoModerationRule, ClientEvents, DMChannel, Entitlement, ForumChannel, Guild, GuildAuditLogsEntry, GuildBan, GuildEmoji, GuildMember, GuildScheduledEvent, Interaction, Invite, MediaChannel, Message, MessageReaction, NonThreadGuildBasedChannel, OmitPartialGroupDMChannel, PartialGuildMember, PartialGuildScheduledEvent, PartialMessage, PartialMessageReaction, PartialThreadMember, PartialUser, PollAnswer, Presence, ReadonlyCollection, Role, Snowflake, StageInstance, Sticker, TextBasedChannel, TextChannel, ThreadMember, Typing, User, VoiceChannel, VoiceState } from "discord.js";
import { GuildMessage } from "../types";
export type ExtendedClientEvents = ClientEvents & {
    raw: any[];
};
/**
 * Each property is a function that converts DJS event listener arguments to Knub's event argument object.
 * @see https://github.com/discordjs/discord.js/blob/669c3cd/packages/discord.js/typings/index.d.ts#L4192
 */
export declare const fromDjsArgs: {
    applicationCommandPermissionsUpdate: (data: ApplicationCommandPermissionsUpdateData) => {
        data: ApplicationCommandPermissionsUpdateData;
    };
    autoModerationActionExecution: (autoModerationActionExecution: AutoModerationActionExecution) => {
        autoModerationActionExecution: AutoModerationActionExecution;
    };
    autoModerationRuleCreate: (autoModerationRule: AutoModerationRule) => {
        autoModerationRule: AutoModerationRule;
    };
    autoModerationRuleDelete: (autoModerationRule: AutoModerationRule) => {
        autoModerationRule: AutoModerationRule;
    };
    autoModerationRuleUpdate: (oldAutoModerationRule: AutoModerationRule | null, newAutoModerationRule: AutoModerationRule) => {
        oldAutoModerationRule: AutoModerationRule | null;
        newAutoModerationRule: AutoModerationRule;
    };
    cacheSweep: (message: string) => {
        message: string;
    };
    channelCreate: (channel: NonThreadGuildBasedChannel) => {
        channel: NonThreadGuildBasedChannel;
    };
    channelDelete: (channel: DMChannel | NonThreadGuildBasedChannel) => {
        channel: DMChannel | NonThreadGuildBasedChannel;
    };
    channelPinsUpdate: (channel: TextBasedChannel, date: Date) => {
        channel: TextBasedChannel;
        date: Date;
    };
    channelUpdate: (oldChannel: DMChannel | NonThreadGuildBasedChannel, newChannel: DMChannel | NonThreadGuildBasedChannel) => {
        oldChannel: DMChannel | NonThreadGuildBasedChannel;
        newChannel: DMChannel | NonThreadGuildBasedChannel;
    };
    debug: (message: string) => {
        message: string;
    };
    emojiCreate: (emoji: GuildEmoji) => {
        emoji: GuildEmoji;
    };
    emojiDelete: (emoji: GuildEmoji) => {
        emoji: GuildEmoji;
    };
    emojiUpdate: (oldEmoji: GuildEmoji, newEmoji: GuildEmoji) => {
        oldEmoji: GuildEmoji;
        newEmoji: GuildEmoji;
    };
    entitlementCreate: (entitlement: Entitlement) => {
        entitlement: Entitlement;
    };
    entitlementDelete: (entitlement: Entitlement) => {
        entitlement: Entitlement;
    };
    entitlementUpdate: (oldEntitlement: Entitlement | null, newEntitlement: Entitlement) => {
        oldEntitlement: Entitlement | null;
        newEntitlement: Entitlement;
    };
    error: (error: Error) => {
        error: Error;
    };
    guildAuditLogEntryCreate: (auditLogEntry: GuildAuditLogsEntry, guild: Guild) => {
        auditLogEntry: GuildAuditLogsEntry<import("discord.js").AuditLogEvent, import("discord.js").GuildAuditLogsActionType, import("discord.js").GuildAuditLogsTargetType, import("discord.js").AuditLogEvent>;
        guild: Guild;
    };
    guildAvailable: (guild: Guild) => {
        guild: Guild;
    };
    guildBanAdd: (ban: GuildBan) => {
        ban: GuildBan;
    };
    guildBanRemove: (ban: GuildBan) => {
        ban: GuildBan;
    };
    guildCreate: (guild: Guild) => {
        guild: Guild;
    };
    guildDelete: (guild: Guild) => {
        guild: Guild;
    };
    guildIntegrationsUpdate: (guild: Guild) => {
        guild: Guild;
    };
    guildMemberAdd: (member: GuildMember) => {
        member: GuildMember;
    };
    guildMemberAvailable: (member: GuildMember | PartialGuildMember) => {
        member: GuildMember | PartialGuildMember;
    };
    guildMemberRemove: (member: GuildMember | PartialGuildMember) => {
        member: GuildMember | PartialGuildMember;
    };
    guildMembersChunk: (members: ReadonlyCollection<Snowflake, GuildMember>, guild: Guild, data: {
        count: number;
        index: number;
        nonce: string | undefined;
    }) => {
        members: ReadonlyCollection<string, GuildMember>;
        guild: Guild;
        data: {
            count: number;
            index: number;
            nonce: string | undefined;
        };
    };
    guildMemberUpdate: (oldMember: GuildMember | PartialGuildMember, newMember: GuildMember) => {
        oldMember: GuildMember | PartialGuildMember;
        newMember: GuildMember;
    };
    guildScheduledEventCreate: (guildScheduledEvent: GuildScheduledEvent) => {
        guildScheduledEvent: GuildScheduledEvent<import("discord.js").GuildScheduledEventStatus>;
    };
    guildScheduledEventUpdate: (oldGuildScheduledEvent: GuildScheduledEvent | PartialGuildScheduledEvent | null, newGuildScheduledEvent: GuildScheduledEvent) => {
        oldGuildScheduledEvent: GuildScheduledEvent<import("discord.js").GuildScheduledEventStatus> | PartialGuildScheduledEvent | null;
        newGuildScheduledEvent: GuildScheduledEvent<import("discord.js").GuildScheduledEventStatus>;
    };
    guildScheduledEventDelete: (guildScheduledEvent: GuildScheduledEvent | PartialGuildScheduledEvent) => {
        guildScheduledEvent: GuildScheduledEvent<import("discord.js").GuildScheduledEventStatus> | PartialGuildScheduledEvent;
    };
    guildScheduledEventUserAdd: (guildScheduledEvent: GuildScheduledEvent | PartialGuildScheduledEvent, user: User) => {
        guildScheduledEvent: GuildScheduledEvent<import("discord.js").GuildScheduledEventStatus> | PartialGuildScheduledEvent;
        user: User;
    };
    guildScheduledEventUserRemove: (guildScheduledEvent: GuildScheduledEvent | PartialGuildScheduledEvent, user: User) => {
        guildScheduledEvent: GuildScheduledEvent<import("discord.js").GuildScheduledEventStatus> | PartialGuildScheduledEvent;
        user: User;
    };
    guildUnavailable: (guild: Guild) => {
        guild: Guild;
    };
    guildUpdate: (oldGuild: Guild, newGuild: Guild) => {
        oldGuild: Guild;
        newGuild: Guild;
    };
    interactionCreate: (interaction: Interaction) => {
        interaction: Interaction;
    };
    invalidated: () => {};
    inviteCreate: (invite: Invite) => {
        invite: Invite;
    };
    inviteDelete: (invite: Invite) => {
        invite: Invite;
    };
    messageCreate: (message: OmitPartialGroupDMChannel<Message>) => {
        message: OmitPartialGroupDMChannel<Message<boolean>>;
    };
    messageDelete: (message: OmitPartialGroupDMChannel<Message | PartialMessage>) => {
        message: OmitPartialGroupDMChannel<Message<boolean> | PartialMessage>;
    };
    messageDeleteBulk: (messages: ReadonlyCollection<Snowflake, OmitPartialGroupDMChannel<Message | PartialMessage>>) => {
        messages: ReadonlyCollection<string, OmitPartialGroupDMChannel<Message<boolean> | PartialMessage>>;
    };
    messagePollVoteAdd: (pollAnswer: PollAnswer, userId: Snowflake) => {
        pollAnswer: PollAnswer;
        userId: string;
    };
    messagePollVoteRemove: (pollAnswer: PollAnswer, userId: Snowflake) => {
        pollAnswer: PollAnswer;
        userId: string;
    };
    messageReactionAdd: (reaction: MessageReaction | PartialMessageReaction, user: User | PartialUser) => {
        reaction: MessageReaction | PartialMessageReaction;
        user: User | PartialUser;
    };
    messageReactionRemove: (reaction: MessageReaction | PartialMessageReaction, user: User | PartialUser) => {
        reaction: MessageReaction | PartialMessageReaction;
        user: User | PartialUser;
    };
    messageReactionRemoveAll: (message: OmitPartialGroupDMChannel<Message | PartialMessage>) => {
        message: OmitPartialGroupDMChannel<Message<boolean> | PartialMessage>;
    };
    messageReactionRemoveEmoji: (reaction: MessageReaction | PartialMessageReaction) => {
        reaction: MessageReaction | PartialMessageReaction;
    };
    messageUpdate: (oldMessage: OmitPartialGroupDMChannel<Message | PartialMessage>, newMessage: OmitPartialGroupDMChannel<Message | PartialMessage>) => {
        oldMessage: OmitPartialGroupDMChannel<Message<boolean> | PartialMessage>;
        newMessage: OmitPartialGroupDMChannel<Message<boolean> | PartialMessage>;
    };
    presenceUpdate: (oldPresence: Presence | null, newPresence: Presence) => {
        oldPresence: Presence | null;
        newPresence: Presence;
    };
    clientReady: () => {};
    roleCreate: (role: Role) => {
        role: Role;
    };
    roleDelete: (role: Role) => {
        role: Role;
    };
    roleUpdate: (oldRole: Role, newRole: Role) => {
        oldRole: Role;
        newRole: Role;
    };
    stageInstanceCreate: (stageInstance: StageInstance) => {
        stageInstance: StageInstance;
    };
    stageInstanceDelete: (stageInstance: StageInstance) => {
        stageInstance: StageInstance;
    };
    stageInstanceUpdate: (oldStageInstance: StageInstance | null, newStageInstance: StageInstance) => {
        oldStageInstance: StageInstance | null;
        newStageInstance: StageInstance;
    };
    stickerCreate: (sticker: Sticker) => {
        sticker: Sticker;
    };
    stickerDelete: (sticker: Sticker) => {
        sticker: Sticker;
    };
    stickerUpdate: (oldSticker: Sticker, newSticker: Sticker) => {
        oldSticker: Sticker;
        newSticker: Sticker;
    };
    threadCreate: (thread: AnyThreadChannel, newlyCreated: boolean) => {
        thread: AnyThreadChannel;
        newlyCreated: boolean;
    };
    threadDelete: (thread: AnyThreadChannel) => {
        thread: AnyThreadChannel;
    };
    threadListSync: (threads: ReadonlyCollection<Snowflake, AnyThreadChannel>, guild: Guild) => {
        threads: ReadonlyCollection<string, AnyThreadChannel>;
        guild: Guild;
    };
    threadMemberUpdate: (oldMember: ThreadMember, newMember: ThreadMember) => {
        oldMember: ThreadMember<boolean>;
        newMember: ThreadMember<boolean>;
    };
    threadMembersUpdate: (addedMembers: ReadonlyCollection<Snowflake, ThreadMember>, removedMembers: ReadonlyCollection<Snowflake, ThreadMember | PartialThreadMember>, thread: AnyThreadChannel) => {
        addedMembers: ReadonlyCollection<string, ThreadMember<boolean>>;
        removedMembers: ReadonlyCollection<string, ThreadMember<boolean> | PartialThreadMember>;
        thread: AnyThreadChannel;
    };
    threadUpdate: (oldThread: AnyThreadChannel, newThread: AnyThreadChannel) => {
        oldThread: AnyThreadChannel;
        newThread: AnyThreadChannel;
    };
    typingStart: (typing: Typing) => {
        typing: Typing;
    };
    userUpdate: (oldUser: User | PartialUser, newUser: User) => {
        oldUser: User | PartialUser;
        newUser: User;
    };
    voiceStateUpdate: (oldState: VoiceState, newState: VoiceState) => {
        oldState: VoiceState;
        newState: VoiceState;
    };
    warn: (message: string) => {
        message: string;
    };
    webhooksUpdate: (channel: TextChannel | AnnouncementChannel | VoiceChannel | ForumChannel | MediaChannel) => {
        channel: AnnouncementChannel | TextChannel | VoiceChannel | ForumChannel | MediaChannel;
    };
    raw: (...rawArgs: any[]) => {
        rawArgs: any[];
    };
};
export type KnownEvents = {
    [key in keyof typeof fromDjsArgs]: ReturnType<(typeof fromDjsArgs)[key]>;
};
export interface KnownGuildEvents extends KnownEvents {
    channelUpdate: {
        oldChannel: NonThreadGuildBasedChannel;
        newChannel: NonThreadGuildBasedChannel;
    };
    channelDelete: {
        channel: NonThreadGuildBasedChannel;
    };
    messageCreate: {
        message: GuildMessage;
    };
    typingStart: {
        typing: Typing & {
            channel: NonThreadGuildBasedChannel;
        };
    };
}
export type EventArguments = KnownEvents;
export type GuildEventArguments = KnownGuildEvents;
export declare const globalEvents: readonly ["debug", "guildCreate", "guildUnavailable", "error", "clientReady", "invalidated", "userUpdate", "warn"];
export type ValidEvent = keyof KnownEvents;
export type GlobalEvent = (typeof globalEvents)[number];
export type GuildEvent = Exclude<ValidEvent, GlobalEvent>;
export declare function isGlobalEvent(ev: ValidEvent): ev is GlobalEvent;
export declare function isGuildEvent(ev: ValidEvent): ev is GuildEvent;
