# SwiftPay Frontend - React Migration Guide

This is a **complete React migration** from the original Next.js project. The application is now a standalone React 19 frontend designed to connect to your **C# ASP.NET backend with Microsoft SQL Server**.

## What Changed

### Technology Stack
- **Before:** Next.js 16 with Server Components
- **After:** React 19 + Vite 5 + React Router 7

### Key Differences

| Aspect | Next.js | React |
|--------|---------|-------|
| Build Tool | Next.js | Vite (3x faster) |
| Routing | File-based (/app) | React Router v7 |
| API Calls | Server Components | React Hooks + Axios |
| Entry Point | /app/layout.tsx | /src/main.tsx |
| HTML | /app/index.html | /index.html |

### File Structure

```
Project Root (React)
├── src/
│   ├── main.tsx              ← App entry point
│   ├── App.tsx               ← Router setup
│   ├── pages/                ← Page components
│   │   ├── customer-portal.tsx
│   │   ├── beneficiaries.tsx
│   │   ├── history.tsx
│   │   ├── notifications.tsx
│   │   ├── compliance.tsx
│   │   ├── operations.tsx
│   │   ├── treasury.tsx
│   │   ├── admin.tsx
│   │   ├── reports.tsx
│   │   ├── agent.tsx
│   │   └── agent/kyc.tsx
│   ├── components/
│   │   ├── swiftpay/         ← Business components
│   │   └── ui/               ← shadcn/ui components
│   ├── lib/
│   │   ├── api-client.ts     ← Axios API client (NEW)
│   │   └── utils.ts
│   └── styles/
│       └── globals.css
├── index.html                ← Main HTML (was /app)
├── vite.config.ts            ← Vite config (new)
├── package.json              ← Updated scripts
└── .env.example              ← Environment template

```

## Quick Start

### 1. Install Dependencies
```bash
pnpm install
# or: npm install / yarn install / bun install
```

### 2. Configure Backend URL
Create `.env` in project root:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 3. Start Development Server
```bash
pnpm dev
```
Opens at `http://localhost:3000`

### 4. Build for Production
```bash
pnpm build
```
Output: `/dist` folder (deploy these static files)

## API Integration (Critical)

### The API Client (`/src/lib/api-client.ts`)

**Every backend request goes through this single Axios instance:**

```typescript
// Example usage in components:
import { apiClient } from '@/lib/api-client';

// In a component:
const [data, setData] = useState(null);

useEffect(() => {
  const fetch = async () => {
    try {
      const transactions = await apiClient.getTransactions(10);
      setData(transactions);
    } catch (error) {
      console.error('Error:', error);
    }
  };
  fetch();
}, []);
```

### What the API Client Handles

✅ **Request Interceptors:**
- Automatically adds JWT Bearer token from localStorage
- Adds Content-Type header

✅ **Response Interceptors:**
- Parses success/error responses
- Auto-redirects to login on 401 (Unauthorized)
- Consistent error handling

✅ **Built-in Methods for All Operations:**
- Transactions, KYC, Refunds
- Beneficiaries, FX Quotes
- Compliance, Operations, Treasury
- Admin, Reports, Notifications

### Your Backend Must Respond With

```json
{
  "success": true,
  "data": { /* your data */ },
  "message": "Success message"
}
```

Or for errors:
```json
{
  "success": false,
  "error": "Error message"
}
```

## Router Setup

**React Router v7** handles all routing now. Routes defined in `/src/App.tsx`:

```typescript
<Routes>
  <Route path="/" element={<CustomerPortal />} />
  <Route path="/beneficiaries" element={<BeneficiariesPage />} />
  <Route path="/history" element={<HistoryPage />} />
  <Route path="/compliance" element={<CompliancePage />} />
  <Route path="/operations" element={<OperationsPage />} />
  <Route path="/treasury" element={<TreasuryPage />} />
  <Route path="/admin" element={<AdminPage />} />
  <Route path="/agent" element={<AgentPortal />} />
  <Route path="/agent/kyc" element={<AgentKYC />} />
</Routes>
```

**Navigation in components:**
```typescript
import { Link, useNavigate } from 'react-router-dom';

// In JSX:
<Link to="/beneficiaries">Go to Beneficiaries</Link>

// Programmatic:
const navigate = useNavigate();
navigate('/history');
```

## State Management

Uses **React Hooks** with the standard pattern:

```typescript
const [loading, setLoading] = useState(true);
const [data, setData] = useState(null);
const [error, setError] = useState(null);

useEffect(() => {
  const fetch = async () => {
    try {
      const result = await apiClient.getTransactions();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  fetch();
}, []);
```

If you need shared state across components, consider:
- **Context API** (simple global state)
- **SWR** (already installed - data fetching/caching)

## Environment Variables

Create `.env` in project root:

```env
# C# ASP.NET Backend
REACT_APP_API_URL=http://localhost:5000/api

# Optional
REACT_APP_TIMEOUT=30000
```

**Development:** `http://localhost:5000/api`
**Production:** Update to your live API URL when deploying

## CORS Configuration (Backend)

Your C# backend MUST enable CORS for the frontend:

```csharp
// Program.cs
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
            "http://localhost:3000",      // dev
            "http://localhost:5173",      // vite alt port
            "https://yourdomain.com"      // production
        )
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials();
    });
});

app.UseCors("AllowFrontend");
```

## Common Tasks

### Adding a New Page

1. Create `/src/pages/my-page.tsx`:
```typescript
import { Topbar } from '@/components/swiftpay/topbar';
import { apiClient } from '@/lib/api-client';
import { useEffect, useState } from 'react';

export default function MyPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      const result = await apiClient.getMyData();
      setData(result);
    };
    fetch();
  }, []);

  return (
    <>
      <Topbar title="My Page" subtitle="Description" />
      <main className="flex-1 overflow-y-auto p-6">
        {/* Your content */}
      </main>
    </>
  );
}
```

2. Add route in `/src/App.tsx`:
```typescript
<Route path="/my-page" element={<MyPage />} />
```

3. Add nav item in `/src/components/swiftpay/sidebar-nav.tsx`

### Adding a New API Endpoint

In `/src/lib/api-client.ts`, add method:

```typescript
async getMyData() {
  const response = await this.client.get<ApiResponse<any>>(
    '/my-endpoint'
  );
  return response.data.data;
}
```

### Using SWR for Data Fetching (Optional)

SWR is pre-installed for advanced caching:

```typescript
import useSWR from 'swr';

export default function MyComponent() {
  const { data, error, isLoading } = useSWR(
    '/api/transactions',
    (url) => apiClient.client.get(url).then(r => r.data.data)
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return <div>{/* render data */}</div>;
}
```

## Build & Deployment

### Development
```bash
pnpm dev          # Start dev server (http://localhost:3000)
pnpm build        # Build for production
pnpm preview      # Preview production build
```

### Production Deployment

1. **Build:** `pnpm build`
2. **Output:** Files in `/dist` folder
3. **Deploy:** Copy `/dist` contents to your static hosting:
   - Vercel
   - AWS S3 + CloudFront
   - Netlify
   - GitHub Pages
   - Any static file hosting

4. **Environment:** Set `REACT_APP_API_URL` to your live backend in deployment config

### Docker Deployment (Optional)

```dockerfile
FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## Troubleshooting

### "Module not found" errors
- Run `pnpm install` again
- Clear cache: `rm -rf node_modules dist && pnpm install`

### API calls failing
- Check `REACT_APP_API_URL` in `.env`
- Verify C# backend is running
- Check CORS configuration on backend
- Look at browser DevTools Network tab

### Port already in use
- Dev server default: `localhost:3000`
- Change in `vite.config.ts` if needed

### Authentication errors (401)
- Check JWT token format
- Token should be in `localStorage` as `authToken`
- Backend must return token in login response

## Next Steps

1. ✅ Frontend is ready
2. **Implement API endpoints** in your C# ASP.NET backend
3. **Test with curl/Postman** before connecting frontend
4. **Update API client methods** if your endpoints differ
5. **Configure CORS** on backend
6. **Deploy frontend** to hosting

See **API_INTEGRATION.md** for detailed endpoint specifications.
