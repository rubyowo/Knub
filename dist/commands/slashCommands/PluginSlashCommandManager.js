"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginSlashCommandManager = void 0;
const utils_1 = require("../../utils");
class PluginSlashCommandManager {
    constructor() {
        this.nameToCommandOrGroup = {};
    }
    setPluginData(pluginData) {
        if (this.pluginData) {
            throw new Error("Plugin data already set");
        }
        this.pluginData = pluginData;
    }
    add(commandOrGroup) {
        this.nameToCommandOrGroup[commandOrGroup.name] = commandOrGroup;
    }
    getAll() {
        return Object.values(this.nameToCommandOrGroup);
    }
    async runFromInteraction(interaction) {
        if (!interaction.isChatInputCommand()) {
            return;
        }
        if (!this.nameToCommandOrGroup[interaction.commandName]) {
            return;
        }
        const commandOrGroup = this.nameToCommandOrGroup[interaction.commandName];
        const command = this.resolveSubcommand(interaction, commandOrGroup);
        if (!command) {
            return;
        }
        // Check custom, config-based permissions
        if (command.configPermission) {
            const matchingConfig = await this.pluginData.config.getMatchingConfig({
                member: interaction.member,
                userId: interaction.user.id,
                channel: interaction.channel,
            });
            if (!(0, utils_1.get)(matchingConfig, command.configPermission)) {
                void interaction.reply({
                    content: "You don't have permission to use this command",
                    ephemeral: true,
                });
                return;
            }
        }
        const nestedOptions = this.getNestedOptionsData(interaction.options.data);
        const receivedOptionNames = new Set(nestedOptions.map((opt) => opt.name));
        const optionsWithValues = {};
        for (const option of command.signature) {
            // If we haven't received a specific option at all, it has to be optional and we can set it to null.
            // We *could* put in a sanity check here to make sure we don't do this for options marked as required,
            // but we should be able to trust the slash command system that a required option *will always be included*.
            if (!receivedOptionNames.has(option.name)) {
                optionsWithValues[option.name] = null;
                continue;
            }
            optionsWithValues[option.name] = option.resolveValue(interaction);
        }
        const meta = {
            interaction,
            options: optionsWithValues,
            pluginData: this.pluginData,
        };
        await command.run(meta);
    }
    resolveSubcommand(interaction, commandOrGroup) {
        if (commandOrGroup.type === "slash") {
            return commandOrGroup;
        }
        const subcommandGroupName = interaction.options.getSubcommandGroup();
        const subcommandName = interaction.options.getSubcommand();
        if (subcommandGroupName) {
            for (const item of commandOrGroup.subcommands) {
                if (item.name !== subcommandGroupName) {
                    continue;
                }
                if (item.type === "slash-group") {
                    for (const subItem of item.subcommands) {
                        if (subItem.name !== subcommandName) {
                            continue;
                        }
                        if (subItem.type === "slash") {
                            return subItem;
                        }
                    }
                }
                console.warn(`[WARN] Received interaction for subcommand group ${interaction.commandName} -> ${subcommandGroupName} but expected subcommand`);
                return null;
            }
        }
        if (subcommandName) {
            for (const item of commandOrGroup.subcommands) {
                if (item.name !== subcommandName) {
                    continue;
                }
                if (item.type === "slash") {
                    return item;
                }
                console.warn(`[WARN] Received interaction for subcommand ${interaction.commandName} -> ${subcommandName} but expected subcommand group`);
                return null;
            }
        }
        return null;
    }
    getNestedOptionsData(optionsData) {
        for (const option of optionsData) {
            if ("options" in option && option.options != null) {
                return this.getNestedOptionsData(option.options);
            }
        }
        return optionsData;
    }
}
exports.PluginSlashCommandManager = PluginSlashCommandManager;
