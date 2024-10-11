import { Interaction } from "discord.js";
import { AnyPluginData } from "../../plugins/PluginData";
import { MessageContextMenuCommandBlueprint, UserContextMenuCommandBlueprint } from "./contextMenuCommandBlueprint";
type AnyContextMenuCommand<TPluginData extends AnyPluginData<any>> = MessageContextMenuCommandBlueprint<TPluginData> | UserContextMenuCommandBlueprint<TPluginData>;
export declare class PluginContextMenuCommandManager<TPluginData extends AnyPluginData<any>> {
    #private;
    setPluginData(pluginData: TPluginData): void;
    add(command: AnyContextMenuCommand<TPluginData>): void;
    getAll(): Array<AnyContextMenuCommand<TPluginData>>;
    runFromInteraction(interaction: Interaction): Promise<void>;
}
export {};
