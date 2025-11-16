import React, { useState } from 'react';
import { BookOpen, Brain, Bookmark, Check, X } from 'lucide-react';
import { getELI5Explanation } from '../utils/conceptExtractor';
import storageManager from '../utils/storageManager';
import masteryTracker from '../utils/masteryTracker';

export default function NodeDetailPanel({ node, onClose, onStartQuiz }) {
  const [eli5, setEli5] = useState(null);
  const [loadingEli5, setLoadingEli5] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(
    storageManager.isBookmarked(node.id)
  );

  const mastery = masteryTracker.getMastery(node.id);

  const handleGetEli5 = async () => {
    setLoadingEli5(true);
    try {
      const explanation = await getELI5Explanation(node.name, node.definition);
      setEli5(explanation);
    } catch (error) {
      setEli5('Unable to generate explanation. Please try again.');
    } finally {
      setLoadingEli5(false);
    }
  };

  const handleBookmark = () => {
    if (isBookmarked) {
      storageManager.removeBookmark(node.id);
      setIsBookmarked(false);
    } else {
      storageManager.saveBookmark(node.id, node.name);
      setIsBookmarked(true);
    }
  };

  return (
    <div className="node-detail-panel">
      <div className="panel-header">
        <div className="panel-title">
          <BookOpen size={24} />
          <h2>{node.name}</h2>
        </div>
        <div className="panel-actions">
          <button onClick={handleBookmark} className="icon-btn" title={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}>
            {isBookmarked ? <Check size={20} /> : <Bookmark size={20} />}
          </button>
          <button onClick={onClose} className="icon-btn">
            <X size={20} />
          </button>
        </div>
      </div>

      <div className="panel-content">
        <div className="detail-section">
          <h3>Definition</h3>
          <p>{node.definition}</p>
        </div>

        {node.formula && (
          <div className="detail-section">
            <h3>Formula</h3>
            <div className="formula">{node.formula}</div>
          </div>
        )}

        {node.prerequisites && node.prerequisites.length > 0 && (
          <div className="detail-section">
            <h3>Prerequisites</h3>
            <p className="prerequisites-note">
              Master these concepts first: {node.prerequisites.join(', ')}
            </p>
          </div>
        )}

        <div className="detail-section">
          <h3>Your Progress</h3>
          <div className="mastery-stats">
            <div className="stat">
              <span className="stat-label">Mastery Level:</span>
              <span className="stat-value">Level {mastery.level}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Attempts:</span>
              <span className="stat-value">{mastery.attempts}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Accuracy:</span>
              <span className="stat-value">
                {mastery.attempts > 0 
                  ? `${Math.round((mastery.correct / mastery.attempts) * 100)}%`
                  : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        <div className="detail-section">
          <h3>Simple Explanation</h3>
          {!eli5 ? (
            <button 
              onClick={handleGetEli5} 
              disabled={loadingEli5}
              className="action-btn"
            >
              <Brain size={18} />
              {loadingEli5 ? 'Generating...' : 'Explain Like I\'m 5'}
            </button>
          ) : (
            <div className="eli5-explanation">
              <p>{eli5}</p>
            </div>
          )}
        </div>

        <div className="panel-footer">
          <button onClick={() => onStartQuiz(node)} className="quiz-btn">
            Test Your Knowledge
          </button>
        </div>
      </div>
    </div>
  );
}