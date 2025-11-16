import React from 'react';
import { Brain, Coffee } from 'lucide-react';
import cognitiveLoadCalculator from '../utils/cognitiveLoadCalculator';

export default function CognitiveLoadMeter({ onBreakSuggestion }) {
  const stats = cognitiveLoadCalculator.getStats();
  const load = parseFloat(stats.load);
  const level = stats.level;

  const getLoadColor = () => {
    if (level === 'low') return '#48bb78';
    if (level === 'moderate') return '#ecc94b';
    if (level === 'high') return '#ed8936';
    return '#f56565';
  };

  const shouldShowBreak = cognitiveLoadCalculator.shouldSuggestBreak();

  return (
    <div className="cognitive-load-meter">
      <div className="meter-header">
        <Brain size={20} />
        <span className="meter-title">Cognitive Load</span>
      </div>

      <div className="load-bar-container">
        <div className="load-bar-bg">
          <div 
            className="load-bar-fill" 
            style={{ 
              width: `${load}%`,
              backgroundColor: getLoadColor()
            }}
          />
        </div>
        <span className="load-percentage">{load.toFixed(0)}%</span>
      </div>

      <div className="load-stats">
        <div className="stat-item">
          <span className="stat-label">Level:</span>
          <span className={`stat-value ${level}`}>
            {level.toUpperCase()}
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Duration:</span>
          <span className="stat-value">{stats.duration} min</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Flow:</span>
          <span className="stat-value">{stats.inFlow ? '✓' : '✗'}</span>
        </div>
      </div>

      {shouldShowBreak && (
        <div className="break-suggestion">
          <Coffee size={18} />
          <div className="break-text">
            <strong>Time for a micro-break!</strong>
            <p>Take 2 minutes to rest your mind</p>
          </div>
          <button onClick={onBreakSuggestion} className="break-btn">
            Start Break
          </button>
        </div>
      )}
    </div>
  );
}