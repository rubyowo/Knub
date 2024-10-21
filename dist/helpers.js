"use strict";
/**
 * @file Public helper functions/types
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserId = exports.getRoleId = exports.getChannelId = exports.snowflakeRegex = exports.roleMentionRegex = exports.channelMentionRegex = exports.userMentionRegex = exports.getMemberLevel = exports.hasPermission = exports.getInviteLink = exports.disableCodeBlocks = exports.deactivateMentions = exports.disableLinkPreviews = exports.waitForReply = exports.createChunkedMessage = exports.splitMessageIntoChunks = exports.splitIntoCleanChunks = void 0;
const pluginUtils_1 = require("./plugins/pluginUtils");
const utils_1 = require("./utils");
/**
 * Splits a string into chunks, preferring to split at newlines if possible
 */
function splitIntoCleanChunks(str, maxChunkLength = 2000) {
    if (str.length < maxChunkLength) {
        return [str];
    }
    const chunks = [];
    while (str.length) {
        if (str.length <= maxChunkLength) {
            chunks.push(str);
            break;
        }
        const slice = str.slice(0, maxChunkLength);
        const lastLineBreakIndex = slice.lastIndexOf("\n");
        if (lastLineBreakIndex === -1) {
            chunks.push(str.slice(0, maxChunkLength));
            str = str.slice(maxChunkLength);
        }
        else {
            chunks.push(str.slice(0, lastLineBreakIndex));
            str = str.slice(lastLineBreakIndex + 1);
        }
    }
    return chunks;
}
exports.splitIntoCleanChunks = splitIntoCleanChunks;
/**
 * Splits a message into chunks that fit into Discord's message length limit (2000) while also retaining leading and
 * trailing line breaks, open code blocks, etc. between chunks
 */
function splitMessageIntoChunks(str, chunkLength = 1990) {
    // We don't split at exactly 2000 since some of the stuff below adds extra length to the chunks
    const chunks = splitIntoCleanChunks(str, chunkLength);
    let openCodeBlock = false;
    return chunks.map((chunk) => {
        // If the chunk starts with a newline, add an invisible unicode char so Discord doesn't strip it away
        if (chunk[0] === "\n")
            chunk = `\u200b${chunk}`;
        // If the chunk ends with a newline, add an invisible unicode char so Discord doesn't strip it away
        if (chunk[chunk.length - 1] === "\n")
            chunk = `${chunk}\u200b`;
        // If the previous chunk had an open code block, open it here again
        if (openCodeBlock) {
            openCodeBlock = false;
            if (chunk.startsWith("```")) {
                // Edge case: Chunk starts with a code block delimiter after the last one ended with an open code block.
                // This can happen if we split immediately before a code block ends.
                // Fix: Just strip the code block delimiter away from here, we don't need it anymore
                chunk = chunk.slice(3);
            }
            else {
                chunk = `\`\`\`${chunk}`;
            }
        }
        // If the chunk has an open code block, close it and open it again in the next chunk
        const codeBlockDelimiters = chunk.match(/```/g);
        if (codeBlockDelimiters && codeBlockDelimiters.length % 2 !== 0) {
            chunk += "```";
            openCodeBlock = true;
        }
        return chunk;
    });
}
exports.splitMessageIntoChunks = splitMessageIntoChunks;
/**
 * Sends a message to the specified channel, splitting it into multiple shorter messages if the message text goes over
 * the Discord message length limit (2000)
 */
async function createChunkedMessage(channel, messageText) {
    const chunks = splitMessageIntoChunks(messageText);
    const messages = [];
    for (const chunk of chunks) {
        messages.push(await channel.send(chunk));
    }
    return messages;
}
exports.createChunkedMessage = createChunkedMessage;
/**
 * Returns a promise that resolves when the specified channel gets a new message, optionally restricted to a message by
 * a specific user only
 */
function waitForReply(client, channel, restrictToUserId, timeout = 15000) {
    return new Promise((resolve) => {
        const timeoutTimer = setTimeout(() => {
            resolve(null);
        }, timeout);
        client.on("messageCreate", (msg) => {
            if (!msg.channel || msg.channel.id !== channel.id)
                return;
            if (msg.author && msg.author.id === client.user.id)
                return;
            if (restrictToUserId && (!msg.author || msg.author.id !== restrictToUserId))
                return;
            clearTimeout(timeoutTimer);
            resolve(msg);
        });
    });
}
exports.waitForReply = waitForReply;
/**
 * Disables link previews in the string by wrapping detected links in < and >
 */
function disableLinkPreviews(str) {
    return str.replace(/(?<!<)(https?:\/\/\S+)/gi, "<$1>");
}
exports.disableLinkPreviews = disableLinkPreviews;
/**
 * Deactivates user/role mentions in the string by adding an invisible unicode char after each @-character
 */
function deactivateMentions(str) {
    return str.replace(/@/g, "@\u200b");
}
exports.deactivateMentions = deactivateMentions;
/**
 * Disables code blocks in the string by adding an invisible unicode char after each backtick
 */
function disableCodeBlocks(str) {
    return str.replace(/`/g, "`\u200b");
}
exports.disableCodeBlocks = disableCodeBlocks;
/**
 * Returns the full invite link for an invite object
 */
function getInviteLink(inv) {
    return `https://discord.gg/${inv.code}`;
}
exports.getInviteLink = getInviteLink;
function hasPermission(config, permission) {
    return (0, utils_1.get)(config, permission) === true;
}
exports.hasPermission = hasPermission;
function getMemberLevel(pluginData, member) {
    const levels = pluginData.fullConfig.levels ?? {};
    return (0, pluginUtils_1.getMemberLevel)(levels, member, pluginData.guild);
}
exports.getMemberLevel = getMemberLevel;
var utils_2 = require("./utils");
Object.defineProperty(exports, "userMentionRegex", { enumerable: true, get: function () { return utils_2.userMentionRegex; } });
Object.defineProperty(exports, "channelMentionRegex", { enumerable: true, get: function () { return utils_2.channelMentionRegex; } });
Object.defineProperty(exports, "roleMentionRegex", { enumerable: true, get: function () { return utils_2.roleMentionRegex; } });
Object.defineProperty(exports, "snowflakeRegex", { enumerable: true, get: function () { return utils_2.snowflakeRegex; } });
Object.defineProperty(exports, "getChannelId", { enumerable: true, get: function () { return utils_2.getChannelId; } });
Object.defineProperty(exports, "getRoleId", { enumerable: true, get: function () { return utils_2.getRoleId; } });
Object.defineProperty(exports, "getUserId", { enumerable: true, get: function () { return utils_2.getUserId; } });
