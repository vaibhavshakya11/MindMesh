import React, { useState } from 'react';
import { Heart, Smile, Meh, Frown } from 'lucide-react';

export default function WellbeingPanel({ onEmotionChange }) {
  const [emotion, setEmotion] = useState('neutral');
  const [showBreakTimer, setShowBreakTimer] = useState(false);
  const [breakTimeLeft, setBreakTimeLeft] = useState(120);

  const emotions = [
    { value: 'great', icon: Smile, label: 'Great', color: '#48bb78' },
    { value: 'neutral', icon: Meh, label: 'Okay', color: '#ecc94b' },
    { value: 'struggling', icon: Frown, label: 'Struggling', color: '#f56565' }
  ];

  const handleEmotionChange = (newEmotion) => {
    setEmotion(newEmotion);
    onEmotionChange(newEmotion);
  };

  const startBreak = () => {
    setShowBreakTimer(true);
    setBreakTimeLeft(120);

    const timer = setInterval(() => {
      setBreakTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setShowBreakTimer(false);
          return 120;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className="wellbeing-panel">
      <div className="wellbeing-header">
        <Heart size={20} />
        <h3>How are you feeling?</h3>
      </div>

      <div className="emotion-selector">
        {emotions.map(({ value, icon: Icon, label, color }) => (
          <button
            key={value}
            onClick={() => handleEmotionChange(value)}
            className={`emotion-btn ${emotion === value ? 'active' : ''}`}
            style={{ 
              borderColor: emotion === value ? color : 'transparent',
              color: emotion === value ? color : '#a0aec0'
            }}
          >
            <Icon size={24} />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {emotion === 'struggling' && (
        <div className="wellbeing-tip">
          <p>It's okay to find things challenging! Consider:</p>
          <ul>
            <li>Reviewing prerequisites</li>
            <li>Taking a short break</li>
            <li>Starting with easier concepts</li>
          </ul>
        </div>
      )}

      {showBreakTimer && (
        <div className="break-timer">
          <h4>Break Time</h4>
          <div className="timer-display">
            {Math.floor(breakTimeLeft / 60)}:{(breakTimeLeft % 60).toString().padStart(2, '0')}
          </div>
          <p>Take deep breaths and relax</p>
        </div>
      )}
    </div>
  );
}