import { GlobalPluginData } from "..";
import { AnyGlobalEventListenerBlueprint } from "../plugins/PluginBlueprint";
import { BasePluginEventManager, Listener, OnOpts, WrappedListener } from "./BasePluginEventManager";
import { ValidEvent } from "./eventTypes";
export declare class GlobalPluginEventManager<TPluginData extends GlobalPluginData<any>> extends BasePluginEventManager<TPluginData> {
    registerEventListener<T extends AnyGlobalEventListenerBlueprint<TPluginData>>(blueprint: T): WrappedListener;
    off(event: ValidEvent, listener: WrappedListener): void;
    on<TEventName extends ValidEvent>(event: TEventName, listener: Listener<TPluginData, TEventName>, opts?: OnOpts): WrappedListener;
}
