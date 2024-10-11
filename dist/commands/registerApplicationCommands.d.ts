import { Client } from "discord.js";
import { MessageContextMenuCommandBlueprint, UserContextMenuCommandBlueprint } from "./contextMenuCommands/contextMenuCommandBlueprint";
import { SlashCommandBlueprint } from "./slashCommands/slashCommandBlueprint";
import { SlashGroupBlueprint } from "./slashCommands/slashGroupBlueprint";
export type AnyApplicationCommandBlueprint = SlashCommandBlueprint<any, any> | SlashGroupBlueprint<any> | MessageContextMenuCommandBlueprint<any> | UserContextMenuCommandBlueprint<any>;
type RegisterResult = {
    create: number;
    update: number;
    delete: number;
};
export declare function registerApplicationCommands(client: Client<true>, commands: AnyApplicationCommandBlueprint[]): Promise<RegisterResult>;
export {};
