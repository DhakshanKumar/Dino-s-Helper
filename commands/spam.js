import { SlashCommandBuilder } from "discord.js";

const command = {
  data: new SlashCommandBuilder()
    .setName("spam")
    .setDescription("Spam messages (owner only tool)")
    .addUserOption(option =>
      option
        .setName("user")
        .setDescription("User to mention (optional)")
        .setRequired(false)
    )
    .addStringOption(option =>
      option
        .setName("message")
        .setDescription("Custom message (optional)")
        .setRequired(false)
    )
    .addIntegerOption(option =>
      option
        .setName("count")
        .setDescription("How many times to send (optional, default 1)")
        .setRequired(false)
    ),

  async execute(interaction) {
    // 🔐 OWNER CHECK
    const ownerIds = process.env.OWNER_IDS?.split(",") || [];

    if (!ownerIds.includes(interaction.user.id)) {
      return interaction.reply({
        content: "❌ Only bot owners can use this command.",
        flags: 64,
      });
    }

    const user = interaction.options.getUser("user");
    const message = interaction.options.getString("message");
    const count = interaction.options.getInteger("count") ?? 1;

    if (count > 10) {
      return interaction.reply({
        content: "Limit is 10 to avoid rate limits.",
        flags: 64,
      });
    }

    await interaction.reply({
      content: "Sending messages...",
      flags: 64,
    });

    for (let i = 0; i < count; i++) {
      let output = "";

      if (user && message) {
        output = `${user} ${message}`;
      } else if (user) {
        output = `${user}`;
      } else if (message) {
        output = message;
      } else {
        output = "No content provided";
      }

      await interaction.channel.send(output);
    }
  },
};

export default command;