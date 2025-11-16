import { azureConfig } from '../config/azureConfig';

class CostController {
  constructor() {
    this.costPerToken = 0.00015 / 1000; // GPT-4o-mini approximate cost
    this.dailySpent = this.loadDailySpent();
    this.lastResetDate = this.loadLastResetDate();
    this.checkDailyReset();
  }

  loadDailySpent() {
    const spent = localStorage.getItem('mindmesh_daily_spent');
    return spent ? parseFloat(spent) : 0;
  }

  saveDailySpent() {
    localStorage.setItem('mindmesh_daily_spent', this.dailySpent.toString());
  }

  loadLastResetDate() {
    return localStorage.getItem('mindmesh_last_reset') || new Date().toDateString();
  }

  saveLastResetDate() {
    localStorage.setItem('mindmesh_last_reset', new Date().toDateString());
  }

  checkDailyReset() {
    const today = new Date().toDateString();
    if (this.lastResetDate !== today) {
      this.dailySpent = 0;
      this.lastResetDate = today;
      this.saveDailySpent();
      this.saveLastResetDate();
    }
  }

  estimateCost(promptTokens, completionTokens = null) {
    const maxTokens = completionTokens || azureConfig.maxTokens;
    return (promptTokens + maxTokens) * this.costPerToken;
  }

  canAfford(estimatedCost) {
    return (this.dailySpent + estimatedCost) <= azureConfig.dailyBudgetUSD;
  }

  recordSpending(promptTokens, completionTokens) {
    const cost = this.estimateCost(promptTokens, completionTokens);
    this.dailySpent += cost;
    this.saveDailySpent();
    return cost;
  }

  compressPrompt(prompt, level = azureConfig.compressionLevel) {
    if (level === 'low') return prompt;
    
    if (level === 'medium') {
      return prompt
        .replace(/\s+/g, ' ')
        .replace(/\n+/g, '\n')
        .trim();
    }
    
    if (level === 'high') {
      return prompt
        .replace(/\s+/g, ' ')
        .replace(/please|kindly|could you/gi, '')
        .replace(/\n+/g, ' ')
        .trim()
        .substring(0, 1000);
    }
    
    return prompt;
  }

  getRemainingBudget() {
    return azureConfig.dailyBudgetUSD - this.dailySpent;
  }

  getStats() {
    return {
      dailySpent: this.dailySpent.toFixed(4),
      remainingBudget: this.getRemainingBudget().toFixed(4),
      budgetLimit: azureConfig.dailyBudgetUSD.toFixed(2)
    };
  }
}

export default new CostController();