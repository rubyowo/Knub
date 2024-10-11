import { AnyPluginData, GlobalPluginData, GuildPluginData } from "../plugins/PluginData";
import { BasePluginType } from "../plugins/pluginTypes";
import { Listener, OnOpts } from "./BasePluginEventManager";
import { GuildEvent, ValidEvent } from "./eventTypes";
export interface EventListenerBlueprint<TPluginData extends AnyPluginData<any>, TEventName extends ValidEvent = ValidEvent> extends OnOpts {
    event: TEventName;
    listener: Listener<TPluginData, TEventName>;
}
/**
 * Helper function to create an event listener blueprint with type hints
 */
type EventListenerBlueprintCreator<TPluginData extends AnyPluginData<any>, TBaseEventName extends ValidEvent> = <TEventName extends TBaseEventName>(blueprint: EventListenerBlueprint<TPluginData, TEventName>) => EventListenerBlueprint<TPluginData, TEventName>;
/**
 * Helper function to create an event listener blueprint for guild events.
 * Used for type inference from event name.
 *
 * To specify `TPluginType` for additional type hints, use:
 * `guildEventListener<TPluginType>()(blueprint)`
 */
export declare function guildPluginEventListener<TEventName extends GuildEvent>(blueprint: EventListenerBlueprint<GuildPluginData<any>, TEventName>): EventListenerBlueprint<GuildPluginData<any>, TEventName>;
/**
 * Specify `TPluginType` for type hints and return self
 */
export declare function guildPluginEventListener<TPluginType extends BasePluginType>(): EventListenerBlueprintCreator<GuildPluginData<TPluginType>, GuildEvent>;
/**
 * Helper function to create an event listener blueprint for global events.
 * Used for type inference from event name.
 *
 * To specify `TPluginType` for additional type hints, use:
 * `globalEventListener<TPluginType>()(blueprint)`
 */
export declare function globalPluginEventListener<TEventName extends ValidEvent>(blueprint: EventListenerBlueprint<GlobalPluginData<any>, TEventName>): EventListenerBlueprint<GlobalPluginData<any>, TEventName>;
/**
 * Specify `TPluginType` for type hints and return self
 */
export declare function globalPluginEventListener<TPluginType extends BasePluginType>(): EventListenerBlueprintCreator<GlobalPluginData<TPluginType>, ValidEvent>;
export {};
