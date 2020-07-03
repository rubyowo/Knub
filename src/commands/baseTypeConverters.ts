import { defaultTypeConverters, createTypeHelper, TypeConversionError } from "knub-command-manager";
import { disableCodeBlocks } from "../helpers";
import { getChannelId, getRoleId, getUserId } from "../utils";
import { Channel, GuildChannel, Member, Role, TextChannel, User, VoiceChannel } from "eris";

export const baseTypeConverters = {
  ...defaultTypeConverters,

  boolean: defaultTypeConverters.bool,

  number(value) {
    const result = parseFloat(value);
    if (Number.isNaN(result)) {
      throw new TypeConversionError(`\`${disableCodeBlocks(value)}\` is not a valid number`);
    }

    return result;
  },

  user(value, { pluginData: { client } }): User {
    const userId = getUserId(value);
    if (!userId) {
      throw new TypeConversionError(`\`${disableCodeBlocks(value)}\` is not a valid user`);
    }

    const user = client.users.get(userId);
    if (!user) {
      throw new TypeConversionError(`Could not find user for user id \`${userId}\``);
    }

    return user;
  },

  member(value, { message, pluginData: { client } }): Member {
    if (!(message.channel instanceof GuildChannel)) {
      throw new TypeConversionError(`Type 'Member' can only be used in guilds`);
    }

    const userId = getUserId(value);
    if (!userId) {
      throw new TypeConversionError(`\`${disableCodeBlocks(value)}\` is not a valid user id`);
    }

    const user = client.users.get(userId);
    if (!user) {
      throw new TypeConversionError(`Could not find user for user id \`${userId}\``);
    }

    const member = message.channel.guild.members.get(user.id);
    if (!member) {
      throw new TypeConversionError(`Could not find guild member for user id \`${userId}\``);
    }

    return member;
  },

  channel(value, { message }): Channel {
    const channelId = getChannelId(value);
    if (!channelId) {
      throw new TypeConversionError(`\`${disableCodeBlocks(value)}\` is not a valid channel`);
    }

    if (!(message.channel instanceof GuildChannel)) {
      throw new TypeConversionError(`Type 'Channel' can only be used in guilds`);
    }

    const guild = message.channel.guild;
    const channel = guild.channels.get(channelId);
    if (!channel) {
      throw new TypeConversionError(`Could not find channel for channel id \`${channelId}\``);
    }

    return channel;
  },

  textChannel(value, { message }): TextChannel {
    const channelId = getChannelId(value);
    if (!channelId) {
      throw new TypeConversionError(`\`${disableCodeBlocks(value)}\` is not a valid channel`);
    }

    if (!(message.channel instanceof GuildChannel)) {
      throw new TypeConversionError(`Type 'Channel' can only be used in guilds`);
    }

    const guild = message.channel.guild;
    const channel = guild.channels.get(channelId);
    if (!channel) {
      throw new TypeConversionError(`Could not find channel for channel id \`${channelId}\``);
    }

    if (!(channel instanceof TextChannel)) {
      throw new TypeConversionError(`Channel \`${channel.name}\` is not a text channel`);
    }

    return channel;
  },

  voiceChannel(value, { message }): VoiceChannel {
    const channelId = getChannelId(value);
    if (!channelId) {
      throw new TypeConversionError(`\`${disableCodeBlocks(value)}\` is not a valid channel`);
    }

    if (!(message.channel instanceof GuildChannel)) {
      throw new TypeConversionError(`Type 'Channel' can only be used in guilds`);
    }

    const guild = message.channel.guild;
    const channel = guild.channels.get(channelId);
    if (!channel) {
      throw new TypeConversionError(`Could not find channel for channel id \`${channelId}\``);
    }

    if (!(channel instanceof VoiceChannel)) {
      throw new TypeConversionError(`Channel \`${channel.name}\` is not a voice channel`);
    }

    return channel;
  },

  role(value, { message }): Role {
    if (!(message.channel instanceof GuildChannel)) {
      throw new TypeConversionError(`Type 'Role' can only be used in guilds`);
    }

    const roleId = getRoleId(value);
    if (!roleId) {
      throw new TypeConversionError(`\`${disableCodeBlocks(value)}\` is not a valid role`);
    }

    const role = message.channel.guild.roles.get(roleId);
    if (!role) {
      throw new TypeConversionError(`Could not find role for role id \`${roleId}\``);
    }

    return role;
  },

  userId(value) {
    const userId = getUserId(value);
    if (!userId) {
      throw new TypeConversionError(`\`${disableCodeBlocks(value)}\` is not a valid user`);
    }

    return userId;
  },

  channelId(value) {
    const channelId = getChannelId(value);
    if (!channelId) {
      throw new TypeConversionError(`\`${disableCodeBlocks(value)}\` is not a valid channel`);
    }

    return channelId;
  },
};

export const baseTypeHelpers = {
  number: createTypeHelper<number>(baseTypeConverters.number),
  user: createTypeHelper<User>(baseTypeConverters.user),
  member: createTypeHelper<Member>(baseTypeConverters.member),
  channel: createTypeHelper<Channel>(baseTypeConverters.channel),
  textChannel: createTypeHelper<TextChannel>(baseTypeConverters.textChannel),
  voiceChannel: createTypeHelper<VoiceChannel>(baseTypeConverters.voiceChannel),
  role: createTypeHelper<Role>(baseTypeConverters.role),
  userId: createTypeHelper<string>(baseTypeConverters.userId),
  channelId: createTypeHelper<string>(baseTypeConverters.channelId),
};