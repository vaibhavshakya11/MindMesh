export class StorageManager {
  saveConceptGraph(topic, graph) {
    const graphs = this.getAllGraphs();
    const timestamp = Date.now();
    const id = `graph_${timestamp}`;
    
    graphs[id] = {
      id,
      topic,
      graph,
      timestamp,
      lastAccessed: timestamp
    };

    localStorage.setItem('mindmesh_graphs', JSON.stringify(graphs));
    return id;
  }

  getConceptGraph(id) {
    const graphs = this.getAllGraphs();
    const graph = graphs[id];
    
    if (graph) {
      graph.lastAccessed = Date.now();
      localStorage.setItem('mindmesh_graphs', JSON.stringify(graphs));
    }
    
    return graph;
  }

  getAllGraphs() {
    const data = localStorage.getItem('mindmesh_graphs');
    return data ? JSON.parse(data) : {};
  }

  deleteGraph(id) {
    const graphs = this.getAllGraphs();
    delete graphs[id];
    localStorage.setItem('mindmesh_graphs', JSON.stringify(graphs));
  }

  exportGraph(id) {
    const graph = this.getConceptGraph(id);
    if (!graph) return null;

    const dataStr = JSON.stringify(graph, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `mindmesh_${graph.topic.replace(/\s+/g, '_')}_${Date.now()}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
  }

  importGraph(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          const id = this.saveConceptGraph(data.topic, data.graph);
          resolve(id);
        } catch (error) {
          reject(new Error('Invalid graph file'));
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }

  saveBookmark(conceptId, conceptName) {
    const bookmarks = this.getBookmarks();
    bookmarks[conceptId] = {
      id: conceptId,
      name: conceptName,
      timestamp: Date.now()
    };
    localStorage.setItem('mindmesh_bookmarks', JSON.stringify(bookmarks));
  }

  removeBookmark(conceptId) {
    const bookmarks = this.getBookmarks();
    delete bookmarks[conceptId];
    localStorage.setItem('mindmesh_bookmarks', JSON.stringify(bookmarks));
  }

  getBookmarks() {
    const data = localStorage.getItem('mindmesh_bookmarks');
    return data ? JSON.parse(data) : {};
  }

  isBookmarked(conceptId) {
    const bookmarks = this.getBookmarks();
    return !!bookmarks[conceptId];
  }
}

export default new StorageManager();