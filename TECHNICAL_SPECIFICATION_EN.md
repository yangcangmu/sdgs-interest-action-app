# SDGs Interest & Action App Technical Specification

## 1. Application Overview

**App Name**: SDGs Interest & Action App  
**Version**: 1.0.0  
**Framework**: Next.js 15.5.0 (App Router)  
**Language**: TypeScript  
**Styling**: Tailwind CSS  
**Deployment**: Vercel  

## 2. Core Features

### 2.1 Quiz Functionality
- **Number of Questions**: 25 questions
- **Duration**: 3-5 minutes
- **Response Format**: 
  - Select one option from choices
  - Interest level slider (0-3, default 1)
- **Language Support**: Japanese/English switching
- **Default Language**: English

### 2.2 Scoring System
- **17 SDG-specific score calculations**
- **Overall interest score (0-100)**
- **Top3/Bottom3 SDG display**

### 2.3 Goal Setting Functionality
- **Create, edit, and delete personal goals**
- **SDG tagging**
- **Frequency setting (Daily/Weekly)**

### 2.4 Check-in Functionality
- **Daily/weekly progress recording**
- **Goal-specific progress management**

## 3. Technical Architecture

### 3.1 Frontend Structure
```
src/
├── app/
│   ├── api/
│   │   ├── quiz/
│   │   │   ├── questions/route.ts
│   │   │   └── submit/route.ts
│   │   ├── goals/route.ts
│   │   └── checkins/route.ts
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── Quiz/
│   │   ├── QuizCard.tsx
│   │   └── QuizContainer.tsx
│   ├── Goals/
│   │   ├── GoalForm.tsx
│   │   └── GoalsList.tsx
│   └── common/
│       ├── LanguageSwitcher.tsx
│       └── LoadingSpinner.tsx
├── lib/
│   ├── scoring.ts
│   └── i18n.ts
├── types/
│   └── index.ts
└── data/
    └── questions.v1.0.json
```

### 3.2 Data Models

**Question Type**:
```typescript
interface Question {
  id: string;
  text: { ja: string; en: string };
  options: Option[];
  sdgTags: number[];
}
```

**Option Type**:
```typescript
interface Option {
  id: string;
  text: { ja: string; en: string };
  sdgWeights: Record<number, number>;
}
```

**Goal Type**:
```typescript
interface Goal {
  id: string;
  title: string;
  description?: string;
  sdgTags: number[];
  cadence: 'daily' | 'weekly';
  targetPerWeek?: number;
  startAt: Date;
  isActive: boolean;
  userId?: string;
  sessionId?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## 4. Scoring Algorithm

### 4.1 Basic Calculation Formulas

**Raw Score**:
```
raw[s] = Σ(selected option's SDG weight × interest level slider value)
```

**Exposure Score**:
```
exp[s] = number of questions tagged with that SDG × 3
```

**Normalized Score**:
```
norm[s] = (raw[s] / exp[s]) × 100
```

**Overall Score**:
```
overall = Σ(norm[s] × exp[s]) / Σ(exp[s])
```

### 4.2 Top3/Bottom3 Selection Algorithm

1. **Rank all 17 SDGs by normalized score in descending order**
2. **Top3**: SDGs ranked 1st-3rd
3. **Bottom3**: SDGs ranked 15th-17th (last 3 if total count < 17)

## 5. Recommended Actions Algorithm

### 5.1 Basic Logic
```typescript
private generateActionRecommendations(top3Sdgs: number[]): ActionRecommendation[] {
  const recommendations: ActionRecommendation[] = [];
  
  // Recommend 3-5 actions for each Top3 SDG
  top3Sdgs.forEach(sdg => {
    const actions = this.getActionRecommendationsForSdg(sdg);
    recommendations.push(...actions);
  });

  return recommendations.slice(0, 15); // Maximum 15 actions
}
```

### 5.2 Action Characteristics
- **Difficulty**: easy, medium, hard
- **Estimated Time**: specific duration (e.g., "10 minutes", "2 hours")
- **SDG Tags**: related SDG numbers
- **Multilingual Support**: Japanese and English titles and descriptions

## 6. Internationalization System

### 6.1 Implementation Method
- **Custom i18n implementation** (no external libraries)
- **Translation Keys**: dot notation (e.g., `quiz.progress`)
- **Parameter Substitution**: `{count}` format

### 6.2 Supported Languages
- **Japanese (ja)**
- **English (en)**
- **Default Language**: English

## 7. API Design

### 7.1 Endpoints

**GET /api/quiz/questions**
- Retrieve quiz question data

**POST /api/quiz/submit**
- Submit quiz responses
- Calculate scores and return results

**GET /api/goals**
- Retrieve goals list

**POST /api/goals**
- Create goal

**PUT /api/goals/[id]**
- Update goal

**DELETE /api/goals/[id]**
- Delete goal

**GET /api/checkins**
- Retrieve check-ins list

**POST /api/checkins**
- Create check-in

## 8. Screen Flow

### 8.1 Basic Flow
1. **Welcome Screen** → Start Quiz
2. **Quiz Screen** → Display Results
3. **Results Screen** → Goal Setting
4. **Goal Setting Screen** → Goals List

### 8.2 State Management
```typescript
type QuizState = 'welcome' | 'quiz' | 'results' | 'goals';
```

## 9. Data Persistence

### 9.1 Current Implementation
- **Memory-based** (data lost on server restart)
- **User identification** via session ID

### 9.2 Data Retention Period
- **90 days** (designed, not fully implemented)

## 10. Error Handling

### 10.1 Implemented
- **Network Errors**: connection failure handling
- **Validation Errors**: input value validation
- **Language Switching Errors**: try-catch protection

### 10.2 Error Display
- **User-friendly messages**
- **Multilingual support**

## 11. Performance Optimization

### 11.1 Implemented
- **useCallback**: prevent function re-rendering
- **useRef**: prevent infinite loops
- **Conditional Rendering**: avoid unnecessary component rendering

## 12. Accessibility

### 12.1 Implementation Status
- **Basic HTML semantics**
- **Keyboard Navigation**: not implemented
- **Screen Reader Support**: not implemented

---

