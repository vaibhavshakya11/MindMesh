import { callAzureOpenAI } from './azureAPI';

export async function extractConcepts(topic) {
  const systemMessage = `You are an expert educational content analyzer. Extract key concepts from the given topic and create a hierarchical concept graph. Return ONLY valid JSON, no markdown formatting.`;

  const userMessage = `
Analyze the topic "${topic}" and create a concept graph with the following structure:

{
  "mainConcept": "topic name",
  "nodes": [
    {
      "id": "unique_id",
      "name": "Concept Name",
      "level": 0-2,
      "definition": "brief definition",
      "prerequisites": ["id1", "id2"],
      "formula": "formula if applicable",
      "isCore": true/false
    }
  ]
}

Rules:
- Main concept has level 0
- Core subconcepts have level 1
- Supporting concepts have level 2
- Include 6-12 nodes total
- Keep definitions under 50 words
- Prerequisites should reference existing node IDs
- For physics/math topics, include formulas
`;

  try {
    const response = await callAzureOpenAI(userMessage, {
      systemMessage,
      temperature: 0.5,
      maxTokens: 1500
    });

    let content = response.content.trim();
    content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    
    const conceptGraph = JSON.parse(content);
    
    if (!conceptGraph.nodes || !Array.isArray(conceptGraph.nodes)) {
      throw new Error('Invalid concept graph structure');
    }

    return conceptGraph;
  } catch (error) {
    console.error('Concept extraction failed:', error);
    throw new Error(`Failed to extract concepts: ${error.message}`);
  }
}

export async function getELI5Explanation(conceptName, definition) {
  const systemMessage = 'You are a master at explaining complex topics simply. Explain like the user is 5 years old, using analogies and simple language.';
  
  const userMessage = `Explain "${conceptName}" (${definition}) in simple terms a 5-year-old could understand. Use an analogy. Keep it under 100 words.`;

  try {
    const response = await callAzureOpenAI(userMessage, {
      systemMessage,
      temperature: 0.8,
      maxTokens: 200
    });

    return response.content.trim();
  } catch (error) {
    console.error('ELI5 generation failed:', error);
    return 'Unable to generate simple explanation at this time.';
  }
}