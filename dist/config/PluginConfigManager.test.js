"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const mocha_1 = require("mocha");
const zod_1 = require("zod");
const testUtils_1 = require("../testUtils");
const PluginConfigManager_1 = require("./PluginConfigManager");
(0, mocha_1.describe)("PluginConfigManager", () => {
    (0, mocha_1.it)("merge user config with default config", async () => {
        const configManager = new PluginConfigManager_1.PluginConfigManager({
            config: {
                can_do: false,
                nested: {
                    one: 10,
                    two: 20,
                },
            },
        }, {
            config: {
                can_do: true,
                nested: {
                    two: 30,
                },
            },
        }, {
            levels: {},
            parser: (input) => input,
        });
        await configManager.init();
        (0, chai_1.expect)(configManager.get().can_do).to.equal(true);
        (0, chai_1.expect)(configManager.get().nested.one).to.equal(10);
        (0, chai_1.expect)(configManager.get().nested.two).to.equal(30);
    });
    (0, mocha_1.it)("merge user overrides with default overrides", async () => {
        const configManager = new PluginConfigManager_1.PluginConfigManager({
            config: {
                can_do: false,
            },
            overrides: [
                {
                    level: ">=50",
                    config: {
                        can_do: true,
                    },
                },
            ],
        }, {
            overrides: [
                {
                    level: ">=20",
                    config: {
                        can_do: true,
                    },
                },
                {
                    level: ">=40",
                    config: {
                        can_do: false,
                    },
                },
            ],
        }, {
            levels: {},
            parser: (input) => input,
        });
        await configManager.init();
        (0, chai_1.expect)(configManager.get().can_do).to.equal(false);
        (0, chai_1.expect)((await configManager.getMatchingConfig({ level: 20 })).can_do).to.equal(true);
        (0, chai_1.expect)((await configManager.getMatchingConfig({ level: 40 })).can_do).to.equal(false);
        (0, chai_1.expect)((await configManager.getMatchingConfig({ level: 50 })).can_do).to.equal(false);
    });
    (0, mocha_1.it)("replace default overrides", async () => {
        const configManager = new PluginConfigManager_1.PluginConfigManager({
            config: {
                can_do: false,
            },
            overrides: [
                {
                    level: ">=50",
                    config: {
                        can_do: true,
                    },
                },
            ],
        }, {
            replaceDefaultOverrides: true,
            overrides: [
                {
                    level: ">=100",
                    config: {
                        can_do: true,
                    },
                },
            ],
        }, {
            levels: {},
            parser: (input) => input,
        });
        await configManager.init();
        (0, chai_1.expect)(configManager.get().can_do).to.equal(false);
        (0, chai_1.expect)((await configManager.getMatchingConfig({ level: 50 })).can_do).to.equal(false);
        (0, chai_1.expect)((await configManager.getMatchingConfig({ level: 100 })).can_do).to.equal(true);
    });
    (0, mocha_1.it)("Config parser", async () => {
        const configSchema = zod_1.z.strictObject({
            something: zod_1.z.number(),
        });
        const configManager = new PluginConfigManager_1.PluginConfigManager({
            config: {
                something: 0,
            },
        }, {
            config: {
                something: "not a number",
            },
        }, {
            levels: {},
            parser: (input) => configSchema.parse(input),
        });
        try {
            await configManager.init();
        }
        catch (err) {
            return;
        }
        chai_1.assert.fail("Config parser did not throw an error");
    });
    (0, mocha_1.it)("Config parser mutations", async () => {
        const configManager = new PluginConfigManager_1.PluginConfigManager({
            config: {
                something: 0,
            },
        }, {
            config: {
                someThing: 5,
            },
        }, {
            levels: {},
            parser: () => {
                return {
                    something: 7,
                };
            },
        });
        await configManager.init();
        (0, chai_1.expect)(configManager.get().something).to.equal(7);
    });
    (0, mocha_1.it)("Async config parser", async () => {
        const configManager = new PluginConfigManager_1.PluginConfigManager({
            config: {
                something: 0,
            },
        }, {
            config: {
                someThing: 5,
            },
        }, {
            levels: {},
            parser: async () => {
                await (0, testUtils_1.sleep)(1);
                return {
                    something: 7,
                };
            },
        });
        await configManager.init();
        (0, chai_1.expect)(configManager.get().something).to.equal(7);
    });
    (0, mocha_1.it)("getMatchingConfig(): user", async () => {
        const client = (0, testUtils_1.createMockClient)();
        const guild = (0, testUtils_1.createMockGuild)(client);
        const user = (0, testUtils_1.createMockUser)(client);
        const member = (0, testUtils_1.createMockMember)(guild, user);
        const channel = (0, testUtils_1.createMockTextChannel)(client, guild.id);
        const message = (0, testUtils_1.createMockMessage)(client, channel, user);
        const configManager = new PluginConfigManager_1.PluginConfigManager({
            config: {
                works: false,
            },
            overrides: [
                {
                    user: user.id,
                    config: {
                        works: true,
                    },
                },
            ],
        }, {}, {
            levels: {},
            parser: (input) => input,
        });
        configManager.setPluginData({ context: "guild", guild });
        await configManager.init();
        (0, chai_1.expect)(configManager.get().works).to.equal(false);
        (0, chai_1.expect)((await configManager.getMatchingConfig({ userId: user.id })).works).to.equal(true);
        (0, chai_1.expect)((await configManager.getMatchingConfig({ member })).works).to.equal(true);
        (0, chai_1.expect)((await configManager.getMatchingConfig({ message })).works).to.equal(true);
    });
    (0, mocha_1.it)("getMatchingConfig(): channel", async () => {
        const client = (0, testUtils_1.createMockClient)();
        const guild = (0, testUtils_1.createMockGuild)(client);
        const user = (0, testUtils_1.createMockUser)(client);
        const channel = (0, testUtils_1.createMockTextChannel)(client, guild.id);
        const message = (0, testUtils_1.createMockMessage)(client, channel, user);
        const configManager = new PluginConfigManager_1.PluginConfigManager({
            config: {
                works: false,
            },
            overrides: [
                {
                    channel: channel.id,
                    config: {
                        works: true,
                    },
                },
            ],
        }, {}, {
            levels: {},
            parser: (input) => input,
        });
        await configManager.init();
        (0, chai_1.expect)(configManager.get().works).to.equal(false);
        (0, chai_1.expect)((await configManager.getMatchingConfig({ channelId: channel.id })).works).to.equal(true);
        (0, chai_1.expect)((await configManager.getMatchingConfig({ message })).works).to.equal(true);
    });
    (0, mocha_1.it)("getMatchingConfig(): channel of thread message", async () => {
        const client = (0, testUtils_1.createMockClient)();
        const guild = (0, testUtils_1.createMockGuild)(client);
        const user = (0, testUtils_1.createMockUser)(client);
        const channel = (0, testUtils_1.createMockTextChannel)(client, guild.id);
        const thread = (0, testUtils_1.createMockThread)(channel);
        const message = (0, testUtils_1.createMockMessage)(client, thread, user);
        const configManager = new PluginConfigManager_1.PluginConfigManager({
            config: {
                works: false,
            },
            overrides: [
                {
                    channel: channel.id,
                    config: {
                        works: true,
                    },
                },
            ],
        }, {}, {
            levels: {},
            parser: (input) => input,
        });
        await configManager.init();
        (0, chai_1.expect)(configManager.get().works).to.equal(false);
        (0, chai_1.expect)((await configManager.getMatchingConfig({ message })).works).to.equal(true);
    });
    (0, mocha_1.it)("getMatchingConfig(): category", async () => {
        const categoryId = "12345";
        const client = (0, testUtils_1.createMockClient)();
        const guild = (0, testUtils_1.createMockGuild)(client);
        const user = (0, testUtils_1.createMockUser)(client);
        const channel = (0, testUtils_1.createMockTextChannel)(client, guild.id, { parent_id: categoryId });
        const message = (0, testUtils_1.createMockMessage)(client, channel, user);
        const configManager = new PluginConfigManager_1.PluginConfigManager({
            config: {
                works: false,
            },
            overrides: [
                {
                    category: categoryId,
                    config: {
                        works: true,
                    },
                },
            ],
        }, {}, {
            levels: {},
            parser: (input) => input,
        });
        await configManager.init();
        (0, chai_1.expect)(configManager.get().works).to.equal(false);
        (0, chai_1.expect)((await configManager.getMatchingConfig({ categoryId })).works).to.equal(true);
        (0, chai_1.expect)((await configManager.getMatchingConfig({ message })).works).to.equal(true);
    });
    (0, mocha_1.it)("getMatchingConfig(): category of thread message", async () => {
        const categoryId = "12345";
        const client = (0, testUtils_1.createMockClient)();
        const guild = (0, testUtils_1.createMockGuild)(client);
        const user = (0, testUtils_1.createMockUser)(client);
        const channel = (0, testUtils_1.createMockTextChannel)(client, guild.id, { parent_id: categoryId });
        const thread = (0, testUtils_1.createMockThread)(channel);
        const message = (0, testUtils_1.createMockMessage)(client, thread, user);
        const configManager = new PluginConfigManager_1.PluginConfigManager({
            config: {
                works: false,
            },
            overrides: [
                {
                    category: categoryId,
                    config: {
                        works: true,
                    },
                },
            ],
        }, {}, {
            levels: {},
            parser: (input) => input,
        });
        await configManager.init();
        (0, chai_1.expect)(configManager.get().works).to.equal(false);
        (0, chai_1.expect)((await configManager.getMatchingConfig({ message })).works).to.equal(true);
    });
    (0, mocha_1.it)("getMatchingConfig(): thread", async () => {
        const client = (0, testUtils_1.createMockClient)();
        const guild = (0, testUtils_1.createMockGuild)(client);
        const user = (0, testUtils_1.createMockUser)(client);
        const channel = (0, testUtils_1.createMockTextChannel)(client, guild.id);
        const thread = (0, testUtils_1.createMockThread)(channel);
        const message = (0, testUtils_1.createMockMessage)(client, thread, user);
        const configManager = new PluginConfigManager_1.PluginConfigManager({
            config: {
                works: false,
            },
            overrides: [
                {
                    thread: thread.id,
                    config: {
                        works: true,
                    },
                },
            ],
        }, {}, {
            levels: {},
            parser: (input) => input,
        });
        await configManager.init();
        (0, chai_1.expect)(configManager.get().works).to.equal(false);
        (0, chai_1.expect)((await configManager.getMatchingConfig({ message })).works).to.equal(true);
    });
    (0, mocha_1.it)("getMatchingConfig(): is_thread", async () => {
        const client = (0, testUtils_1.createMockClient)();
        const guild = (0, testUtils_1.createMockGuild)(client);
        const user = (0, testUtils_1.createMockUser)(client);
        const channel = (0, testUtils_1.createMockTextChannel)(client, guild.id);
        const thread = (0, testUtils_1.createMockThread)(channel);
        const message = (0, testUtils_1.createMockMessage)(client, thread, user);
        const configManager = new PluginConfigManager_1.PluginConfigManager({
            config: {
                works: false,
            },
            overrides: [
                {
                    is_thread: true,
                    config: {
                        works: true,
                    },
                },
            ],
        }, {}, {
            levels: {},
            parser: (input) => input,
        });
        await configManager.init();
        (0, chai_1.expect)(configManager.get().works).to.equal(false);
        (0, chai_1.expect)((await configManager.getMatchingConfig({ message })).works).to.equal(true);
    });
    (0, mocha_1.it)("getMatchingConfig(): roles", async () => {
        const client = (0, testUtils_1.createMockClient)();
        const guild = (0, testUtils_1.createMockGuild)(client);
        const user = (0, testUtils_1.createMockUser)(client);
        const role = (0, testUtils_1.createMockRole)(guild);
        const member = (0, testUtils_1.createMockMember)(guild, user, { roles: [role.id] });
        const channel = (0, testUtils_1.createMockTextChannel)(client, guild.id);
        const message = (0, testUtils_1.createMockMessage)(client, channel, user);
        const configManager = new PluginConfigManager_1.PluginConfigManager({
            config: {
                works: false,
            },
            overrides: [
                {
                    role: role.id,
                    config: {
                        works: true,
                    },
                },
            ],
        }, {}, {
            levels: {},
            parser: (input) => input,
        });
        configManager.setPluginData({ context: "guild", guild });
        await configManager.init();
        (0, chai_1.expect)(configManager.get().works).to.equal(false);
        (0, chai_1.expect)((await configManager.getMatchingConfig({ memberRoles: [role.id] })).works).to.equal(true);
        (0, chai_1.expect)((await configManager.getMatchingConfig({ member })).works).to.equal(true);
        (0, chai_1.expect)((await configManager.getMatchingConfig({ message })).works).to.equal(true);
    });
});
