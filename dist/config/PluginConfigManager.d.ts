import { APIInteractionGuildMember, Channel, GuildMember, Interaction, Message, PartialUser, User } from "discord.js";
import { BasePluginData } from "../plugins/PluginData";
import { ConfigParserFn, CustomOverrideCriteriaFunctions, PermissionLevels, PluginOptions } from "./configTypes";
import { MatchParams } from "./configUtils";
export interface ExtendedMatchParams extends MatchParams {
    channelId?: string | null;
    member?: GuildMember | APIInteractionGuildMember | null;
    message?: Message | null;
    channel?: Channel | null;
    interaction?: Interaction | null;
}
export interface PluginConfigManagerOpts<TPluginData extends BasePluginData<any>> {
    levels: PermissionLevels;
    parser: ConfigParserFn<TPluginData["_pluginType"]["config"]>;
    customOverrideCriteriaFunctions?: CustomOverrideCriteriaFunctions<TPluginData>;
}
export declare class PluginConfigManager<TPluginData extends BasePluginData<any>> {
    private readonly defaultOptions;
    private readonly userInput;
    private readonly levels;
    private readonly customOverrideCriteriaFunctions?;
    private readonly parser;
    private pluginData?;
    private initialized;
    private parsedOptions;
    constructor(defaultOptions: PluginOptions<TPluginData["_pluginType"]>, userInput: unknown, opts: PluginConfigManagerOpts<TPluginData>);
    init(): Promise<void>;
    protected getParsedOptions(): PluginOptions<TPluginData["_pluginType"]>;
    protected getMemberLevel(member: GuildMember | APIInteractionGuildMember): number | null;
    setPluginData(pluginData: TPluginData): void;
    get(): TPluginData["_pluginType"]["config"];
    getMatchingConfig(matchParams: ExtendedMatchParams): Promise<TPluginData["_pluginType"]["config"]>;
    getForMessage(msg: Message): Promise<TPluginData["_pluginType"]["config"]>;
    getForInteraction(interaction: Interaction): Promise<TPluginData["_pluginType"]["config"]>;
    getForChannel(channel: Channel): Promise<TPluginData["_pluginType"]["config"]>;
    getForUser(user: User | PartialUser): Promise<TPluginData["_pluginType"]["config"]>;
    getForMember(member: GuildMember): Promise<TPluginData["_pluginType"]["config"]>;
}
