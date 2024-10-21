"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const mocha_1 = require("mocha");
const testUtils_1 = require("../testUtils");
const configUtils_1 = require("./configUtils");
(0, mocha_1.describe)("configUtils", () => {
    (0, mocha_1.describe)("mergeConfig", () => {
        const base = {
            foo: 1,
            bar: {
                baz: 2,
                qux: 3,
            },
            simpleArr: [1, 2],
            addArr: [1, 2],
            subArr: [1, 2],
        };
        const override = {
            foo: 2,
            bar: {
                baz: 5,
                quux: 10,
            },
            simpleArr: ["a", "b"],
            "+addArr": [3],
            "-subArr": [1],
        };
        const result = (0, configUtils_1.mergeConfig)(base, override);
        (0, mocha_1.it)("should overwrite scalar values", () => {
            (0, chai_1.expect)(result.foo).to.equal(2);
        });
        (0, mocha_1.it)("should overwrite nested scalar values", () => {
            (0, chai_1.expect)(result.bar.baz).to.equal(5);
        });
        (0, mocha_1.it)("should merge objects instead of overwriting them", () => {
            (0, chai_1.expect)(result.bar.qux).to.equal(3);
            (0, chai_1.expect)(result.bar.quux).to.equal(10);
        });
        (0, mocha_1.it)("should overwrite arrays", () => {
            (0, chai_1.expect)(result.simpleArr).to.eql(["a", "b"]);
        });
        (0, mocha_1.it)("should not support adding to arrays anymore", () => {
            (0, chai_1.expect)(result.addArr).to.eql([1, 2]);
        });
        (0, mocha_1.it)("should not support removing from arrays anymore", () => {
            (0, chai_1.expect)(result.addArr).to.eql([1, 2]);
        });
    });
    (0, mocha_1.describe)("getMatchingPluginConfig", () => {
        const sharedPluginOptions = {
            config: {
                value: 5,
                hasAccess: false,
            },
            overrides: [
                {
                    level: ">=20",
                    config: {
                        hasAccess: true,
                    },
                },
                {
                    level: [">=30", "<40"],
                    config: {
                        hasAccess: false,
                    },
                },
                {
                    level: [],
                    config: {
                        value: 50,
                    },
                },
                {
                    channel: ["1100", "1200"],
                    config: {
                        value: 10,
                    },
                },
                {
                    user: "2100",
                    config: {
                        value: 15,
                    },
                },
                {
                    role: ["3100", "3200"],
                    config: {
                        value: 20,
                    },
                },
                {
                    channel: "1100",
                    role: "3100",
                    config: {
                        value: 25,
                    },
                },
                {
                    category: ["9100", "9200"],
                    config: {
                        value: 120,
                    },
                },
            ],
        };
        (0, mocha_1.it)("should use defaults with empty match params", async () => {
            const matchedConfig = await (0, configUtils_1.getMatchingPluginConfig)(null, sharedPluginOptions, {});
            (0, chai_1.expect)(matchedConfig.value).to.equal(5);
            (0, chai_1.expect)(matchedConfig.hasAccess).to.equal(false);
        });
        (0, mocha_1.it)("should match levels", async () => {
            const matchedConfig = await (0, configUtils_1.getMatchingPluginConfig)(null, sharedPluginOptions, {
                level: 60,
            });
            (0, chai_1.expect)(matchedConfig.hasAccess).to.equal(true);
        });
        (0, mocha_1.it)("should require all level conditions to apply", async () => {
            const matchedConfig = await (0, configUtils_1.getMatchingPluginConfig)(null, sharedPluginOptions, {
                level: 35,
            });
            (0, chai_1.expect)(matchedConfig.hasAccess).to.equal(false);
        });
        (0, mocha_1.it)("should match channels and accept any specified channel", async () => {
            const matchedConfig1 = await (0, configUtils_1.getMatchingPluginConfig)(null, sharedPluginOptions, {
                channelId: "1100",
            });
            const matchedConfig2 = await (0, configUtils_1.getMatchingPluginConfig)(null, sharedPluginOptions, {
                channelId: "1200",
            });
            (0, chai_1.expect)(matchedConfig1.value).to.equal(10);
            (0, chai_1.expect)(matchedConfig2.value).to.equal(10);
        });
        (0, mocha_1.it)("should match categories and accept any specified category", async () => {
            const matchedConfig1 = await (0, configUtils_1.getMatchingPluginConfig)(null, sharedPluginOptions, {
                categoryId: "9100",
            });
            const matchedConfig2 = await (0, configUtils_1.getMatchingPluginConfig)(null, sharedPluginOptions, {
                categoryId: "9200",
            });
            (0, chai_1.expect)(matchedConfig1.value).to.equal(120);
            (0, chai_1.expect)(matchedConfig2.value).to.equal(120);
        });
        (0, mocha_1.it)("should match users", async () => {
            const matchedConfig = await (0, configUtils_1.getMatchingPluginConfig)(null, sharedPluginOptions, {
                userId: "2100",
            });
            (0, chai_1.expect)(matchedConfig.value).to.equal(15);
        });
        (0, mocha_1.it)("should match roles", async () => {
            const matchedConfig1 = await (0, configUtils_1.getMatchingPluginConfig)(null, sharedPluginOptions, {
                memberRoles: ["3100"],
            });
            const matchedConfig2 = await (0, configUtils_1.getMatchingPluginConfig)(null, sharedPluginOptions, {
                memberRoles: ["3100", "3200"],
            });
            (0, chai_1.expect)(matchedConfig1.value).to.equal(5); // has 3100 but no 3200 -> no match
            (0, chai_1.expect)(matchedConfig2.value).to.equal(20); // has 3100 and 3200 -> match
        });
        (0, mocha_1.it)("custom override criteria", async () => {
            const customPluginOptions = {
                config: {
                    value: 5,
                },
                overrides: [
                    {
                        extra: {
                            bestPlant: "ficus",
                        },
                        config: {
                            value: 10,
                        },
                    },
                    {
                        extra: {
                            bestPlant: "daisy",
                        },
                        config: {
                            value: 20,
                        },
                    },
                    {
                        extra: {
                            bestPlant: "rose",
                            worstPlant: "pine",
                        },
                        config: {
                            value: 30,
                        },
                    },
                ],
            };
            const first = (arr) => (arr ? arr[0] : undefined);
            const last = (arr) => (arr?.length ? arr[arr.length - 1] : undefined);
            const customOverrideCriteriaFunctions = {
                bestPlant: (pluginData, matchParams, value) => first(matchParams.extra?.plantsInPreferenceOrder) === value,
                worstPlant: (pluginData, matchParams, value) => last(matchParams.extra?.plantsInPreferenceOrder) === value,
            };
            const matchedConfig1 = await (0, configUtils_1.getMatchingPluginConfig)(null, customPluginOptions, {
                extra: {
                    plantsInPreferenceOrder: ["ficus", "daisy", "rose", "pine"],
                },
            }, customOverrideCriteriaFunctions);
            const matchedConfig2 = await (0, configUtils_1.getMatchingPluginConfig)(null, customPluginOptions, {
                extra: {
                    plantsInPreferenceOrder: ["daisy", "ficus", "rose", "pine"],
                },
            }, customOverrideCriteriaFunctions);
            const matchedConfig3 = await (0, configUtils_1.getMatchingPluginConfig)(null, customPluginOptions, {
                extra: {
                    plantsInPreferenceOrder: ["pine", "daisy", "rose", "ficus"],
                },
            }, customOverrideCriteriaFunctions);
            const matchedConfig4 = await (0, configUtils_1.getMatchingPluginConfig)(null, customPluginOptions, {
                extra: {
                    plantsInPreferenceOrder: ["rose", "daisy", "ficus", "pine"],
                },
            }, customOverrideCriteriaFunctions);
            (0, chai_1.expect)(matchedConfig1.value).to.equal(10);
            (0, chai_1.expect)(matchedConfig2.value).to.equal(20);
            (0, chai_1.expect)(matchedConfig3.value).to.equal(5);
            (0, chai_1.expect)(matchedConfig4.value).to.equal(30);
        });
        (0, mocha_1.it)("custom async override criteria", async () => {
            const customPluginOptions = {
                config: {
                    value: 5,
                },
                overrides: [
                    {
                        extra: {
                            bestPlant: "ficus",
                        },
                        config: {
                            value: 10,
                        },
                    },
                ],
            };
            const first = (arr) => (arr ? arr[0] : undefined);
            const customOverrideCriteriaFunctions = {
                bestPlant: async (pluginData, matchParams, value) => {
                    await (0, testUtils_1.sleep)(50);
                    return first(matchParams.extra?.plantsInPreferenceOrder) === value;
                },
            };
            const matchedConfig1 = await (0, configUtils_1.getMatchingPluginConfig)(null, customPluginOptions, {
                extra: {
                    plantsInPreferenceOrder: ["ficus", "daisy", "rose", "pine"],
                },
            }, customOverrideCriteriaFunctions);
            const matchedConfig2 = await (0, configUtils_1.getMatchingPluginConfig)(null, customPluginOptions, {
                extra: {
                    plantsInPreferenceOrder: ["daisy", "ficus", "rose", "pine"],
                },
            }, customOverrideCriteriaFunctions);
            (0, chai_1.expect)(matchedConfig1.value).to.equal(10); // Matched
            (0, chai_1.expect)(matchedConfig2.value).to.equal(5); // No match
        });
        (0, mocha_1.it)("false when no conditions are present", async () => {
            const pluginOpts = {
                config: {
                    value: 5,
                },
                overrides: [
                    {
                        config: {
                            value: 20,
                        },
                    },
                ],
            };
            const matchedConfig = await (0, configUtils_1.getMatchingPluginConfig)(null, pluginOpts, {});
            (0, chai_1.expect)(matchedConfig.value).to.equal(5);
        });
        (0, mocha_1.it)("false when an empty 'all' condition is present", async () => {
            const pluginOpts = {
                config: {
                    value: 5,
                },
                overrides: [
                    {
                        user: "500",
                        all: [],
                        config: {
                            value: 20,
                        },
                    },
                ],
            };
            const matchedConfig = await (0, configUtils_1.getMatchingPluginConfig)(null, pluginOpts, {
                userId: "500",
            });
            (0, chai_1.expect)(matchedConfig.value).to.equal(5);
        });
        (0, mocha_1.it)("false when an empty 'any' condition is present", async () => {
            const pluginOpts = {
                config: {
                    value: 5,
                },
                overrides: [
                    {
                        user: "500",
                        any: [],
                        config: {
                            value: 20,
                        },
                    },
                ],
            };
            const matchedConfig = await (0, configUtils_1.getMatchingPluginConfig)(null, pluginOpts, {
                userId: "500",
            });
            (0, chai_1.expect)(matchedConfig.value).to.equal(5);
        });
        (0, mocha_1.it)("errors when an unknown condition is present", async () => {
            const pluginOpts = {
                config: {
                    value: 5,
                },
                overrides: [
                    {
                        user: "500",
                        unknown: "foo",
                        config: {
                            value: 20,
                        },
                    },
                ],
            };
            try {
                await (0, configUtils_1.getMatchingPluginConfig)(null, pluginOpts, {
                    userId: "500",
                });
                chai_1.expect.fail("No error was thrown");
            }
            catch { }
        });
        (0, mocha_1.it)("'all' special criterion", async () => {
            const pluginOpts = {
                config: {
                    value: 5,
                },
                overrides: [
                    {
                        user: "1000",
                        all: [
                            {
                                level: ">=50",
                            },
                            {
                                level: "<100",
                            },
                        ],
                        config: {
                            value: 10,
                        },
                    },
                ],
            };
            const matchedConfig1 = await (0, configUtils_1.getMatchingPluginConfig)(null, pluginOpts, {
                userId: "1000",
                level: 75,
            });
            const matchedConfig2 = await (0, configUtils_1.getMatchingPluginConfig)(null, pluginOpts, {
                userId: "1000",
                level: 120,
            });
            const matchedConfig3 = await (0, configUtils_1.getMatchingPluginConfig)(null, pluginOpts, {
                userId: "1000",
                level: 25,
            });
            (0, chai_1.expect)(matchedConfig1.value).to.equal(10);
            (0, chai_1.expect)(matchedConfig2.value).to.equal(5);
            (0, chai_1.expect)(matchedConfig3.value).to.equal(5);
        });
        (0, mocha_1.it)("'any' special criterion", async () => {
            const pluginOpts = {
                config: {
                    value: 5,
                },
                overrides: [
                    {
                        any: [
                            {
                                level: "<25",
                            },
                            {
                                level: ">75",
                            },
                        ],
                        config: {
                            value: 10,
                        },
                    },
                ],
            };
            const matchedConfig1 = await (0, configUtils_1.getMatchingPluginConfig)(null, pluginOpts, {
                level: 15,
            });
            const matchedConfig2 = await (0, configUtils_1.getMatchingPluginConfig)(null, pluginOpts, {
                level: 95,
            });
            const matchedConfig3 = await (0, configUtils_1.getMatchingPluginConfig)(null, pluginOpts, {
                level: 50,
            });
            (0, chai_1.expect)(matchedConfig1.value).to.equal(10);
            (0, chai_1.expect)(matchedConfig2.value).to.equal(10);
            (0, chai_1.expect)(matchedConfig3.value).to.equal(5);
        });
        (0, mocha_1.it)("'not' special criterion", async () => {
            const pluginOpts1 = {
                config: {
                    value: 5,
                },
                overrides: [
                    // Matches as long as the user isn't 1234
                    {
                        not: {
                            user: "1234",
                        },
                        config: {
                            value: 10,
                        },
                    },
                ],
            };
            const pluginOpts2 = {
                config: {
                    value: 5,
                },
                overrides: [
                    // Matches if your level is greater than or equal to 50, as long as the user isn't 1234
                    {
                        all: [
                            {
                                level: ">=50",
                            },
                            {
                                not: {
                                    user: "1234",
                                },
                            },
                        ],
                        config: {
                            value: 20,
                        },
                    },
                ],
            };
            const pluginOpts3 = {
                config: {
                    value: 5,
                },
                overrides: [
                    // Matches if your level is greater than or equal to 50 (via negation)
                    {
                        not: {
                            level: "<50",
                        },
                        config: {
                            value: 30,
                        },
                    },
                ],
            };
            const matchedConfig1 = await (0, configUtils_1.getMatchingPluginConfig)(null, pluginOpts1, {
                userId: "1234",
            });
            const matchedConfig2 = await (0, configUtils_1.getMatchingPluginConfig)(null, pluginOpts1, {
                userId: "5678",
            });
            (0, chai_1.expect)(matchedConfig1.value).to.equal(5);
            (0, chai_1.expect)(matchedConfig2.value).to.equal(10);
            const matchedConfig3 = await (0, configUtils_1.getMatchingPluginConfig)(null, pluginOpts2, {
                level: 95,
                userId: "1234",
            });
            const matchedConfig4 = await (0, configUtils_1.getMatchingPluginConfig)(null, pluginOpts2, {
                level: 95,
                userId: "5678",
            });
            (0, chai_1.expect)(matchedConfig3.value).to.equal(5);
            (0, chai_1.expect)(matchedConfig4.value).to.equal(20);
            const matchedConfig5 = await (0, configUtils_1.getMatchingPluginConfig)(null, pluginOpts3, {
                level: 49,
            });
            const matchedConfig6 = await (0, configUtils_1.getMatchingPluginConfig)(null, pluginOpts3, {
                level: 50,
            });
            const matchedConfig7 = await (0, configUtils_1.getMatchingPluginConfig)(null, pluginOpts3, {
                level: 51,
            });
            (0, chai_1.expect)(matchedConfig5.value).to.equal(5);
            (0, chai_1.expect)(matchedConfig6.value).to.equal(30);
            (0, chai_1.expect)(matchedConfig7.value).to.equal(30);
        });
        (0, mocha_1.it)("level matching against 0 works", async () => {
            const pluginOpts = {
                config: {
                    value: 5,
                },
                overrides: [
                    {
                        level: "<=30",
                        config: {
                            value: 20,
                        },
                    },
                ],
            };
            const matchedConfig = await (0, configUtils_1.getMatchingPluginConfig)(null, pluginOpts, { level: 0 });
            (0, chai_1.expect)(matchedConfig.value).to.equal(20);
        });
        (0, mocha_1.it)("complex nested overrides work", async () => {
            // EITHER:
            // - Channel is 123, roles include 456, roles do NOT include 789
            // OR:
            // - Channel is 111, role is 222
            const pluginOpts = {
                config: {
                    value: 5,
                },
                overrides: [
                    {
                        any: [
                            {
                                all: [
                                    {
                                        channel: "123",
                                        role: "456",
                                    },
                                    {
                                        not: {
                                            role: "789",
                                        },
                                    },
                                ],
                            },
                            {
                                channel: "111",
                                role: "222",
                            },
                        ],
                        config: {
                            value: 20,
                        },
                    },
                ],
            };
            const matchedConfig1 = await (0, configUtils_1.getMatchingPluginConfig)(null, pluginOpts, {});
            (0, chai_1.expect)(matchedConfig1.value).to.equal(5);
            // Excluded role "789" included, fail
            const matchedConfig2 = await (0, configUtils_1.getMatchingPluginConfig)(null, pluginOpts, {
                channelId: "123",
                memberRoles: ["456", "789"],
            });
            (0, chai_1.expect)(matchedConfig2.value).to.equal(5);
            // Excluded role "789" not included, pass
            const matchedConfig3 = await (0, configUtils_1.getMatchingPluginConfig)(null, pluginOpts, {
                channelId: "123",
                memberRoles: ["456"],
            });
            (0, chai_1.expect)(matchedConfig3.value).to.equal(20);
            // Required role "456" not included, fail
            const matchedConfig4 = await (0, configUtils_1.getMatchingPluginConfig)(null, pluginOpts, {
                channelId: "123",
                memberRoles: [],
            });
            (0, chai_1.expect)(matchedConfig4.value).to.equal(5);
            // Alternative condition, pass
            const matchedConfig5 = await (0, configUtils_1.getMatchingPluginConfig)(null, pluginOpts, {
                channelId: "111",
                memberRoles: ["222"],
            });
            (0, chai_1.expect)(matchedConfig5.value).to.equal(20);
            // Alternative condition with excluded role of first condition, pass
            const matchedConfig6 = await (0, configUtils_1.getMatchingPluginConfig)(null, pluginOpts, {
                channelId: "111",
                memberRoles: ["222", "789"],
            });
            (0, chai_1.expect)(matchedConfig6.value).to.equal(20);
        });
    });
});
