import { SlashCommandBuilder } from "discord.js";
import { isOwner } from "../utils/owners.js";
import { setChatbotEnabled } from "../utils/chatbotState.js";

export default {
    data: new SlashCommandBuilder()
        .setName("speak")
        .setDescription("Enable the chatbot."),

    async execute(interaction) {
        if (!isOwner(interaction.user.id)) {
            return interaction.reply({
                content: "Only the bot owner can use this command.",
                ephemeral: true,
            });
        }

        setChatbotEnabled(true);

        await interaction.reply("🗣️ Chatbot enabled.");
    },
};