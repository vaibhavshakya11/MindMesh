export const azureConfig = {
  endpoint: process.env.REACT_APP_AZURE_ENDPOINT || '',
  apiKey: process.env.REACT_APP_AZURE_API_KEY || '',
  deploymentName: process.env.REACT_APP_AZURE_DEPLOYMENT_NAME || 'gpt-4o-mini',
  maxTokens: parseInt(process.env.REACT_APP_MAX_TOKENS) || 2000,
  compressionLevel: process.env.REACT_APP_COMPRESSION_LEVEL || 'medium',
  dailyBudgetUSD: parseFloat(process.env.REACT_APP_DAILY_BUDGET_USD) || 5.0
};

export const validateConfig = () => {
  if (!azureConfig.endpoint || !azureConfig.apiKey) {
    throw new Error('Azure configuration missing. Please check your .env file.');
  }
  return true;
};