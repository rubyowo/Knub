"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerApplicationCommands = void 0;
const discord_js_1 = require("discord.js");
const utils_1 = require("../utils");
async function registerApplicationCommands(client, commands) {
    const pendingAPIData = commands.map((cmd) => applicationCommandToAPIData(cmd));
    const pendingAPIDataByName = (0, utils_1.indexBy)(pendingAPIData, "name");
    const existingAPIData = (await client.rest.get(discord_js_1.Routes.applicationCommands(client.application.id), {
        query: new URLSearchParams({ with_localizations: "true" }),
    }));
    const existingAPIDataByName = (0, utils_1.indexBy)(existingAPIData, "name");
    const diff = compareAPIData(pendingAPIDataByName, existingAPIDataByName);
    for (const dataToCreate of diff.create) {
        await client.rest.post(discord_js_1.Routes.applicationCommands(client.application.id), { body: dataToCreate });
    }
    for (const dataToUpdate of diff.update) {
        // Updating a command is the same operation as creating one, but we're keeping them separate here for semantic purposes
        await client.rest.post(discord_js_1.Routes.applicationCommands(client.application.id), { body: dataToUpdate });
    }
    for (const dataToDelete of diff.delete) {
        await client.rest.delete(discord_js_1.Routes.applicationCommand(client.application.id, dataToDelete.id));
    }
    return {
        create: diff.create.length,
        update: diff.update.length,
        delete: diff.delete.length,
    };
}
exports.registerApplicationCommands = registerApplicationCommands;
function compareAPIData(pendingAPIDataByName, existingAPIDataByName) {
    const diff = {
        create: [],
        update: [],
        delete: [],
    };
    for (const pendingName of pendingAPIDataByName.keys()) {
        if (!existingAPIDataByName.has(pendingName)) {
            diff.create.push(pendingAPIDataByName.get(pendingName));
            continue;
        }
        if (hasPendingDataChanged(pendingAPIDataByName.get(pendingName), existingAPIDataByName.get(pendingName))) {
            diff.update.push(pendingAPIDataByName.get(pendingName));
        }
    }
    for (const existingName of existingAPIDataByName.keys()) {
        if (!pendingAPIDataByName.has(existingName)) {
            diff.delete.push(existingAPIDataByName.get(existingName));
        }
    }
    return diff;
}
function hasPendingDataChanged(pendingData, existingData) {
    if (pendingData == null && existingData == null) {
        return false;
    }
    if (typeof pendingData !== typeof existingData) {
        return true;
    }
    if (typeof pendingData !== "object") {
        if (pendingData !== existingData) {
        }
        return pendingData !== existingData;
    }
    if (Array.isArray(pendingData)) {
        if (!Array.isArray(existingData)) {
            return true;
        }
        if (pendingData.length !== existingData.length) {
            return true;
        }
        for (const [i, pendingItem] of pendingData.entries()) {
            const existingItem = existingData[i];
            if (hasPendingDataChanged(pendingItem, existingItem)) {
                return true;
            }
        }
        return false;
    }
    // We only care about changed keys in pendingData
    // Extra keys in existingData are fine
    for (const key of Object.keys(pendingData)) {
        // Exception: An empty options list is not returned by the API
        if (key === "options" &&
            Array.isArray(pendingData[key]) &&
            pendingData[key].length === 0 &&
            existingData[key] == null) {
            continue;
        }
        if (hasPendingDataChanged(pendingData[key], existingData[key])) {
            return true;
        }
    }
    if ("default_member_permissions" in existingData && !("default_member_permissions" in pendingData)) {
        return true;
    }
    return false;
}
function applicationCommandToAPIData(input) {
    if (input.type === "slash-group") {
        return slashGroupToAPIData(input);
    }
    if (input.type === "slash") {
        return slashCommandToAPIData(input);
    }
    if (input.type === "message-context-menu") {
        return messageContextMenuCommandToAPIData(input);
    }
    if (input.type === "user-context-menu") {
        return userContextMenuCommandToAPIData(input);
    }
    throw new Error(`Unknown command type: ${input.type}`);
}
function slashGroupToAPIData(blueprint, depth = 1) {
    if (depth >= 3) {
        throw new Error("Subcommands can only be nested in one subcommand group");
    }
    if ("defaultMemberPermissions" in blueprint && depth > 1) {
        throw new Error("Only top-level slash groups and commands can have defaultMemberPermissions");
    }
    return {
        type: discord_js_1.ApplicationCommandType.ChatInput,
        name: blueprint.name,
        name_localizations: blueprint.nameLocalizations,
        description: blueprint.description,
        description_localizations: blueprint.descriptionLocalizations,
        ...(depth === 1
            ? {
                // Only included on the top level, not in a nested subcommand group
                default_member_permissions: blueprint.defaultMemberPermissions ?? "0",
                dm_permission: Boolean(blueprint.allowDms),
            }
            : {}),
        options: blueprint.subcommands.map((subCommand) => {
            if (subCommand.type === "slash-group") {
                return {
                    ...slashGroupToAPIData(subCommand, depth + 1),
                    type: discord_js_1.ApplicationCommandOptionType.SubcommandGroup,
                };
            }
            return {
                ...slashCommandToAPIData(subCommand, depth + 1),
                type: discord_js_1.ApplicationCommandOptionType.Subcommand,
            };
        }),
    };
}
function slashCommandToAPIData(blueprint, depth = 1) {
    if ("defaultMemberPermissions" in blueprint && depth > 1) {
        throw new Error("Only top-level slash groups and commands can have defaultMemberPermissions");
    }
    return {
        name: blueprint.name,
        name_localizations: blueprint.nameLocalizations,
        description: blueprint.description,
        description_localizations: blueprint.descriptionLocalizations,
        ...(depth === 1
            ? {
                // Only included on the top level, not in subcommands
                default_member_permissions: blueprint.defaultMemberPermissions ?? "0",
                dm_permission: Boolean(blueprint.allowDms),
            }
            : {}),
        options: blueprint.signature.map((option) => optionToAPIData(option)),
    };
}
function optionToAPIData(option) {
    return {
        name: option.name,
        name_localizations: option.nameLocalizations,
        description: option.description,
        description_localizations: option.descriptionLocalizations,
        required: option.required,
        type: option.type,
        ...option.getExtraAPIProps(),
    };
}
function messageContextMenuCommandToAPIData(blueprint) {
    return {
        type: discord_js_1.ApplicationCommandType.Message,
        name: blueprint.name,
        name_localizations: blueprint.nameLocalizations,
        description_localizations: blueprint.descriptionLocalizations,
        default_member_permissions: blueprint.defaultMemberPermissions ?? "0",
        dm_permission: Boolean(blueprint.allowDms),
    };
}
function userContextMenuCommandToAPIData(blueprint) {
    return {
        type: discord_js_1.ApplicationCommandType.User,
        name: blueprint.name,
        name_localizations: blueprint.nameLocalizations,
        description_localizations: blueprint.descriptionLocalizations,
        default_member_permissions: blueprint.defaultMemberPermissions ?? "0",
        dm_permission: Boolean(blueprint.allowDms),
    };
}
