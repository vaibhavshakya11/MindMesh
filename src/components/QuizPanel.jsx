import React, { useState, useEffect } from 'react';
import { Trophy, X, AlertCircle } from 'lucide-react';
import { generateQuiz } from '../utils/quizGenerator';
import masteryTracker from '../utils/masteryTracker';
import cognitiveLoadCalculator from '../utils/cognitiveLoadCalculator';

export default function QuizPanel({ concept, onClose, onComplete }) {
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());
  const [hesitationTimer, setHesitationTimer] = useState(null);
  const [hasHesitated, setHasHesitated] = useState(false);

  useEffect(() => {
    loadQuiz();
  }, [concept]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!showResult && !hasHesitated) {
        setHasHesitated(true);
      }
    }, 10000);

    setHesitationTimer(timer);

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [showResult, hasHesitated]);

  const loadQuiz = async () => {
    setLoading(true);
    try {
      const mastery = masteryTracker.getMastery(concept.id);
      let difficulty = 'medium';
      
      if (mastery.level <= 1) difficulty = 'easy';
      else if (mastery.level >= 4) difficulty = 'hard';

      const newQuiz = await generateQuiz(concept, difficulty);
      setQuiz(newQuiz);
      setStartTime(Date.now());
    } catch (error) {
      console.error('Quiz generation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (selectedOption === null) return;

    const timeSpent = Date.now() - startTime;
    const isCorrect = selectedOption === quiz.correctIndex;

    masteryTracker.recordAttempt(concept.id, isCorrect, timeSpent, hasHesitated);
    
    cognitiveLoadCalculator.recordInteraction('quiz', timeSpent, {
      isWrong: !isCorrect,
      hesitated: hasHesitated
    });

    setShowResult(true);

    if (hesitationTimer) {
      clearTimeout(hesitationTimer);
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setShowResult(false);
    setHasHesitated(false);
    onComplete();
    loadQuiz();
  };

  if (loading) {
    return (
      <div className="quiz-panel">
        <div className="quiz-header">
          <h3>Loading Quiz...</h3>
          <button onClick={onClose} className="icon-btn">
            <X size={20} />
          </button>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="quiz-panel">
        <div className="quiz-header">
          <h3>Failed to load quiz</h3>
          <button onClick={onClose} className="icon-btn">
            <X size={20} />
          </button>
        </div>
        <button onClick={loadQuiz} className="action-btn">Retry</button>
      </div>
    );
  }

  const isCorrect = selectedOption === quiz.correctIndex;

  return (
    <div className="quiz-panel">
      <div className="quiz-header">
        <div className="quiz-title">
          <Trophy size={24} />
          <h3>Quiz: {concept.name}</h3>
        </div>
        <button onClick={onClose} className="icon-btn">
          <X size={20} />
        </button>
      </div>

      <div className="quiz-content">
        <div className="quiz-difficulty">
          <span className={`difficulty-badge ${quiz.difficulty}`}>
            {quiz.difficulty.toUpperCase()}
          </span>
        </div>

        <div className="quiz-question">
          <p>{quiz.question}</p>
        </div>

        <div className="quiz-options">
          {quiz.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => !showResult && setSelectedOption(idx)}
              disabled={showResult}
              className={`option-btn ${
                selectedOption === idx ? 'selected' : ''
              } ${
                showResult && idx === quiz.correctIndex ? 'correct' : ''
              } ${
                showResult && selectedOption === idx && !isCorrect ? 'incorrect' : ''
              }`}
            >
              <span className="option-letter">{String.fromCharCode(65 + idx)}</span>
              <span className="option-text">{option}</span>
            </button>
          ))}
        </div>

        {showResult && (
          <div className={`quiz-result ${isCorrect ? 'correct' : 'incorrect'}`}>
            <div className="result-header">
              {isCorrect ? (
                <>
                  <Trophy size={24} />
                  <h4>Correct!</h4>
                </>
              ) : (
                <>
                  <AlertCircle size={24} />
                  <h4>Not quite</h4>
                </>
              )}
            </div>
            <p className="result-explanation">{quiz.explanation}</p>
            {hasHesitated && (
              <p className="hesitation-note">
                You took more than 10 seconds — consider reviewing this concept.
              </p>
            )}
          </div>
        )}

        <div className="quiz-actions">
          {!showResult ? (
            <button 
              onClick={handleSubmit} 
              disabled={selectedOption === null}
              className="submit-btn"
            >
              Submit Answer
            </button>
          ) : (
            <div className="result-actions">
              <button onClick={handleNext} className="action-btn">
                Next Question
              </button>
              <button onClick={onClose} className="secondary-btn">
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}