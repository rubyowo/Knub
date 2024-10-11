"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isGuildEvent = exports.isGlobalEvent = exports.globalEvents = exports.fromDjsArgs = void 0;
const createFromDjsArgsObject = (obj) => {
    return obj;
};
/**
 * Each property is a function that converts DJS event listener arguments to Knub's event argument object.
 * @see https://github.com/discordjs/discord.js/blob/669c3cd/packages/discord.js/typings/index.d.ts#L4192
 */
exports.fromDjsArgs = createFromDjsArgsObject({
    applicationCommandPermissionsUpdate: (data) => ({ data }),
    autoModerationActionExecution: (autoModerationActionExecution) => ({
        autoModerationActionExecution,
    }),
    autoModerationRuleCreate: (autoModerationRule) => ({ autoModerationRule }),
    autoModerationRuleDelete: (autoModerationRule) => ({ autoModerationRule }),
    autoModerationRuleUpdate: (oldAutoModerationRule, newAutoModerationRule) => ({ oldAutoModerationRule, newAutoModerationRule }),
    cacheSweep: (message) => ({ message }),
    channelCreate: (channel) => ({ channel }),
    channelDelete: (channel) => ({ channel }),
    channelPinsUpdate: (channel, date) => ({ channel, date }),
    channelUpdate: (oldChannel, newChannel) => ({ oldChannel, newChannel }),
    debug: (message) => ({ message }),
    emojiCreate: (emoji) => ({ emoji }),
    emojiDelete: (emoji) => ({ emoji }),
    emojiUpdate: (oldEmoji, newEmoji) => ({ oldEmoji, newEmoji }),
    entitlementCreate: (entitlement) => ({ entitlement }),
    entitlementDelete: (entitlement) => ({ entitlement }),
    entitlementUpdate: (oldEntitlement, newEntitlement) => ({
        oldEntitlement,
        newEntitlement,
    }),
    error: (error) => ({ error }),
    guildAuditLogEntryCreate: (auditLogEntry, guild) => ({ auditLogEntry, guild }),
    guildAvailable: (guild) => ({ guild }),
    guildBanAdd: (ban) => ({ ban }),
    guildBanRemove: (ban) => ({ ban }),
    guildCreate: (guild) => ({ guild }),
    guildDelete: (guild) => ({ guild }),
    guildIntegrationsUpdate: (guild) => ({ guild }),
    guildMemberAdd: (member) => ({ member }),
    guildMemberAvailable: (member) => ({ member }),
    guildMemberRemove: (member) => ({ member }),
    guildMembersChunk: (members, guild, data) => ({ members, guild, data }),
    guildMemberUpdate: (oldMember, newMember) => ({
        oldMember,
        newMember,
    }),
    guildScheduledEventCreate: (guildScheduledEvent) => ({ guildScheduledEvent }),
    guildScheduledEventUpdate: (oldGuildScheduledEvent, newGuildScheduledEvent) => ({ oldGuildScheduledEvent, newGuildScheduledEvent }),
    guildScheduledEventDelete: (guildScheduledEvent) => ({
        guildScheduledEvent,
    }),
    guildScheduledEventUserAdd: (guildScheduledEvent, user) => ({
        guildScheduledEvent,
        user,
    }),
    guildScheduledEventUserRemove: (guildScheduledEvent, user) => ({
        guildScheduledEvent,
        user,
    }),
    guildUnavailable: (guild) => ({ guild }),
    guildUpdate: (oldGuild, newGuild) => ({ oldGuild, newGuild }),
    interactionCreate: (interaction) => ({ interaction }),
    invalidated: () => ({}),
    inviteCreate: (invite) => ({ invite }),
    inviteDelete: (invite) => ({ invite }),
    messageCreate: (message) => ({ message }),
    messageDelete: (message) => ({ message }),
    messageDeleteBulk: (messages) => ({ messages }),
    messagePollVoteAdd: (pollAnswer, userId) => ({ pollAnswer, userId }),
    messagePollVoteRemove: (pollAnswer, userId) => ({ pollAnswer, userId }),
    messageReactionAdd: (reaction, user) => ({
        reaction,
        user,
    }),
    messageReactionRemove: (reaction, user) => ({
        reaction,
        user,
    }),
    messageReactionRemoveAll: (message) => ({ message }),
    messageReactionRemoveEmoji: (reaction) => ({ reaction }),
    messageUpdate: (oldMessage, newMessage) => ({
        oldMessage,
        newMessage,
    }),
    presenceUpdate: (oldPresence, newPresence) => ({ oldPresence, newPresence }),
    clientReady: () => ({}),
    roleCreate: (role) => ({ role }),
    roleDelete: (role) => ({ role }),
    roleUpdate: (oldRole, newRole) => ({ oldRole, newRole }),
    stageInstanceCreate: (stageInstance) => ({ stageInstance }),
    stageInstanceDelete: (stageInstance) => ({ stageInstance }),
    stageInstanceUpdate: (oldStageInstance, newStageInstance) => ({
        oldStageInstance,
        newStageInstance,
    }),
    stickerCreate: (sticker) => ({ sticker }),
    stickerDelete: (sticker) => ({ sticker }),
    stickerUpdate: (oldSticker, newSticker) => ({ oldSticker, newSticker }),
    threadCreate: (thread, newlyCreated) => ({ thread, newlyCreated }),
    threadDelete: (thread) => ({ thread }),
    threadListSync: (threads, guild) => ({ threads, guild }),
    threadMemberUpdate: (oldMember, newMember) => ({ oldMember, newMember }),
    threadMembersUpdate: (addedMembers, removedMembers, thread) => ({ addedMembers, removedMembers, thread }),
    threadUpdate: (oldThread, newThread) => ({ oldThread, newThread }),
    typingStart: (typing) => ({ typing }),
    userUpdate: (oldUser, newUser) => ({ oldUser, newUser }),
    voiceStateUpdate: (oldState, newState) => ({ oldState, newState }),
    warn: (message) => ({ message }),
    webhooksUpdate: (channel) => ({
        channel,
    }),
    raw: (...rawArgs) => ({ rawArgs }),
});
exports.globalEvents = [
    "debug",
    "guildCreate",
    "guildUnavailable",
    "error",
    "clientReady",
    "invalidated",
    "userUpdate",
    "warn",
];
function isGlobalEvent(ev) {
    return exports.globalEvents.includes(ev);
}
exports.isGlobalEvent = isGlobalEvent;
function isGuildEvent(ev) {
    return !exports.globalEvents.includes(ev);
}
exports.isGuildEvent = isGuildEvent;
