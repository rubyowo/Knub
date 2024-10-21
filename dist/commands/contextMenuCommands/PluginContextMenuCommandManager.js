"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _PluginContextMenuCommandManager_pluginData, _PluginContextMenuCommandManager_nameToCommand;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginContextMenuCommandManager = void 0;
const utils_1 = require("../../utils");
class PluginContextMenuCommandManager {
    constructor() {
        _PluginContextMenuCommandManager_pluginData.set(this, null);
        _PluginContextMenuCommandManager_nameToCommand.set(this, {});
    }
    setPluginData(pluginData) {
        __classPrivateFieldSet(this, _PluginContextMenuCommandManager_pluginData, pluginData, "f");
    }
    add(command) {
        __classPrivateFieldGet(this, _PluginContextMenuCommandManager_nameToCommand, "f")[command.name] = command;
    }
    getAll() {
        return Object.values(__classPrivateFieldGet(this, _PluginContextMenuCommandManager_nameToCommand, "f"));
    }
    async runFromInteraction(interaction) {
        if (!interaction.isContextMenuCommand()) {
            return;
        }
        if (!__classPrivateFieldGet(this, _PluginContextMenuCommandManager_nameToCommand, "f")[interaction.commandName]) {
            return;
        }
        const command = __classPrivateFieldGet(this, _PluginContextMenuCommandManager_nameToCommand, "f")[interaction.commandName];
        // Check custom, config-based permissions
        if (command.configPermission) {
            const matchingConfig = await __classPrivateFieldGet(this, _PluginContextMenuCommandManager_pluginData, "f").config.getMatchingConfig({
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
        if (interaction.isMessageContextMenuCommand()) {
            await command.run({
                pluginData: __classPrivateFieldGet(this, _PluginContextMenuCommandManager_pluginData, "f"),
                interaction,
            });
            return;
        }
        if (interaction.isUserContextMenuCommand()) {
            await command.run({
                pluginData: __classPrivateFieldGet(this, _PluginContextMenuCommandManager_pluginData, "f"),
                interaction,
            });
            return;
        }
        throw new Error("Unknown context menu command type encountered");
    }
}
exports.PluginContextMenuCommandManager = PluginContextMenuCommandManager;
_PluginContextMenuCommandManager_pluginData = new WeakMap(), _PluginContextMenuCommandManager_nameToCommand = new WeakMap();
