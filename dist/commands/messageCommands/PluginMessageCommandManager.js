"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginMessageCommandManager = void 0;
const knub_command_manager_1 = require("knub-command-manager");
const perf_hooks_1 = require("perf_hooks");
const messageCommandUtils_1 = require("./messageCommandUtils");
/**
 * A module to manage and run commands for a single instance of a plugin
 */
class PluginMessageCommandManager {
    constructor(client, opts = {}) {
        this.manager = new knub_command_manager_1.CommandManager({
            prefix: opts.prefix ?? (0, messageCommandUtils_1.getDefaultMessageCommandPrefix)(client),
        });
        this.handlers = new Map();
    }
    setPluginData(pluginData) {
        if (this.pluginData) {
            throw new Error("Plugin data already set");
        }
        this.pluginData = pluginData;
    }
    add(blueprint) {
        const preFilters = Array.from(blueprint.config?.preFilters ?? []);
        preFilters.unshift(messageCommandUtils_1.restrictCommandSource, messageCommandUtils_1.checkCommandPermission);
        const postFilters = Array.from(blueprint.config?.postFilters ?? []);
        postFilters.unshift(messageCommandUtils_1.checkCommandCooldown, messageCommandUtils_1.checkCommandLocks);
        const config = {
            ...blueprint.config,
            preFilters,
            postFilters,
            extra: {
                blueprint,
            },
        };
        const command = this.manager.add(blueprint.trigger, blueprint.signature, config);
        this.handlers.set(command.id, blueprint.run);
    }
    remove(id) {
        this.manager.remove(id);
        this.handlers.delete(id);
    }
    getAll() {
        return this.manager.getAll();
    }
    async runFromMessage(msg) {
        if (msg.content == null || msg.content.trim() === "" || !msg.channel.isSendable()) {
            return;
        }
        const command = await this.manager.findMatchingCommand(msg.content, {
            message: msg,
            pluginData: this.pluginData,
        });
        if (!command) {
            return;
        }
        if ((0, knub_command_manager_1.isError)(command)) {
            const usageLine = (0, messageCommandUtils_1.getMessageCommandSignature)(command.command);
            void msg.channel.send(`${command.error}\nUsage: \`${usageLine}\``);
            return;
        }
        const extraMeta = {};
        if (command.config.extra?._lock) {
            extraMeta.lock = command.config.extra._lock;
        }
        await this.runCommand(msg, command, extraMeta);
    }
    async runCommand(msg, matchedCommand, extraMeta) {
        const handler = this.handlers.get(matchedCommand.id);
        if (!handler) {
            throw new Error(`Command handler for command ${matchedCommand.id} does not exist`);
        }
        const valueMap = Object.entries(matchedCommand.values).reduce((map, [key, matched]) => {
            map[key] = matched.value;
            return map;
        }, {});
        const meta = {
            ...extraMeta,
            args: valueMap,
            message: msg,
            pluginData: this.pluginData,
            command: matchedCommand,
        };
        const startTime = perf_hooks_1.performance.now();
        await handler(meta);
        const commandName = typeof matchedCommand.originalTriggers[0] === "string"
            ? matchedCommand.originalTriggers[0]
            : matchedCommand.originalTriggers[0].source;
        this.pluginData.getKnubInstance().profiler.addDataPoint(`command:${commandName}`, perf_hooks_1.performance.now() - startTime);
    }
}
exports.PluginMessageCommandManager = PluginMessageCommandManager;
