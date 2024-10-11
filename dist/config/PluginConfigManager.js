"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginConfigManager = void 0;
const PluginData_1 = require("../plugins/PluginData");
const pluginUtils_1 = require("../plugins/pluginUtils");
const ConfigValidationError_1 = require("./ConfigValidationError");
const configTypes_1 = require("./configTypes");
const configUtils_1 = require("./configUtils");
class PluginConfigManager {
    constructor(defaultOptions, userInput, opts) {
        this.initialized = false;
        this.parsedOptions = null;
        this.defaultOptions = defaultOptions;
        this.userInput = userInput;
        this.levels = opts.levels;
        this.parser = opts.parser;
        this.customOverrideCriteriaFunctions = opts.customOverrideCriteriaFunctions;
    }
    async init() {
        if (this.initialized) {
            throw new Error("Already initialized");
        }
        const userInputParseResult = configTypes_1.pluginBaseOptionsSchema.safeParse(this.userInput);
        if (!userInputParseResult.success) {
            throw new ConfigValidationError_1.ConfigValidationError(userInputParseResult.error.message);
        }
        const parsedUserInput = userInputParseResult.data;
        const config = (0, configUtils_1.mergeConfig)(this.defaultOptions.config ?? {}, parsedUserInput.config ?? {});
        const parsedValidConfig = await this.parser(config);
        const parsedUserInputOverrides = parsedUserInput.overrides;
        const overrides = parsedUserInput.replaceDefaultOverrides
            ? parsedUserInputOverrides ?? []
            : (this.defaultOptions.overrides ?? []).concat(parsedUserInputOverrides ?? []);
        const parsedValidOverrides = [];
        for (const override of overrides) {
            if (!("config" in override)) {
                throw new ConfigValidationError_1.ConfigValidationError("Overrides must include the config property");
            }
            if (!config) {
                // FIXME: Debug
                console.debug("!! DEBUG !! PluginConfigManager.init config missing", this.pluginData && (0, PluginData_1.isGuildPluginData)(this.pluginData) ? this.pluginData.guild.id : "(global)");
            }
            const overrideConfig = (0, configUtils_1.mergeConfig)(config, override.config ?? {});
            // Validate the override config as if it was already merged with the base config
            // In reality, overrides are merged with the base config when they are evaluated
            await this.parser(overrideConfig);
            parsedValidOverrides.push(override);
        }
        this.parsedOptions = {
            config: parsedValidConfig,
            overrides: parsedValidOverrides,
        };
        this.initialized = true;
    }
    getParsedOptions() {
        if (!this.initialized) {
            throw new Error("Not initialized");
        }
        return this.parsedOptions;
    }
    getMemberLevel(member) {
        if (!this.pluginData || !(0, PluginData_1.isGuildPluginData)(this.pluginData)) {
            return null;
        }
        return (0, pluginUtils_1.getMemberLevel)(this.levels, member, this.pluginData.guild);
    }
    setPluginData(pluginData) {
        if (this.pluginData) {
            throw new Error("Plugin data already set");
        }
        this.pluginData = pluginData;
    }
    get() {
        return this.getParsedOptions().config;
    }
    getMatchingConfig(matchParams) {
        const { message, interaction } = matchParams;
        const userId = 
        // Directly passed userId
        matchParams.userId ||
            // Passed member's ID
            (matchParams.member && "id" in matchParams.member && matchParams.member.id) ||
            // Passed member's user ID
            matchParams.member?.user.id ||
            // Passed message's author's ID
            message?.author?.id ||
            // Passed interaction's author's ID
            interaction?.user?.id ||
            null;
        const channelId = 
        // Directly passed channelId
        matchParams.channelId ||
            // Passed non-thread channel's ID
            (matchParams.channel && !matchParams.channel.isThread() && matchParams.channel.id) ||
            // Passed thread channel's parent ID
            (matchParams.channel?.isThread() && matchParams.channel.parentId) ||
            // Passed message's thread's parent ID
            (message?.channel?.isThread() && message.channel.parentId) ||
            // Passed message's non-thread channel's ID
            message?.channel?.id ||
            // Passed interaction's author's ID
            interaction?.channel?.id ||
            null;
        const categoryId = 
        // Directly passed categoryId
        matchParams.categoryId ||
            // Passed non-thread channel's parent ID
            (matchParams.channel && !matchParams.channel.isThread() && matchParams.channel.parentId) ||
            // Passed thread channel's parent ID
            (matchParams.channel?.isThread?.() && matchParams.channel.parent?.parentId) ||
            // Passed message's thread's channel's parent ID
            (message?.channel?.isThread?.() && message.channel.parent?.parentId) ||
            // Passed message's non-thread channel's parent ID
            (message?.channel && message.channel.parentId) ||
            // Passed interaction's thread's channel's parent ID
            (interaction?.channel?.isThread?.() && interaction.channel.parent?.parentId) ||
            // Passed interaction's non-thread channel's parent ID
            (interaction?.channel && interaction.channel.parentId) ||
            null;
        // Passed thread id -> passed message's thread id
        const threadId = 
        // Directly passed threadId
        matchParams.threadId ||
            // Passed thread channel's ID
            (matchParams.channel?.isThread?.() && matchParams.channel.id) ||
            // Passed message's thread channel's ID
            (message?.channel?.isThread?.() && message.channel.id) ||
            // Passed interaction's thread channel's ID
            (interaction?.channel?.isThread?.() && interaction.channel.id) ||
            null;
        // Passed value -> whether message's channel is a thread -> whether interaction's channel is a thread
        const isThread = matchParams.isThread ??
            matchParams?.channel?.isThread?.() ??
            message?.channel?.isThread?.() ??
            interaction?.channel?.isThread?.() ??
            null;
        // Passed member -> passed message's member -> passed interaction's member
        const member = matchParams.member || message?.member || interaction?.member;
        // Passed level -> passed member's level
        const level = matchParams?.level ?? (member && this.getMemberLevel(member)) ?? null;
        // Passed roles -> passed member's roles
        const memberRoles = matchParams.memberRoles ?? (member ? (0, pluginUtils_1.getMemberRoles)(member) : []);
        const finalMatchParams = {
            level,
            userId,
            channelId,
            categoryId,
            threadId,
            isThread,
            memberRoles,
        };
        return (0, configUtils_1.getMatchingPluginConfig)(this.pluginData, this.getParsedOptions(), finalMatchParams, this.customOverrideCriteriaFunctions);
    }
    getForMessage(msg) {
        const level = msg.member ? this.getMemberLevel(msg.member) : null;
        return this.getMatchingConfig({
            level,
            userId: msg.author.id,
            channelId: msg.channel.id,
            categoryId: msg.channel.parentId,
            memberRoles: msg.member ? [...msg.member.roles.cache.keys()] : [],
        });
    }
    getForInteraction(interaction) {
        return this.getMatchingConfig({ interaction });
    }
    getForChannel(channel) {
        return this.getMatchingConfig({
            channelId: channel.id,
            categoryId: channel.parentId,
        });
    }
    getForUser(user) {
        return this.getMatchingConfig({
            userId: user.id,
        });
    }
    getForMember(member) {
        const level = this.getMemberLevel(member);
        return this.getMatchingConfig({
            level,
            userId: member.user.id,
            memberRoles: [...member.roles.cache.keys()],
        });
    }
}
exports.PluginConfigManager = PluginConfigManager;
