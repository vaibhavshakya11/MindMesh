import React from 'react';
import { Zap, X } from 'lucide-react';

export default function FlowMode({ isActive, onExit }) {
  if (!isActive) return null;

  return (
    <div className="flow-mode-overlay">
      <div className="flow-mode-indicator">
        <Zap size={24} />
        <span>FLOW MODE</span>
        <button onClick={onExit} className="flow-exit-btn">
          <X size={20} />
        </button>
      </div>
    </div>
  );
}