import { SlashCommandBuilder } from 'discord.js';
import { getVoiceConnection } from '@discordjs/voice';
import { isOwner } from '../utils/owners.js';

export default {
    data: new SlashCommandBuilder()
        .setName('leave')
        .setDescription('Leave the voice channel'),

    async execute(interaction, client) {
        if (!isOwner(interaction.user.id)) {
            return interaction.reply({
                content: 'Only the bot owner can use this command.',
                ephemeral: true
            });
        }

        const connection = getVoiceConnection(interaction.guild.id);

        if (!connection) {
            return interaction.reply({
                content: 'Not connected.',
                ephemeral: true
            });
        }

        client.activeConnections.delete(interaction.guild.id);
        connection.destroy();

        await interaction.reply('Left the voice channel.');
    }
};