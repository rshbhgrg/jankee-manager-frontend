# Jankee Manager - Frontend

Modern, professional frontend application for managing outdoor advertising sites (hoardings and unipoles).

## 🚀 Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite 6
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Routing**: React Router v7
- **State Management**:
  - TanStack Query (server state)
  - Zustand (client state)
- **Forms**: React Hook Form + Zod validation
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Date Handling**: date-fns

## 📋 Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Backend API running on port 3001 (see jankee-manager-backend)

## 🛠️ Installation

1. Clone the repository
```bash
git clone <repository-url>
cd jankee-manager-frontend
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
```

Edit `.env` and update the API URL if needed:
```
VITE_API_BASE_URL=http://localhost:3001/api
```

## 🏃 Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 🔨 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production (TypeScript + Vite) |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint (check for issues) |
| `npm run lint:fix` | Run ESLint and auto-fix issues |
| `npm run format` | Format code with Prettier |
| `npm run type-check` | Check TypeScript types (no emit) |

## 📁 Project Structure

```
src/
├── components/       # Reusable React components
│   ├── ui/          # shadcn/ui components
│   ├── layout/      # Layout components (Header, Sidebar, etc.)
│   ├── sites/       # Site-specific components
│   ├── clients/     # Client-specific components
│   └── activities/  # Activity-specific components
├── pages/           # Route pages
│   ├── Dashboard/   # Dashboard page
│   ├── Sites/       # Sites management pages
│   ├── Clients/     # Clients management pages
│   ├── Activities/  # Activities management pages
│   └── Reports/     # Reports pages
├── hooks/           # Custom React hooks
├── services/        # API services (Axios)
├── stores/          # Zustand stores
├── types/           # TypeScript type definitions
├── lib/             # Utility functions
│   └── utils/       # Helpers, formatters, validators
├── config/          # App configuration
└── assets/          # Static assets
```

## 🎨 Code Quality

### ESLint + Prettier
- Automatic code formatting on save
- Pre-commit hooks ensure all code is linted and formatted
- TypeScript strict mode enabled

### Git Hooks (Husky)
- **pre-commit**: Runs lint-staged to check and fix files before commit
- Ensures code quality and consistency

## 🔧 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:3001/api` |
| `VITE_APP_NAME` | Application name | `Jankee Manager` |
| `NODE_ENV` | Environment mode | `development` |

## 🏗️ Build

Create a production build:
```bash
npm run build
```

The built files will be in the `dist/` directory.

Preview the production build:
```bash
npm run preview
```

## 📦 Dependencies

### Core
- `react` - UI library
- `react-dom` - React DOM rendering
- `react-router-dom` - Client-side routing
- `@tanstack/react-query` - Server state management
- `zustand` - Client state management

### UI & Styling
- `tailwindcss` - Utility-first CSS framework
- `@tailwindcss/vite` - Tailwind CSS v4 Vite plugin
- `shadcn/ui` (via Radix UI) - Accessible component primitives
- `lucide-react` - Icon library

### Forms & Validation
- `react-hook-form` - Form state management
- `zod` - Schema validation
- `@hookform/resolvers` - React Hook Form + Zod integration

### Utilities
- `axios` - HTTP client
- `date-fns` - Date utilities
- `clsx` - Class name utility
- `tailwind-merge` - Merge Tailwind classes

## 🔒 Type Safety

Full TypeScript coverage with:
- Strict mode enabled
- No unchecked indexed access
- No implicit returns
- No unused locals/parameters
- Path aliases configured (`@/`)

## 🎯 Features

- ✅ Modern, professional UI design
- ✅ Fully responsive (desktop, tablet, mobile)
- ✅ Type-safe API calls
- ✅ Form validation with Zod schemas
- ✅ Optimistic updates with React Query
- ✅ Error boundaries
- ✅ Loading states
- ✅ Toast notifications
- ✅ Search and filtering
- ✅ Pagination
- ✅ Accessibility (WCAG AA)

## 📖 Documentation

- [Business Requirements](../jankee-manager/BUSINESS_REQUIREMENTS.md)
- [Frontend TODO](../jankee-manager/FRONTEND_TODO.md)
- [API Documentation](../jankee-manager-backend/README.md)

## 🤝 Contributing

1. Follow the code style (enforced by ESLint/Prettier)
2. Write meaningful commit messages
3. Add comments for complex logic
4. Ensure all tests pass before pushing
5. Keep components small and focused

## 📄 License

MIT

---

**Built with ❤️ for Jankee Manager**
