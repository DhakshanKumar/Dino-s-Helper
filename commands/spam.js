import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";

const command = {
  data: new SlashCommandBuilder()
    .setName("spam")
    .setDescription("Spam mention a user (owner only)")
    .addUserOption(option =>
      option.setName("user")
        .setDescription("User to tag")
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option.setName("count")
        .setDescription("Number of times to send")
        .setRequired(true)
    ),

  async execute(interaction) {
    // 🔐 OWNER CHECK
    const ownerIds = process.env.OWNER_IDS?.split(",") || [];

    if (!ownerIds.includes(interaction.user.id)) {
      return interaction.reply({
        content: "❌ Only @Dinoplayz\_Official can use this command.",
        ephemeral: true,
      });
    }

    const user = interaction.options.getUser("user");
    const count = interaction.options.getInteger("count");

    if (count > 10) {
      return interaction.reply({
        content: "Limit is 10 to avoid rate limits.",
        ephemeral: true,
      });
    }

    await interaction.reply({
      content: `Spamming ${user} ${count} times...`,
      ephemeral: true,
    });

    for (let i = 0; i < count; i++) {
      await interaction.channel.send(`${user}`);
    }
  },
};

export default command;