export class MasteryTracker {
  constructor() {
    this.masteryData = this.loadMasteryData();
  }

  loadMasteryData() {
    const data = localStorage.getItem('mindmesh_mastery');
    return data ? JSON.parse(data) : {};
  }

  saveMasteryData() {
    localStorage.setItem('mindmesh_mastery', JSON.stringify(this.masteryData));
  }

  initializeConcept(conceptId) {
    if (!this.masteryData[conceptId]) {
      this.masteryData[conceptId] = {
        level: 0,
        attempts: 0,
        correct: 0,
        lastReview: Date.now(),
        nextReview: Date.now(),
        timeSpent: 0,
        hesitations: 0
      };
      this.saveMasteryData();
    }
  }

  recordAttempt(conceptId, isCorrect, timeSpent, hesitated = false) {
    this.initializeConcept(conceptId);
    
    const data = this.masteryData[conceptId];
    data.attempts++;
    if (isCorrect) data.correct++;
    if (hesitated) data.hesitations++;
    data.timeSpent += timeSpent;
    data.lastReview = Date.now();

    const accuracy = data.correct / data.attempts;
    
    if (isCorrect && accuracy > 0.8) {
      data.level = Math.min(data.level + 1, 5);
    } else if (!isCorrect && data.attempts > 1) {
      data.level = Math.max(data.level - 1, 0);
    }

    const intervals = [5, 30, 1440, 10080, 43200]; // minutes
    const intervalMs = intervals[Math.min(data.level, 4)] * 60 * 1000;
    data.nextReview = Date.now() + intervalMs;

    this.saveMasteryData();
    return data;
  }

  getMastery(conceptId) {
    this.initializeConcept(conceptId);
    return this.masteryData[conceptId];
  }

  getAllMastery() {
    return this.masteryData;
  }

  getMasteryLevel(conceptId) {
    const data = this.getMastery(conceptId);
    return data.level;
  }

  isDueForReview(conceptId) {
    const data = this.getMastery(conceptId);
    return Date.now() >= data.nextReview;
  }

  getConceptsDueForReview(conceptIds) {
    return conceptIds.filter(id => this.isDueForReview(id));
  }

  reset() {
    this.masteryData = {};
    this.saveMasteryData();
  }
}

export default new MasteryTracker();