"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const mocha_1 = require("mocha");
const PluginBlueprint_1 = require("./plugins/PluginBlueprint");
const testUtils_1 = require("./testUtils");
const utils_1 = require("./utils");
(0, mocha_1.describe)("Knub", () => {
    (0, mocha_1.it)("Multiple GUILD_CREATE events load guild's plugins only once", (mochaDone) => {
        (0, testUtils_1.withKnub)(mochaDone, async (createKnub, done) => {
            let loadedTimes = 0;
            const PluginToLoad = (0, PluginBlueprint_1.guildPlugin)({
                name: "plugin-to-load",
                configParser: () => ({}),
                afterLoad() {
                    loadedTimes++;
                },
                afterUnload() {
                    loadedTimes--;
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
            await (0, testUtils_1.sleep)(10);
            knub.client.ws.emit("GUILD_CREATE", guild);
            await (0, testUtils_1.sleep)(10);
            knub.client.ws.emit("GUILD_CREATE", guild);
            knub.client.ws.emit("GUILD_CREATE", guild);
            knub.client.ws.emit("GUILD_CREATE", guild);
            await (0, testUtils_1.sleep)(10);
            chai_1.assert.strictEqual(loadedTimes, 1);
            done();
        });
    });
    (0, mocha_1.it)("GUILD_CREATE followed by ready event load guild's plugins only once", (mochaDone) => {
        (0, testUtils_1.withKnub)(mochaDone, async (createKnub, done) => {
            let loadedTimes = 0;
            const PluginToLoad = (0, PluginBlueprint_1.guildPlugin)({
                name: "plugin-to-load",
                configParser: () => ({}),
                afterLoad() {
                    loadedTimes++;
                },
                afterUnload() {
                    loadedTimes--;
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
            await (0, testUtils_1.sleep)(30);
            knub.client.emit("ready", knub.client);
            await (0, testUtils_1.sleep)(30);
            (0, chai_1.assert)(loadedTimes === 1);
            done();
        });
    });
    (0, mocha_1.it)("Errors during plugin loading unloads guild", (mochaDone) => {
        (0, testUtils_1.withKnub)(mochaDone, async (createKnub, done) => {
            let loadedTimes = 0;
            const Plugin1 = (0, PluginBlueprint_1.guildPlugin)({
                name: "plugin1",
                configParser: () => ({}),
                beforeLoad() {
                    loadedTimes++;
                },
                beforeUnload() {
                    loadedTimes--;
                },
            });
            const PluginWithError = (0, PluginBlueprint_1.guildPlugin)({
                name: "plugin-with-error",
                configParser: () => ({}),
                beforeStart() {
                    throw new Error("Foo");
                },
            });
            const knub = createKnub({
                guildPlugins: [Plugin1, PluginWithError],
                options: {
                    autoRegisterApplicationCommands: false,
                    getEnabledGuildPlugins() {
                        return ["plugin1", "plugin-with-error"];
                    },
                    logFn: utils_1.noop,
                },
            });
            knub.on("error", () => { });
            const guild = (0, testUtils_1.createMockGuild)(knub.client);
            await (0, testUtils_1.initializeKnub)(knub);
            knub.client.ws.emit("GUILD_CREATE", guild);
            await (0, testUtils_1.sleep)(10);
            knub.client.ws.emit("GUILD_CREATE", guild);
            await (0, testUtils_1.sleep)(10);
            knub.client.ws.emit("GUILD_CREATE", guild);
            knub.client.ws.emit("GUILD_CREATE", guild);
            knub.client.ws.emit("GUILD_CREATE", guild);
            await (0, testUtils_1.sleep)(10);
            (0, chai_1.expect)(knub.getLoadedGuild(guild.id)).to.equal(undefined);
            (0, chai_1.expect)(loadedTimes).to.equal(0);
            done();
        });
    });
    // it("Profiler tracks plugin load times", async () => {
    //   const PluginToLoad = guildPlugin({
    //     name: "plugin-to-load",
    //     configParser: () => ({}),
    //
    //     async beforeLoad() {
    //       await sleep(10);
    //     },
    //   });
    //
    //   const client = createMockClient();
    //   const knub = new Knub(client, {
    //     guildPlugins: [PluginToLoad],
    //     options: {
    //       autoRegisterApplicationCommands: false,
    //       getEnabledGuildPlugins() {
    //         return ["plugin-to-load"];
    //       },
    //       logFn: noop,
    //     },
    //   });
    //
    //   knub.initialize();
    //   client.emit("connect");
    //   client.emit("ready", client);
    //   await sleep(20);
    //
    //   const guild = createMockGuild(client);
    //   client.ws.emit("GUILD_CREATE", guild);
    //   await sleep(20);
    //
    //   expect(Object.keys(knub.profiler.getData())).to.include("load-plugin:plugin-to-load");
    //   expect(knub.profiler.getData()["load-plugin:plugin-to-load"].totalTime).to.be.greaterThanOrEqual(8);
    // });
    //
    // it("Profiler tracks event processing times", async () => {
    //   const PluginToLoad = guildPlugin({
    //     name: "plugin-to-load",
    //     configParser: () => ({}),
    //
    //     events: [
    //       guildPluginEventListener({
    //         event: "messageCreate",
    //         async listener() {
    //           await sleep(10);
    //         },
    //       }),
    //     ],
    //   });
    //
    //   const client = createMockClient();
    //   const knub = new Knub(client, {
    //     guildPlugins: [PluginToLoad],
    //     options: {
    //       autoRegisterApplicationCommands: false,
    //       getEnabledGuildPlugins() {
    //         return ["plugin-to-load"];
    //       },
    //       logFn: noop,
    //     },
    //   });
    //
    //   knub.initialize();
    //   client.emit("connect");
    //   client.emit("ready", client);
    //   await sleep(20);
    //
    //   const guild = createMockGuild(client);
    //   client.ws.emit("GUILD_CREATE", guild);
    //   await sleep(20);
    //
    //   const channel = createMockTextChannel(client, guild.id);
    //   const user = createMockUser(client);
    //   const message = createMockMessage(client, channel, user);
    //   client.emit("messageCreate", message);
    //   await sleep(20);
    //
    //   expect(Object.keys(knub.profiler.getData())).to.include("event:messageCreate:plugin-to-load");
    //   expect(knub.profiler.getData()["event:messageCreate:plugin-to-load"].totalTime).to.be.greaterThanOrEqual(8);
    // });
    //
    // it("Profiler tracks message command processing times", async () => {
    //   const PluginToLoad = guildPlugin({
    //     name: "plugin-to-load",
    //     configParser: () => ({}),
    //
    //     messageCommands: [
    //       guildPluginMessageCommand({
    //         trigger: "foo",
    //         permission: null,
    //         async run() {
    //           await sleep(10);
    //         },
    //       }),
    //     ],
    //   });
    //
    //   const client = createMockClient();
    //   const knub = new Knub(client, {
    //     guildPlugins: [PluginToLoad],
    //     options: {
    //       autoRegisterApplicationCommands: false,
    //       getEnabledGuildPlugins() {
    //         return ["plugin-to-load"];
    //       },
    //       getConfig() {
    //         return {
    //           prefix: "!",
    //         };
    //       },
    //       logFn: noop,
    //     },
    //   });
    //
    //   knub.initialize();
    //   client.emit("connect");
    //   client.emit("ready", client);
    //   await sleep(20);
    //
    //   const guild = createMockGuild(client);
    //   client.ws.emit("GUILD_CREATE", guild);
    //   await sleep(20);
    //
    //   const channel = createMockTextChannel(client, guild.id);
    //   const user = createMockUser(client);
    //   const message = createMockMessage(client, channel, user, { content: "!foo" });
    //   client.emit("messageCreate", message);
    //   await sleep(20);
    //
    //   expect(Object.keys(knub.profiler.getData())).to.include("command:foo");
    //   expect(knub.profiler.getData()["command:foo"].totalTime).to.be.greaterThanOrEqual(8);
    // });
    (0, mocha_1.it)("concurrentGuildLoadLimit", (mochaDone) => {
        (0, testUtils_1.withKnub)(mochaDone, async (createKnub, done) => {
            const concurrentGuildLoadLimit = 10;
            const loadTimeMs = 40;
            let loadedTimes = 0;
            const PluginToLoad = (0, PluginBlueprint_1.guildPlugin)({
                name: "plugin-to-load",
                configParser: () => ({}),
                async beforeLoad() {
                    await (0, testUtils_1.sleep)(loadTimeMs);
                },
                afterLoad() {
                    loadedTimes++;
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
                    concurrentGuildLoadLimit,
                },
            });
            await (0, testUtils_1.initializeKnub)(knub);
            for (let i = 0; i < concurrentGuildLoadLimit * 2; i++) {
                const guild = (0, testUtils_1.createMockGuild)(knub.client);
                knub.client.ws.emit("GUILD_CREATE", guild);
            }
            await (0, testUtils_1.sleep)(loadTimeMs + 5);
            chai_1.assert.equal(loadedTimes, concurrentGuildLoadLimit);
            await (0, testUtils_1.sleep)(loadTimeMs + 5);
            chai_1.assert.equal(loadedTimes, concurrentGuildLoadLimit * 2);
            done();
        });
    });
});
