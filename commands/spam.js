import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";

const command = {
  data: new SlashCommandBuilder()
    .setName("spam")
    .setDescription("Spam mention a user (use responsibly)")
    .addUserOption(option =>
      option.setName("user")
        .setDescription("User to tag")
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option.setName("count")
        .setDescription("Number of times to send")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async execute(interaction) {
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