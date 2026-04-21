# SwiftPay Frontend - API Integration Guide

This React frontend is fully configured to integrate with your **C# ASP.NET backend** using Microsoft SQL Server.

## Setup

### 1. Install Dependencies
```bash
pnpm install
# or npm install / yarn install / bun install
```

### 2. Configure Environment
Create a `.env` file in the project root (copy from `.env.example`):

```env
REACT_APP_API_URL=http://localhost:5000/api
```

Update `http://localhost:5000` to match your ASP.NET backend URL.

### 3. Run Development Server
```bash
pnpm dev
```

Visit `http://localhost:3000`

## API Client

All API calls are managed through `/src/lib/api-client.ts` using Axios with automatic:
- **Request interceptors** for auth token injection (Bearer token)
- **Response interceptors** for error handling (auto-logout on 401)
- **Timeout handling** (30 seconds by default)

## Available API Endpoints

The API client has pre-configured methods for all SwiftPay operations:

### Transactions
- `apiClient.getTransactions(limit?)` - Get user transactions
- `apiClient.getTransactionById(id)` - Get specific transaction
- `apiClient.createTransaction(payload)` - Send money

### Quotes & FX
- `apiClient.getQuote(from, to, amount)` - Get exchange rate quote

### Beneficiaries
- `apiClient.getBeneficiaries()` - List all beneficiaries
- `apiClient.addBeneficiary(payload)` - Add new beneficiary
- `apiClient.deleteBeneficiary(id)` - Remove beneficiary

### KYC
- `apiClient.submitKYC(payload)` - Submit KYC documents
- `apiClient.getKYCStatus()` - Get user KYC status

### Refunds
- `apiClient.requestRefund(txnId, { reason, notes })` - Request refund
- `apiClient.getRefundStatus(txnId)` - Check refund status

### Admin Operations
- `apiClient.getComplianceCases(filter?)` - Get compliance cases
- `apiClient.updateComplianceCase(caseId, payload)` - Update case status
- `apiClient.getOperationsMetrics()` - Get operations dashboard data
- `apiClient.getSettlementBatches()` - Get settlement batches
- `apiClient.getFXRates()` - Get live FX rates
- `apiClient.updateMargin(corridor, margin)` - Update FX margin
- `apiClient.getAdminStats()` - Get admin statistics
- `apiClient.getUsers()` - List all users
- `apiClient.updateUser(id, payload)` - Update user details

### Other
- `apiClient.getNotifications()` - Get user notifications
- `apiClient.markNotificationAsRead(id)` - Mark notification as read
- `apiClient.getReports()` - Get available reports
- `apiClient.downloadReport(id)` - Download report as PDF

## Backend Requirements

Your C# ASP.NET API should return responses in this format:

```json
{
  "success": true,
  "data": { /* actual data */ },
  "message": "Operation successful"
}
```

### Endpoints Your Backend Should Implement

#### Transactions
- `GET /api/transactions` - List transactions
- `GET /api/transactions/{id}` - Get transaction details
- `POST /api/transactions` - Create new transaction
- `POST /api/transactions/{id}/refund` - Request refund
- `GET /api/transactions/{id}/refund-status` - Check refund status

#### FX & Quotes
- `GET /api/quotes?fromCurrency=USD&toCurrency=INR&amount=100`

#### Beneficiaries
- `GET /api/beneficiaries`
- `POST /api/beneficiaries`
- `DELETE /api/beneficiaries/{id}`

#### KYC
- `POST /api/kyc/submit`
- `GET /api/kyc/status`

#### Admin
- `GET /api/compliance/cases`
- `PUT /api/compliance/cases/{id}`
- `GET /api/operations/metrics`
- `GET /api/operations/settlements`
- `GET /api/treasury/rates`
- `PUT /api/treasury/margins`
- `GET /api/admin/stats`
- `GET /api/admin/users`
- `PUT /api/admin/users/{id}`

#### Other
- `GET /api/notifications`
- `PUT /api/notifications/{id}/read`
- `GET /api/reports`
- `GET /api/reports/{id}/download`

## Authentication

The frontend automatically handles JWT tokens:

1. **Login Response** should include: `{ success: true, data: { token: "jwt_token_here" } }`
2. Token is stored in `localStorage` as `authToken`
3. All requests include `Authorization: Bearer {token}` header
4. On 401 response, user is redirected to login page

## CORS Configuration

Your C# ASP.NET backend should have CORS enabled for `http://localhost:3000`:

```csharp
// Program.cs
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "http://localhost:5173")
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

app.UseCors("AllowFrontend");
```

## Building for Production

```bash
pnpm build
```

Output files will be in `/dist` - deploy these static files to your hosting.

Update `REACT_APP_API_URL` environment variable in your production deployment to point to your live ASP.NET backend.

## Troubleshooting

**CORS errors?** - Ensure your C# backend has CORS configured
**401 Unauthorized?** - Check token format (should be JWT)
**Network errors?** - Verify `REACT_APP_API_URL` in `.env` matches backend

## Styling

Uses Tailwind CSS 4 with custom design tokens in `/src/styles/globals.css`.
All components use shadcn/ui components located in `/src/components/ui/`.
