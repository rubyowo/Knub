import { APIInteractionDataResolvedGuildMember, APIRole, ApplicationCommandOptionType, Attachment, Channel, ChannelType, ChatInputCommandInteraction, GuildMember, Locale, Role, User } from "discord.js";
export interface BaseSlashCommandOption<DiscordType extends ApplicationCommandOptionType, OutputType> {
    type: DiscordType;
    resolveValue: (interaction: ChatInputCommandInteraction) => OutputType;
    getExtraAPIProps: () => Record<string, any>;
    name: string;
    nameLocalizations?: Record<Locale, string>;
    description: string;
    descriptionLocalizations?: Record<Locale, string>;
    required?: boolean;
}
type OptionBuilderInput<OptionType extends BaseSlashCommandOption<any, unknown>, Name extends string> = Omit<OptionType, "type" | "resolveValue" | "getExtraAPIProps"> & {
    name: Name;
};
type OptionBuilderOutput<OptionType extends BaseSlashCommandOption<any, unknown>, InputType> = InputType & {
    type: OptionType["type"];
    resolveValue: OptionType["resolveValue"];
    getExtraAPIProps: OptionType["getExtraAPIProps"];
};
export type OptionBuilder<OptionType extends BaseSlashCommandOption<any, unknown>> = <Name extends string, OptionInput extends OptionBuilderInput<OptionType, Name>>(opt: OptionInput) => OptionBuilderOutput<OptionType, OptionInput>;
export declare function makeOptionBuilder<OptionType extends BaseSlashCommandOption<any, unknown>>(builderFn: OptionBuilder<OptionType>): OptionBuilder<OptionType>;
export type StringSlashCommandOptionChoice = {
    name: string;
    nameLocalizations?: Record<Locale, string>;
    value: string;
};
interface StringSlashCommandOption extends BaseSlashCommandOption<ApplicationCommandOptionType.String, string> {
    choices?: StringSlashCommandOptionChoice[];
    minLength?: string;
    maxLength?: string;
}
export type IntegerSlashCommandOptionChoice = {
    name: string;
    nameLocalizations?: Record<Locale, string>;
    value: number;
};
export type IntegerSlashCommandOption = BaseSlashCommandOption<ApplicationCommandOptionType.Integer, number> & {
    choices?: IntegerSlashCommandOptionChoice[];
    minValue?: number;
    maxValue?: number;
};
export type BooleanSlashCommandOption = BaseSlashCommandOption<ApplicationCommandOptionType.Boolean, boolean>;
export type UserSlashCommandOption = BaseSlashCommandOption<ApplicationCommandOptionType.User, User>;
export type ChannelSlashCommandOption<TChannelType extends ChannelType[]> = BaseSlashCommandOption<ApplicationCommandOptionType.Channel, Extract<Channel, {
    type: TChannelType[number];
}>> & {
    channelTypes: TChannelType;
};
declare function channelOptionBuilder<TChannelType extends ChannelType[], Name extends string, OptionInput extends OptionBuilderInput<ChannelSlashCommandOption<TChannelType>, Name>>(opt: OptionInput): OptionBuilderOutput<ChannelSlashCommandOption<OptionInput["channelTypes"]>, OptionInput>;
export type RoleSlashCommandOption = BaseSlashCommandOption<ApplicationCommandOptionType.Role, Role | APIRole>;
export type MentionableSlashCommandOption = BaseSlashCommandOption<ApplicationCommandOptionType.Mentionable, User | GuildMember | Role | APIRole | APIInteractionDataResolvedGuildMember>;
export type NumberSlashCommandOptionChoice = {
    name: string;
    nameLocalizations?: Record<Locale, string>;
    value: number;
};
export type NumberSlashCommandOption = BaseSlashCommandOption<ApplicationCommandOptionType.Number, number> & {
    choices?: NumberSlashCommandOptionChoice[];
    minValue?: number;
    maxValue?: number;
};
export type AttachmentSlashCommandOption = BaseSlashCommandOption<ApplicationCommandOptionType.Attachment, Attachment>;
export declare const slashOptions: {
    string: OptionBuilder<StringSlashCommandOption>;
    integer: OptionBuilder<IntegerSlashCommandOption>;
    boolean: OptionBuilder<BooleanSlashCommandOption>;
    user: OptionBuilder<UserSlashCommandOption>;
    channel: typeof channelOptionBuilder;
    role: OptionBuilder<RoleSlashCommandOption>;
    mentionable: OptionBuilder<MentionableSlashCommandOption>;
    number: OptionBuilder<NumberSlashCommandOption>;
    attachment: OptionBuilder<AttachmentSlashCommandOption>;
};
export {};
