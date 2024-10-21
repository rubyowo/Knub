import { GuildPluginData } from "..";
import { AnyGuildEventListenerBlueprint } from "../plugins/PluginBlueprint";
import { BasePluginEventManager, Listener, OnOpts, WrappedListener } from "./BasePluginEventManager";
import { GuildEvent } from "./eventTypes";
export declare class GuildPluginEventManager<TPluginData extends GuildPluginData<any>> extends BasePluginEventManager<TPluginData> {
    registerEventListener<T extends AnyGuildEventListenerBlueprint<TPluginData>>(blueprint: T): WrappedListener;
    off(event: GuildEvent, listener: WrappedListener): void;
    on<TEventName extends GuildEvent>(event: TEventName, listener: Listener<TPluginData, TEventName>, opts?: OnOpts): WrappedListener;
}
