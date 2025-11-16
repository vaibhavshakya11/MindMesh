import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import masteryTracker from '../utils/masteryTracker';

export default function ConceptGraph({ 
  graph, 
  onNodeClick, 
  selectedNode, 
  focusMode, 
  focusedNodes 
}) {
  const svgRef = useRef();

  useEffect(() => {
    if (!graph || !graph.nodes || graph.nodes.length === 0) return;

    const width = 800;
    const height = 600;
    const padding = 100;

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height]);

    const g = svg.append('g');

    svg.call(d3.zoom()
      .scaleExtent([0.5, 3])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      }));

    // Calculate linear positions based on levels
    const nodesByLevel = {};
    graph.nodes.forEach(node => {
      if (!nodesByLevel[node.level]) {
        nodesByLevel[node.level] = [];
      }
      nodesByLevel[node.level].push(node);
    });

    const maxLevel = Math.max(...graph.nodes.map(n => n.level));
    const levelWidth = (width - 2 * padding) / (maxLevel || 1);

    // Position nodes in a linear, hierarchical layout
    graph.nodes.forEach(node => {
      const nodesAtLevel = nodesByLevel[node.level];
      const levelHeight = (height - 2 * padding) / (nodesAtLevel.length + 1);
      const indexAtLevel = nodesAtLevel.indexOf(node);
      
      node.x = padding + (node.level * levelWidth);
      node.y = padding + ((indexAtLevel + 1) * levelHeight);
      node.fx = node.x; // Fix x position
      node.fy = node.y; // Fix y position
    });

    const links = [];
    graph.nodes.forEach(node => {
      if (node.prerequisites && node.prerequisites.length > 0) {
        node.prerequisites.forEach(prereqId => {
          if (graph.nodes.find(n => n.id === prereqId)) {
            links.push({ source: prereqId, target: node.id });
          }
        });
      }
    });

    const visibleNodes = focusMode && focusedNodes.length > 0
      ? graph.nodes.filter(n => focusedNodes.includes(n.id))
      : graph.nodes;

    const visibleLinks = focusMode && focusedNodes.length > 0
      ? links.filter(l => focusedNodes.includes(l.source) && focusedNodes.includes(l.target))
      : links;

    // Create arrow marker
    svg.append('defs').append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '-0 -5 10 10')
      .attr('refX', 28)
      .attr('refY', 0)
      .attr('orient', 'auto')
      .attr('markerWidth', 8)
      .attr('markerHeight', 8)
      .append('svg:path')
      .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
      .attr('fill', '#4a5568');

    // Create link paths with curves
    const link = g.append('g')
      .selectAll('path')
      .data(visibleLinks)
      .join('path')
      .attr('class', 'graph-link')
      .attr('fill', 'none')
      .attr('stroke', '#4a5568')
      .attr('stroke-width', 2)
      .attr('marker-end', 'url(#arrowhead)')
      .attr('d', d => {
        const sourceNode = graph.nodes.find(n => n.id === d.source);
        const targetNode = graph.nodes.find(n => n.id === d.target);
        
        if (!sourceNode || !targetNode) return '';

        const dx = targetNode.x - sourceNode.x;
        const dy = targetNode.y - sourceNode.y;
        
        // Create a smooth curve
        const controlX = sourceNode.x + dx * 0.5;
        const controlY = sourceNode.y + dy * 0.3;
        
        return `M ${sourceNode.x},${sourceNode.y} Q ${controlX},${controlY} ${targetNode.x},${targetNode.y}`;
      });

    const node = g.append('g')
      .selectAll('g')
      .data(visibleNodes)
      .join('g')
      .attr('class', 'graph-node')
      .attr('transform', d => `translate(${d.x},${d.y})`)
      .style('cursor', 'pointer')
      .on('click', (event, d) => {
        event.stopPropagation();
        onNodeClick(d);
      });

    // Add node circles
    node.append('circle')
      .attr('r', d => {
        if (d.level === 0) return 40;
        if (d.level === 1) return 32;
        return 26;
      })
      .attr('fill', d => {
        const mastery = masteryTracker.getMastery(d.id);
        const level = mastery.level;
        const colors = [
          '#1a202c',
          '#2d3748',
          '#4a5568',
          '#718096',
          '#a0aec0',
          '#e2e8f0'
        ];
        return colors[Math.min(level, 5)];
      })
      .attr('stroke', d => {
        if (selectedNode && selectedNode.id === d.id) return '#63b3ed';
        if (d.isCore) return '#48bb78';
        return '#4a5568';
      })
      .attr('stroke-width', d => selectedNode && selectedNode.id === d.id ? 4 : 2)
      .style('filter', 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))');

    // Add node labels
    node.append('text')
      .text(d => {
        const name = d.name;
        return name.length > 12 ? name.substring(0, 12) + '...' : name;
      })
      .attr('text-anchor', 'middle')
      .attr('dy', d => d.level === 0 ? -50 : -40)
      .attr('fill', '#e2e8f0')
      .attr('font-size', d => d.level === 0 ? '15px' : '13px')
      .attr('font-weight', d => d.level === 0 ? 'bold' : '600')
      .style('pointer-events', 'none')
      .style('text-shadow', '0 2px 4px rgba(0,0,0,0.5)');

    // Add mastery level badge
    node.append('circle')
      .attr('cx', 20)
      .attr('cy', -20)
      .attr('r', 12)
      .attr('fill', '#2d3748')
      .attr('stroke', '#4299e1')
      .attr('stroke-width', 2);

    node.append('text')
      .text(d => {
        const mastery = masteryTracker.getMastery(d.id);
        return mastery.level;
      })
      .attr('x', 20)
      .attr('y', -16)
      .attr('text-anchor', 'middle')
      .attr('fill', '#90cdf4')
      .attr('font-size', '11px')
      .attr('font-weight', 'bold')
      .style('pointer-events', 'none');

    // Add level labels
    const levels = [...new Set(graph.nodes.map(n => n.level))].sort();
    levels.forEach(level => {
      const x = padding + (level * levelWidth);
      svg.append('text')
        .attr('x', x)
        .attr('y', 30)
        .attr('text-anchor', 'middle')
        .attr('fill', '#718096')
        .attr('font-size', '12px')
        .attr('font-weight', '600')
        .text(level === 0 ? 'Main Concept' : level === 1 ? 'Core Concepts' : 'Details');
    });

  }, [graph, selectedNode, focusMode, focusedNodes, onNodeClick]);

  if (!graph || !graph.nodes || graph.nodes.length === 0) {
    return (
      <div className="graph-placeholder">
        <p>Enter a topic to generate your concept map</p>
      </div>
    );
  }

  return (
    <div className="concept-graph">
      <svg ref={svgRef}></svg>
      <div className="graph-legend">
        <div className="legend-item">
          <div className="legend-circle" style={{ background: '#1a202c' }}></div>
          <span>L0: New</span>
        </div>
        <div className="legend-item">
          <div className="legend-circle" style={{ background: '#4a5568' }}></div>
          <span>L2: Learning</span>
        </div>
        <div className="legend-item">
          <div className="legend-circle" style={{ background: '#a0aec0' }}></div>
          <span>L4: Mastered</span>
        </div>
      </div>
    </div>
  );
}