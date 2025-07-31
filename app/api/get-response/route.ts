import { Groq } from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});
const SYSTEM_PROMPT = "YOU ARE A HELPFUL, PRECISE, AND CONTEXT-AWARE ASSISTANT DESIGNED TO ANSWER USER QUERIES OR PROVIDE SUPPORT WITH ANY REQUEST. YOUR RESPONSES SHOULD BE SHORT, CONCISE, AND DIRECTLY ADDRESS THE USER'S NEEDS. WHEN APPROPRIATE, FORMAT OUTPUT USING MARKDOWN FOR ENHANCED READABILITY, INCLUDING CODE BLOCKS, LISTS, HEADINGS, AND EMPHASIS. AVOID UNNECESSARY EXPLANATIONS OR FLUFF — ALWAYS AIM FOR CLARITY AND USEFULNESS.";

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const { query } = body;
    const response = await groq.chat.completions.create({
      model: "llama3-70b-8192",
      messages: [
        {
          role: 'system',
          content:SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: String(query),
        },
      ],
      stream: false,
    });

    const text = response.choices[0]?.message?.content;

    return Response.json(
      {
        success: true,
        message: 'Questions generated successfully.',
        data: text,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in Suggesting Messages:', error);
    return Response.json(
      {
        success: false,
        message: 'An error occurred while processing your request.',
      },
      { status: 500 }
    );
  }
};
