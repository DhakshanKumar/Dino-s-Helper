import Groq from "groq-sdk";

export default (client) => {
  const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });

  client.on("messageCreate", async (message) => {
    if (message.author.bot) return;
    if (message.mentions.everyone) return;
    if (message.mentions.here) return;
    if (!message.mentions.has(client.user)) return;

    const prompt = message.content
      .replace(`<@${client.user.id}>`, "")
      .replace(`<@!${client.user.id}>`, "")
      .trim();

    if (!prompt) {
      return message.reply("Mention me with a message 🙂");
    }

    try {
      await message.channel.sendTyping();

      const completion = await groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      });

      const text = completion.choices?.[0]?.message?.content;

      await message.reply(
        text?.length > 2000 ? text.slice(0, 1990) + "..." : text || "No response"
      );

    } catch (err) {
      console.error("Groq Error:", err);
      message.reply("❌ Groq failed to respond.");
    }
  });
};