import React, { useState, useEffect } from 'react';
import InputPanel from './components/InputPanel';
import ConceptGraph from './components/ConceptGraph';
import NodeDetailPanel from './components/NodeDetailPanel';
import QuizPanel from './components/QuizPanel';
import CognitiveLoadMeter from './components/CognitiveLoadMeter';
import WellbeingPanel from './components/WellbeingPanel';
import ControlPanel from './components/ControlPanel';
import FlowMode from './components/FlowMode';
import ManualConceptPanel from './components/ManualConceptPanel';
import { extractConcepts } from './utils/conceptExtractor';
import storageManager from './utils/storageManager';
import masteryTracker from './utils/masteryTracker';
import cognitiveLoadCalculator from './utils/cognitiveLoadCalculator';
import { AlertCircle, Plus } from 'lucide-react';

function App() {
  const [graph, setGraph] = useState(null);
  const [graphId, setGraphId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [quizNode, setQuizNode] = useState(null);
  const [emotion, setEmotion] = useState('neutral');
  const [focusMode, setFocusMode] = useState(false);
  const [focusedNodes, setFocusedNodes] = useState([]);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [flowModeActive, setFlowModeActive] = useState(false);
  const [manualMode, setManualMode] = useState(false);
  const [showManualPanel, setShowManualPanel] = useState(false);

  useEffect(() => {
    const checkFlowState = setInterval(() => {
      const inFlow = cognitiveLoadCalculator.isInFlowState();
      setFlowModeActive(inFlow && !selectedNode && !quizNode);
    }, 5000);

    return () => clearInterval(checkFlowState);
  }, [selectedNode, quizNode]);

  const handleSubmit = async (topic) => {
    setLoading(true);
    setError(null);
    setSelectedNode(null);
    setQuizNode(null);
    setManualMode(false);

    try {
      const conceptGraph = await extractConcepts(topic);
      setGraph(conceptGraph);
      
      const id = storageManager.saveConceptGraph(topic, conceptGraph);
      setGraphId(id);

      conceptGraph.nodes.forEach(node => {
        masteryTracker.initializeConcept(node.id);
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleManualMode = () => {
    setManualMode(true);
    setGraph({
      mainConcept: 'Manual Concept Map',
      nodes: []
    });
    setShowManualPanel(true);
    const id = storageManager.saveConceptGraph('Manual Concept Map', {
      mainConcept: 'Manual Concept Map',
      nodes: []
    });
    setGraphId(id);
  };

  const handleAddConcept = (concept) => {
    const updatedGraph = {
      ...graph,
      nodes: [...graph.nodes, concept]
    };
    
    setGraph(updatedGraph);
    masteryTracker.initializeConcept(concept.id);
    
    if (graphId) {
      storageManager.saveConceptGraph(graph.mainConcept, updatedGraph);
    }
  };

  const handleNodeClick = (node) => {
    setSelectedNode(node);
    setQuizNode(null);
    setShowManualPanel(false);
    
    cognitiveLoadCalculator.recordInteraction('node_view', 1000, {});
  };

  const handleStartQuiz = (node) => {
    setQuizNode(node);
    setSelectedNode(null);
    setShowManualPanel(false);
  };

  const handleQuizComplete = () => {
    setGraph({ ...graph });
  };

  const handleEmotionChange = (newEmotion) => {
    setEmotion(newEmotion);
  };

  const handleFocusModeToggle = () => {
    if (!focusMode && selectedNode) {
      const relatedNodes = [selectedNode.id];
      if (selectedNode.prerequisites) {
        relatedNodes.push(...selectedNode.prerequisites);
      }
      graph.nodes.forEach(node => {
        if (node.prerequisites && node.prerequisites.includes(selectedNode.id)) {
          relatedNodes.push(node.id);
        }
      });
      setFocusedNodes(relatedNodes);
    }
    setFocusMode(!focusMode);
  };

  const handleImport = (id) => {
    const imported = storageManager.getConceptGraph(id);
    if (imported) {
      setGraph(imported.graph);
      setGraphId(imported.id);
      setManualMode(false);
    }
  };

  const handleBreakSuggestion = () => {
    setSelectedNode(null);
    setQuizNode(null);
    alert('Take a 2-minute break. Breathe deeply and relax your eyes.');
  };

  const renderBookmarks = () => {
    const bookmarks = storageManager.getBookmarks();
    const bookmarkArray = Object.values(bookmarks);

    if (bookmarkArray.length === 0) {
      return <div className="bookmarks-empty">No bookmarks yet</div>;
    }

    return (
      <div className="bookmarks-list">
        <h3>Your Bookmarks</h3>
        {bookmarkArray.map(bookmark => {
          const node = graph?.nodes.find(n => n.id === bookmark.id);
          return (
            <button
              key={bookmark.id}
              onClick={() => {
                if (node) handleNodeClick(node);
                setShowBookmarks(false);
              }}
              className="bookmark-item"
            >
              <span>{bookmark.name}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  storageManager.removeBookmark(bookmark.id);
                  setShowBookmarks(false);
                  setTimeout(() => setShowBookmarks(true), 10);
                }}
                className="bookmark-remove"
              >
                ×
              </button>
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="app">
      <FlowMode isActive={flowModeActive} onExit={() => setFlowModeActive(false)} />
      
      <div className="app-header">
        <h1>MindMesh</h1>
        <p className="app-tagline">Adaptive Learning Through Concept Mapping</p>
      </div>

      {error && (
        <div className="error-banner">
          <AlertCircle size={20} />
          <span>{error}</span>
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      {!graph && !loading && (
        <div className="app-main centered">
          <InputPanel 
            onSubmit={handleSubmit} 
            onManualMode={handleManualMode}
            isLoading={loading} 
          />
        </div>
      )}

      {(graph || loading) && (
        <div className="app-layout">
          <div className="left-sidebar">
            <CognitiveLoadMeter onBreakSuggestion={handleBreakSuggestion} />
            <WellbeingPanel onEmotionChange={handleEmotionChange} />
            <ControlPanel
              graph={graph}
              graphId={graphId}
              onImport={handleImport}
              onFocusModeToggle={handleFocusModeToggle}
              focusMode={focusMode}
              onShowBookmarks={() => setShowBookmarks(!showBookmarks)}
            />
          </div>

          <div className="main-content">
            {loading && (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Generating your concept map...</p>
              </div>
            )}
            
            {graph && !loading && (
              <ConceptGraph
                graph={graph}
                onNodeClick={handleNodeClick}
                selectedNode={selectedNode}
                focusMode={focusMode}
                focusedNodes={focusedNodes}
              />
            )}

            {showBookmarks && (
              <div className="bookmarks-overlay">
                <div className="bookmarks-panel">
                  <button
                    onClick={() => setShowBookmarks(false)}
                    className="bookmarks-close"
                  >
                    ×
                  </button>
                  {renderBookmarks()}
                </div>
              </div>
            )}
          </div>

          <div className="right-sidebar">
            {manualMode && showManualPanel && (
              <ManualConceptPanel
                graph={graph}
                onAddConcept={handleAddConcept}
                onClose={() => setShowManualPanel(false)}
              />
            )}

            {selectedNode && !quizNode && !showManualPanel && (
              <NodeDetailPanel
                node={selectedNode}
                onClose={() => setSelectedNode(null)}
                onStartQuiz={handleStartQuiz}
              />
            )}

            {quizNode && !showManualPanel && (
              <QuizPanel
                concept={quizNode}
                onClose={() => setQuizNode(null)}
                onComplete={handleQuizComplete}
              />
            )}

            {!selectedNode && !quizNode && !showManualPanel && graph && (
              <div className="info-panel">
                <h3>Welcome to MindMesh</h3>
                <p>Click on any node to explore concepts and test your knowledge.</p>
                {manualMode && (
                  <button 
                    onClick={() => setShowManualPanel(true)}
                    className="action-btn"
                    style={{ marginTop: '1rem' }}
                  >
                    <Plus size={18} />
                    Add New Concept
                  </button>
                )}
                <div className="quick-tips">
                  <h4>Quick Tips:</h4>
                  <ul>
                    <li>Darker nodes = lower mastery</li>
                    <li>Lighter nodes = higher mastery</li>
                    <li>Green borders = core concepts</li>
                    <li>Blue border = selected node</li>
                    {manualMode && <li>Click "Add New Concept" to build manually</li>}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;