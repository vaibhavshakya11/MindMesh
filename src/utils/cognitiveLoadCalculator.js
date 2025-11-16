export class CognitiveLoadCalculator {
  constructor() {
    this.sessionData = {
      startTime: Date.now(),
      interactions: [],
      wrongAnswers: 0,
      hesitations: 0,
      avgTimePerNode: 0,
      currentLoad: 0
    };
  }

  recordInteraction(type, duration, metadata = {}) {
    this.sessionData.interactions.push({
      type,
      duration,
      timestamp: Date.now(),
      ...metadata
    });

    if (metadata.isWrong) {
      this.sessionData.wrongAnswers++;
    }

    if (metadata.hesitated) {
      this.sessionData.hesitations++;
    }

    this.calculateLoad();
  }

  calculateLoad() {
    const recentInteractions = this.sessionData.interactions.slice(-10);
    
    if (recentInteractions.length === 0) {
      this.sessionData.currentLoad = 0;
      return 0;
    }

    const avgTime = recentInteractions.reduce((sum, i) => sum + i.duration, 0) / recentInteractions.length;
    const recentWrong = recentInteractions.filter(i => i.isWrong).length;
    const recentHesitations = recentInteractions.filter(i => i.hesitated).length;

    const timeScore = Math.min(avgTime / 60000, 1) * 30;
    const errorScore = (recentWrong / recentInteractions.length) * 40;
    const hesitationScore = (recentHesitations / recentInteractions.length) * 30;

    this.sessionData.currentLoad = Math.min(timeScore + errorScore + hesitationScore, 100);
    this.sessionData.avgTimePerNode = avgTime;

    return this.sessionData.currentLoad;
  }

  getCurrentLoad() {
    return this.sessionData.currentLoad;
  }

  getLoadLevel() {
    const load = this.sessionData.currentLoad;
    if (load < 25) return 'low';
    if (load < 50) return 'moderate';
    if (load < 75) return 'high';
    return 'critical';
  }

  shouldSuggestBreak() {
    return this.sessionData.currentLoad > 70 || 
           this.sessionData.wrongAnswers > 3 ||
           (Date.now() - this.sessionData.startTime) > 45 * 60 * 1000;
  }

  isInFlowState() {
    const load = this.sessionData.currentLoad;
    const recentInteractions = this.sessionData.interactions.slice(-5);
    const recentCorrect = recentInteractions.filter(i => !i.isWrong).length;
    
    return load > 30 && load < 70 && recentCorrect >= 4;
  }

  getStats() {
    const sessionDuration = (Date.now() - this.sessionData.startTime) / 1000 / 60;
    return {
      load: this.sessionData.currentLoad,
      level: this.getLoadLevel(),
      duration: sessionDuration.toFixed(1),
      interactions: this.sessionData.interactions.length,
      wrongAnswers: this.sessionData.wrongAnswers,
      hesitations: this.sessionData.hesitations,
      inFlow: this.isInFlowState()
    };
  }

  reset() {
    this.sessionData = {
      startTime: Date.now(),
      interactions: [],
      wrongAnswers: 0,
      hesitations: 0,
      avgTimePerNode: 0,
      currentLoad: 0
    };
  }
}

export default new CognitiveLoadCalculator();