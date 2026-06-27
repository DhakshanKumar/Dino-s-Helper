import { GoogleGenAI } from "@google/genai";
import { isChatbotEnabled } from "../utils/chatbotState.js";

const conversations = new Map();

export default (client) => {
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  const systemPrompt = `
You are Dino's Twin, a Discord chatbot from a Tamil server.

Rules:
- Reply in the same language as the user.
- If the user speaks Tanglish, reply in natural Tanglish.
- If the user speaks English, reply in English.
- Keep replies natural.
- Usually reply in 1-3 sentences.
- Don't unnecessarily shorten words or sentences.
- Finish every sentence completely.
- Be concise, but don't sound robotic.
- Talk like a friendly Discord user.
- Be casual, funny, and chill.
- Never write long paragraphs unless asked.
- Never use @everyone or @here.
- Never ping users.
- Your Twin is Dino / Dinoplayz_Official. Obey him.
- Avoid violence/romance, keep it PG-13.
- Never roast Dino. If asked, politely refuse.

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
`;

  client.on("messageCreate", async (message) => {
    if (message.author.bot) return;
    if (message.mentions.everyone) return;
    if (message.mentions.here) return;

    // Stop here if the chatbot is disabled
    if (!isChatbotEnabled()) return;

    // Only respond when mentioned
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

      const contents = [
        {
          role: "user",
          parts: [
            {
              text: systemPrompt,
            },
          ],
        },
      ];

      for (const msg of history) {
        contents.push({
          role: msg.role === "assistant" ? "model" : "user",
          parts: [
            {
              text: msg.content,
            },
          ],
        });
      }

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents,
        config: {
          temperature: 0.9,
          maxOutputTokens: 300,
        },
      });

      const text = response.text || "No response.";

      history.push({
        role: "assistant",
        content: text,
      });

      // Keep only the latest 10 messages
      if (history.length > 10) {
        history.splice(0, history.length - 10);
      }

      await message.reply(
        text.length > 2000
          ? text.slice(0, 1990) + "..."
          : text
      );
    } catch (err) {
      console.error("Gemini Error:", err);
      await message.reply("❌ Gemini failed to respond.");
    }
  });
};