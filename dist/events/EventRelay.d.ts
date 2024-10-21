import { Client } from "discord.js";
import { Profiler } from "../Profiler";
import { EventArguments, ExtendedClientEvents, GuildEvent, ValidEvent } from "./eventTypes";
export type RelayListener<TEvent extends ValidEvent> = {
    (args: EventArguments[TEvent]): any;
    profilerContext?: string;
};
type GuildListenerMap = Map<string, Map<GuildEvent, Set<RelayListener<GuildEvent>>>>;
type AnyListenerMap = Map<ValidEvent, Set<RelayListener<ValidEvent>>>;
/**
 * Relays Discord events to the appropriate plugins.
 * Guild events are a subset of all events, that apply to a specific guild.
 */
export declare class EventRelay {
    protected client: Client;
    protected profiler: Profiler;
    protected guildListeners: GuildListenerMap;
    protected anyListeners: AnyListenerMap;
    protected registeredRelays: Set<ValidEvent>;
    constructor(client: Client, profiler: Profiler);
    onGuildEvent<TEvent extends GuildEvent>(guildId: string, ev: TEvent, listener: RelayListener<TEvent>): void;
    offGuildEvent<TEvent extends GuildEvent>(guildId: string, ev: TEvent, listener: RelayListener<TEvent>): void;
    onAnyEvent<TEvent extends ValidEvent>(ev: TEvent, listener: RelayListener<TEvent>): void;
    offAnyEvent<TEvent extends ValidEvent>(ev: TEvent, listener: RelayListener<TEvent>): void;
    protected registerEventRelay(ev: ValidEvent): void;
    protected relayEvent(ev: ValidEvent, args: ExtendedClientEvents[ValidEvent]): void;
}
export {};
