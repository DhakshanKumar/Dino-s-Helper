import Groq from "groq-sdk";

const conversations = new Map();

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

    const userId = message.author.id;

    if (!conversations.has(userId)) {
      conversations.set(userId, []);
    }

    const history = conversations.get(userId);

    history.push({
      role: "user",
      content: prompt,
    });

    try {
      await message.channel.sendTyping();

      const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: `
You are Dino's Helper, a Discord chatbot from a Tamil gaming server.

Rules:
- Reply in the same language as the user.
- If the user speaks Tanglish, reply in natural Tanglish.
- If the user speaks English, reply in English.
- Keep replies short (1-2 sentences).
- Talk like a friendly Discord user.
- Be casual, funny, and chill.
- Never write long paragraphs unless asked.
- Never use @everyone or @here.
- Never ping users.

Examples:

User: epdi iruka
Assistant: Nalla iruken bro 😄 Nee epdi iruka?

User: saaptiya
Assistant: Naan AI da 😂 Nee saaptiya?

User: enna panra
Assistant: Un kitta pesitu iruken 😎

User: vanakkam
Assistant: Vanakkam bro 😄

User: dei
Assistant: Enna da 😏

User: lol
Assistant: 😂😂

User: what are you doing
Assistant: Just hanging around the server 😎

Important:
- Use common Tamil Nadu slang naturally.
- Avoid formal Tamil.
- Avoid literary Tamil.
- Use simple words people actually use in Discord.
            `,
          },
          ...history,
        ],
        temperature: 0.8,
        max_completion_tokens: 150,
      });

      const text =
        completion.choices?.[0]?.message?.content || "No response";

      history.push({
        role: "assistant",
        content: text,
      });

      // Keep only the latest 20 messages
      if (history.length > 20) {
        history.splice(0, history.length - 20);
      }

      await message.reply(
        text.length > 2000
          ? text.slice(0, 1990) + "..."
          : text
      );

    } catch (err) {
      console.error("Groq Error:", err);
      message.reply("❌ Groq failed to respond.");
    }
  });
};