/**
 * @file Public helper functions/types
 */
import { Client, GuildMember, Invite, Message, SendableChannels, TextBasedChannel } from "discord.js";
import { GuildPluginData } from "./plugins/PluginData";
/**
 * Splits a string into chunks, preferring to split at newlines if possible
 */
export declare function splitIntoCleanChunks(str: string, maxChunkLength?: number): string[];
/**
 * Splits a message into chunks that fit into Discord's message length limit (2000) while also retaining leading and
 * trailing line breaks, open code blocks, etc. between chunks
 */
export declare function splitMessageIntoChunks(str: string, chunkLength?: number): string[];
/**
 * Sends a message to the specified channel, splitting it into multiple shorter messages if the message text goes over
 * the Discord message length limit (2000)
 */
export declare function createChunkedMessage(channel: SendableChannels, messageText: string): Promise<Message[]>;
/**
 * Returns a promise that resolves when the specified channel gets a new message, optionally restricted to a message by
 * a specific user only
 */
export declare function waitForReply(client: Client, channel: TextBasedChannel, restrictToUserId?: string, timeout?: number): Promise<Message | null>;
/**
 * Disables link previews in the string by wrapping detected links in < and >
 */
export declare function disableLinkPreviews(str: string): string;
/**
 * Deactivates user/role mentions in the string by adding an invisible unicode char after each @-character
 */
export declare function deactivateMentions(str: string): string;
/**
 * Disables code blocks in the string by adding an invisible unicode char after each backtick
 */
export declare function disableCodeBlocks(str: string): string;
/**
 * Returns the full invite link for an invite object
 */
export declare function getInviteLink(inv: Invite): string;
export declare function hasPermission(config: unknown, permission: string): boolean;
export declare function getMemberLevel(pluginData: GuildPluginData<any>, member: GuildMember): number;
export { userMentionRegex, channelMentionRegex, roleMentionRegex, snowflakeRegex, getChannelId, getRoleId, getUserId, } from "./utils";
