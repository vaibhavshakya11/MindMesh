import { callAzureOpenAI } from './azureAPI';

export async function generateQuiz(concept, difficulty = 'medium', previousAttempts = []) {
  const systemMessage = 'You are an expert quiz creator. Generate educational quiz questions that test understanding. Return ONLY valid JSON.';

  const difficultyMap = {
    easy: 'basic recall and recognition',
    medium: 'application and comprehension',
    hard: 'analysis and synthesis'
  };

  const userMessage = `
Create a multiple-choice quiz question about "${concept.name}".
Definition: ${concept.definition}
${concept.formula ? `Formula: ${concept.formula}` : ''}
Difficulty: ${difficultyMap[difficulty]}

Return JSON format:
{
  "question": "question text",
  "options": ["A", "B", "C", "D"],
  "correctIndex": 0-3,
  "explanation": "why this is correct"
}

Make it challenging but fair. Avoid questions similar to: ${previousAttempts.join(', ')}
`;

  try {
    const response = await callAzureOpenAI(userMessage, {
      systemMessage,
      temperature: 0.7,
      maxTokens: 400
    });

    let content = response.content.trim();
    content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    
    const quiz = JSON.parse(content);
    
    return {
      ...quiz,
      conceptId: concept.id,
      difficulty,
      timestamp: Date.now()
    };
  } catch (error) {
    console.error('Quiz generation failed:', error);
    return {
      question: `What is ${concept.name}?`,
      options: [
        concept.definition,
        'An unrelated concept',
        'A mathematical constant',
        'None of the above'
      ],
      correctIndex: 0,
      explanation: concept.definition,
      conceptId: concept.id,
      difficulty,
      timestamp: Date.now()
    };
  }
}

export function calculateNextReviewTime(masteryLevel, lastReview) {
  const intervals = {
    0: 5 * 60 * 1000,        // 5 minutes
    1: 30 * 60 * 1000,       // 30 minutes
    2: 24 * 60 * 60 * 1000,  // 1 day
    3: 7 * 24 * 60 * 60 * 1000, // 1 week
    4: 30 * 24 * 60 * 60 * 1000  // 1 month
  };

  const interval = intervals[Math.min(masteryLevel, 4)] || intervals[0];
  return lastReview + interval;
}