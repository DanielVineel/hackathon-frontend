# Code Editor Routing & Implementation Guide

## Route Definition

The CodeEditor component is defined in `src/pages/StudentMain.jsx`:

```jsx
<Route path="code-editor/:problemId" element={<StudentCodeEditor />} />
```

Alternative routes for different types:
```jsx
// Event Problem Solving
<Route path="event/:eventId/problem/:problemId" element={<StudentCodeEditor />} />

// Practice Mode
<Route path="practice/:problemId" element={<StudentCodeEditor />} />

// Contest Mode  
<Route path="contest/:eventId/problem/:problemId" element={<StudentCodeEditor />} />
```

## How to Navigate to CodeEditor

### Standalone Problem
```jsx
import { useNavigate } from "react-router-dom";

const navigate = useNavigate();

// Basic problem solving
navigate("/student/code-editor/123");

// With type specification
navigate("/student/code-editor/123", {
  state: { type: "problem" }
});
```

### Event Problem
```jsx
// Navigate with event context
navigate("/student/event/456/problem/123", {
  state: { type: "event" }
});
```

### Practice Mode
```jsx
navigate("/student/practice/123", {
  state: { type: "practice" }
});
```

### Contest Mode
```jsx
navigate("/student/contest/456/problem/123", {
  state: { type: "contest" }
});
```

### Event Introduction
```jsx
navigate("/student/event/456/intro", {
  state: { type: "event-intro" }
});
```

## Component Files

- **Page**: `src/pages/student/CodeEditor.jsx` - Main page component
- **Component**: `src/components/code-editor/CodeEditor.jsx` - Code editor UI (CodeMirror wrapper)
- **Styles**: `src/pages/styles/student/CodeEditor.css` - All styling
- **Routes**: `src/pages/StudentMain.jsx` - Route definitions

## Features by Type

| Type | Timer | Leaderboard | Test Run | Attempts | Navigate |
|------|-------|-------------|----------|----------|----------|
| problem | ❌ | ❌ | ✅ | ∞ | ❌ |
| event | ✅ | ✅ | ✅ | Limited | ✅ |
| practice | ❌ | ❌ | ✅ | ∞ | ❌ |
| contest | ✅ | ✅ | ❌ | 1 | ✅ |
| event-intro | ❌ | ❌ | ❌ | 0 | ❌ |

## API Endpoints Used

```
GET /student/problem/{problemId}
GET /student/event/{eventId}/problem/{problemId}
GET /student/event/{eventId}/timer
GET /student/event/{eventId}/leaderboard
POST /submissions/run
POST /submissions/event/run
POST /submissions/submit
POST /submissions/event/submit
```

## Dark Mode

Dark mode automatically applies via CSS variables:
- Light mode: `background-color: var(--bg-primary)` = #f5f5f7 (soft gray)
- Dark mode: `background-color: var(--bg-primary)` = #0a0a0a (dark)
- Card backgrounds are softer, not pure white/black to prevent eye strain
