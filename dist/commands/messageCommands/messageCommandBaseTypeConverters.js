"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.baseCommandParameterTypeHelpers = exports.messageCommandBaseTypeConverters = void 0;
const discord_js_1 = require("discord.js");
const knub_command_manager_1 = require("knub-command-manager");
const helpers_1 = require("../../helpers");
const utils_1 = require("../../utils");
exports.messageCommandBaseTypeConverters = {
    ...knub_command_manager_1.defaultTypeConverters,
    boolean: knub_command_manager_1.defaultTypeConverters.bool,
    number(value) {
        const result = parseFloat(value);
        if (Number.isNaN(result)) {
            throw new knub_command_manager_1.TypeConversionError(`\`${(0, helpers_1.disableCodeBlocks)(value)}\` is not a valid number`);
        }
        return result;
    },
    user(value, { pluginData: { client } }) {
        const userId = (0, utils_1.getUserId)(value);
        if (!userId) {
            throw new knub_command_manager_1.TypeConversionError(`\`${(0, helpers_1.disableCodeBlocks)(value)}\` is not a valid user`);
        }
        const user = client.users.cache.get(userId);
        if (!user) {
            throw new knub_command_manager_1.TypeConversionError(`Could not find user for user id \`${userId}\``);
        }
        return user;
    },
    member(value, { message, pluginData: { client } }) {
        if (message.channel.type === discord_js_1.ChannelType.DM) {
            throw new knub_command_manager_1.TypeConversionError(`Type 'Member' can only be used in guilds`);
        }
        const userId = (0, utils_1.getUserId)(value);
        if (!userId) {
            throw new knub_command_manager_1.TypeConversionError(`\`${(0, helpers_1.disableCodeBlocks)(value)}\` is not a valid user id`);
        }
        const user = client.users.cache.get(userId);
        if (!user) {
            throw new knub_command_manager_1.TypeConversionError(`Could not find user for user id \`${userId}\``);
        }
        const member = message.guild?.members.cache.get(user.id);
        if (!member) {
            throw new knub_command_manager_1.TypeConversionError(`Could not find guild member for user id \`${userId}\``);
        }
        return member;
    },
    channel(value, { message }) {
        if (message.channel.type === discord_js_1.ChannelType.DM) {
            throw new knub_command_manager_1.TypeConversionError(`Type 'Channel' can only be used in guilds`);
        }
        const channelId = (0, utils_1.getChannelId)(value);
        if (!channelId) {
            throw new knub_command_manager_1.TypeConversionError(`\`${(0, helpers_1.disableCodeBlocks)(value)}\` is not a valid channel`);
        }
        const guild = message.guild;
        const channel = guild?.channels.cache.get(channelId);
        if (!channel) {
            throw new knub_command_manager_1.TypeConversionError(`Could not find channel for channel id \`${channelId}\``);
        }
        return channel;
    },
    textChannel(value, { message }) {
        if (message.channel.type === discord_js_1.ChannelType.DM) {
            throw new knub_command_manager_1.TypeConversionError(`Type 'textChannel' can only be used in guilds`);
        }
        const channelId = (0, utils_1.getChannelId)(value);
        if (!channelId) {
            throw new knub_command_manager_1.TypeConversionError(`\`${(0, helpers_1.disableCodeBlocks)(value)}\` is not a valid channel`);
        }
        const guild = message.guild;
        const channel = guild?.channels.cache.get(channelId);
        if (!channel) {
            throw new knub_command_manager_1.TypeConversionError(`Could not find channel for channel id \`${channelId}\``);
        }
        if (!channel.isTextBased()) {
            throw new knub_command_manager_1.TypeConversionError(`Channel \`${channel.name}\` is not a text channel`);
        }
        return channel;
    },
    voiceChannel(value, { message }) {
        if (message.channel.type === discord_js_1.ChannelType.DM) {
            throw new knub_command_manager_1.TypeConversionError(`Type 'voiceChannel' can only be used in guilds`);
        }
        const channelId = (0, utils_1.getChannelId)(value);
        if (!channelId) {
            throw new knub_command_manager_1.TypeConversionError(`\`${(0, helpers_1.disableCodeBlocks)(value)}\` is not a valid channel`);
        }
        const guild = message.guild;
        const channel = guild?.channels.cache.get(channelId);
        if (!channel) {
            throw new knub_command_manager_1.TypeConversionError(`Could not find channel for channel id \`${channelId}\``);
        }
        if (channel.type !== discord_js_1.ChannelType.GuildVoice) {
            throw new knub_command_manager_1.TypeConversionError(`Channel \`${channel.name}\` is not a voice channel`);
        }
        return channel;
    },
    role(value, { message }) {
        if (message.channel.type === discord_js_1.ChannelType.DM) {
            throw new knub_command_manager_1.TypeConversionError(`Type 'Role' can only be used in guilds`);
        }
        const roleId = (0, utils_1.getRoleId)(value);
        if (!roleId) {
            throw new knub_command_manager_1.TypeConversionError(`\`${(0, helpers_1.disableCodeBlocks)(value)}\` is not a valid role`);
        }
        const role = message.guild?.roles.cache.get(roleId);
        if (!role) {
            throw new knub_command_manager_1.TypeConversionError(`Could not find role for role id \`${roleId}\``);
        }
        return role;
    },
    userId(value) {
        const userId = (0, utils_1.getUserId)(value);
        if (!userId) {
            throw new knub_command_manager_1.TypeConversionError(`\`${(0, helpers_1.disableCodeBlocks)(value)}\` is not a valid user`);
        }
        return userId;
    },
    channelId(value) {
        const channelId = (0, utils_1.getChannelId)(value);
        if (!channelId) {
            throw new knub_command_manager_1.TypeConversionError(`\`${(0, helpers_1.disableCodeBlocks)(value)}\` is not a valid channel`);
        }
        return channelId;
    },
};
exports.baseCommandParameterTypeHelpers = {
    // knub-command-manager defaults
    string: knub_command_manager_1.string,
    bool: knub_command_manager_1.bool,
    switchOption: knub_command_manager_1.switchOption,
    // Knub-specific types
    // knub-command-manager also has a number() helper, but we have slightly different error handling here
    number: (0, knub_command_manager_1.createTypeHelper)(exports.messageCommandBaseTypeConverters.number),
    user: (0, knub_command_manager_1.createTypeHelper)(exports.messageCommandBaseTypeConverters.user),
    member: (0, knub_command_manager_1.createTypeHelper)(exports.messageCommandBaseTypeConverters.member),
    channel: (0, knub_command_manager_1.createTypeHelper)(exports.messageCommandBaseTypeConverters.channel),
    textChannel: (0, knub_command_manager_1.createTypeHelper)(exports.messageCommandBaseTypeConverters.textChannel),
    voiceChannel: (0, knub_command_manager_1.createTypeHelper)(exports.messageCommandBaseTypeConverters.voiceChannel),
    role: (0, knub_command_manager_1.createTypeHelper)(exports.messageCommandBaseTypeConverters.role),
    userId: (0, knub_command_manager_1.createTypeHelper)(exports.messageCommandBaseTypeConverters.userId),
    channelId: (0, knub_command_manager_1.createTypeHelper)(exports.messageCommandBaseTypeConverters.channelId),
};
