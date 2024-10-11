import { AnyPluginData } from "../plugins/PluginData";
import { BasePluginType } from "../plugins/pluginTypes";
import { Awaitable } from "../utils";
import { EventMeta, Listener } from "./BasePluginEventManager";
import { EventArguments, ValidEvent } from "./eventTypes";
export type EventFilter = <TEventName extends ValidEvent>(event: TEventName, meta: EventMeta<AnyPluginData<BasePluginType>, EventArguments[TEventName]>) => Awaitable<boolean>;
export type FilteredListener<T extends Listener<any, any>> = T;
/**
 * Runs the specified event listener if the event passes ALL of the specified
 * filters
 */
export declare function withFilters<T extends Listener<any, any>>(event: ValidEvent, listener: T, filters: EventFilter[]): FilteredListener<T>;
/**
 * Runs the specified event listener if the event passes ANY of the specified
 * filters
 */
export declare function withAnyFilter<T extends Listener<any, any>>(event: ValidEvent, listener: T, filters: EventFilter[]): FilteredListener<T>;
export declare function onlyGuild(): EventFilter;
export declare function onlyDM(): EventFilter;
export declare function cooldown(timeMs: number, permission?: string): EventFilter;
export declare function requirePermission(permission: string): EventFilter;
export declare function ignoreBots(): EventFilter;
export declare function ignoreSelf(): EventFilter;
export declare function locks(locksToAcquire: string | string[]): EventFilter;
