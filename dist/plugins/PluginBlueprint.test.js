"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const knub_command_manager_1 = require("knub-command-manager");
const mocha_1 = require("mocha");
const PluginContextMenuCommandManager_1 = require("../commands/contextMenuCommands/PluginContextMenuCommandManager");
const contextMenuCommandBlueprint_1 = require("../commands/contextMenuCommands/contextMenuCommandBlueprint");
const PluginMessageCommandManager_1 = require("../commands/messageCommands/PluginMessageCommandManager");
const messageCommandBlueprint_1 = require("../commands/messageCommands/messageCommandBlueprint");
const PluginSlashCommandManager_1 = require("../commands/slashCommands/PluginSlashCommandManager");
const PluginConfigManager_1 = require("../config/PluginConfigManager");
const EventListenerBlueprint_1 = require("../events/EventListenerBlueprint");
const GlobalPluginEventManager_1 = require("../events/GlobalPluginEventManager");
const GuildPluginEventManager_1 = require("../events/GuildPluginEventManager");
const index_1 = require("../index");
const testUtils_1 = require("../testUtils");
const utils_1 = require("../utils");
const PluginBlueprint_1 = require("./PluginBlueprint");
const PluginData_1 = require("./PluginData");
(0, mocha_1.describe)("PluginBlueprint", () => {
    (0, mocha_1.describe)("Commands and events", () => {
        (0, mocha_1.it)("loads commands and events", (mochaDone) => {
            (0, testUtils_1.withKnub)(mochaDone, async (createKnub, done) => {
                const PluginToLoad = (0, PluginBlueprint_1.guildPlugin)({
                    name: "plugin-to-load",
                    configParser: () => ({}),
                    messageCommands: [(0, messageCommandBlueprint_1.guildPluginMessageCommand)({ trigger: "foo", permission: null, run: utils_1.noop })],
                    slashCommands: [(0, index_1.guildPluginSlashCommand)({ name: "bar", description: "", signature: [], run: utils_1.noop })],
                    contextMenuCommands: [(0, contextMenuCommandBlueprint_1.guildPluginMessageContextMenuCommand)({ name: "baz", run: utils_1.noop })],
                    events: [(0, EventListenerBlueprint_1.guildPluginEventListener)({ event: "messageCreate", listener: utils_1.noop })],
                    afterLoad(pluginData) {
                        chai_1.assert.strictEqual(pluginData.messageCommands.getAll().length, 1);
                        chai_1.assert.strictEqual(pluginData.slashCommands.getAll().length, 1);
                        chai_1.assert.strictEqual(pluginData.contextMenuCommands.getAll().length, 1);
                        // There are also default message and interaction listeners that are always registered, hence 4
                        chai_1.assert.strictEqual(pluginData.events.getListenerCount(), 4);
                        done();
                    },
                });
                const knub = createKnub({
                    guildPlugins: [PluginToLoad],
                    options: {
                        autoRegisterApplicationCommands: false,
                        getEnabledGuildPlugins() {
                            return ["plugin-to-load"];
                        },
                        logFn: utils_1.noop,
                    },
                });
                await (0, testUtils_1.initializeKnub)(knub);
                const guild = (0, testUtils_1.createMockGuild)(knub.client);
                knub.client.ws.emit("GUILD_CREATE", guild);
            });
        });
        (0, mocha_1.it)("guild events are only passed to the matching guild", (mochaDone) => {
            (0, testUtils_1.withKnub)(mochaDone, async (createKnub, done) => {
                const PluginToLoad = (0, PluginBlueprint_1.guildPlugin)({
                    name: "plugin-to-load",
                    configParser: () => ({}),
                    events: [
                        (0, EventListenerBlueprint_1.guildPluginEventListener)({
                            event: "messageCreate",
                            listener({ pluginData, args }) {
                                chai_1.assert.strictEqual(pluginData.guild.id, args.message.channel.guild.id);
                                guildCounts[pluginData.guild.id]++;
                            },
                        }),
                    ],
                });
                const knub = createKnub({
                    guildPlugins: [PluginToLoad],
                    options: {
                        getEnabledGuildPlugins() {
                            return ["plugin-to-load"];
                        },
                        logFn: utils_1.noop,
                    },
                });
                await (0, testUtils_1.initializeKnub)(knub);
                const guild0 = (0, testUtils_1.createMockGuild)(knub.client);
                const guild1 = (0, testUtils_1.createMockGuild)(knub.client);
                const guildCounts = {
                    [guild0.id]: 0,
                    [guild1.id]: 0,
                };
                knub.client.ws.emit("GUILD_CREATE", guild0);
                knub.client.ws.emit("GUILD_CREATE", guild1);
                await (0, testUtils_1.sleep)(30);
                const user0 = (0, testUtils_1.createMockUser)(knub.client);
                const user1 = (0, testUtils_1.createMockUser)(knub.client);
                const guild0Channel = (0, testUtils_1.createMockTextChannel)(knub.client, guild0.id);
                const guild1Channel = (0, testUtils_1.createMockTextChannel)(knub.client, guild1.id);
                const guild0Message1 = (0, testUtils_1.createMockMessage)(knub.client, guild0Channel, user0, { content: "foo" });
                const guild0Message2 = (0, testUtils_1.createMockMessage)(knub.client, guild0Channel, user0, { content: "bar" });
                const guild1Message1 = (0, testUtils_1.createMockMessage)(knub.client, guild1Channel, user1, { content: "foo" });
                const guild1Message2 = (0, testUtils_1.createMockMessage)(knub.client, guild1Channel, user1, { content: "bar" });
                knub.client.emit("messageCreate", guild0Message1);
                knub.client.emit("messageCreate", guild0Message2);
                knub.client.emit("messageCreate", guild1Message1);
                knub.client.emit("messageCreate", guild1Message2);
                await (0, testUtils_1.sleep)(30);
                chai_1.assert.strictEqual(guildCounts[guild0.id], 2);
                chai_1.assert.strictEqual(guildCounts[guild1.id], 2);
                done();
            });
        });
        (0, mocha_1.it)("global events are not passed to guild event listeners", (mochaDone) => {
            (0, testUtils_1.withKnub)(mochaDone, async (createKnub, done) => {
                const PluginToLoad = (0, PluginBlueprint_1.guildPlugin)({
                    name: "plugin-to-load",
                    configParser: () => ({}),
                    events: [
                        // @ts-expect-error: "userUpdate" is not a valid guild event
                        (0, EventListenerBlueprint_1.guildPluginEventListener)({
                            // @ts-expect-error: "userUpdate" is not a valid guild event
                            event: "userUpdate",
                            listener() {
                                chai_1.assert.fail("userUpdate was called in a guild event listener");
                            },
                        }),
                    ],
                });
                const client = (0, testUtils_1.createMockClient)();
                const knub = createKnub({
                    guildPlugins: [PluginToLoad],
                    options: {
                        getEnabledGuildPlugins() {
                            return ["plugin-to-load"];
                        },
                        logFn: utils_1.noop,
                    },
                });
                await (0, testUtils_1.initializeKnub)(knub);
                const guild0 = (0, testUtils_1.createMockGuild)(client);
                client.ws.emit("GUILD_CREATE", guild0);
                await (0, testUtils_1.sleep)(30);
                const user = (0, testUtils_1.createMockUser)(client);
                client.emit("userUpdate", user, user);
                await (0, testUtils_1.sleep)(10);
                done();
            });
        });
        (0, mocha_1.it)("global events are passed to global event listeners", (mochaDone) => {
            (0, testUtils_1.withKnub)(mochaDone, async (createKnub, done) => {
                const PluginToLoad = (0, PluginBlueprint_1.globalPlugin)({
                    name: "plugin-to-load",
                    configParser: () => ({}),
                    events: [
                        (0, EventListenerBlueprint_1.globalPluginEventListener)({
                            event: "userUpdate",
                            listener() {
                                done();
                            },
                        }),
                    ],
                });
                const knub = createKnub({
                    globalPlugins: [PluginToLoad],
                    options: {
                        logFn: utils_1.noop,
                    },
                });
                await (0, testUtils_1.initializeKnub)(knub);
                const user = (0, testUtils_1.createMockUser)(knub.client);
                knub.client.emit("userUpdate", user, user);
            });
        });
        (0, mocha_1.it)("guild events are passed to global event listeners", (mochaDone) => {
            (0, testUtils_1.withKnub)(mochaDone, async (createKnub, done) => {
                const PluginToLoad = (0, PluginBlueprint_1.globalPlugin)({
                    name: "plugin-to-load",
                    configParser: () => ({}),
                    events: [
                        (0, EventListenerBlueprint_1.globalPluginEventListener)({
                            event: "messageCreate",
                            listener({ pluginData, args }) {
                                chai_1.assert.ok((0, PluginData_1.isGlobalPluginData)(pluginData));
                                chai_1.assert.strictEqual(args.message.channel.guild.id, guild.id);
                                done();
                            },
                        }),
                    ],
                });
                const knub = createKnub({
                    globalPlugins: [PluginToLoad],
                    options: {
                        logFn: utils_1.noop,
                    },
                });
                await (0, testUtils_1.initializeKnub)(knub);
                const guild = (0, testUtils_1.createMockGuild)(knub.client);
                const user = (0, testUtils_1.createMockUser)(knub.client);
                const channel = (0, testUtils_1.createMockTextChannel)(knub.client, guild.id);
                const message = (0, testUtils_1.createMockMessage)(knub.client, channel, user);
                knub.client.emit("messageCreate", message);
            });
        });
        (0, mocha_1.describe)("Message commands", () => {
            (0, mocha_1.it)("command permissions", (mochaDone) => {
                (0, testUtils_1.withKnub)(mochaDone, async (createKnub, done) => {
                    const infoCmdCallUsers = [];
                    const serverCmdCallUsers = [];
                    const pingCmdCallUsers = [];
                    const TestPlugin = (0, PluginBlueprint_1.guildPlugin)()({
                        name: "test-plugin",
                        configParser: (input) => input,
                        defaultOptions: {
                            config: {
                                can_use_info_cmd: false,
                                can_use_server_cmd: false,
                                can_use_ping_cmd: false,
                            },
                        },
                        messageCommands: [
                            (0, messageCommandBlueprint_1.guildPluginMessageCommand)({
                                trigger: "info",
                                permission: "can_use_info_cmd",
                                run({ message }) {
                                    infoCmdCallUsers.push(message.author.id);
                                },
                            }),
                            (0, messageCommandBlueprint_1.guildPluginMessageCommand)({
                                trigger: "server",
                                permission: "can_use_server_cmd",
                                run({ message }) {
                                    serverCmdCallUsers.push(message.author.id);
                                },
                            }),
                            (0, messageCommandBlueprint_1.guildPluginMessageCommand)({
                                trigger: "ping",
                                permission: "can_use_ping_cmd",
                                run({ message }) {
                                    pingCmdCallUsers.push(message.author.id);
                                },
                            }),
                        ],
                    });
                    const knub = createKnub({
                        guildPlugins: [TestPlugin],
                        options: {
                            getEnabledGuildPlugins() {
                                return ["test-plugin"];
                            },
                            getConfig() {
                                return {
                                    prefix: "!",
                                    plugins: {
                                        "test-plugin": {
                                            overrides: [
                                                {
                                                    user: user1.id,
                                                    config: {
                                                        can_use_info_cmd: true,
                                                    },
                                                },
                                                {
                                                    user: user2.id,
                                                    config: {
                                                        can_use_server_cmd: true,
                                                    },
                                                },
                                                {
                                                    role: role.id,
                                                    config: {
                                                        can_use_ping_cmd: true,
                                                    },
                                                },
                                            ],
                                        },
                                    },
                                };
                            },
                            logFn: utils_1.noop,
                        },
                    });
                    const user1 = (0, testUtils_1.createMockUser)(knub.client);
                    const user2 = (0, testUtils_1.createMockUser)(knub.client);
                    const user3 = (0, testUtils_1.createMockUser)(knub.client);
                    const guild = (0, testUtils_1.createMockGuild)(knub.client);
                    const role = (0, testUtils_1.createMockRole)(guild);
                    await (0, testUtils_1.initializeKnub)(knub);
                    void (0, testUtils_1.createMockMember)(guild, user3, { roles: [role.id] });
                    knub.client.ws.emit("GUILD_CREATE", guild);
                    await (0, testUtils_1.sleep)(10);
                    const channel = (0, testUtils_1.createMockTextChannel)(knub.client, guild.id);
                    // !info
                    const infoFromUser1Msg = (0, testUtils_1.createMockMessage)(knub.client, channel, user1, { content: "!info" });
                    knub.client.emit("messageCreate", infoFromUser1Msg);
                    await (0, testUtils_1.sleep)(10);
                    const infoFromUser2Msg = (0, testUtils_1.createMockMessage)(knub.client, channel, user2, { content: "!info" });
                    knub.client.emit("messageCreate", infoFromUser2Msg);
                    await (0, testUtils_1.sleep)(10);
                    // !server
                    const serverFromUser1Msg = (0, testUtils_1.createMockMessage)(knub.client, channel, user1, { content: "!server" });
                    knub.client.emit("messageCreate", serverFromUser1Msg);
                    await (0, testUtils_1.sleep)(10);
                    const serverFromUser2Msg = (0, testUtils_1.createMockMessage)(knub.client, channel, user2, { content: "!server" });
                    knub.client.emit("messageCreate", serverFromUser2Msg);
                    await (0, testUtils_1.sleep)(10);
                    // !ping
                    const pingFromUser1Msg = (0, testUtils_1.createMockMessage)(knub.client, channel, user1, { content: "!ping" });
                    knub.client.emit("messageCreate", pingFromUser1Msg);
                    await (0, testUtils_1.sleep)(10);
                    const pingFromUser3Msg = (0, testUtils_1.createMockMessage)(knub.client, channel, user3, { content: "!ping" });
                    knub.client.emit("messageCreate", pingFromUser3Msg);
                    await (0, testUtils_1.sleep)(10);
                    chai_1.assert.deepStrictEqual(infoCmdCallUsers, [user1.id]);
                    chai_1.assert.deepStrictEqual(serverCmdCallUsers, [user2.id]);
                    chai_1.assert.deepStrictEqual(pingCmdCallUsers, [user3.id]);
                    done();
                });
            });
        });
        (0, mocha_1.describe)("Slash commands", () => {
            (0, mocha_1.it)("Type inference in slash command function", () => {
                (0, PluginBlueprint_1.guildPlugin)({
                    name: "slash-test-plugin",
                    configParser: () => ({}),
                    slashCommands: [
                        (0, index_1.guildPluginSlashCommand)({
                            name: "echo",
                            description: "Repeat what you said",
                            signature: [
                                index_1.slashOptions.string({ name: "text1", description: "bar", required: true }),
                                index_1.slashOptions.string({ name: "text2", description: "bar" }),
                                index_1.slashOptions.string({ name: "text3", description: "bar", required: false }),
                            ],
                            run({ interaction, options }) {
                                (0, testUtils_1.assertTypeEquals)();
                                (0, testUtils_1.assertTypeEquals)(); // Required (required: true), cannot be null
                                (0, testUtils_1.assertTypeEquals)();
                                (0, testUtils_1.assertTypeEquals)(); // Optional (required: omitted), can be null
                                (0, testUtils_1.assertTypeEquals)();
                                (0, testUtils_1.assertTypeEquals)(); // Optional (required: false), can be null
                                (0, testUtils_1.assertTypeEquals)();
                            },
                        }),
                    ],
                });
            });
            (0, mocha_1.it)("Slash command group types", () => {
                (0, PluginBlueprint_1.guildPlugin)({
                    name: "slash-test-plugin",
                    configParser: () => ({}),
                    slashCommands: [
                        (0, index_1.guildPluginSlashGroup)({
                            name: "top_level_group",
                            description: "",
                            subcommands: [
                                (0, index_1.guildPluginSlashCommand)({
                                    name: "one_level_down",
                                    description: "",
                                    signature: [],
                                    run() { },
                                }),
                                (0, index_1.guildPluginSlashGroup)({
                                    name: "second_level_group",
                                    description: "",
                                    subcommands: [
                                        (0, index_1.guildPluginSlashCommand)({
                                            name: "two_levels_down",
                                            description: "",
                                            signature: [],
                                            run() { },
                                        }),
                                    ],
                                }),
                            ],
                        }),
                    ],
                });
            });
        });
    });
    (0, mocha_1.describe)("Lifecycle hooks", () => {
        (0, mocha_1.it)("GuildPlugin beforeLoad()", (mochaDone) => {
            (0, testUtils_1.withKnub)(mochaDone, async (createKnub, done) => {
                const PluginToLoad = {
                    name: "plugin-to-load",
                    configParser: () => ({}),
                    beforeLoad() {
                        done();
                    },
                };
                const knub = createKnub({
                    guildPlugins: [PluginToLoad],
                    options: {
                        getEnabledGuildPlugins() {
                            return ["plugin-to-load"];
                        },
                        logFn: utils_1.noop,
                    },
                });
                await (0, testUtils_1.initializeKnub)(knub);
                const guild = (0, testUtils_1.createMockGuild)(knub.client);
                knub.client.ws.emit("GUILD_CREATE", guild);
            });
        });
        (0, mocha_1.it)("GlobalPlugin beforeLoad()", (mochaDone) => {
            (0, testUtils_1.withKnub)(mochaDone, async (createKnub, done) => {
                const PluginToLoad = {
                    name: "plugin-to-load",
                    configParser: () => ({}),
                    beforeLoad() {
                        done();
                    },
                };
                const knub = createKnub({
                    globalPlugins: [PluginToLoad],
                    options: {
                        logFn: utils_1.noop,
                    },
                });
                await (0, testUtils_1.initializeKnub)(knub);
            });
        });
        (0, mocha_1.it)("GuildPlugin beforeStart()", (mochaDone) => {
            (0, testUtils_1.withKnub)(mochaDone, async (createKnub, done) => {
                const PluginToLoad = {
                    name: "plugin-to-load",
                    configParser: () => ({}),
                    beforeStart() {
                        done();
                    },
                };
                const knub = createKnub({
                    guildPlugins: [PluginToLoad],
                    options: {
                        getEnabledGuildPlugins() {
                            return ["plugin-to-load"];
                        },
                        logFn: utils_1.noop,
                    },
                });
                await (0, testUtils_1.initializeKnub)(knub);
                const guild = (0, testUtils_1.createMockGuild)(knub.client);
                knub.client.ws.emit("GUILD_CREATE", guild);
            });
        });
        (0, mocha_1.it)("GlobalPlugin beforeStart()", (mochaDone) => {
            (0, testUtils_1.withKnub)(mochaDone, async (createKnub, done) => {
                const PluginToLoad = {
                    name: "plugin-to-load",
                    configParser: () => ({}),
                    beforeStart() {
                        done();
                    },
                };
                const knub = createKnub({
                    globalPlugins: [PluginToLoad],
                    options: {
                        logFn: utils_1.noop,
                    },
                });
                await (0, testUtils_1.initializeKnub)(knub);
            });
        });
        (0, mocha_1.it)("GuildPlugin afterLoad()", (mochaDone) => {
            (0, testUtils_1.withKnub)(mochaDone, async (createKnub, done) => {
                const PluginToLoad = {
                    name: "plugin-to-load",
                    configParser: () => ({}),
                    afterLoad() {
                        done();
                    },
                };
                const knub = createKnub({
                    guildPlugins: [PluginToLoad],
                    options: {
                        getEnabledGuildPlugins() {
                            return ["plugin-to-load"];
                        },
                        logFn: utils_1.noop,
                    },
                });
                await (0, testUtils_1.initializeKnub)(knub);
                const guild = (0, testUtils_1.createMockGuild)(knub.client);
                knub.client.ws.emit("GUILD_CREATE", guild);
            });
        });
        (0, mocha_1.it)("GlobalPlugin afterLoad()", (mochaDone) => {
            (0, testUtils_1.withKnub)(mochaDone, async (createKnub, done) => {
                const PluginToLoad = {
                    name: "plugin-to-load",
                    configParser: () => ({}),
                    afterLoad() {
                        done();
                    },
                };
                const knub = createKnub({
                    globalPlugins: [PluginToLoad],
                    options: {
                        logFn: utils_1.noop,
                    },
                });
                await (0, testUtils_1.initializeKnub)(knub);
            });
        });
        (0, mocha_1.it)("GuildPlugin beforeUnload()", (mochaDone) => {
            (0, testUtils_1.withKnub)(mochaDone, async (createKnub, done) => {
                const beforeUnloadCalled = false;
                const PluginToUnload = {
                    name: "plugin-to-unload",
                    configParser: () => ({}),
                    afterLoad() {
                        knub.client.emit("guildUnavailable", guild);
                    },
                    beforeUnload() {
                        done();
                    },
                };
                const knub = createKnub({
                    guildPlugins: [PluginToUnload],
                    options: {
                        getEnabledGuildPlugins() {
                            return ["plugin-to-unload"];
                        },
                        logFn: utils_1.noop,
                    },
                });
                await (0, testUtils_1.initializeKnub)(knub);
                const guild = (0, testUtils_1.createMockGuild)(knub.client);
                knub.client.ws.emit("GUILD_CREATE", guild);
            });
        });
        (0, mocha_1.it)("GlobalPlugin beforeUnload()", (mochaDone) => {
            (0, testUtils_1.withKnub)(mochaDone, async (createKnub, done) => {
                const PluginToLoad = {
                    name: "plugin-to-load",
                    configParser: () => ({}),
                    beforeUnload() {
                        done();
                    },
                };
                const knub = createKnub({
                    globalPlugins: [PluginToLoad],
                    options: {
                        logFn: utils_1.noop,
                    },
                });
                await (0, testUtils_1.initializeKnub)(knub);
                void knub.destroy();
            });
        });
        (0, mocha_1.it)("GuildPlugin afterUnload()", (mochaDone) => {
            (0, testUtils_1.withKnub)(mochaDone, async (createKnub, done) => {
                const PluginToUnload = {
                    name: "plugin-to-unload",
                    configParser: () => ({}),
                    afterLoad() {
                        knub.client.emit("guildUnavailable", guild);
                    },
                    afterUnload() {
                        done();
                    },
                };
                const knub = createKnub({
                    guildPlugins: [PluginToUnload],
                    options: {
                        getEnabledGuildPlugins() {
                            return ["plugin-to-unload"];
                        },
                        logFn: utils_1.noop,
                    },
                });
                await (0, testUtils_1.initializeKnub)(knub);
                const guild = (0, testUtils_1.createMockGuild)(knub.client);
                knub.client.ws.emit("GUILD_CREATE", guild);
            });
        });
        (0, mocha_1.it)("GlobalPlugin afterUnload()", (mochaDone) => {
            (0, testUtils_1.withKnub)(mochaDone, async (createKnub, done) => {
                const PluginToLoad = {
                    name: "plugin-to-load",
                    configParser: () => ({}),
                    afterUnload() {
                        done();
                    },
                };
                const knub = createKnub({
                    globalPlugins: [PluginToLoad],
                    options: {
                        logFn: utils_1.noop,
                    },
                });
                await (0, testUtils_1.initializeKnub)(knub);
                void knub.destroy();
            });
        });
        (0, mocha_1.it)("GuildPlugin afterLoad() runs after beforeLoad()", (mochaDone) => {
            (0, testUtils_1.withKnub)(mochaDone, async (createKnub, done) => {
                let beforeLoadCalled = false;
                const PluginToLoad = {
                    name: "plugin-to-load",
                    configParser: () => ({}),
                    beforeLoad() {
                        beforeLoadCalled = true;
                    },
                    afterLoad() {
                        chai_1.assert.strictEqual(beforeLoadCalled, true);
                        done();
                    },
                };
                const knub = createKnub({
                    guildPlugins: [PluginToLoad],
                    options: {
                        getEnabledGuildPlugins() {
                            return ["plugin-to-load"];
                        },
                        logFn: utils_1.noop,
                    },
                });
                await (0, testUtils_1.initializeKnub)(knub);
                const guild = (0, testUtils_1.createMockGuild)(knub.client);
                knub.client.ws.emit("GUILD_CREATE", guild);
            });
        });
        (0, mocha_1.it)("GlobalPlugin afterLoad() runs after beforeLoad()", (mochaDone) => {
            (0, testUtils_1.withKnub)(mochaDone, async (createKnub, done) => {
                let beforeLoadCalled = false;
                const PluginToLoad = {
                    name: "plugin-to-load",
                    configParser: () => ({}),
                    beforeLoad() {
                        beforeLoadCalled = true;
                    },
                    afterLoad() {
                        chai_1.assert.strictEqual(beforeLoadCalled, true);
                        done();
                    },
                };
                const knub = createKnub({
                    globalPlugins: [PluginToLoad],
                    options: {
                        logFn: utils_1.noop,
                    },
                });
                await (0, testUtils_1.initializeKnub)(knub);
            });
        });
        (0, mocha_1.it)("GuildPlugin beforeUnload() runs before afterUnload()", (mochaDone) => {
            (0, testUtils_1.withKnub)(mochaDone, async (createKnub, done) => {
                let beforeUnloadCalled = false;
                const PluginToUnload = {
                    name: "plugin-to-unload",
                    configParser: () => ({}),
                    afterLoad() {
                        knub.client.emit("guildUnavailable", guild);
                    },
                    beforeUnload() {
                        beforeUnloadCalled = true;
                    },
                    afterUnload() {
                        chai_1.assert.strictEqual(beforeUnloadCalled, true);
                        done();
                    },
                };
                const knub = createKnub({
                    guildPlugins: [PluginToUnload],
                    options: {
                        getEnabledGuildPlugins() {
                            return ["plugin-to-unload"];
                        },
                        logFn: utils_1.noop,
                    },
                });
                await (0, testUtils_1.initializeKnub)(knub);
                const guild = (0, testUtils_1.createMockGuild)(knub.client);
                knub.client.ws.emit("GUILD_CREATE", guild);
            });
        });
        (0, mocha_1.it)("GlobalPlugin beforeUnload() runs before afterUnload()", (mochaDone) => {
            (0, testUtils_1.withKnub)(mochaDone, async (createKnub, done) => {
                let beforeUnloadCalled = false;
                const PluginToUnload = {
                    name: "plugin-to-unload",
                    configParser: () => ({}),
                    beforeUnload() {
                        beforeUnloadCalled = true;
                    },
                    afterUnload() {
                        chai_1.assert.strictEqual(beforeUnloadCalled, true);
                        done();
                    },
                };
                const knub = createKnub({
                    globalPlugins: [PluginToUnload],
                    options: {
                        logFn: utils_1.noop,
                    },
                });
                await (0, testUtils_1.initializeKnub)(knub);
                void knub.destroy();
            });
        });
        (0, mocha_1.it)("hasPlugin() and getPlugin() are unavailable in GuildPlugin beforeLoad()", (mochaDone) => {
            (0, testUtils_1.withKnub)(mochaDone, async (createKnub, done) => {
                const PluginToLoad = {
                    name: "plugin-to-load",
                    configParser: () => ({}),
                    beforeLoad(pluginData) {
                        chai_1.assert.throws(() => pluginData.hasPlugin({}));
                        chai_1.assert.throws(() => pluginData.getPlugin({}));
                        done();
                    },
                };
                const knub = createKnub({
                    guildPlugins: [PluginToLoad],
                    options: {
                        getEnabledGuildPlugins() {
                            return ["plugin-to-load"];
                        },
                        logFn: utils_1.noop,
                    },
                });
                await (0, testUtils_1.initializeKnub)(knub);
                const guild = (0, testUtils_1.createMockGuild)(knub.client);
                knub.client.ws.emit("GUILD_CREATE", guild);
            });
        });
        (0, mocha_1.it)("hasPlugin() and getPlugin() are unavailable in GlobalPlugin beforeLoad()", (mochaDone) => {
            (0, testUtils_1.withKnub)(mochaDone, async (createKnub, done) => {
                const PluginToLoad = {
                    name: "plugin-to-load",
                    configParser: () => ({}),
                    beforeLoad(pluginData) {
                        chai_1.assert.throws(() => pluginData.hasPlugin({}));
                        chai_1.assert.throws(() => pluginData.getPlugin({}));
                        done();
                    },
                };
                const knub = createKnub({
                    globalPlugins: [PluginToLoad],
                    options: {
                        logFn: utils_1.noop,
                    },
                });
                await (0, testUtils_1.initializeKnub)(knub);
            });
        });
        (0, mocha_1.it)("hasPlugin() and getPlugin() are unavailable in GuildPlugin afterUnload()", (mochaDone) => {
            (0, testUtils_1.withKnub)(mochaDone, async (createKnub, done) => {
                const PluginToUnload = {
                    name: "plugin-to-unload",
                    configParser: () => ({}),
                    afterLoad() {
                        knub.client.emit("guildUnavailable", guild);
                    },
                    afterUnload(pluginData) {
                        chai_1.assert.throws(() => pluginData.hasPlugin({}));
                        chai_1.assert.throws(() => pluginData.getPlugin({}));
                        done();
                    },
                };
                const knub = createKnub({
                    guildPlugins: [PluginToUnload],
                    options: {
                        getEnabledGuildPlugins() {
                            return ["plugin-to-unload"];
                        },
                        logFn: utils_1.noop,
                    },
                });
                await (0, testUtils_1.initializeKnub)(knub);
                const guild = (0, testUtils_1.createMockGuild)(knub.client);
                knub.client.ws.emit("GUILD_CREATE", guild);
            });
        });
        (0, mocha_1.it)("hasPlugin() and getPlugin() are unavailable in GlobalPlugin afterUnload()", (mochaDone) => {
            (0, testUtils_1.withKnub)(mochaDone, async (createKnub, done) => {
                const PluginToLoad = {
                    name: "plugin-to-load",
                    configParser: () => ({}),
                    afterUnload(pluginData) {
                        chai_1.assert.throws(() => pluginData.hasPlugin({}));
                        chai_1.assert.throws(() => pluginData.getPlugin({}));
                        done();
                    },
                };
                const knub = createKnub({
                    globalPlugins: [PluginToLoad],
                    options: {
                        logFn: utils_1.noop,
                    },
                });
                await (0, testUtils_1.initializeKnub)(knub);
                void knub.destroy();
            });
        });
        (0, mocha_1.it)("GuildPlugin is unavailable to other plugins during afterUnload()", (mochaDone) => {
            (0, testUtils_1.withKnub)(mochaDone, async (createKnub, done) => {
                const PluginWithPublicInterface = (0, PluginBlueprint_1.guildPlugin)()({
                    name: "plugin-with-public-interface",
                    configParser: () => ({}),
                    public() {
                        return {};
                    },
                });
                const PluginWithTests = {
                    name: "plugin-with-tests",
                    configParser: () => ({}),
                    dependencies: () => [PluginWithPublicInterface],
                    afterLoad() {
                        knub.client.emit("guildUnavailable", guild);
                    },
                    afterUnload(pluginData) {
                        chai_1.assert.throws(() => pluginData.getPlugin(PluginWithPublicInterface));
                        done();
                    },
                };
                const knub = createKnub({
                    guildPlugins: [PluginWithPublicInterface, PluginWithTests],
                    options: {
                        getEnabledGuildPlugins() {
                            return ["plugin-with-tests"];
                        },
                        logFn: utils_1.noop,
                    },
                });
                await (0, testUtils_1.initializeKnub)(knub);
                const guild = (0, testUtils_1.createMockGuild)(knub.client);
                knub.client.ws.emit("GUILD_CREATE", guild);
            });
        });
        (0, mocha_1.it)("GlobalPlugin is unavailable to other plugins during afterUnload()", (mochaDone) => {
            (0, testUtils_1.withKnub)(mochaDone, async (createKnub, done) => {
                const PluginWithPublicInterface = (0, PluginBlueprint_1.globalPlugin)()({
                    name: "plugin-with-public-interface",
                    configParser: () => ({}),
                    public() {
                        return {};
                    },
                });
                const PluginWithTests = {
                    name: "plugin-with-tests",
                    configParser: () => ({}),
                    dependencies: () => [PluginWithPublicInterface],
                    afterLoad() {
                        void knub.destroy();
                    },
                    afterUnload(pluginData) {
                        chai_1.assert.throws(() => pluginData.getPlugin(PluginWithPublicInterface));
                        done();
                    },
                };
                const knub = createKnub({
                    globalPlugins: [PluginWithPublicInterface, PluginWithTests],
                    options: {
                        logFn: utils_1.noop,
                    },
                });
                await (0, testUtils_1.initializeKnub)(knub);
            });
        });
        (0, mocha_1.it)("GuildPlugin hook order", (mochaDone) => {
            (0, testUtils_1.withKnub)(mochaDone, async (createKnub, done) => {
                let lastCalledHook = null;
                const PluginToLoad = {
                    name: "plugin-to-load",
                    configParser: () => ({}),
                    beforeLoad() {
                        chai_1.assert.strictEqual(lastCalledHook, null);
                        lastCalledHook = "beforeLoad";
                    },
                    beforeStart() {
                        chai_1.assert.strictEqual(lastCalledHook, "beforeLoad");
                        lastCalledHook = "beforeStart";
                    },
                    afterLoad() {
                        chai_1.assert.strictEqual(lastCalledHook, "beforeStart");
                        lastCalledHook = "afterLoad";
                        knub.client.emit("guildUnavailable", guild);
                    },
                    beforeUnload() {
                        chai_1.assert.strictEqual(lastCalledHook, "afterLoad");
                        lastCalledHook = "beforeUnload";
                    },
                    afterUnload() {
                        chai_1.assert.strictEqual(lastCalledHook, "beforeUnload");
                        done();
                    },
                };
                const knub = createKnub({
                    guildPlugins: [PluginToLoad],
                    options: {
                        getEnabledGuildPlugins() {
                            return ["plugin-to-load"];
                        },
                        logFn: utils_1.noop,
                    },
                });
                await (0, testUtils_1.initializeKnub)(knub);
                const guild = (0, testUtils_1.createMockGuild)(knub.client);
                knub.client.ws.emit("GUILD_CREATE", guild);
            });
        });
        (0, mocha_1.it)("GlobalPlugin hook order", (mochaDone) => {
            (0, testUtils_1.withKnub)(mochaDone, async (createKnub, done) => {
                let lastCalledHook = null;
                const PluginToLoad = {
                    name: "plugin-to-load",
                    configParser: () => ({}),
                    beforeLoad() {
                        chai_1.assert.strictEqual(lastCalledHook, null);
                        lastCalledHook = "beforeLoad";
                    },
                    beforeStart() {
                        chai_1.assert.strictEqual(lastCalledHook, "beforeLoad");
                        lastCalledHook = "beforeStart";
                    },
                    afterLoad() {
                        chai_1.assert.strictEqual(lastCalledHook, "beforeStart");
                        lastCalledHook = "afterLoad";
                        void knub.destroy();
                    },
                    beforeUnload() {
                        chai_1.assert.strictEqual(lastCalledHook, "afterLoad");
                        lastCalledHook = "beforeUnload";
                    },
                    afterUnload() {
                        chai_1.assert.strictEqual(lastCalledHook, "beforeUnload");
                        done();
                    },
                };
                const knub = createKnub({
                    globalPlugins: [PluginToLoad],
                    options: {
                        logFn: utils_1.noop,
                    },
                });
                await (0, testUtils_1.initializeKnub)(knub);
            });
        });
    });
    (0, mocha_1.describe)("Dependencies", () => {
        (0, mocha_1.it)("hasPlugin", (mochaDone) => {
            (0, testUtils_1.withKnub)(mochaDone, async (createKnub, done) => {
                const DependencyToLoad = (0, PluginBlueprint_1.guildPlugin)({
                    name: "dependency-to-load",
                    configParser: () => ({}),
                });
                const SomeOtherPlugin = (0, PluginBlueprint_1.guildPlugin)({
                    name: "some-other-plugin",
                    configParser: () => ({}),
                });
                const PluginToLoad = (0, PluginBlueprint_1.guildPlugin)({
                    name: "plugin-to-load",
                    dependencies: () => [DependencyToLoad],
                    configParser: () => ({}),
                    afterLoad(pluginData) {
                        chai_1.assert.ok(pluginData.hasPlugin(DependencyToLoad));
                        chai_1.assert.ok(!pluginData.hasPlugin(SomeOtherPlugin));
                        done();
                    },
                });
                const knub = createKnub({
                    guildPlugins: [DependencyToLoad, PluginToLoad],
                    options: {
                        getEnabledGuildPlugins() {
                            return ["dependency-to-load", "plugin-to-load"];
                        },
                        logFn: utils_1.noop,
                    },
                });
                await (0, testUtils_1.initializeKnub)(knub);
                const guild = (0, testUtils_1.createMockGuild)(knub.client);
                knub.client.ws.emit("GUILD_CREATE", guild);
            });
        });
        (0, mocha_1.it)("getPlugin", (mochaDone) => {
            (0, testUtils_1.withKnub)(mochaDone, async (createKnub, done) => {
                const DependencyToLoad = (0, PluginBlueprint_1.guildPlugin)()({
                    name: "dependency-to-load",
                    configParser: () => ({}),
                    public(pluginData) {
                        return {
                            ok() {
                                chai_1.assert.strictEqual(pluginData.state.value, 10);
                                done();
                            },
                        };
                    },
                    beforeLoad(pluginData) {
                        pluginData.state.value = 10;
                    },
                });
                const PluginToLoad = (0, PluginBlueprint_1.guildPlugin)({
                    name: "plugin-to-load",
                    configParser: () => ({}),
                    afterLoad(pluginData) {
                        const instance = pluginData.getPlugin(DependencyToLoad);
                        instance.ok();
                    },
                });
                const knub = createKnub({
                    guildPlugins: [DependencyToLoad, PluginToLoad],
                    options: {
                        getEnabledGuildPlugins() {
                            return ["dependency-to-load", "plugin-to-load"];
                        },
                        logFn: utils_1.noop,
                    },
                });
                await (0, testUtils_1.initializeKnub)(knub);
                const guild = (0, testUtils_1.createMockGuild)(knub.client);
                knub.client.ws.emit("GUILD_CREATE", guild);
            });
        });
        (0, mocha_1.it)("hasGlobalPlugin", (mochaDone) => {
            (0, testUtils_1.withKnub)(mochaDone, async (createKnub, done) => {
                const SomeGlobalPlugin = (0, PluginBlueprint_1.globalPlugin)({
                    name: "some-global-plugin",
                    configParser: () => ({}),
                    public() {
                        return {
                            works: () => true,
                        };
                    },
                });
                const SomeGuildPlugin = (0, PluginBlueprint_1.guildPlugin)({
                    name: "some-guild-plugin",
                    configParser: () => ({}),
                    beforeLoad(pluginData) {
                        const hasGlobalPlugin = pluginData.hasGlobalPlugin(SomeGlobalPlugin);
                        chai_1.assert.strictEqual(hasGlobalPlugin, true);
                        done();
                    },
                });
                const knub = createKnub({
                    globalPlugins: [SomeGlobalPlugin],
                    guildPlugins: [SomeGuildPlugin],
                    options: {
                        getEnabledGuildPlugins() {
                            return ["some-guild-plugin"];
                        },
                        logFn: utils_1.noop,
                    },
                });
                await (0, testUtils_1.initializeKnub)(knub);
                const guild = (0, testUtils_1.createMockGuild)(knub.client);
                knub.client.ws.emit("GUILD_CREATE", guild);
            });
        });
        (0, mocha_1.it)("getPlugin", (mochaDone) => {
            (0, testUtils_1.withKnub)(mochaDone, async (createKnub, done) => {
                const SomeGlobalPlugin = (0, PluginBlueprint_1.globalPlugin)({
                    name: "some-global-plugin",
                    configParser: () => ({}),
                    public() {
                        return {
                            works: () => true,
                        };
                    },
                });
                const SomeGuildPlugin = (0, PluginBlueprint_1.guildPlugin)({
                    name: "some-guild-plugin",
                    configParser: () => ({}),
                    beforeLoad(pluginData) {
                        const globalPlugin = pluginData.getGlobalPlugin(SomeGlobalPlugin);
                        chai_1.assert.strictEqual(globalPlugin.works(), true);
                        done();
                    },
                });
                const knub = createKnub({
                    globalPlugins: [SomeGlobalPlugin],
                    guildPlugins: [SomeGuildPlugin],
                    options: {
                        getEnabledGuildPlugins() {
                            return ["some-guild-plugin"];
                        },
                        logFn: utils_1.noop,
                    },
                });
                await (0, testUtils_1.initializeKnub)(knub);
                const guild = (0, testUtils_1.createMockGuild)(knub.client);
                knub.client.ws.emit("GUILD_CREATE", guild);
            });
        });
        (0, mocha_1.it)("getPlugin has correct pluginData", (mochaDone) => {
            (0, testUtils_1.withKnub)(mochaDone, async (createKnub, done) => {
                const DependencyToLoad = (0, PluginBlueprint_1.guildPlugin)({
                    name: "dependency-to-load",
                    configParser: (input) => input,
                    defaultOptions: {
                        config: {
                            some_value: "cookies",
                        },
                    },
                    public(pluginData) {
                        return {
                            ok() {
                                chai_1.assert.ok(pluginData != null);
                                chai_1.assert.strictEqual(pluginData.config.get().some_value, "cookies");
                                chai_1.assert.notStrictEqual(pluginData.config.get().some_value, "milk");
                                done();
                            },
                        };
                    },
                });
                const PluginToLoad = (0, PluginBlueprint_1.guildPlugin)({
                    name: "plugin-to-load",
                    configParser: () => ({}),
                    defaultOptions: {
                        config: {
                            some_value: "milk",
                        },
                    },
                    afterLoad(pluginData) {
                        const instance = pluginData.getPlugin(DependencyToLoad);
                        instance.ok();
                    },
                });
                const knub = createKnub({
                    guildPlugins: [DependencyToLoad, PluginToLoad],
                    options: {
                        getEnabledGuildPlugins() {
                            return ["dependency-to-load", "plugin-to-load"];
                        },
                        logFn: utils_1.noop,
                    },
                });
                await (0, testUtils_1.initializeKnub)(knub);
                const guild = (0, testUtils_1.createMockGuild)(knub.client);
                knub.client.ws.emit("GUILD_CREATE", guild);
            });
        });
        (0, mocha_1.it)("automatic dependency loading", (mochaDone) => {
            (0, testUtils_1.withKnub)(mochaDone, async (createKnub, done) => {
                const DependencyToLoad = (0, PluginBlueprint_1.guildPlugin)({
                    name: "dependency-to-load",
                    configParser: () => ({}),
                });
                const OtherDependencyToLoad = (0, PluginBlueprint_1.guildPlugin)({
                    name: "other-dependency-to-load",
                    configParser: () => ({}),
                });
                const PluginToLoad = (0, PluginBlueprint_1.guildPlugin)({
                    name: "plugin-to-load",
                    configParser: () => ({}),
                    dependencies: () => [DependencyToLoad, OtherDependencyToLoad],
                    afterLoad(pluginData) {
                        chai_1.assert.ok(pluginData.hasPlugin(DependencyToLoad));
                        chai_1.assert.ok(pluginData.hasPlugin(OtherDependencyToLoad));
                        done();
                    },
                });
                const knub = createKnub({
                    guildPlugins: [DependencyToLoad, OtherDependencyToLoad, PluginToLoad],
                    options: {
                        getEnabledGuildPlugins() {
                            return ["plugin-to-load"];
                        },
                        logFn: utils_1.noop,
                    },
                });
                await (0, testUtils_1.initializeKnub)(knub);
                const guild = (0, testUtils_1.createMockGuild)(knub.client);
                knub.client.ws.emit("GUILD_CREATE", guild);
            });
        });
        (0, mocha_1.it)("transitive dependencies", (mochaDone) => {
            (0, testUtils_1.withKnub)(mochaDone, async (createKnub, done) => {
                const DependencyTwo = (0, PluginBlueprint_1.guildPlugin)({
                    name: "dependency-two",
                    configParser: () => ({}),
                });
                const DependencyOne = (0, PluginBlueprint_1.guildPlugin)({
                    name: "dependency-one",
                    configParser: () => ({}),
                    dependencies: () => [DependencyTwo],
                });
                const PluginToLoad = (0, PluginBlueprint_1.guildPlugin)({
                    name: "plugin-to-load",
                    configParser: () => ({}),
                    dependencies: () => [DependencyOne],
                    afterLoad(pluginData) {
                        chai_1.assert.ok(pluginData.hasPlugin(DependencyOne));
                        chai_1.assert.ok(pluginData.hasPlugin(DependencyTwo));
                        done();
                    },
                });
                const knub = createKnub({
                    guildPlugins: [DependencyOne, DependencyTwo, PluginToLoad],
                    options: {
                        getEnabledGuildPlugins() {
                            return ["plugin-to-load"];
                        },
                        logFn: utils_1.noop,
                    },
                });
                await (0, testUtils_1.initializeKnub)(knub);
                const guild = (0, testUtils_1.createMockGuild)(knub.client);
                knub.client.ws.emit("GUILD_CREATE", guild);
            });
        });
        (0, mocha_1.it)("plugins loaded as dependencies do not load commands or events", (mochaDone) => {
            (0, testUtils_1.withKnub)(mochaDone, async (createKnub, done) => {
                const Dependency = (0, PluginBlueprint_1.guildPlugin)({
                    name: "dependency",
                    configParser: () => ({}),
                    messageCommands: [(0, messageCommandBlueprint_1.guildPluginMessageCommand)({ trigger: "foo", permission: null, run: utils_1.noop })],
                    events: [(0, EventListenerBlueprint_1.guildPluginEventListener)({ event: "messageCreate", listener: utils_1.noop })],
                    afterLoad(pluginData) {
                        // The command above should *not* be loaded
                        chai_1.assert.strictEqual(pluginData.messageCommands.getAll().length, 0);
                        // The event listener above should *not* be loaded, and neither should the default message listener
                        chai_1.assert.strictEqual(pluginData.events.getListenerCount(), 0);
                        done();
                    },
                });
                const PluginToLoad = (0, PluginBlueprint_1.guildPlugin)({
                    name: "plugin-to-load",
                    configParser: () => ({}),
                    dependencies: () => [Dependency],
                });
                const knub = createKnub({
                    guildPlugins: [Dependency, PluginToLoad],
                    options: {
                        getEnabledGuildPlugins() {
                            return ["plugin-to-load"];
                        },
                        logFn: utils_1.noop,
                    },
                });
                await (0, testUtils_1.initializeKnub)(knub);
                const guild = (0, testUtils_1.createMockGuild)(knub.client);
                knub.client.ws.emit("GUILD_CREATE", guild);
            });
        });
    });
    (0, mocha_1.describe)("Custom overrides", () => {
        (0, mocha_1.it)("Synchronous custom overrides", (mochaDone) => {
            (0, testUtils_1.withKnub)(mochaDone, async (createKnub, done) => {
                let commandTriggers = 0;
                const TestPlugin = (0, PluginBlueprint_1.guildPlugin)()({
                    name: "test-plugin",
                    configParser: () => ({}),
                    defaultOptions: {
                        config: {
                            can_do: false,
                        },
                    },
                    customOverrideCriteriaFunctions: {
                        myUserOverride: (pluginData, matchParams, value) => matchParams.userId === value,
                    },
                    messageCommands: [
                        (0, messageCommandBlueprint_1.guildPluginMessageCommand)({
                            trigger: "foo",
                            permission: "can_do",
                            run() {
                                commandTriggers++;
                            },
                        }),
                    ],
                    async afterLoad() {
                        const channel = (0, testUtils_1.createMockTextChannel)(knub.client, guild.id);
                        const message1 = (0, testUtils_1.createMockMessage)(knub.client, channel, user1, { content: "!foo" });
                        knub.client.emit("messageCreate", message1);
                        await (0, testUtils_1.sleep)(30);
                        const message2 = (0, testUtils_1.createMockMessage)(knub.client, channel, user2, { content: "!foo" });
                        knub.client.emit("messageCreate", message2);
                        await (0, testUtils_1.sleep)(30);
                        chai_1.assert.equal(commandTriggers, 1);
                        done();
                    },
                });
                const knub = createKnub({
                    guildPlugins: [TestPlugin],
                    options: {
                        getEnabledGuildPlugins() {
                            return ["test-plugin"];
                        },
                        getConfig() {
                            return {
                                prefix: "!",
                                plugins: {
                                    "test-plugin": {
                                        overrides: [
                                            {
                                                extra: {
                                                    myUserOverride: user1.id,
                                                },
                                                config: {
                                                    can_do: true,
                                                },
                                            },
                                        ],
                                    },
                                },
                            };
                        },
                        logFn: utils_1.noop,
                    },
                });
                const user1 = (0, testUtils_1.createMockUser)(knub.client);
                const user2 = (0, testUtils_1.createMockUser)(knub.client);
                await (0, testUtils_1.initializeKnub)(knub);
                const guild = (0, testUtils_1.createMockGuild)(knub.client);
                knub.client.ws.emit("GUILD_CREATE", guild);
            });
        });
        (0, mocha_1.it)("Asynchronous custom overrides", (mochaDone) => {
            (0, testUtils_1.withKnub)(mochaDone, async (createKnub, done) => {
                let commandTriggers = 0;
                const TestPlugin = (0, PluginBlueprint_1.guildPlugin)()({
                    name: "test-plugin",
                    configParser: () => ({}),
                    defaultOptions: {
                        config: {
                            can_do: false,
                        },
                    },
                    customOverrideCriteriaFunctions: {
                        myAsyncUserOverride: async (pluginData, matchParams, value) => {
                            await (0, testUtils_1.sleep)(5);
                            return matchParams.userId === value;
                        },
                    },
                    messageCommands: [
                        (0, messageCommandBlueprint_1.guildPluginMessageCommand)({
                            trigger: "foo",
                            permission: "can_do",
                            run() {
                                commandTriggers++;
                            },
                        }),
                    ],
                    async afterLoad() {
                        const channel = (0, testUtils_1.createMockTextChannel)(knub.client, guild.id);
                        const message1 = (0, testUtils_1.createMockMessage)(knub.client, channel, user1, { content: "!foo" });
                        knub.client.emit("messageCreate", message1);
                        await (0, testUtils_1.sleep)(30);
                        const message2 = (0, testUtils_1.createMockMessage)(knub.client, channel, user2, { content: "!foo" });
                        knub.client.emit("messageCreate", message2);
                        await (0, testUtils_1.sleep)(30);
                        chai_1.assert.equal(commandTriggers, 1);
                        done();
                    },
                });
                const knub = createKnub({
                    guildPlugins: [TestPlugin],
                    options: {
                        getEnabledGuildPlugins() {
                            return ["test-plugin"];
                        },
                        getConfig() {
                            return {
                                prefix: "!",
                                plugins: {
                                    "test-plugin": {
                                        overrides: [
                                            {
                                                extra: {
                                                    myAsyncUserOverride: user1.id,
                                                },
                                                config: {
                                                    can_do: true,
                                                },
                                            },
                                        ],
                                    },
                                },
                            };
                        },
                        logFn: utils_1.noop,
                    },
                });
                const user1 = (0, testUtils_1.createMockUser)(knub.client);
                const user2 = (0, testUtils_1.createMockUser)(knub.client);
                await (0, testUtils_1.initializeKnub)(knub);
                const guild = (0, testUtils_1.createMockGuild)(knub.client);
                knub.client.ws.emit("GUILD_CREATE", guild);
            });
        });
    });
    (0, mocha_1.describe)("Custom argument types", () => {
        (0, mocha_1.it)("Custom argument types", (mochaDone) => {
            (0, testUtils_1.withKnub)(mochaDone, async (createKnub, done) => {
                const types = {
                    foo: (value, ctx) => {
                        return `${value}-${ctx.pluginData.guild.id}`;
                    },
                };
                const TestPlugin = (0, PluginBlueprint_1.guildPlugin)({
                    name: "test-plugin",
                    configParser: () => ({}),
                    messageCommands: [
                        (0, messageCommandBlueprint_1.guildPluginMessageCommand)({
                            trigger: "foo",
                            permission: null,
                            signature: (0, knub_command_manager_1.parseSignature)("<str:foo>", types, "foo"),
                            run({ args: { str } }) {
                                chai_1.assert.equal(str, `bar-${guild.id}`);
                                done();
                            },
                        }),
                    ],
                    afterLoad() {
                        const channel = (0, testUtils_1.createMockTextChannel)(knub.client, guild.id);
                        const user = (0, testUtils_1.createMockUser)(knub.client);
                        const msg = (0, testUtils_1.createMockMessage)(knub.client, channel, user, { content: "!foo bar" });
                        knub.client.emit("messageCreate", msg);
                    },
                });
                const knub = createKnub({
                    guildPlugins: [TestPlugin],
                    options: {
                        getEnabledGuildPlugins() {
                            return ["test-plugin"];
                        },
                        getConfig() {
                            return {
                                prefix: "!",
                            };
                        },
                        logFn: utils_1.noop,
                    },
                });
                await (0, testUtils_1.initializeKnub)(knub);
                const guild = (0, testUtils_1.createMockGuild)(knub.client);
                knub.client.ws.emit("GUILD_CREATE", guild);
            });
        });
    });
    (0, mocha_1.describe)("Misc", () => {
        (0, mocha_1.it)("pluginData contains everything (guild plugin)", (mochaDone) => {
            (0, testUtils_1.withKnub)(mochaDone, async (createKnub, done) => {
                const TestPlugin = {
                    name: "test-plugin",
                    configParser: () => ({}),
                    afterLoad(pluginData) {
                        chai_1.assert.ok(pluginData.client != null);
                        chai_1.assert.ok(pluginData.cooldowns instanceof index_1.CooldownManager);
                        chai_1.assert.ok(pluginData.messageCommands instanceof PluginMessageCommandManager_1.PluginMessageCommandManager);
                        chai_1.assert.ok(pluginData.slashCommands instanceof PluginSlashCommandManager_1.PluginSlashCommandManager);
                        chai_1.assert.ok(pluginData.contextMenuCommands instanceof PluginContextMenuCommandManager_1.PluginContextMenuCommandManager);
                        chai_1.assert.ok(pluginData.config instanceof PluginConfigManager_1.PluginConfigManager);
                        chai_1.assert.ok(pluginData.events instanceof GuildPluginEventManager_1.GuildPluginEventManager);
                        chai_1.assert.ok(pluginData.locks instanceof index_1.LockManager);
                        done();
                    },
                };
                const knub = createKnub({
                    guildPlugins: [TestPlugin],
                    options: {
                        getEnabledGuildPlugins() {
                            return ["test-plugin"];
                        },
                        logFn: utils_1.noop,
                    },
                });
                await (0, testUtils_1.initializeKnub)(knub);
                const guild = (0, testUtils_1.createMockGuild)(knub.client);
                knub.client.ws.emit("GUILD_CREATE", guild);
            });
        });
        (0, mocha_1.it)("pluginData contains everything (global plugin)", (mochaDone) => {
            (0, testUtils_1.withKnub)(mochaDone, async (createKnub, done) => {
                const TestPlugin = {
                    name: "test-plugin",
                    configParser: () => ({}),
                    afterLoad(pluginData) {
                        chai_1.assert.ok(pluginData.client != null);
                        chai_1.assert.ok(pluginData.cooldowns instanceof index_1.CooldownManager);
                        chai_1.assert.ok(pluginData.messageCommands instanceof PluginMessageCommandManager_1.PluginMessageCommandManager);
                        chai_1.assert.ok(pluginData.slashCommands instanceof PluginSlashCommandManager_1.PluginSlashCommandManager);
                        chai_1.assert.ok(pluginData.contextMenuCommands instanceof PluginContextMenuCommandManager_1.PluginContextMenuCommandManager);
                        chai_1.assert.ok(pluginData.config instanceof PluginConfigManager_1.PluginConfigManager);
                        chai_1.assert.ok(pluginData.events instanceof GlobalPluginEventManager_1.GlobalPluginEventManager);
                        chai_1.assert.ok(pluginData.locks instanceof index_1.LockManager);
                        done();
                    },
                };
                const knub = createKnub({
                    globalPlugins: [TestPlugin],
                    options: {
                        logFn: utils_1.noop,
                    },
                });
                await (0, testUtils_1.initializeKnub)(knub);
            });
        });
        (0, mocha_1.it)("event handlers are unloaded on plugin unload", (mochaDone) => {
            (0, testUtils_1.withKnub)(mochaDone, async (createKnub, done) => {
                let msgEvFnCallNum = 0;
                const messageEv = (0, EventListenerBlueprint_1.guildPluginEventListener)({
                    event: "messageCreate",
                    listener() {
                        msgEvFnCallNum++;
                        knub.client.emit("guildUnavailable", guild);
                        (0, testUtils_1.sleep)(30).then(async () => {
                            const msg2 = (0, testUtils_1.createMockMessage)(knub.client, textChannel, author, { content: "hi!" });
                            knub.client.emit("messageCreate", msg2);
                            await (0, testUtils_1.sleep)(30);
                            chai_1.assert.strictEqual(msgEvFnCallNum, 1);
                            done();
                        });
                    },
                });
                const PluginToUnload = {
                    name: "plugin-to-unload",
                    configParser: () => ({}),
                    events: [messageEv],
                    afterLoad() {
                        const msg = (0, testUtils_1.createMockMessage)(knub.client, textChannel, author, { content: "hi!" });
                        knub.client.emit("messageCreate", msg);
                    },
                };
                const knub = createKnub({
                    guildPlugins: [PluginToUnload],
                    options: {
                        getEnabledGuildPlugins() {
                            return ["plugin-to-unload"];
                        },
                        logFn: utils_1.noop,
                    },
                });
                await (0, testUtils_1.initializeKnub)(knub);
                const guild = (0, testUtils_1.createMockGuild)(knub.client);
                const textChannel = (0, testUtils_1.createMockTextChannel)(knub.client, guild.id);
                const author = (0, testUtils_1.createMockUser)(knub.client);
                knub.client.ws.emit("GUILD_CREATE", guild);
            });
        });
    });
    (0, mocha_1.describe)("plugin() helper", () => {
        (0, mocha_1.it)("(blueprint)", () => {
            const blueprint = (0, PluginBlueprint_1.guildPlugin)({
                name: "my-plugin",
                configParser: () => ({}),
            });
            (0, chai_1.expect)(blueprint.name).to.equal("my-plugin");
        });
        (0, mocha_1.it)("<TPluginType>()(blueprint)", () => {
            const blueprint = (0, PluginBlueprint_1.guildPlugin)()({
                name: "my-plugin",
                configParser: () => ({}),
                beforeLoad(pluginData) {
                    const typeCheck = true;
                },
                afterLoad(pluginData) {
                    const typeCheck = true;
                },
            });
            (0, chai_1.expect)(blueprint.name).to.equal("my-plugin");
        });
    });
    (0, mocha_1.describe)("Public interfaces", () => {
        (0, mocha_1.it)("Public interface type inference works", () => {
            const OtherPlugin = (0, PluginBlueprint_1.guildPlugin)()({
                name: "other-plugin",
                configParser: () => ({}),
                public(pluginData) {
                    return {
                        myFn(param) {
                            const result = true;
                        },
                    };
                },
            });
            const MainPlugin = (0, PluginBlueprint_1.guildPlugin)({
                name: "main-plugin",
                configParser: () => ({}),
                afterLoad(pluginData) {
                    const otherPlugin = pluginData.getPlugin(OtherPlugin);
                    const result = true;
                },
            });
        });
        // Note: public interface *functionality* is already tested by Dependencies#getPlugin above
    });
});
