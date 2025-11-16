import React, { useState } from 'react';
import { Plus, Save, X } from 'lucide-react';

export default function ManualConceptPanel({ graph, onAddConcept, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    definition: '',
    level: 1,
    formula: '',
    prerequisites: [],
    isCore: false
  });

  const [showForm, setShowForm] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePrerequisiteToggle = (nodeId) => {
    setFormData(prev => ({
      ...prev,
      prerequisites: prev.prerequisites.includes(nodeId)
        ? prev.prerequisites.filter(id => id !== nodeId)
        : [...prev.prerequisites, nodeId]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.definition) {
      alert('Please fill in name and definition');
      return;
    }

    const newConcept = {
      id: `manual_${Date.now()}`,
      name: formData.name.trim(),
      definition: formData.definition.trim(),
      level: parseInt(formData.level),
      formula: formData.formula.trim(),
      prerequisites: formData.prerequisites,
      isCore: formData.isCore
    };

    onAddConcept(newConcept);

    // Reset form
    setFormData({
      name: '',
      definition: '',
      level: 1,
      formula: '',
      prerequisites: [],
      isCore: false
    });
    setShowForm(false);
  };

  return (
    <div className="manual-concept-panel">
      <div className="manual-header">
        <div className="manual-title">
          <Plus size={24} />
          <h3>Add Concept Manually</h3>
        </div>
        <button onClick={onClose} className="icon-btn">
          <X size={20} />
        </button>
      </div>

      {!showForm ? (
        <button 
          onClick={() => setShowForm(true)} 
          className="add-concept-btn"
        >
          <Plus size={20} />
          Add New Concept
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="concept-form">
          <div className="form-group">
            <label>Concept Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Angular Velocity"
              required
            />
          </div>

          <div className="form-group">
            <label>Definition *</label>
            <textarea
              name="definition"
              value={formData.definition}
              onChange={handleChange}
              placeholder="Brief definition of the concept..."
              rows="3"
              required
            />
          </div>

          <div className="form-group">
            <label>Level</label>
            <select name="level" value={formData.level} onChange={handleChange}>
              <option value="0">0 - Main Concept</option>
              <option value="1">1 - Core Concept</option>
              <option value="2">2 - Supporting Detail</option>
            </select>
          </div>

          <div className="form-group">
            <label>Formula (Optional)</label>
            <input
              type="text"
              name="formula"
              value={formData.formula}
              onChange={handleChange}
              placeholder="e.g., ω = dθ/dt"
            />
          </div>

          {graph && graph.nodes && graph.nodes.length > 0 && (
            <div className="form-group">
              <label>Prerequisites</label>
              <div className="prerequisites-list">
                {graph.nodes.map(node => (
                  <label key={node.id} className="prerequisite-item">
                    <input
                      type="checkbox"
                      checked={formData.prerequisites.includes(node.id)}
                      onChange={() => handlePrerequisiteToggle(node.id)}
                    />
                    <span>{node.name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="isCore"
                checked={formData.isCore}
                onChange={handleChange}
              />
              <span>Mark as Core Concept</span>
            </label>
          </div>

          <div className="form-actions">
            <button type="submit" className="save-btn">
              <Save size={18} />
              Add Concept
            </button>
            <button 
              type="button" 
              onClick={() => setShowForm(false)} 
              className="cancel-btn"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}