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
var _Knub_guildLoadRunner, _Knub_loadErrorInterval;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Knub = void 0;
const events_1 = require("events");
const discord_js_1 = require("discord.js");
const ConcurrentRunner_1 = require("./ConcurrentRunner");
const Profiler_1 = require("./Profiler");
const Queue_1 = require("./Queue");
const PluginContextMenuCommandManager_1 = require("./commands/contextMenuCommands/PluginContextMenuCommandManager");
const PluginMessageCommandManager_1 = require("./commands/messageCommands/PluginMessageCommandManager");
const registerApplicationCommands_1 = require("./commands/registerApplicationCommands");
const PluginSlashCommandManager_1 = require("./commands/slashCommands/PluginSlashCommandManager");
const PluginConfigManager_1 = require("./config/PluginConfigManager");
const CooldownManager_1 = require("./cooldowns/CooldownManager");
const EventRelay_1 = require("./events/EventRelay");
const GlobalPluginEventManager_1 = require("./events/GlobalPluginEventManager");
const GuildPluginEventManager_1 = require("./events/GuildPluginEventManager");
const LockManager_1 = require("./locks/LockManager");
const PluginLoadError_1 = require("./plugins/PluginLoadError");
const PluginNotLoadedError_1 = require("./plugins/PluginNotLoadedError");
const UnknownPluginError_1 = require("./plugins/UnknownPluginError");
const pluginUtils_1 = require("./plugins/pluginUtils");
const utils_1 = require("./utils");
const defaultKnubArgs = {
    guildPlugins: [],
    globalPlugins: [],
    options: {},
};
const defaultLogFn = (level, ...args) => {
    if (level === "error") {
        console.error("[ERROR]", ...args);
    }
    else if (level === "warn") {
        console.warn("[WARN]", ...args);
    }
    else {
        console.log(`[${level.toUpperCase()}]`, ...args);
    }
};
class Knub extends events_1.EventEmitter {
    constructor(client, userArgs) {
        super();
        this.guildPlugins = new Map();
        this.globalPlugins = new Map();
        this.loadedGuilds = new Map();
        // Guild loads and unloads are queued up to avoid race conditions
        this.guildLoadQueues = new Map();
        this.globalContextLoaded = false;
        this.globalContextLoadPromise = Promise.resolve();
        this.log = defaultLogFn;
        this.profiler = new Profiler_1.Profiler();
        _Knub_guildLoadRunner.set(this, void 0);
        _Knub_loadErrorInterval.set(this, null);
        this.destroyPromise = null;
        const args = {
            ...defaultKnubArgs,
            ...userArgs,
        };
        this.client = client;
        this.eventRelay = new EventRelay_1.EventRelay(client, this.profiler);
        this.globalContext = {
            // @ts-ignore: This property is always set in loadGlobalConfig() before it can be used by plugins
            config: null,
            loadedPlugins: new Map(),
            locks: new LockManager_1.LockManager(),
        };
        const uniquePluginNames = new Set();
        const validatePlugin = (plugin) => {
            if (plugin.name == null) {
                throw new Error("No plugin name specified for plugin");
            }
            if (uniquePluginNames.has(plugin.name)) {
                throw new Error(`Duplicate plugin name: ${plugin.name}`);
            }
            uniquePluginNames.add(plugin.name);
        };
        for (const globalPlugin of args.globalPlugins) {
            validatePlugin(globalPlugin);
            this.globalPlugins.set(globalPlugin.name, globalPlugin);
        }
        for (const guildPlugin of args.guildPlugins) {
            validatePlugin(guildPlugin);
            this.guildPlugins.set(guildPlugin.name, guildPlugin);
        }
        const defaultOptions = {
            getConfig: pluginUtils_1.defaultGetConfig,
            getEnabledGuildPlugins: pluginUtils_1.defaultGetEnabledGuildPlugins,
            canLoadGuild: () => true,
            customArgumentTypes: {},
            concurrentGuildLoadLimit: 10,
        };
        this.options = { ...defaultOptions, ...args.options };
        if (this.options.logFn) {
            this.log = this.options.logFn;
        }
        __classPrivateFieldSet(this, _Knub_guildLoadRunner, new ConcurrentRunner_1.ConcurrentRunner(this.options.concurrentGuildLoadLimit), "f");
    }
    initialize() {
        __classPrivateFieldSet(this, _Knub_loadErrorInterval, setInterval(() => {
            this.log("info", "Still connecting...");
        }, 30 * 1000), "f");
        this.client.once("clientReady", () => {
            if (__classPrivateFieldGet(this, _Knub_loadErrorInterval, "f")) {
                clearInterval(__classPrivateFieldGet(this, _Knub_loadErrorInterval, "f"));
            }
            this.log("info", "Bot connected!");
        });
        this.client.ws.once("ready", async () => {
            this.log("info", "Received READY");
            const autoRegisterApplicationCommands = this.options.autoRegisterApplicationCommands ?? true;
            if (autoRegisterApplicationCommands) {
                this.log("info", "- Registering application commands with Discord...");
                await this.registerApplicationCommands();
            }
            this.log("info", "- Loading global plugins...");
            await this.loadGlobalContext();
            this.log("info", "- Loading available servers that haven't been loaded yet...");
            await this.loadAllAvailableGuilds();
            this.log("info", "Done!");
            this.emit("loadingFinished");
        });
        this.client.ws.on(discord_js_1.GatewayDispatchEvents.GuildCreate, (data) => {
            setImmediate(() => {
                this.log("info", `Guild available: ${data.id}`);
                void __classPrivateFieldGet(this, _Knub_guildLoadRunner, "f").run(() => this.loadGuild(data.id)).catch((err) => this.throwOrEmit(err));
            });
        });
        this.client.on("guildUnavailable", (guild) => {
            this.log("info", `Guild unavailable: ${guild.id}`);
            void this.unloadGuild(guild.id);
        });
        this.client.on("guildDelete", (guild) => {
            this.log("info", `Left guild: ${guild.id}`);
            void this.unloadGuild(guild.id);
        });
    }
    async destroy() {
        if (!this.destroyPromise) {
            this.destroyPromise = (async () => {
                this.client.destroy();
                await this.unloadAllGuilds();
                await this.unloadGlobalContext();
                this.removeAllListeners();
                this.clearGuildLoadQueues();
                if (__classPrivateFieldGet(this, _Knub_loadErrorInterval, "f")) {
                    clearInterval(__classPrivateFieldGet(this, _Knub_loadErrorInterval, "f"));
                }
            })();
        }
        return this.destroyPromise;
    }
    throwOrEmit(error) {
        if (this.listenerCount("error") > 0) {
            this.emit("error", error);
            return;
        }
        throw error;
    }
    getAvailablePlugins() {
        return this.guildPlugins;
    }
    getGlobalPlugins() {
        return this.globalPlugins;
    }
    getGlobalConfig() {
        return this.globalContext.config;
    }
    /**
     * Create the partial PluginData that's passed to beforeLoad()
     */
    async buildGuildPluginData(ctx, plugin, loadedAsDependency) {
        const configManager = new PluginConfigManager_1.PluginConfigManager(plugin.defaultOptions ?? { config: {} }, (0, utils_1.get)(ctx.config, `plugins.${plugin.name}`) || {}, {
            levels: ctx.config.levels || {},
            parser: plugin.configParser,
            customOverrideCriteriaFunctions: plugin.customOverrideCriteriaFunctions,
        });
        try {
            await configManager.init();
        }
        catch (e) {
            if (!(e instanceof Error)) {
                throw e;
            }
            throw new PluginLoadError_1.PluginLoadError(plugin.name, ctx, e);
        }
        const pluginData = {
            _pluginType: undefined,
            pluginName: plugin.name,
            context: "guild",
            guild: this.client.guilds.resolve(ctx.guildId),
            loaded: false,
            client: this.client,
            config: configManager,
            locks: ctx.locks,
            cooldowns: new CooldownManager_1.CooldownManager(),
            fullConfig: ctx.config,
            events: new GuildPluginEventManager_1.GuildPluginEventManager(this.eventRelay),
            messageCommands: new PluginMessageCommandManager_1.PluginMessageCommandManager(this.client, { prefix: ctx.config.prefix }),
            slashCommands: new PluginSlashCommandManager_1.PluginSlashCommandManager(),
            contextMenuCommands: new PluginContextMenuCommandManager_1.PluginContextMenuCommandManager(),
            loadedAsDependency,
            getKnubInstance: () => this,
            hasGlobalPlugin: (0, utils_1.notCallable)("hasGlobalPlugin is not available yet"),
            getGlobalPlugin: (0, utils_1.notCallable)("getGlobalPlugin is not available yet"),
            hasPlugin: (0, utils_1.notCallable)("hasPlugin is not available yet"),
            getPlugin: (0, utils_1.notCallable)("getPlugin is not available yet"),
            state: {},
        };
        pluginData.config.setPluginData(pluginData);
        pluginData.events.setPluginData(pluginData);
        pluginData.messageCommands.setPluginData(pluginData);
        pluginData.slashCommands.setPluginData(pluginData);
        pluginData.contextMenuCommands.setPluginData(pluginData);
        this.addGlobalDependencyFnsToPluginData(pluginData);
        return pluginData;
    }
    addDependencyFnsToPluginData(ctx, pluginData) {
        pluginData.hasPlugin = (resolvablePlugin) => this.ctxHasPlugin(ctx, resolvablePlugin);
        pluginData.getPlugin = (resolvablePlugin) => {
            const publicInterface = this.getPluginPublicInterface(ctx, resolvablePlugin);
            if (!publicInterface) {
                throw new Error("Requested global plugin is not available");
            }
            return publicInterface;
        };
    }
    /**
     * Create the partial PluginData that's passed to beforeLoad()
     */
    async buildGlobalPluginData(ctx, plugin, loadedAsDependency) {
        const configManager = new PluginConfigManager_1.PluginConfigManager(plugin.defaultOptions ?? { config: {} }, (0, utils_1.get)(ctx.config, `plugins.${plugin.name}`) || {}, {
            levels: ctx.config.levels || {},
            parser: plugin.configParser,
            customOverrideCriteriaFunctions: plugin.customOverrideCriteriaFunctions,
        });
        try {
            await configManager.init();
        }
        catch (e) {
            if (!(e instanceof Error)) {
                throw e;
            }
            throw new PluginLoadError_1.PluginLoadError(plugin.name, ctx, e);
        }
        const pluginData = {
            _pluginType: undefined,
            context: "global",
            pluginName: plugin.name,
            loaded: false,
            client: this.client,
            config: configManager,
            locks: ctx.locks,
            cooldowns: new CooldownManager_1.CooldownManager(),
            fullConfig: ctx.config,
            events: new GlobalPluginEventManager_1.GlobalPluginEventManager(this.eventRelay),
            messageCommands: new PluginMessageCommandManager_1.PluginMessageCommandManager(this.client, { prefix: ctx.config.prefix }),
            slashCommands: new PluginSlashCommandManager_1.PluginSlashCommandManager(),
            contextMenuCommands: new PluginContextMenuCommandManager_1.PluginContextMenuCommandManager(),
            loadedAsDependency,
            // @ts-ignore: This is actually correct, dw about it
            getKnubInstance: () => this,
            hasGlobalPlugin: (0, utils_1.notCallable)("hasGlobalPlugin is not available yet"),
            getGlobalPlugin: (0, utils_1.notCallable)("getGlobalPlugin is not available yet"),
            hasPlugin: (0, utils_1.notCallable)("hasPlugin is not available yet"),
            getPlugin: (0, utils_1.notCallable)("getPlugin is not available yet"),
            state: {},
        };
        pluginData.config.setPluginData(pluginData);
        pluginData.events.setPluginData(pluginData);
        pluginData.messageCommands.setPluginData(pluginData);
        pluginData.slashCommands.setPluginData(pluginData);
        pluginData.contextMenuCommands.setPluginData(pluginData);
        this.addGlobalDependencyFnsToPluginData(pluginData);
        return pluginData;
    }
    addGlobalDependencyFnsToPluginData(pluginData) {
        pluginData.hasGlobalPlugin = (resolvablePlugin) => this.ctxHasPlugin(this.globalContext, resolvablePlugin);
        pluginData.getGlobalPlugin = (resolvablePlugin) => {
            const publicInterface = this.getPluginPublicInterface(this.globalContext, resolvablePlugin);
            if (!publicInterface) {
                throw new Error("Requested global plugin is not available");
            }
            return publicInterface;
        };
    }
    async resolveDependencies(plugin, resolvedDependencies = new Set()) {
        if (!plugin.dependencies) {
            return resolvedDependencies;
        }
        const dependencies = await plugin.dependencies();
        for (const dependency of dependencies) {
            if (!resolvedDependencies.has(dependency.name)) {
                resolvedDependencies.add(dependency.name);
                // Resolve transitive dependencies
                await this.resolveDependencies(dependency, resolvedDependencies);
            }
        }
        return resolvedDependencies;
    }
    ctxHasPlugin(ctx, plugin) {
        return ctx.loadedPlugins.has(plugin.name);
    }
    getPluginPublicInterface(ctx, plugin) {
        if (!ctx.loadedPlugins.has(plugin.name)) {
            throw new PluginNotLoadedError_1.PluginNotLoadedError(`Plugin ${plugin.name} is not loaded`);
        }
        const loadedPlugin = ctx.loadedPlugins.get(plugin.name);
        // FIXME: TS can't associate loadedPlugin.publicData with loadedPlugin.blueprint.public's type here
        // @ts-expect-error
        const publicInterface = loadedPlugin.blueprint.public?.(loadedPlugin.pluginData) ?? null;
        return publicInterface;
    }
    async loadAllAvailableGuilds() {
        const guilds = Array.from(this.client.guilds.cache.values());
        const loadPromises = guilds.map((guild) => __classPrivateFieldGet(this, _Knub_guildLoadRunner, "f").run(() => this.loadGuild(guild.id)).catch((err) => this.throwOrEmit(err)));
        await Promise.all(loadPromises);
    }
    async loadGuild(guildId) {
        let guildLoadPromise = this.getGuildLoadQueue(guildId).add(async () => {
            if (this.loadedGuilds.has(guildId)) {
                return;
            }
            // Only load the guild if we're actually in the guild
            if (!this.client.guilds.resolve(guildId)) {
                return;
            }
            const guildContext = {
                guildId,
                // @ts-ignore: This property is always set below before it can be used by plugins
                config: null,
                loadedPlugins: new Map(),
                locks: new LockManager_1.LockManager(),
            };
            let err = null;
            try {
                await this.loadGuildConfig(guildContext);
                await this.loadGuildPlugins(guildContext);
            }
            catch (_err) {
                err = _err;
            }
            // Even if we get an error, we need to mark the guild briefly as loaded
            // so the unload function has something to work with
            this.loadedGuilds.set(guildId, guildContext);
            // However, we don't emit the guildLoaded event unless we managed to load everything without errors
            if (err) {
                throw err;
            }
            this.emit("guildLoaded", guildId);
            // Call afterLoad() hooks
            for (const loadedPlugin of guildContext.loadedPlugins.values()) {
                await loadedPlugin.blueprint.afterLoad?.(loadedPlugin.pluginData);
            }
        });
        guildLoadPromise = guildLoadPromise.catch(async (err) => {
            // If we encounter errors during loading, unload the guild and re-throw the error
            await this.unloadGuild(guildId);
            throw err;
        });
        return guildLoadPromise;
    }
    async reloadGuild(guildId) {
        await this.unloadGuild(guildId);
        await __classPrivateFieldGet(this, _Knub_guildLoadRunner, "f").run(() => this.loadGuild(guildId)).catch((err) => this.throwOrEmit(err));
    }
    async unloadGuild(guildId) {
        // Loads and unloads are queued up to avoid race conditions
        return this.getGuildLoadQueue(guildId).add(async () => {
            const ctx = this.loadedGuilds.get(guildId);
            if (!ctx) {
                return;
            }
            const pluginsToUnload = Array.from(ctx.loadedPlugins.entries());
            // 1. Run each plugin's beforeUnload() function
            for (const [_, loadedPlugin] of pluginsToUnload) {
                await loadedPlugin.blueprint.beforeUnload?.(loadedPlugin.pluginData);
            }
            // 2. Remove event listeners and mark each plugin as unloaded
            for (const [pluginName, loadedPlugin] of pluginsToUnload) {
                await this.destroyPluginData(loadedPlugin.pluginData);
                loadedPlugin.pluginData.loaded = false;
                ctx.loadedPlugins.delete(pluginName);
            }
            // 3. Mark the guild as unloaded
            this.loadedGuilds.delete(ctx.guildId);
            this.emit("guildUnloaded", ctx.guildId);
            // 4. Run each plugin's afterUnload() function
            for (const [_, loadedPlugin] of pluginsToUnload) {
                loadedPlugin.pluginData.hasPlugin = (0, utils_1.notCallable)("hasPlugin is no longer available");
                loadedPlugin.pluginData.getPlugin = (0, utils_1.notCallable)("getPlugin is no longer available");
                await loadedPlugin.blueprint.afterUnload?.(loadedPlugin.pluginData);
            }
        });
    }
    async unloadAllGuilds() {
        // Merge guild IDs of loaded guilds and those that are in the progress of being loaded
        // This way we won't miss guilds that are still undergoing their initial load, i.e. they're not returned by getLoadedGuilds()
        const loadedGuildIds = this.getLoadedGuilds().map((c) => c.guildId);
        const queuedGuildIds = Array.from(this.guildLoadQueues.keys());
        const uniqueGuildIds = new Set([...loadedGuildIds, ...queuedGuildIds]);
        const unloadPromises = Array.from(uniqueGuildIds).map((guildId) => this.unloadGuild(guildId));
        await Promise.all(unloadPromises);
    }
    getGuildLoadQueue(guildId) {
        if (!this.guildLoadQueues.has(guildId)) {
            const queueTimeout = 60 * 5 * 1000; // 5 minutes, should be plenty to allow plugins time to load/unload properly
            this.guildLoadQueues.set(guildId, new Queue_1.Queue(queueTimeout));
        }
        return this.guildLoadQueues.get(guildId);
    }
    clearGuildLoadQueues() {
        for (const [key, queue] of this.guildLoadQueues) {
            this.guildLoadQueues.delete(key);
            queue.destroy();
        }
    }
    getLoadedGuild(guildId) {
        return this.loadedGuilds.get(guildId);
    }
    getLoadedGuilds() {
        return Array.from(this.loadedGuilds.values());
    }
    async loadGuildConfig(ctx) {
        ctx.config = await this.options.getConfig(ctx.guildId);
    }
    async loadGuildPlugins(ctx) {
        const enabledPlugins = await this.options.getEnabledGuildPlugins(ctx, this.guildPlugins);
        const dependencies = new Set();
        for (const pluginName of enabledPlugins) {
            await this.resolveDependencies(this.guildPlugins.get(pluginName), dependencies);
        }
        // Reverse the order of dependencies so transitive dependencies get loaded first
        const dependenciesArr = Array.from(dependencies.values()).reverse();
        const pluginsToLoad = Array.from(new Set([...dependenciesArr, ...enabledPlugins]));
        // 1. Set up plugin data for each plugin. Call beforeLoad() hook.
        for (const pluginName of pluginsToLoad) {
            if (!this.guildPlugins.has(pluginName)) {
                throw new UnknownPluginError_1.UnknownPluginError(`Unknown plugin: ${pluginName}`);
            }
            const plugin = this.guildPlugins.get(pluginName);
            const onlyLoadedAsDependency = !enabledPlugins.includes(pluginName);
            const pluginData = await this.buildGuildPluginData(ctx, plugin, onlyLoadedAsDependency);
            try {
                await plugin.beforeLoad?.(pluginData);
            }
            catch (e) {
                await this.destroyPluginData(pluginData);
                throw new PluginLoadError_1.PluginLoadError(plugin.name, ctx, e);
            }
            this.addDependencyFnsToPluginData(ctx, pluginData);
            ctx.loadedPlugins.set(pluginName, {
                blueprint: plugin,
                pluginData,
                onlyLoadedAsDependency,
            });
        }
        // 2. Call each plugin's beforeStart() hook
        for (const [pluginName, loadedPlugin] of ctx.loadedPlugins) {
            try {
                loadedPlugin.blueprint.beforeStart?.(loadedPlugin.pluginData);
            }
            catch (e) {
                throw new PluginLoadError_1.PluginLoadError(pluginName, ctx, e);
            }
        }
        // 3. Register event handlers and commands
        for (const [pluginName, { blueprint, pluginData, onlyLoadedAsDependency }] of ctx.loadedPlugins) {
            if (!onlyLoadedAsDependency) {
                // Register event listeners
                if (blueprint.events) {
                    for (const eventListenerBlueprint of blueprint.events) {
                        pluginData.events.registerEventListener({
                            ...eventListenerBlueprint,
                            listener: eventListenerBlueprint.listener,
                        });
                    }
                }
                // Register message commands
                if (blueprint.messageCommands) {
                    for (const commandBlueprint of blueprint.messageCommands) {
                        pluginData.messageCommands.add({
                            ...commandBlueprint,
                            run: commandBlueprint.run,
                        });
                    }
                }
                // Initialize messageCreate event listener for message commands
                pluginData.events.on("messageCreate", ({ args: { message }, pluginData: _pluginData }) => {
                    return _pluginData.messageCommands.runFromMessage(message);
                });
                // Register slash commands
                if (blueprint.slashCommands) {
                    for (const slashCommandBlueprint of blueprint.slashCommands) {
                        pluginData.slashCommands.add(slashCommandBlueprint);
                    }
                }
                // Add interactionCreate event listener for slash commands
                pluginData.events.on("interactionCreate", async ({ args: { interaction }, pluginData: _pluginData }) => {
                    await _pluginData.slashCommands.runFromInteraction(interaction);
                });
                // Register context menu commands
                if (blueprint.contextMenuCommands) {
                    for (const contextMenuCommandBlueprint of blueprint.contextMenuCommands) {
                        pluginData.contextMenuCommands.add(contextMenuCommandBlueprint);
                    }
                }
                // Add interactionCreate event listener for context menu commands
                pluginData.events.on("interactionCreate", async ({ args: { interaction }, pluginData: _pluginData }) => {
                    await _pluginData.contextMenuCommands.runFromInteraction(interaction);
                });
            }
            pluginData.loaded = true;
        }
    }
    /**
     * The global context analogue to loadGuild()
     */
    async loadGlobalContext() {
        if (this.globalContextLoaded) {
            return;
        }
        this.globalContextLoadPromise = (async () => {
            const globalContext = {
                config: await this.options.getConfig("global"),
                loadedPlugins: new Map(),
                locks: new LockManager_1.LockManager(),
            };
            await this.loadGlobalPlugins(globalContext);
            this.globalContext = globalContext;
            this.globalContextLoaded = true;
            // Call afterLoad() hooks after the context has been loaded
            for (const loadedPlugin of this.globalContext.loadedPlugins.values()) {
                loadedPlugin.blueprint.afterLoad?.(loadedPlugin.pluginData);
            }
        })();
        await this.globalContextLoadPromise;
    }
    async reloadGlobalContext() {
        await this.unloadGlobalContext();
        await this.loadGlobalContext();
    }
    async unloadGlobalContext() {
        // Make sure we don't start unloading the global context while it's still loading
        await this.globalContextLoadPromise;
        const pluginsToUnload = Array.from(this.globalContext.loadedPlugins.entries());
        // 1. Run each plugin's beforeUnload() function
        for (const [_, loadedPlugin] of pluginsToUnload) {
            await loadedPlugin.blueprint.beforeUnload?.(loadedPlugin.pluginData);
        }
        // 2. Remove event listeners and mark each plugin as unloaded
        for (const [pluginName, loadedPlugin] of pluginsToUnload) {
            await this.destroyPluginData(loadedPlugin.pluginData);
            loadedPlugin.pluginData.loaded = false;
            this.globalContext.loadedPlugins.delete(pluginName);
        }
        // 3. Mark the global context as unloaded
        this.globalContextLoaded = false;
        // 4. Run each plugin's afterUnload() function
        for (const [_, loadedPlugin] of pluginsToUnload) {
            loadedPlugin.pluginData.hasPlugin = (0, utils_1.notCallable)("hasPlugin is no longer available");
            loadedPlugin.pluginData.getPlugin = (0, utils_1.notCallable)("getPlugin is no longer available");
            await loadedPlugin.blueprint.afterUnload?.(loadedPlugin.pluginData);
        }
    }
    async loadGlobalPlugins(ctx) {
        // 1. Set up plugin data for each plugin. Call beforeLoad() hooks.
        for (const [pluginName, plugin] of this.globalPlugins.entries()) {
            const pluginData = await this.buildGlobalPluginData(ctx, plugin, false);
            try {
                await plugin.beforeLoad?.(pluginData);
            }
            catch (e) {
                await this.destroyPluginData(pluginData);
                throw new PluginLoadError_1.PluginLoadError(plugin.name, ctx, e);
            }
            this.addDependencyFnsToPluginData(ctx, pluginData);
            ctx.loadedPlugins.set(pluginName, {
                blueprint: plugin,
                pluginData,
            });
        }
        // 2. Call each plugin's beforeStart() hook
        for (const [pluginName, loadedPlugin] of ctx.loadedPlugins) {
            try {
                await loadedPlugin.blueprint.beforeStart?.(loadedPlugin.pluginData);
            }
            catch (e) {
                throw new PluginLoadError_1.PluginLoadError(pluginName, ctx, e);
            }
        }
        // 3. Register each plugin's event listeners and commands
        for (const [pluginName, { pluginData, blueprint }] of ctx.loadedPlugins) {
            // Register event listeners
            if (blueprint.events) {
                for (const eventListenerBlueprint of blueprint.events) {
                    pluginData.events.registerEventListener({
                        ...eventListenerBlueprint,
                        listener: eventListenerBlueprint.listener,
                    });
                }
            }
            // Register message commands
            if (blueprint.messageCommands) {
                for (const commandBlueprint of blueprint.messageCommands) {
                    pluginData.messageCommands.add({
                        ...commandBlueprint,
                        run: commandBlueprint.run,
                    });
                }
            }
            // Add messageCreate event listener for commands
            pluginData.events.on("messageCreate", ({ args: { message }, pluginData: _pluginData }) => {
                return _pluginData.messageCommands.runFromMessage(message);
            });
            // Register slash commands
            if (blueprint.slashCommands) {
                for (const slashCommandBlueprint of blueprint.slashCommands) {
                    pluginData.slashCommands.add(slashCommandBlueprint);
                }
            }
            // Add interactionCreate event listener for slash commands
            pluginData.events.on("interactionCreate", async ({ args: { interaction }, pluginData: _pluginData }) => {
                await _pluginData.slashCommands.runFromInteraction(interaction);
            });
            // Register context menu commands
            if (blueprint.contextMenuCommands) {
                for (const contextMenuCommandBlueprint of blueprint.contextMenuCommands) {
                    pluginData.contextMenuCommands.add(contextMenuCommandBlueprint);
                }
            }
            // Add interactionCreate event listener for context menu commands
            pluginData.events.on("interactionCreate", async ({ args: { interaction }, pluginData: _pluginData }) => {
                await _pluginData.contextMenuCommands.runFromInteraction(interaction);
            });
            pluginData.loaded = true;
        }
    }
    /**
     * Cleans up plugin data by removing any dangling event handlers and timers
     */
    async destroyPluginData(pluginData) {
        pluginData.cooldowns.destroy();
        pluginData.events.destroy();
        await pluginData.locks.destroy();
    }
    async registerApplicationCommands() {
        const applicationCommands = [];
        for (const plugin of this.guildPlugins.values()) {
            applicationCommands.push(...(plugin.slashCommands || []));
            applicationCommands.push(...(plugin.contextMenuCommands || []));
        }
        for (const plugin of this.globalPlugins.values()) {
            applicationCommands.push(...(plugin.slashCommands || []));
            applicationCommands.push(...(plugin.contextMenuCommands || []));
        }
        if (applicationCommands.length) {
            const result = await (0, registerApplicationCommands_1.registerApplicationCommands)(this.client, applicationCommands);
            this.log("info", `-- Created ${result.create}, updated ${result.update}, deleted ${result.delete}`);
        }
    }
}
exports.Knub = Knub;
_Knub_guildLoadRunner = new WeakMap(), _Knub_loadErrorInterval = new WeakMap();
