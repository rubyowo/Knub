"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.slashOptions = exports.makeOptionBuilder = void 0;
const discord_js_1 = require("discord.js");
function makeOptionBuilder(builderFn) {
    return builderFn;
}
exports.makeOptionBuilder = makeOptionBuilder;
const stringOptionBuilder = makeOptionBuilder((opt) => {
    return {
        ...opt,
        type: discord_js_1.ApplicationCommandOptionType.String,
        resolveValue: (interaction) => interaction.options.getString(opt.name) ?? "",
        getExtraAPIProps: () => ({
            choices: opt.choices
                ? opt.choices.map((choice) => ({
                    name: choice.name,
                    name_localizations: choice.nameLocalizations,
                    value: choice.value,
                }))
                : undefined,
            min_length: opt.minLength,
            max_length: opt.maxLength,
        }),
    };
});
const integerOptionBuilder = makeOptionBuilder((opt) => {
    return {
        ...opt,
        type: discord_js_1.ApplicationCommandOptionType.Integer,
        resolveValue: (interaction) => interaction.options.getInteger(opt.name, true),
        getExtraAPIProps: () => ({
            choices: opt.choices
                ? opt.choices.map((choice) => ({
                    name: choice.name,
                    name_localizations: choice.nameLocalizations,
                    value: choice.value,
                }))
                : undefined,
            min_value: opt.minValue,
            max_value: opt.maxValue,
        }),
    };
});
const booleanOptionBuilder = makeOptionBuilder((opt) => {
    return {
        ...opt,
        type: discord_js_1.ApplicationCommandOptionType.Boolean,
        resolveValue: (interaction) => interaction.options.getBoolean(opt.name, true),
        getExtraAPIProps: () => ({}),
    };
});
const userOptionBuilder = makeOptionBuilder((opt) => {
    return {
        ...opt,
        type: discord_js_1.ApplicationCommandOptionType.User,
        resolveValue: (interaction) => interaction.options.getUser(opt.name, true),
        getExtraAPIProps: () => ({}),
    };
});
function channelOptionBuilder(opt) {
    return {
        ...opt,
        type: discord_js_1.ApplicationCommandOptionType.Channel,
        resolveValue: (interaction) => interaction.options.getChannel(opt.name, true),
        getExtraAPIProps: () => ({
            channel_types: opt.channelTypes,
        }),
    };
}
const roleOptionBuilder = makeOptionBuilder((opt) => {
    return {
        ...opt,
        type: discord_js_1.ApplicationCommandOptionType.Role,
        resolveValue: (interaction) => interaction.options.getRole(opt.name, true),
        getExtraAPIProps: () => ({}),
    };
});
const mentionableOptionBuilder = makeOptionBuilder((opt) => {
    return {
        ...opt,
        type: discord_js_1.ApplicationCommandOptionType.Mentionable,
        resolveValue: (interaction) => interaction.options.getMentionable(opt.name, true),
        getExtraAPIProps: () => ({}),
    };
});
const numberOptionBuilder = makeOptionBuilder((opt) => {
    return {
        ...opt,
        type: discord_js_1.ApplicationCommandOptionType.Number,
        resolveValue: (interaction) => interaction.options.getNumber(opt.name, true),
        getExtraAPIProps: () => ({
            choices: opt.choices
                ? opt.choices.map((choice) => ({
                    name: choice.name,
                    name_localizations: choice.nameLocalizations,
                    value: choice.value,
                }))
                : undefined,
            min_value: opt.minValue,
            max_value: opt.maxValue,
        }),
    };
});
const attachmentOptionBuilder = makeOptionBuilder((opt) => {
    return {
        ...opt,
        type: discord_js_1.ApplicationCommandOptionType.Attachment,
        resolveValue: (interaction) => interaction.options.getAttachment(opt.name, true),
        getExtraAPIProps: () => ({}),
    };
});
// endregion
exports.slashOptions = {
    string: stringOptionBuilder,
    integer: integerOptionBuilder,
    boolean: booleanOptionBuilder,
    user: userOptionBuilder,
    channel: channelOptionBuilder,
    role: roleOptionBuilder,
    mentionable: mentionableOptionBuilder,
    number: numberOptionBuilder,
    attachment: attachmentOptionBuilder,
};
