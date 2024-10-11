import { Channel, Guild, Message, PartialDMChannel, PartialUser, User } from "discord.js";
import { KnownEvents } from "./eventTypes";
type EventToGuild = {
    [P in keyof KnownEvents]?: (args: KnownEvents[P]) => Guild | null | undefined;
};
type EventToUser = {
    [P in keyof KnownEvents]?: (args: KnownEvents[P]) => User | PartialUser | null | undefined;
};
type EventToChannel = {
    [P in keyof KnownEvents]?: (args: KnownEvents[P]) => Channel | PartialDMChannel | null | undefined;
};
type EventToMessage = {
    [P in keyof KnownEvents]?: (args: KnownEvents[P]) => Message | null | undefined;
};
export declare const eventToGuild: EventToGuild;
export declare const eventToUser: EventToUser;
export declare const eventToChannel: EventToChannel;
export declare const eventToMessage: EventToMessage;
export {};
