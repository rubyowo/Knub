"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertTypeEquals = exports.createMockThread = exports.createMockRole = exports.createMockMessage = exports.createMockTextChannel = exports.createMockMember = exports.createMockUser = exports.createMockGuild = exports.sleep = exports.initializeKnub = exports.withKnub = exports.createMockClient = void 0;
const utils_1 = require("./utils");
const events = require("events");
const discord_js_1 = require("discord.js");
const Knub_1 = require("./Knub");
const EventEmitter = events.EventEmitter;
const persisted = new WeakMap();
function persist(that, prop, initial) {
    if (!persisted.has(that)) {
        persisted.set(that, new Map());
    }
    const thatProps = persisted.get(that);
    if (!thatProps.has(prop)) {
        thatProps.set(prop, initial);
    }
    return thatProps.get(prop);
}
function createMockWebSocketManager() {
    return new Proxy(new EventEmitter(), {
        get(target, p) {
            if (p in target) {
                return target[p];
            }
            return utils_1.noop;
        },
    });
}
function createMockClient() {
    return new Proxy(new EventEmitter(), {
        get(target, p, proxy) {
            if (p in target) {
                return target[p];
            }
            if (p === "destroy") {
                return () => target.removeAllListeners();
            }
            if (p === "ws") {
                return persist(target, p, createMockWebSocketManager());
            }
            if (p === "users") {
                // We use Reflect.construct() here because the constructor is marked as private in the typings
                const userManager = Reflect.construct(discord_js_1.UserManager, [proxy]);
                return persist(target, p, userManager);
            }
            if (p === "guilds") {
                // @ts-ignore
                // This type assertation is needed because the constructor is marked as private
                return persist(target, p, new discord_js_1.GuildManager(proxy));
            }
            if (p === "options") {
                return {
                    intents: null,
                    makeCache: discord_js_1.Options.cacheEverything(),
                };
            }
            if (p === "channels") {
                // @ts-ignore
                // This type assertation is needed because the constructor is marked as private
                return persist(target, p, new discord_js_1.ChannelManager(proxy, []));
            }
            return utils_1.noop;
        },
    });
}
exports.createMockClient = createMockClient;
/**
 * Helper function to set up Knub with auto-cleanup
 */
async function withKnub(mochaDoneFn, fn) {
    let knub = null;
    const createKnub = (args) => {
        const client = createMockClient();
        knub = new Knub_1.Knub(client, args);
        return knub;
    };
    const done = () => {
        if (!knub) {
            throw new Error("createKnub() was not called in withKnub()");
        }
        void knub.destroy();
        mochaDoneFn();
    };
    try {
        await fn(createKnub, done);
    }
    catch (e) {
        // TS doing some weird inference here, narrowing `knub` to `never`, hence the assertation
        await knub?.destroy();
        throw e;
    }
}
exports.withKnub = withKnub;
/**
 * Most tests need to initialize Knub, so this is a helper function to handle that
 */
async function initializeKnub(knub) {
    return new Promise((resolve) => {
        knub.once("loadingFinished", () => {
            resolve();
        });
        knub.initialize();
        knub.client.emit("connect");
        knub.client.emit("shardReady", 0, undefined);
        knub.client.emit("ready", knub.client);
    });
}
exports.initializeKnub = initializeKnub;
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
exports.sleep = sleep;
let mockGuildId = 10000;
function createMockGuild(client, data = {}) {
    const id = (++mockGuildId).toString();
    client.guilds.cache.set(id, {
        id,
        client,
        name: `Mock Guild #${id}`,
        ...data,
    });
    const mockGuild = client.guilds.cache.get(id);
    // @ts-ignore
    // This type assertation is needed because the constructor is marked as private
    mockGuild.members = new discord_js_1.GuildMemberManager(mockGuild);
    // @ts-ignore
    // This type assertation is needed because the constructor is marked as private
    mockGuild.channels = new discord_js_1.GuildChannelManager(mockGuild);
    // @ts-ignore
    // This type assertation is needed because the constructor is marked as private
    mockGuild.roles = new discord_js_1.RoleManager(mockGuild);
    // Add everyone role
    mockGuild.roles.cache.set(mockGuild.id, createMockRole(mockGuild, { name: "everyone" }, mockGuild.id));
    return mockGuild;
}
exports.createMockGuild = createMockGuild;
let mockUserId = 20000;
function createMockUser(client, data = {}) {
    const id = (++mockUserId).toString();
    const mockUser = client.users.cache.set(id, 
    // @ts-ignore
    new discord_js_1.User(client, {
        id,
        username: `mockuser_${id}`,
        discriminator: "0001",
        ...data,
    }));
    return mockUser.get(id);
}
exports.createMockUser = createMockUser;
function createMockMember(guild, user, data = {}) {
    // @ts-ignore
    // Not sure why the eslint rule below is triggered, but it probably
    // has something to do with the constructor being marked as private.
    guild.members.cache.set(user.id, new discord_js_1.GuildMember(guild.client, { user, ...data }, guild));
    return guild.members.cache.get(user.id);
}
exports.createMockMember = createMockMember;
let mockChannelId = 30000;
function createMockTextChannel(client, guildId, data = {}) {
    const id = (++mockChannelId).toString();
    const guild = client.guilds.cache.get(guildId);
    // @ts-ignore
    const mockChannel = new discord_js_1.TextChannel(guild, {
        id,
        guild,
        type: discord_js_1.ChannelType.GuildText,
        name: `mock-channel-${id}`,
        ...data,
    }, client);
    guild.channels.cache.set(id, mockChannel);
    client.channels.cache.set(id, mockChannel);
    return mockChannel;
}
exports.createMockTextChannel = createMockTextChannel;
let mockMessageId = 40000;
function createMockMessage(client, channel, author, data = {}) {
    // @ts-ignore
    // This type assertation is needed because the constructor is marked as private
    const message = new discord_js_1.Message(client, {
        id: (++mockMessageId).toString(),
        channel_id: channel.id,
        mentions: [],
        // @ts-ignore
        author,
        ...data,
    });
    return message;
}
exports.createMockMessage = createMockMessage;
let mockRoleId = 50000;
function createMockRole(guild, data = {}, overrideId = null) {
    const id = overrideId || (++mockRoleId).toString();
    guild.roles.cache.set(id, 
    // @ts-ignore
    // This type assertation is needed because the constructor is marked as private
    new discord_js_1.Role(guild.client, {
        id,
        permissions: "0",
        ...data,
    }, guild));
    return guild.roles.cache.get(id);
}
exports.createMockRole = createMockRole;
let mockThreadId = 60000;
function createMockThread(channel) {
    const id = (++mockThreadId).toString();
    channel.guild.channels.cache.set(id, 
    // @ts-ignore
    // This type assertation is needed because the constructor is marked as private
    new discord_js_1.ThreadChannel(channel.guild, {
        id,
        type: discord_js_1.ChannelType.GuildPublicThread,
        parent_id: channel.id,
    }, channel.client));
    const mockThread = channel.guild.channels.cache.get(id);
    channel.client.channels.cache.set(id, mockThread);
    return mockThread;
}
exports.createMockThread = createMockThread;
/**
 * Assertion "function" for types
 * 1. First type parameter (TExpected) is the expected type
 * 2. Second type parameter (TActual) is the actual, tested type
 * 3. Third type parameter (TAssert) is either true or false, based on whether the first and second type should match
 *
 * For example:
 * ```
 * assertTypeEquals<string, string, true>(); // passes: string and string match, and third parameter was true
 * assertTypeEquals<string, number, true>(); // error: string and number do not match, but third parameter was true
 * assertTypeEquals<string, number, false>(); // passses: string and number do not match, and third parameter was false
 * ```
 */
function assertTypeEquals() { }
exports.assertTypeEquals = assertTypeEquals;
