/**
 * @file Internal utility functions/types
 */
import { Snowflake } from "discord.js";
/** */
export type Awaitable<T = unknown> = T | Promise<T>;
export type WithRequiredProps<T, K extends keyof T> = T & {
    [PK in K]-?: Exclude<T[K], null>;
};
export declare function get<TObj>(obj: TObj, path: string, def?: any): unknown;
export declare const userMentionRegex: RegExp;
export declare const channelMentionRegex: RegExp;
export declare const roleMentionRegex: RegExp;
export declare const snowflakeRegex: RegExp;
export declare function getUserId(str: string): Snowflake | null;
export declare function getChannelId(str: string): Snowflake | null;
export declare function getRoleId(str: string): Snowflake | null;
export declare const noop: () => void;
export declare const typedKeys: <T = Record<string, unknown>>(o: T) => (keyof T)[];
export type KeyOfMap<M extends Map<unknown, unknown>> = M extends Map<infer K, unknown> ? K : never;
export declare function indexBy<Obj, Key extends keyof Obj>(arr: Obj[], key: Key): Map<Obj[Key], Obj>;
export declare function notCallable(message: string): () => never;
