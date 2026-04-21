# SwiftPay Quick Start Guide

Get up and running in 5 minutes.

## 1️⃣ Install & Run (2 minutes)

```bash
# Install dependencies
pnpm install

# Copy environment file
cp .env.example .env

# Start development server
pnpm dev
```

**Frontend is now running at `http://localhost:3000`**

---

## 2️⃣ Configure Backend (1 minute)

Edit `.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

Make sure your C# ASP.NET backend is running on `http://localhost:5000`

---

## 3️⃣ Test Connection (2 minutes)

### Option A: Manual Check
1. Open `http://localhost:3000` in browser
2. Open DevTools → Network tab
3. Try logging in or viewing transactions
4. Check if network requests go to your backend

### Option B: Quick Test
```bash
# Test backend is running
curl http://localhost:5000/api/transactions -H "Authorization: Bearer test-token"

# Should return an API response (or 401 if no token, that's OK)
```

---

## 📚 Key Files to Know

| File | Purpose |
|------|---------|
| `/src/lib/api-client.ts` | All API calls go through here |
| `/src/pages/` | Page components (Home, History, etc) |
| `/src/App.tsx` | Routes definition |
| `.env` | Backend URL configuration |
| `vite.config.ts` | Build & dev server config |

---

## 🔗 API Integration

### Frontend → Backend Flow

```
React Component
    ↓
const result = await apiClient.getTransactions()
    ↓
Axios (adds auth header)
    ↓
POST http://localhost:5000/api/transactions
    ↓
Your C# Backend
    ↓
{ success: true, data: [...] }
    ↓
Component renders data
```

### Your Backend Must Return

```json
{
  "success": true,
  "data": {
    /* your data here */
  }
}
```

---

## 🚀 Common Tasks

### Add a New API Endpoint

1. **Add method in `/src/lib/api-client.ts`:**
```typescript
async getMyData() {
  const response = await this.client.get('/my-endpoint');
  return response.data.data;
}
```

2. **Use in component:**
```typescript
const data = await apiClient.getMyData();
```

### Add a New Page

1. **Create `/src/pages/my-page.tsx`:**
```typescript
import { Topbar } from '@/components/swiftpay/topbar';

export default function MyPage() {
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

2. **Add route in `/src/App.tsx`:**
```typescript
<Route path="/my-page" element={<MyPage />} />
```

### Use API Client in Component

```typescript
import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';

export default function MyComponent() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await apiClient.getTransactions();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return <div>{/* render data */}</div>;
}
```

---

## 🐛 Debugging

### Check Backend Connection
Open DevTools → Network tab, then perform an action. You should see:
```
POST http://localhost:5000/api/transactions
Authorization: Bearer eyJ...
Content-Type: application/json
```

### Check API Response
In DevTools → Network tab, click the request and view Response tab:
```json
{
  "success": true,
  "data": [...]
}
```

### Common Errors

| Error | Cause | Fix |
|-------|-------|-----|
| `CORS error` | Backend doesn't allow frontend domain | Add CORS to C# backend |
| `401 Unauthorized` | Invalid/missing token | Check localStorage has authToken |
| `Cannot GET /api/...` | Endpoint not implemented | Implement endpoint in C# |
| `Connection refused` | Backend not running | Start C# app on port 5000 |

---

## 📦 Build for Production

```bash
# Build
pnpm build

# Output: /dist folder

# Preview production build
pnpm preview
```

Deploy `/dist` contents to your hosting (Vercel, S3, etc)

---

## 🔐 Authentication

Token is automatically handled:
- Stored in `localStorage` as `authToken`
- Sent in `Authorization: Bearer {token}` header
- On 401 error, user is logged out automatically

Your login endpoint should return:
```json
{
  "success": true,
  "data": {
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
  }
}
```

---

## ✅ Quick Checklist

Before going live:

- [ ] Backend running on port 5000
- [ ] CORS enabled in C# backend
- [ ] All endpoints return `{ success: true, data: ... }` format
- [ ] Frontend can login successfully
- [ ] Transactions visible in frontend
- [ ] Environment variable `REACT_APP_API_URL` set correctly
- [ ] Production build tested locally (`pnpm preview`)
- [ ] No console errors in DevTools

---

## 📞 Need Help?

- **Startup:** This file
- **API Details:** `API_INTEGRATION.md`
- **Full Migration Guide:** `REACT_MIGRATION.md`
- **Backend Examples:** `CSHARP_BACKEND_EXAMPLES.md`
- **Full Checklist:** `IMPLEMENTATION_CHECKLIST.md`

---

## 🎯 Next Step

1. **Ensure your C# backend is running**
2. **Check `.env` has correct API URL**
3. **Open http://localhost:3000**
4. **Try logging in**
5. **Check DevTools Network tab for API calls**
6. **Implement missing endpoints as needed**

**Happy building! 🚀**
