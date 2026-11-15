import Groq from 'groq-sdk';

const groqApiKey = import.meta.env.VITE_GROQ_API_KEY;

export interface EvaluationResult {
  score: number;
  feedback: string[];
  improvedPrompt: string;
}

export async function evaluatePromptWithGroq(
  gameTitle: string, 
  gameDescription: string, 
  userPrompt: string
): Promise<EvaluationResult> {
  if (!groqApiKey) {
    throw new Error('AI prompt evaluation is not configured. Add VITE_GROQ_API_KEY to the deployment environment.');
  }

  try {
    const groq = new Groq({
      apiKey: groqApiKey,
      dangerouslyAllowBrowser: true
    });
    const completion = await groq.chat.completions.create({
      model: 'openai/gpt-oss-120b', // Active Groq model
      messages: [
        {
          role: 'system',
          content: `You are a friendly, encouraging prompt engineering AI coach for PROMNEXA. 
Your goal is to provide simple, easy-to-understand feedback that beginners can easily grasp (avoid complex tech jargon). 
Return your response strictly as valid JSON with keys: 
- "score": number from 0 to 100
- "feedback": array of strings starting with '✓ ' for what went well, '→ ' for gentle tips, or '💡 ' for simple suggestions
- "improvedPrompt": a clear, enhanced string version of the user prompt.`
        },
        {
          role: 'user',
          content: `Game Mode: "${gameTitle}" (${gameDescription}). Evaluate this user prompt: "${userPrompt}"`
        }
      ],
      response_format: { type: 'json_object' }
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response content received from Groq AI.');
    }

    const data = JSON.parse(content);
    return {
      score: data.score || 50,
      feedback: data.feedback || [
        '✓ Good effort describing your core idea!',
        '→ Try adding a bit more detail about the final format.',
        '💡 Tip: Clear instructions help the AI avoid guessing.'
      ],
      improvedPrompt: data.improvedPrompt || `${userPrompt}, highly detailed, clear structure.`
    };
  } catch (err) {
    console.error('Groq AI evaluation error:', err);
    throw new Error('Failed to evaluate prompt using Groq AI. Please check your API key.');
  }
}