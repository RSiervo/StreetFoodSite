
import { GoogleGenAI, Chat } from "@google/genai";
import { MENU_ITEMS } from '../constants';
import { MenuItem, Language } from '../types';

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
    `- ${item.name} (₱${item.price}): ${item.description} [${item.isSpicy ? 'Spicy' : 'Non-Spicy'}, ${item.isVeg ? 'Veg' : 'Non-Veg'}]`
  ).join('\n');
};

export const startChatSession = async (language: Language = 'en') => {
  initAI();
  if (!ai) throw new Error("API Key missing");

  const isFilipino = language === 'fil';

  const systemInstruction = `
    You are "StreetBot", the AI food concierge for "PinoyBites", a Filipino street food app. 
    Your goal is to help customers choose delicious street food, suggest pairings (e.g., "This is perfect with Coke!"), and answer questions about ingredients.
    
    Here is our current Menu:
    ${getMenuContext()}
    
    Context:
    - Current Language Setting: ${isFilipino ? 'Filipino/Taglish' : 'English'}
    
    Rules:
    1. If the language setting is 'Filipino', use enthusiastic "Taglish" (English mixed with Tagalog slang like "Solid to!", "Masarap!", "Tara kain!").
    2. If the language setting is 'English', use friendly, standard English, but you can keep the food names in Filipino.
    3. If a user asks for spicy food, recommend spicy items like Sisig with extra chili.
    4. If a user is vegetarian, only recommend veg items like Taho or Turon (check the flag).
    5. Suggest combos (e.g., Isaw + Gulaman).
    6. Keep responses under 50 words unless asked for a story.
    7. Do not mention items not on the menu.
  `;

  chatSession = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction,
      temperature: 0.7,
    },
  });
};

export const sendMessageToAI = async (message: string, language: Language = 'en'): Promise<string> => {
  if (!chatSession) {
    await startChatSession(language);
  }
  if (!chatSession) return language === 'fil' ? "Pasensya na, busy sa kusina. Paki-ulit?" : "Sorry, busy in the kitchen. Can you repeat that?";

  try {
    const result = await chatSession.sendMessage({ message });
    return result.text || (language === 'fil' ? "Sarap! Ano pa gusto mo?" : "Delicious! What else would you like?");
  } catch (error) {
    console.error("AI Error:", error);
    return language === 'fil' ? "Ay, nalaglag ang fishball. Paki-ulit po?" : "Oops, dropped the fishball. Please try again.";
  }
};
