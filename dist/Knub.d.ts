/// <reference types="node" />
import { EventEmitter } from "events";
import { Client, Snowflake } from "discord.js";
import { Profiler } from "./Profiler";
import { Queue } from "./Queue";
import { BaseConfig } from "./config/configTypes";
import { EventRelay } from "./events/EventRelay";
import { AnyPluginBlueprint, GlobalPluginBlueprint, GuildPluginBlueprint } from "./plugins/PluginBlueprint";
import { AnyPluginData, GlobalPluginData, GuildPluginData } from "./plugins/PluginData";
import { BasePluginType } from "./plugins/pluginTypes";
import { PluginPublicInterface } from "./plugins/pluginUtils";
import { AnyContext, GlobalContext, GlobalPluginMap, GuildContext, GuildPluginMap, KnubArgs, KnubOptions, LogFn } from "./types";
export declare class Knub extends EventEmitter {
    #private;
    client: Client;
    protected eventRelay: EventRelay;
    protected guildPlugins: GuildPluginMap;
    protected globalPlugins: GlobalPluginMap;
    protected loadedGuilds: Map<string, GuildContext>;
    protected guildLoadQueues: Map<string, Queue>;
    protected globalContext: GlobalContext;
    protected globalContextLoaded: boolean;
    protected globalContextLoadPromise: Promise<void>;
    protected options: KnubOptions;
    protected log: LogFn;
    profiler: Profiler;
    protected destroyPromise: Promise<void> | null;
    constructor(client: Client, userArgs: Partial<KnubArgs>);
    initialize(): void;
    destroy(): Promise<void>;
    protected throwOrEmit(error: any): void;
    getAvailablePlugins(): GuildPluginMap;
    getGlobalPlugins(): GlobalPluginMap;
    getGlobalConfig(): BaseConfig;
    /**
     * Create the partial PluginData that's passed to beforeLoad()
     */
    protected buildGuildPluginData<TPluginType extends BasePluginType>(ctx: GuildContext, plugin: GuildPluginBlueprint<GuildPluginData<TPluginType>, any>, loadedAsDependency: boolean): Promise<GuildPluginData<TPluginType>>;
    protected addDependencyFnsToPluginData(ctx: AnyContext, pluginData: AnyPluginData<any>): void;
    /**
     * Create the partial PluginData that's passed to beforeLoad()
     */
    protected buildGlobalPluginData<TPluginType extends BasePluginType>(ctx: AnyContext, plugin: GlobalPluginBlueprint<GlobalPluginData<TPluginType>, any>, loadedAsDependency: boolean): Promise<GlobalPluginData<TPluginType>>;
    protected addGlobalDependencyFnsToPluginData(pluginData: AnyPluginData<any>): void;
    protected resolveDependencies(plugin: AnyPluginBlueprint, resolvedDependencies?: Set<string>): Promise<Set<string>>;
    protected ctxHasPlugin(ctx: AnyContext, plugin: AnyPluginBlueprint): boolean;
    protected getPluginPublicInterface<T extends AnyPluginBlueprint>(ctx: AnyContext, plugin: T): PluginPublicInterface<T>;
    protected loadAllAvailableGuilds(): Promise<void>;
    loadGuild(guildId: Snowflake): Promise<void>;
    reloadGuild(guildId: Snowflake): Promise<void>;
    unloadGuild(guildId: Snowflake): Promise<void>;
    protected unloadAllGuilds(): Promise<void>;
    protected getGuildLoadQueue(guildId: Snowflake): Queue;
    protected clearGuildLoadQueues(): void;
    getLoadedGuild(guildId: Snowflake): GuildContext | undefined;
    getLoadedGuilds(): GuildContext[];
    protected loadGuildConfig(ctx: GuildContext): Promise<void>;
    protected loadGuildPlugins(ctx: GuildContext): Promise<void>;
    /**
     * The global context analogue to loadGuild()
     */
    loadGlobalContext(): Promise<void>;
    reloadGlobalContext(): Promise<void>;
    unloadGlobalContext(): Promise<void>;
    protected loadGlobalPlugins(ctx: GlobalContext): Promise<void>;
    /**
     * Cleans up plugin data by removing any dangling event handlers and timers
     */
    protected destroyPluginData(pluginData: GuildPluginData<any> | GlobalPluginData<any>): Promise<void>;
    protected registerApplicationCommands(): Promise<void>;
}
