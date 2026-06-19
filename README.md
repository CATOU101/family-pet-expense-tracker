# Family Pet Expense Tracker

A modern, full-featured web application for tracking family and pet expenses with budget management, real-time charts, and multi-user support.

## Features

✨ **Core Features:**
- 💰 Add, view, edit, and delete expenses
- 📊 Categorize expenses (Family & Pet)
- 💵 Budget tracking with real-time alerts
- 📈 Interactive charts and reports
- 👥 Multi-user support with Firebase authentication
- 🔄 Real-time data synchronization
- 📱 Fully responsive design

## Tech Stack

- **Frontend:** React 18 + TypeScript
- **Build Tool:** Vite
- **Backend:** Firebase (Authentication & Firestore)
- **Charts:** Recharts
- **Styling:** CSS3

## Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Firebase account (free tier works)

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Setup Firebase:**
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Create a new project
   - Enable Authentication (Email/Password)
   - Create a Firestore Database (Start in test mode for development)
   - Copy your project settings

3. **Configure Environment:**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your Firebase credentials

4. **Start Development:**
   ```bash
   npm run dev
   ```
   Open http://localhost:5173

## Project Structure

```
src/
├── config/
│   └── firebase.ts           # Firebase configuration
├── context/
│   ├── AuthContext.tsx       # Authentication context
│   └── ExpenseContext.tsx    # Expense data context
├── pages/
│   ├── AuthPage.tsx          # Login/Signup page
│   └── Dashboard.tsx         # Main dashboard
├── components/
│   ├── Navbar.tsx            # Top navigation
│   ├── ExpenseForm.tsx       # Add expense form
│   ├── ExpenseList.tsx       # List of expenses
│   ├── BudgetForm.tsx        # Add budget form
│   ├── BudgetList.tsx        # List of budgets
│   └── Reports.tsx           # Analytics & charts
├── types/
│   └── index.ts              # TypeScript interfaces
└── App.tsx                   # Root component
```

## Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## Deployment

### Firebase Hosting
1. Build: `npm run build`
2. Install Firebase CLI: `npm install -g firebase-tools`
3. Initialize: `firebase init hosting`
4. Deploy: `firebase deploy`

### Vercel
1. Push to GitHub
2. Connect to Vercel
3. Set environment variables
4. Deploy automatically

## License

MIT License
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
