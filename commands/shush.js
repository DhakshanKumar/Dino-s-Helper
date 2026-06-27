import { SlashCommandBuilder } from "discord.js";
import { isOwner } from "../utils/owners.js";
import { setChatbotEnabled } from "../utils/chatbotState.js";

export default {
    data: new SlashCommandBuilder()
        .setName("shush")
        .setDescription("Disable the chatbot."),

    async execute(interaction) {
        if (!isOwner(interaction.user.id)) {
            return interaction.reply({
                content: "Only the bot owner can use this command.",
                ephemeral: true,
            });
        }

        setChatbotEnabled(false);

        await interaction.reply("🤫 Chatbot disabled.");
    },
};