import { Client, Message } from "discord.js";
import { ICommandConfig as MessageCommandConfig, ICommandDefinition as MessageCommandDefinition, IParameter as MessageCommandParameter, TOption as MessageCommandOption, TSignature as MessageCommandSignature } from "knub-command-manager";
import { Lock } from "../../locks/LockManager";
import { AnyPluginData, GuildPluginData } from "../../plugins/PluginData";
import { BasePluginType } from "../../plugins/pluginTypes";
import { GuildMessage } from "../../types";
import { Awaitable } from "../../utils";
import { MessageCommandBlueprint } from "./messageCommandBlueprint";
export type MessageCommandSignatureOrArray<TPluginData extends AnyPluginData<any>> = MessageCommandSignature<CommandContext<TPluginData>> | Array<MessageCommandSignature<CommandContext<TPluginData>>>;
export declare function getDefaultMessageCommandPrefix(client: Client): RegExp;
export type ContextualCommandMessage<TPluginData extends AnyPluginData<any>> = TPluginData extends GuildPluginData<any> ? GuildMessage : Message;
export interface MessageCommandMeta<TPluginData extends AnyPluginData<any>, TArguments> {
    args: TArguments;
    message: ContextualCommandMessage<TPluginData>;
    command: MessageCommandDefinition<any, any>;
    pluginData: TPluginData;
    lock?: Lock;
}
/**
 * Command signatures are objects where each property contains a parameter/option object.
 * Each parameter/option object in turn contains a `type` function. ArgsFromSignature maps the signature object
 * to the return types of said type functions. For example, if the signature had a "name" property with a type function
 * that returns a string, ArgsFromSignature would return `{ name: string }`.
 */
type MessageCommandArgsFromSignature<T extends MessageCommandSignature<any>> = {
    [K in keyof T]: T[K] extends MessageCommandParameter<any> | MessageCommandOption<any> ? ParameterOrOptionType<T[K]> : never;
};
/**
 * Higher level wrapper for ArgsFromSignature that also supports multiple signatures,
 * returning a union type of possible sets of arguments.
 */
export type ArgsFromSignatureOrArray<T extends MessageCommandSignatureOrArray<any>> = ArgsFromSignatureUnion<SignatureToArray<T>[number]>;
type ArgsFromSignatureUnion<T extends MessageCommandSignature<any>> = T extends any ? MessageCommandArgsFromSignature<T> : never;
type SignatureToArray<T> = T extends any[] ? T : [T];
type PromiseType<T> = T extends PromiseLike<infer U> ? U : T;
type ParameterOrOptionType<T extends MessageCommandParameter<any> | MessageCommandOption<any>> = T extends MessageCommandParameter<any> ? T["rest"] extends true ? Array<PromiseType<ReturnType<T["type"]>>> : PromiseType<ReturnType<T["type"]>> : PromiseType<ReturnType<T["type"]>>;
export type CommandFn<TPluginData extends AnyPluginData<any>, _TSignature extends MessageCommandSignatureOrArray<TPluginData>> = (meta: MessageCommandMeta<TPluginData, ArgsFromSignatureOrArray<_TSignature>>) => Awaitable<void>;
export interface CommandContext<TPluginData extends AnyPluginData<any>> {
    message: Message;
    pluginData: TPluginData;
    lock?: Lock;
}
export interface CommandExtraData<TPluginData extends AnyPluginData<any>> {
    blueprint: MessageCommandBlueprint<TPluginData, any>;
    _lock?: Lock;
}
export type PluginCommandDefinition = MessageCommandDefinition<CommandContext<any>, CommandExtraData<any>>;
export type PluginCommandConfig = MessageCommandConfig<CommandContext<any>, CommandExtraData<any>>;
/**
 * Returns a readable command signature string for the given command.
 * Trigger is passed as a string instead of using the "triggers" property of the command to allow choosing which
 * trigger of potentially multiple ones to show and in what format.
 */
export declare function getMessageCommandSignature(command: PluginCommandDefinition, overrideTrigger?: string, overrideSignature?: MessageCommandSignature<any>): string;
/**
 * Command pre-filter to restrict the command to the plugin's guilds, unless
 * allowed for DMs
 */
export declare function restrictCommandSource(cmd: PluginCommandDefinition, context: CommandContext<any>): boolean;
/**
 * Command pre-filter to restrict the command by specifying a required
 * permission
 */
export declare function checkCommandPermission<TPluginType extends BasePluginType, TPluginData extends AnyPluginData<TPluginType>>(cmd: PluginCommandDefinition, context: CommandContext<TPluginData>): Promise<boolean>;
/**
 * Command post-filter to check if the command's on cooldown and, if not, to put
 * it on cooldown
 */
export declare function checkCommandCooldown<TPluginType extends BasePluginType, TPluginData extends AnyPluginData<TPluginType>>(cmd: PluginCommandDefinition, context: CommandContext<TPluginData>): Promise<boolean>;
/**
 * Command post-filter to wait for and trigger any locks the command has, and to
 * interrupt command execution if the lock gets interrupted before it
 */
export declare function checkCommandLocks<TPluginType extends BasePluginType, TPluginData extends AnyPluginData<TPluginType>>(cmd: PluginCommandDefinition, context: CommandContext<TPluginData>): Promise<boolean>;
export {};
