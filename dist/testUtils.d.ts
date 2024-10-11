import { AnnouncementChannel, AnyThreadChannel, Client, Guild, GuildChannel, GuildMember, Message, OmitPartialGroupDMChannel, Role, SendableChannels, Snowflake, TextChannel, User } from "discord.js";
import { Knub } from "./Knub";
import { KnubArgs } from "./types";
export declare function createMockClient(): Client<true>;
/**
 * Helper function to set up Knub with auto-cleanup
 */
export declare function withKnub(mochaDoneFn: () => void, fn: (createKnub: (args: Partial<KnubArgs>) => Knub, done: () => void) => void | Promise<void>): Promise<void>;
/**
 * Most tests need to initialize Knub, so this is a helper function to handle that
 */
export declare function initializeKnub(knub: Knub): Promise<void>;
export declare function sleep(ms: number): Promise<void>;
export declare function createMockGuild(client: Client, data?: {}): Guild;
export declare function createMockUser(client: Client, data?: {}): User;
export declare function createMockMember(guild: Guild, user: User, data?: {}): GuildMember;
export declare function createMockTextChannel(client: Client, guildId: Snowflake, data?: {}): TextChannel;
export declare function createMockMessage(client: Client, channel: SendableChannels, author: User, data?: {}): OmitPartialGroupDMChannel<Message>;
export declare function createMockRole(guild: Guild, data?: {}, overrideId?: string | null): Role;
export declare function createMockThread(channel: AnnouncementChannel | GuildChannel): AnyThreadChannel;
export type AssertTypeEquals<TActual, TExpected> = TActual extends TExpected ? true : false;
/**
 * Assertion "function" for types
 * 1. First type parameter (TExpected) is the expected type
 * 2. Second type parameter (TActual) is the actual, tested type
 * 3. Third type parameter (TAssert) is either true or false, based on whether the first and second type should match
 *
 * For example:
 * ```
 * assertTypeEquals<string, string, true>(); // passes: string and string match, and third parameter was true
 * assertTypeEquals<string, number, true>(); // error: string and number do not match, but third parameter was true
 * assertTypeEquals<string, number, false>(); // passses: string and number do not match, and third parameter was false
 * ```
 */
export declare function assertTypeEquals<TExpected, TActual, TAssert extends TActual extends TExpected ? true : false>(): void;
