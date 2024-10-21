"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const knub_command_manager_1 = require("knub-command-manager");
const mocha_1 = require("mocha");
const messageCommandBlueprint_1 = require("./messageCommandBlueprint");
(0, mocha_1.describe)("guildPluginMessageCommand() helper", () => {
    (0, mocha_1.it)("(blueprint)", () => {
        const blueprint = (0, messageCommandBlueprint_1.guildPluginMessageCommand)({
            trigger: "cmd",
            permission: null,
            signature: {
                foo: (0, knub_command_manager_1.string)(),
                bar: (0, knub_command_manager_1.number)(),
            },
            run({ args }) {
                // Test type inference
                const result = true;
            },
        });
        (0, chai_1.expect)(blueprint.trigger).to.equal("cmd");
        (0, chai_1.expect)(blueprint.signature).to.eql({ foo: (0, knub_command_manager_1.string)(), bar: (0, knub_command_manager_1.number)() });
        (0, chai_1.expect)(blueprint.run).to.not.equal(undefined);
    });
    (0, mocha_1.it)("<TPluginType>()(blueprint)", () => {
        const blueprint = (0, messageCommandBlueprint_1.guildPluginMessageCommand)()({
            trigger: "cmd",
            permission: null,
            signature: {
                foo: (0, knub_command_manager_1.string)(),
                bar: (0, knub_command_manager_1.number)(),
            },
            run({ args, pluginData }) {
                // Test type inference
                const result = true;
                const result2 = true;
            },
        });
        (0, chai_1.expect)(blueprint.trigger).to.equal("cmd");
        (0, chai_1.expect)(blueprint.signature).to.eql({ foo: (0, knub_command_manager_1.string)(), bar: (0, knub_command_manager_1.number)() });
        (0, chai_1.expect)(blueprint.run).to.not.equal(undefined);
    });
    (0, mocha_1.it)("command message is a guild message", () => {
        (0, messageCommandBlueprint_1.guildPluginMessageCommand)({
            trigger: "foo",
            permission: null,
            run({ message }) {
                // Make sure message.member cannot be null
                // https://github.com/microsoft/TypeScript/issues/29627#issuecomment-458329399
                const result = true;
                // Make sure message.channel is always a textable guild channel and cannot be a private channel
                const result2 = true;
            },
        });
    });
    (0, mocha_1.it)("args type inference for multiple signatures", () => {
        (0, messageCommandBlueprint_1.guildPluginMessageCommand)({
            trigger: "cmd",
            permission: null,
            signature: [
                {
                    foo: (0, knub_command_manager_1.string)(),
                    bar: (0, knub_command_manager_1.number)(),
                },
                {
                    baz: (0, knub_command_manager_1.number)(),
                },
            ],
            run({ args }) {
                if (args.foo != null) {
                    const x = args.bar; // args.bar cannot be undefined
                    const y = args.baz; // args.baz must be undefined
                }
                if (args.baz != null) {
                    const x = args.baz; // args.baz cannot be undefined
                    const y = args.bar; // args.bar must be undefined
                }
            },
        });
    });
});
(0, mocha_1.describe)("globalPluginMessageCommand() helper", () => {
    (0, mocha_1.it)("(blueprint)", () => {
        const blueprint = (0, messageCommandBlueprint_1.globalPluginMessageCommand)({
            trigger: "cmd",
            permission: null,
            signature: {
                foo: (0, knub_command_manager_1.string)(),
                bar: (0, knub_command_manager_1.number)(),
            },
            run({ args }) {
                // Test type inference
                const result = true;
            },
        });
        (0, chai_1.expect)(blueprint.trigger).to.equal("cmd");
        (0, chai_1.expect)(blueprint.signature).to.eql({ foo: (0, knub_command_manager_1.string)(), bar: (0, knub_command_manager_1.number)() });
        (0, chai_1.expect)(blueprint.run).to.not.equal(undefined);
    });
    (0, mocha_1.it)("<TPluginType>()(blueprint)", () => {
        const blueprint = (0, messageCommandBlueprint_1.globalPluginMessageCommand)()({
            trigger: "cmd",
            permission: null,
            signature: {
                foo: (0, knub_command_manager_1.string)(),
                bar: (0, knub_command_manager_1.number)(),
            },
            run({ args, pluginData }) {
                // Test type inference
                const result = true;
                const result2 = true;
            },
        });
        (0, chai_1.expect)(blueprint.trigger).to.equal("cmd");
        (0, chai_1.expect)(blueprint.signature).to.eql({ foo: (0, knub_command_manager_1.string)(), bar: (0, knub_command_manager_1.number)() });
        (0, chai_1.expect)(blueprint.run).to.not.equal(undefined);
    });
    (0, mocha_1.it)("command message is NOT necessarily a guild message", () => {
        (0, messageCommandBlueprint_1.globalPluginMessageCommand)({
            trigger: "foo",
            permission: null,
            run({ message }) {
                // If the message is not necessarily a guild message, the member can be null
                // https://github.com/microsoft/TypeScript/issues/29627#issuecomment-458329399
                const result = true;
                // If the message is not necessarily a guild message, the channel can be a private channel
                // as well as a guild channel.
                const result2 = true;
            },
        });
    });
});
