import {
    SlashCommandBuilder
} from 'discord.js';

import {
    joinVoiceChannel,
    VoiceConnectionStatus,
    entersState
} from '@discordjs/voice';

import { isOwner } from '../utils/owners.js';

export default {
    data: new SlashCommandBuilder()
        .setName('join')
        .setDescription('Join your voice channel'),

    async execute(interaction, client) {
        if (!isOwner(interaction.user.id)) {
            return interaction.reply({
                content: 'Only the bot owner can use this command.',
                ephemeral: true
            });
        }

        const channel = interaction.member.voice.channel;

        if (!channel) {
            return interaction.reply({
                content: 'Join a voice channel first.',
                ephemeral: true
            });
        }

        const connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator,
            selfDeaf: false
        });

        client.activeConnections.set(channel.guild.id, {
            guildId: channel.guild.id,
            channelId: channel.id
        });

        connection.on(VoiceConnectionStatus.Disconnected, async () => {
            const saved = client.activeConnections.get(channel.guild.id);
            if (!saved) return;

            try {
                await entersState(connection, VoiceConnectionStatus.Signalling, 5000);
            } catch {
                joinVoiceChannel({
                    channelId: saved.channelId,
                    guildId: saved.guildId,
                    adapterCreator: channel.guild.voiceAdapterCreator,
                    selfDeaf: false
                });
            }
        });

        await interaction.reply(`Joined **${channel.name}**`);
    }
};