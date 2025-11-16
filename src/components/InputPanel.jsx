import React, { useState } from 'react';
import { BookOpen, Loader, Edit3 } from 'lucide-react';

export default function InputPanel({ onSubmit, onManualMode, isLoading }) {
  const [topic, setTopic] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (topic.trim()) {
      onSubmit(topic.trim());
    }
  };

  const examples = [
    'Rigid Body Mechanics',
    'Neural Networks',
    'Quantum Entanglement',
    'Photosynthesis',
    'Binary Search Trees'
  ];

  return (
    <div className="input-panel">
      <div className="input-header">
        <BookOpen size={32} />
        <h1>MindMesh</h1>
        <p>Transform any topic into an adaptive concept map</p>
      </div>

      <form onSubmit={handleSubmit} className="input-form">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter a topic (e.g., Rigid Body Mechanics, Neural Networks...)"
          disabled={isLoading}
          className="topic-input"
        />
        <div className="input-button-group">
          <button type="submit" disabled={isLoading || !topic.trim()} className="submit-btn">
            {isLoading ? (
              <>
                <Loader className="spinner" size={20} />
                Generating...
              </>
            ) : (
              'Generate Concept Map'
            )}
          </button>
          <button 
            type="button" 
            onClick={onManualMode} 
            disabled={isLoading}
            className="manual-btn"
            title="Build concept map manually"
          >
            <Edit3 size={20} />
            Manual Mode
          </button>
        </div>
      </form>

      <div className="examples">
        <span>Try:</span>
        {examples.map((ex, idx) => (
          <button
            key={idx}
            onClick={() => setTopic(ex)}
            disabled={isLoading}
            className="example-btn"
          >
            {ex}
          </button>
        ))}
      </div>
    </div>
  );
}