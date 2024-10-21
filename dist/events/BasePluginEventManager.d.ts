import { Lock } from "../locks/LockManager";
import { AnyPluginData, GuildPluginData } from "../plugins/PluginData";
import { Awaitable } from "../utils";
import { EventRelay } from "./EventRelay";
import { EventFilter } from "./eventFilters";
import { EventArguments, GuildEventArguments, ValidEvent } from "./eventTypes";
export interface EventMeta<TPluginData extends AnyPluginData<any>, TArguments> {
    args: TArguments;
    pluginData: TPluginData;
    lock?: Lock;
}
export type Listener<TPluginData extends AnyPluginData<any>, TEventName extends ValidEvent> = (meta: EventMeta<TPluginData, TPluginData extends GuildPluginData<any> ? GuildEventArguments[TEventName] : EventArguments[TEventName]>) => Awaitable<void>;
export type WrappedListener = (args: any) => Awaitable<void>;
export interface OnOpts {
    allowBots?: boolean;
    allowSelf?: boolean;
    filters?: EventFilter[];
}
/**
 * A wrapper for the d.js event emitter that passes plugin data to the listener
 * functions and, by default, restricts events to the plugin's guilds.
 */
export declare abstract class BasePluginEventManager<TPluginData extends AnyPluginData<any>> {
    protected eventRelay: EventRelay;
    protected listeners: Map<string, Set<WrappedListener>>;
    protected pluginData: TPluginData | undefined;
    constructor(eventRelay: EventRelay);
    setPluginData(pluginData: TPluginData): void;
    abstract off(event: string, listener: WrappedListener): void;
    getListenerCount(): number;
    clearAllListeners(): void;
    destroy(): void;
}
