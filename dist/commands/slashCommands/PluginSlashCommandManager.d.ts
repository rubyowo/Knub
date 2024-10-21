import { ChatInputCommandInteraction, CommandInteractionOption, Interaction } from "discord.js";
import { AnyPluginData } from "../../plugins/PluginData";
import { AnySlashCommandSignature, SlashCommandBlueprint } from "./slashCommandBlueprint";
import { SlashGroupBlueprint } from "./slashGroupBlueprint";
type CommandOrGroup<TPluginData extends AnyPluginData<any>> = SlashCommandBlueprint<TPluginData, AnySlashCommandSignature> | SlashGroupBlueprint<TPluginData>;
export declare class PluginSlashCommandManager<TPluginData extends AnyPluginData<any>> {
    protected pluginData: TPluginData | undefined;
    protected nameToCommandOrGroup: Record<string, CommandOrGroup<TPluginData>>;
    setPluginData(pluginData: TPluginData): void;
    add(commandOrGroup: CommandOrGroup<TPluginData>): void;
    getAll(): Array<CommandOrGroup<TPluginData>>;
    runFromInteraction(interaction: Interaction): Promise<void>;
    protected resolveSubcommand(interaction: ChatInputCommandInteraction, commandOrGroup: CommandOrGroup<TPluginData>): SlashCommandBlueprint<TPluginData, AnySlashCommandSignature> | null;
    protected getNestedOptionsData(optionsData: readonly CommandInteractionOption[]): readonly CommandInteractionOption[];
}
export {};
