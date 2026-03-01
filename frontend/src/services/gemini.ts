import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

let genAI: GoogleGenerativeAI | null = null;

export const initGemini = (key?: string) => {
    const finalKey = key || apiKey;
    if (finalKey) {
        genAI = new GoogleGenerativeAI(finalKey);
    }
    return genAI !== null;
};

export const getGeminiModel = () => {
    if (!genAI) {
        throw new Error('Gemini AI not initialized. Please set your API key.');
    }
    return genAI.getGenerativeModel({ model: 'gemini-pro' });
};

export const generateAIResponse = async (prompt: string): Promise<string> => {
    try {
        const model = getGeminiModel();
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error('Gemini API error:', error);
        throw error;
    }
};

// AI-powered suggestions for different modules
export const getTaskSuggestions = async (tasks: string[]): Promise<string> => {
    const prompt = `Based on these current tasks: ${tasks.join(', ')}
  
Provide 3 brief, actionable suggestions to help prioritize and complete them efficiently. Keep each suggestion to one sentence.`;

    return generateAIResponse(prompt);
};

export const getDailySummary = async (data: {
    completedTasks: number;
    totalTasks: number;
    habitsCompleted: number;
    focusMinutes: number;
}): Promise<string> => {
    const prompt = `Generate a brief, encouraging daily summary for someone who:
- Completed ${data.completedTasks} out of ${data.totalTasks} tasks
- Completed ${data.habitsCompleted} habits
- Spent ${data.focusMinutes} minutes in focused work

Keep it to 2-3 sentences, be motivating but realistic.`;

    return generateAIResponse(prompt);
};

export const getGoalAdvice = async (goal: string, progress: number): Promise<string> => {
    const prompt = `For the goal: "${goal}" which is ${progress}% complete.
  
Provide one brief, actionable tip to help make progress. Keep it to 1-2 sentences.`;

    return generateAIResponse(prompt);
};

export const getFinancialInsight = async (data: {
    income: number;
    expenses: number;
    topCategories: string[];
}): Promise<string> => {
    const prompt = `Financial overview:
- Income: $${data.income}
- Expenses: $${data.expenses}
- Top spending: ${data.topCategories.join(', ')}

Provide one brief financial insight or tip. Keep it to 1-2 sentences.`;

    return generateAIResponse(prompt);
};

export const getMotivationalQuote = async (context?: string): Promise<string> => {
    const prompt = context
        ? `Generate a brief, original motivational quote related to: ${context}`
        : 'Generate a brief, original motivational quote about productivity and personal growth.';

    return generateAIResponse(prompt);
};

export const isGeminiInitialized = () => genAI !== null;
