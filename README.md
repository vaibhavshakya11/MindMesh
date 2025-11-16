# MindMesh — The Adaptive Concept Map That Learns You

[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![D3.js](https://img.shields.io/badge/D3.js-7.8.5-orange.svg)](https://d3js.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

An intelligent, client-side learning platform that transforms any study topic into an interactive concept map using Azure GPT-4o-mini. Features adaptive quizzes, spaced repetition, cognitive load monitoring, and wellbeing support.

![MindMesh Screenshot](https://via.placeholder.com/800x400?text=MindMesh+Concept+Map)

---

## 🌟 Features

### 🧠 Core Learning Engine
- **AI-Powered Concept Extraction**: Automatically converts any topic into a hierarchical concept graph
- **Linear Graph Visualization**: Clean, left-to-right layout using D3.js
- **Manual Mode**: Build concept maps from scratch without AI
- **Interactive Nodes**: Click, drag, zoom, and explore relationships
- **Mastery Heatmap**: Visual feedback showing understanding levels (L0-L5)
- **Prerequisite Mapping**: Clear learning pathways from basics to advanced

### 📚 Adaptive Learning
- **Micro-Quizzes**: Context-aware questions based on your mastery level
- **Spaced Repetition**: Smart scheduling for optimal retention (5min → 30min → 1day → 1week → 1month)
- **ELI5 Explanations**: Get simple explanations for any concept on demand
- **Difficulty Adjustment**: Quiz complexity adapts to your emotion and performance
- **Real-time Mastery Tracking**: Watch your progress grow with each interaction

### 💚 Wellbeing & Cognitive Load
- **Real-time Load Monitoring**: Tracks mental effort based on time, errors, and hesitation
- **Micro-Recovery Nudges**: Break suggestions when cognitive load exceeds 70%
- **Flow Mode**: Distraction-free UI that activates during optimal focus states
- **Emotion Tracking**: Adjust difficulty based on how you're feeling (Great/Okay/Struggling)
- **Session Statistics**: Duration, interactions, and performance metrics

### 🛠️ Utility Features
- **Focus Mode**: Isolate concept subgraphs with prerequisites and dependents
- **Smart Bookmarks**: Save important concepts for quick review
- **Import/Export**: Share and backup your concept maps as JSON
- **Persistent Storage**: All progress saved locally in browser
- **Cost Control**: Built-in Azure API budget management with real-time tracking

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 16+ and npm
- **Azure OpenAI** account with GPT-4o-mini deployment

### Installation

1. **Clone or download the project:**
```bash
git clone https://github.com/yourusername/mindmesh.git
cd mindmesh
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure Azure OpenAI:**

Create a `.env` file in the root directory:

```env
REACT_APP_AZURE_ENDPOINT=https://your-resource.openai.azure.com/
REACT_APP_AZURE_API_KEY=your-api-key-here
REACT_APP_AZURE_DEPLOYMENT_NAME=gpt-4o-mini
REACT_APP_MAX_TOKENS=2000
REACT_APP_COMPRESSION_LEVEL=medium
REACT_APP_DAILY_BUDGET_USD=5.00
```

**How to get Azure credentials:**
- Go to [Azure Portal](https://portal.azure.com)
- Create an Azure OpenAI resource
- Deploy the `gpt-4o-mini` model
- Copy the endpoint and API key from "Keys and Endpoint" section

4. **Start the development server:**
```bash
npm start
```

5. **Open in browser:**
Navigate to `http://localhost:3000`

---

## 📖 Usage Guide

### 🎯 Generate a Concept Map (AI Mode)

1. Enter a topic in the input field (e.g., "Rigid Body Mechanics", "Neural Networks")
2. Click **"Generate Concept Map"**
3. Wait 5-15 seconds for AI to extract concepts
4. Explore the linear graph with nodes arranged by complexity

**Example Topics:**
- Physics: "Thermodynamics", "Quantum Entanglement", "Electromagnetism"
- Computer Science: "Binary Search Trees", "Machine Learning", "REST APIs"
- Biology: "Photosynthesis", "Cell Division", "Gene Expression"
- Mathematics: "Calculus", "Linear Algebra", "Probability Theory"

### ✍️ Build Manually (Manual Mode)

1. Click **"Manual Mode"** on the input screen
2. Start with a main concept (Level 0)
3. Click **"Add New Concept"** in the right panel
4. Fill out the form:
   - **Name**: Concept title
   - **Definition**: Brief explanation
   - **Level**: 0 (Main), 1 (Core), 2 (Detail)
   - **Formula**: Optional mathematical formula
   - **Prerequisites**: Select from existing nodes
   - **Core Concept**: Mark as essential
5. Click **"Add Concept"** to place it on the graph

### 🔍 Explore Concepts

- **Click any node** to view details, definitions, and formulas
- Use **"Explain Like I'm 5"** for simple analogies
- View **prerequisite chains** and learning paths
- Check **mastery stats**: level, attempts, accuracy
- **Bookmark** important concepts for quick access

### 🎓 Test Your Knowledge

1. Click **"Test Your Knowledge"** on any concept
2. Answer multiple-choice questions
3. Difficulty adapts to your mastery level:
   - **Easy** (L0-L1): Basic recall
   - **Medium** (L2-L3): Application
   - **Hard** (L4-L5): Analysis
4. Get instant feedback with explanations
5. Hesitation tracked (>10 seconds = flagged)

### 📊 Monitor Your Learning

**Cognitive Load Meter:**
- **Low (<25%)**: Ready for new concepts
- **Moderate (25-50%)**: Optimal learning state
- **High (50-75%)**: Consider easier content
- **Critical (>75%)**: Break recommended

**Wellbeing Panel:**
- Select your emotion: Great / Okay / Struggling
- Receive personalized tips and difficulty adjustments
- Start 2-minute micro-breaks when needed

**Flow Mode:**
- Activates automatically when:
  - Cognitive load is 30-70%
  - 4+ correct answers in last 5 attempts
- Hides distractions for deep focus

### 🎯 Advanced Features

**Focus Mode:**
- Select a node and click **"Focus Mode"**
- Graph shows only selected node, prerequisites, and dependents
- Perfect for studying specific pathways

**Bookmarks:**
- Click bookmark icon on any concept
- Access all bookmarks from Control Panel
- Quick navigation for revision

**Import/Export:**
- Export your graph as JSON for backup
- Share concept maps with classmates
- Import previously created maps

---

## 💰 Cost Management

MindMesh includes robust cost control to manage Azure API usage:

### Budget Tracking
- **Daily Limit**: Default $5.00/day (~33,000 tokens with GPT-4o-mini)
- **Real-time Monitoring**: View spending in Control Panel
- **Auto-Reset**: Budget resets daily at midnight
- **Request Blocking**: Stops API calls when budget exceeded

### Token Optimization
- **Compression Levels**:
  - `low`: No compression (most accurate)
  - `medium`: Remove extra whitespace (balanced)
  - `high`: Aggressive trimming (maximum savings)
- **Smart Prompting**: Minimal token usage for common tasks
- **Efficient Caching**: Reuses concept data when possible

### Cost Statistics
View in Control Panel:
- Daily spent: $0.0234
- Remaining: $4.9766
- Budget: $5.00
- Visual progress bar

**Estimated Costs (GPT-4o-mini at $0.15/1M tokens):**
- Generate concept map: $0.0015 - $0.0030
- Generate quiz: $0.0006 - $0.0012
- ELI5 explanation: $0.0003 - $0.0006
- **~150-200 concept maps per $5.00 budget**

---

## 🏗️ Architecture

### Technology Stack
- **Frontend**: React 18.2.0
- **Visualization**: D3.js 7.8.5
- **AI**: Azure OpenAI GPT-4o-mini
- **Icons**: Lucide React 0.263.1
- **Styling**: CSS3 (Dark mode first)
- **Storage**: Browser localStorage

### Key Design Principles
- **Client-side Only**: No backend server required
- **Privacy First**: All data stored locally
- **Cost Efficient**: Token optimization and budget controls
- **Offline Capable**: Works without internet after initial generation
- **Responsive**: Mobile-friendly design

### Project Structure
```
mindmesh/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── ConceptGraph.jsx          # D3 visualization
│   │   ├── InputPanel.jsx            # Topic input
│   │   ├── ManualConceptPanel.jsx    # Manual concept form
│   │   ├── NodeDetailPanel.jsx       # Concept details
│   │   ├── QuizPanel.jsx             # Adaptive quizzes
│   │   ├── CognitiveLoadMeter.jsx    # Load tracking
│   │   ├── WellbeingPanel.jsx        # Emotion tracking
│   │   ├── ControlPanel.jsx          # Settings & actions
│   │   └── FlowMode.jsx              # Flow state indicator
│   ├── utils/
│   │   ├── azureAPI.js               # API communication
│   │   ├── costController.js         # Budget management
│   │   ├── conceptExtractor.js       # AI concept extraction
│   │   ├── quizGenerator.js          # Adaptive quiz creation
│   │   ├── masteryTracker.js         # Spaced repetition
│   │   ├── cognitiveLoadCalculator.js # Mental effort tracking
│   │   └── storageManager.js         # Data persistence
│   ├── config/
│   │   └── azureConfig.js            # Azure settings
│   ├── styles/
│   │   └── App.css                   # Dark mode styling
│   ├── App.jsx                       # Main application
│   └── index.jsx                     # React entry point
├── .env                               # Environment variables
├── .env.example                       # Environment template
├── package.json
└── README.md
```

---

## 🧪 Testing Guide

### Functionality Checklist

**AI Generation:**
- ✅ Enter topic and generate concept map
- ✅ Nodes arranged linearly (left to right)
- ✅ Prerequisites show with curved arrows
- ✅ Main concept (Level 0) on left
- ✅ Core concepts (Level 1) in middle
- ✅ Details (Level 2) on right

**Manual Mode:**
- ✅ Click "Manual Mode" creates empty graph
- ✅ Add concepts with form validation
- ✅ Set prerequisites from existing nodes
- ✅ Mark concepts as core (green border)
- ✅ Mix AI and manual concepts

**Interaction:**
- ✅ Click nodes to view details
- ✅ Generate ELI5 explanations
- ✅ Take quizzes with adaptive difficulty
- ✅ Bookmark/unbookmark concepts
- ✅ Drag and zoom graph

**Learning Features:**
- ✅ Mastery levels update after quizzes
- ✅ Spaced repetition schedules
- ✅ Cognitive load tracks in real-time
- ✅ Flow mode activates automatically
- ✅ Break suggestions appear

**Data Management:**
- ✅ Export graph as JSON
- ✅ Import saved graphs
- ✅ Bookmarks persist
- ✅ Mastery data persists
- ✅ Cost tracking persists

**Cost Control:**
- ✅ Budget limit enforced
- ✅ Token compression works
- ✅ Spending tracked accurately
- ✅ Daily reset at midnight

### Test Scenarios

**Scenario 1: First-Time User**
1. Open app, enter "Rigid Body Mechanics"
2. View generated concept map
3. Click "Moment of Inertia" node
4. Read definition and get ELI5
5. Take quiz, answer correctly
6. Observe mastery level increase to L1

**Scenario 2: Manual Builder**
1. Click "Manual Mode"
2. Add "Web Development" (Level 0)
3. Add "HTML", "CSS", "JavaScript" (Level 1)
4. Set "HTML" as prerequisite for "CSS"
5. Take quiz on HTML
6. Export and save graph

**Scenario 3: Cost Management**
1. Check initial budget in Control Panel
2. Generate 5 concept maps
3. Observe spending increase
4. Generate 10 quizzes
5. Verify remaining budget decreases
6. Test budget limit (set to $0.10 and exceed)

---

## 🐛 Troubleshooting

### Common Issues

#### 🔴 API Errors

**401 Unauthorized**
- ❌ Problem: Invalid API key
- ✅ Solution: Check `REACT_APP_AZURE_API_KEY` in `.env`

**404 Not Found**
- ❌ Problem: Wrong endpoint or deployment name
- ✅ Solution: Verify `REACT_APP_AZURE_ENDPOINT` and `REACT_APP_AZURE_DEPLOYMENT_NAME`

**429 Rate Limited**
- ❌ Problem: Too many requests to Azure
- ✅ Solution: Wait 60 seconds, then retry

**Budget Exceeded**
- ❌ Problem: Daily spending limit reached
- ✅ Solution: Increase `REACT_APP_DAILY_BUDGET_USD` or wait until midnight

#### 🟡 Graph Issues

**Graph Not Rendering**
- Clear browser cache (Ctrl+Shift+Delete)
- Check browser console for errors (F12)
- Ensure topic is specific (not too broad)

**Nodes Overlapping**
- This shouldn't happen with linear layout
- Try refreshing the page
- Zoom out and pan to see all nodes

**Missing Arrows**
- Prerequisites may not be set correctly
- In manual mode, ensure prerequisites exist before referencing

#### 🟢 Data Issues

**Lost Progress**
- Check if localStorage is enabled in browser
- Ensure cookies/site data not blocked
- Export graphs regularly as backup

**Mastery Not Updating**
- Clear localStorage and restart
- Check browser console for errors
- Ensure quizzes are completed (not just started)

---

## 🌐 Browser Compatibility

| Browser | Minimum Version | Tested |
|---------|----------------|--------|
| Chrome | 90+ | ✅ |
| Firefox | 88+ | ✅ |
| Safari | 14+ | ✅ |
| Edge | 90+ | ✅ |
| Opera | 76+ | ⚠️ |

**Note**: Internet Explorer is not supported.

---

## ⚡ Performance Tips

1. **Start Specific** - "Angular Momentum in Rigid Bodies" works better than "Physics"
2. **Use Compression** - Set `COMPRESSION_LEVEL=high` for cost savings
3. **Export Regularly** - Backup important concept maps weekly
4. **Monitor Load** - Take breaks when cognitive load exceeds 70%
5. **Review Scheduling** - Focus on concepts due for spaced repetition
6. **Batch Learning** - Study related concepts together using Focus Mode
7. **Clear Old Data** - Reset mastery data for topics you've mastered

---

## 🔐 Privacy & Security

### Data Storage
- ✅ All data stored **locally** in browser localStorage
- ✅ No server-side storage or databases
- ✅ No user accounts or authentication required
- ✅ Export feature gives you full data ownership

### External Communication
- 🌐 Azure OpenAI API calls only (for concept/quiz generation)
- 🔒 API key transmitted via HTTPS
- 📊 No analytics or tracking scripts
- 🚫 No third-party cookies

### Recommendations
- Keep your `.env` file private (never commit to Git)
- Rotate Azure API keys periodically
- Use separate Azure resources for different projects
- Export important graphs before clearing browser data

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

### Areas for Improvement
- 🎨 UI/UX enhancements
- 🧪 Additional quiz types (fill-in-blank, matching)
- 📊 Analytics dashboard for learning patterns
- 🌍 Internationalization (i18n)
- 📱 Mobile app version
- 🔄 Sync across devices (optional backend)
- 🎓 Pre-built curriculum templates

### Development Setup
```bash
# Fork the repository
git clone https://github.com/yourusername/mindmesh.git
cd mindmesh

# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and test
npm start

# Commit with clear messages
git commit -m "Add: feature description"

# Push and create PR
git push origin feature/your-feature-name
```

---

## 📝 Changelog

### v1.0.0 (2024-11-16)
- ✨ Initial release
- 🤖 AI-powered concept extraction
- 📊 Linear graph visualization
- ✍️ Manual concept mode
- 🎓 Adaptive quizzes with spaced repetition
- 🧠 Cognitive load monitoring
- 💰 Cost control system
- 💾 Import/export functionality

---

## 📄 License

MIT License - Free for personal and educational use

```
Copyright (c) 2024 MindMesh

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
```

---

## 🙏 Acknowledgments

- **Azure OpenAI** for powering intelligent concept extraction
- **D3.js** for beautiful graph visualizations
- **React** community for excellent documentation
- **Spaced Repetition** research by Piotr Woźniak
- **Cognitive Load Theory** by John Sweller

---

## 📧 Support

- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/yourusername/mindmesh/issues)
- 💡 **Feature Requests**: [GitHub Discussions](https://github.com/yourusername/mindmesh/discussions)
- 📖 **Documentation**: [Wiki](https://github.com/yourusername/mindmesh/wiki)
- 💬 **Community**: [Discord Server](https://discord.gg/mindmesh)

---

## 🌟 Star History

If you find MindMesh helpful, please consider giving it a star on GitHub! ⭐

---

**Built with ❤️ for learners everywhere**

Transform the way you learn. One concept at a time. 🧠✨

---

### Quick Links
- [Installation](#-quick-start)
- [Usage Guide](#-usage-guide)
- [Cost Management](#-cost-management)
- [Architecture](#%EF%B8%8F-architecture)
- [Troubleshooting](#-troubleshooting)

Happy Learning! 🚀
