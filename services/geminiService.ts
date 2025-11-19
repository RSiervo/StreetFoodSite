import { GoogleGenAI, Chat } from "@google/genai";
import { MENU_ITEMS } from '../constants';
import { MenuItem } from '../types';

let ai: GoogleGenAI | null = null;
let chatSession: Chat | null = null;

const initAI = () => {
  if (!ai && process.env.API_KEY) {
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
};

// Helper to format menu for the AI context
const getMenuContext = (): string => {
  return MENU_ITEMS.map((item: MenuItem) => 
    `- ${item.name} ($${item.price}): ${item.description} [${item.isSpicy ? 'Spicy' : 'Non-Spicy'}, ${item.isVeg ? 'Veg' : 'Non-Veg'}]`
  ).join('\n');
};

export const startChatSession = async () => {
  initAI();
  if (!ai) throw new Error("API Key missing");

  const systemInstruction = `
    You are "StreetBot", the AI food concierge for the StreetBites app. 
    Your goal is to help customers choose delicious street food, suggest pairings, and answer questions about ingredients.
    
    Here is our current Menu:
    ${getMenuContext()}
    
    Rules:
    1. Be enthusiastic, short, and punchy. Street food style!
    2. If a user asks for spicy food, recommend spicy items.
    3. If a user is vegetarian, only recommend veg items.
    4. Suggest combos (e.g., Burger + Fries).
    5. Keep responses under 50 words unless asked for a story.
    6. Do not mention items not on the menu.
  `;

  chatSession = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction,
      temperature: 0.7,
    },
  });
};

export const sendMessageToAI = async (message: string): Promise<string> => {
  if (!chatSession) {
    await startChatSession();
  }
  if (!chatSession) return "Sorry, I'm having trouble connecting to the kitchen right now.";

  try {
    const result = await chatSession.sendMessage({ message });
    return result.text || "Yum! Anything else?";
  } catch (error) {
    console.error("AI Error:", error);
    return "Oops! I dropped the taco. Can you ask that again?";
  }
};