import { azureConfig, validateConfig } from '../config/azureConfig';
import costController from './costController';

export async function callAzureOpenAI(messages, options = {}) {
  try {
    validateConfig();

    const systemMessage = options.systemMessage || 'You are a helpful educational assistant.';
    const userMessage = typeof messages === 'string' ? messages : messages[messages.length - 1].content;
    
    const compressedMessage = costController.compressPrompt(userMessage);
    const estimatedPromptTokens = Math.ceil(compressedMessage.length / 4);
    const estimatedCost = costController.estimateCost(estimatedPromptTokens);

    if (!costController.canAfford(estimatedCost)) {
      throw new Error(`Daily budget exceeded. Remaining: $${costController.getRemainingBudget().toFixed(2)}`);
    }

    const requestBody = {
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: compressedMessage }
      ],
      max_tokens: options.maxTokens || azureConfig.maxTokens,
      temperature: options.temperature || 0.7,
      top_p: options.topP || 0.95
    };

    const response = await fetch(
      `${azureConfig.endpoint}/openai/deployments/${azureConfig.deploymentName}/chat/completions?api-version=2024-02-15-preview`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': azureConfig.apiKey
        },
        body: JSON.stringify(requestBody)
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Azure API Error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    
    const promptTokens = data.usage?.prompt_tokens || estimatedPromptTokens;
    const completionTokens = data.usage?.completion_tokens || azureConfig.maxTokens;
    costController.recordSpending(promptTokens, completionTokens);

    return {
      content: data.choices[0].message.content,
      usage: data.usage,
      cost: costController.getStats()
    };
  } catch (error) {
    console.error('Azure API call failed:', error);
    throw error;
  }
}