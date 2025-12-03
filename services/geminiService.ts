import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Difficulty, QuizQuestion } from "../types";

// NOTE: While the user requested "Qianwen", this environment requires the use of the pre-configured 
// Google GenAI SDK and API Key. We prompt the model to act specifically as a Chinese curriculum expert.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
你是一位来自中国深圳的小学三年级数学金牌教师。
1. **教材背景**：你非常熟悉北师大版和人教版小学三年级上册数学教材。
2. **核心内容**：混合运算、观察物体、加与减、乘与除、周长、年月日、小数的初步认识。
3. **教学风格**：生动活泼，喜欢用生活中的例子（如深圳的地标、超市购物、游乐园）来讲解。多用emoji 🌟🚀。
4. **能力提升**：在适当时候引入简单的奥数概念（如植树问题、和差倍问题、周期问题），但要浅显易懂。
5. **语言**：必须使用简体中文。
`;

export const getExplanation = async (topicTitle: string, userQuery: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `请为三年级小学生讲解知识点：${topicTitle}。
      
      用户具体问题：${userQuery || "请先简单有趣地介绍这个概念，然后举一个生活中的例子。"}
      
      要求：
      1. 语言通俗易懂，像讲故事一样。
      2. 如果是几何问题（如周长），请描述形状。
      3. 如果是计算问题，请展示步骤。
      4. 最后给出一个简单的互动思考题。`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      }
    });
    return response.text;
  } catch (error) {
    console.error("AI Explanation Error:", error);
    return "哎呀，老师的网络稍微有点卡，请再问一次吧！🤖";
  }
};

export const generateQuiz = async (topicTitle: string, difficulty: Difficulty): Promise<QuizQuestion[]> => {
  const quizSchema: Schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        id: { type: Type.INTEGER },
        question: { type: Type.STRING },
        options: { 
          type: Type.ARRAY,
          items: { type: Type.STRING }
        },
        correctAnswer: { type: Type.INTEGER, description: "The index of the correct answer (0-3)" },
        explanation: { type: Type.STRING, description: "A fun explanation of why the answer is correct" }
      },
      required: ["id", "question", "options", "correctAnswer", "explanation"],
    }
  };

  try {
    const prompt = `请出3道关于"${topicTitle}"的数学选择题，难度为"${difficulty}"。
    
    难度标准：
    - 基础巩固：课本基础题，直接计算或定义。
    - 能力提升：稍微复杂的应用题，需要两步思考。
    - 奥数挑战：简单的逻辑推理或经典奥数题（如简单的鸡兔同笼变体，简单的周期问题）。
    
    注意：返回纯JSON格式。`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: quizSchema,
        systemInstruction: SYSTEM_INSTRUCTION,
      }
    });

    if (response.text) {
        return JSON.parse(response.text) as QuizQuestion[];
    }
    return [];
  } catch (error) {
    console.error("AI Quiz Error:", error);
    return [];
  }
};

export const chatWithTutor = async (history: {role: string, parts: {text: string}[]}[], message: string) => {
    try {
        const chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: SYSTEM_INSTRUCTION
            },
            history: history
        });
        
        const result = await chat.sendMessage({ message });
        return result.text;
    } catch (error) {
        console.error("Chat Error", error);
        return "老师正在思考中，请稍等一下... 🧠";
    }
}
