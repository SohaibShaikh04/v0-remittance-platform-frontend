# SwiftPay Implementation Checklist

Complete this checklist to successfully deploy SwiftPay with your C# ASP.NET backend.

---

## Phase 1: Frontend Setup ✅ (Already Done)

- [x] Migrated from Next.js to React 19 + Vite
- [x] Set up React Router for navigation
- [x] Created API client with Axios
- [x] Built all 12 portal pages
- [x] Configured Tailwind CSS + design system
- [x] Added environment configuration
- [x] Installed all dependencies

**Status: Frontend ready to connect**

---

## Phase 2: Backend Preparation (Your Team)

### Database Setup
- [ ] Create SQL Server database (or use existing)
- [ ] Run migration scripts to create tables:
  - [ ] Users table
  - [ ] Transactions table
  - [ ] Beneficiaries table
  - [ ] Refunds table
  - [ ] ComplianceCases table
  - [ ] Notifications table
- [ ] Create stored procedures (if needed)
- [ ] Set up indexes on common queries
- [ ] Seed test data

### C# ASP.NET Project Setup
- [ ] Create new ASP.NET Core 8.0+ project
- [ ] Install NuGet packages:
  - [ ] `Microsoft.EntityFrameworkCore`
  - [ ] `Microsoft.EntityFrameworkCore.SqlServer`
  - [ ] `System.IdentityModel.Tokens.Jwt` (for JWT)
  - [ ] `BCrypt.Net-Next` (for password hashing)
- [ ] Create DbContext for database access
- [ ] Configure connection string in `appsettings.json`
- [ ] Set up dependency injection

### CORS Configuration
- [ ] Add CORS policy in `Program.cs`
- [ ] Allow `http://localhost:3000` for development
- [ ] Allow production domain when deploying
- [ ] Allow credentials for cookie-based auth (if using)

### Authentication Setup
- [ ] Implement JWT token generation service
- [ ] Create `/api/auth/login` endpoint
- [ ] Create `/api/auth/register` endpoint (optional)
- [ ] Implement password hashing with BCrypt
- [ ] Configure JWT validation in middleware
- [ ] Test authentication flow

---

## Phase 3: API Endpoints Implementation

### Priority 1: Core Transactions (Required First)

#### Auth Endpoints
- [ ] `POST /api/auth/login` - User login
- [ ] `POST /api/auth/register` - User registration
- [ ] `POST /api/auth/logout` - User logout
- [ ] `GET /api/auth/me` - Current user info

#### Transaction Endpoints
- [ ] `GET /api/transactions` - List user transactions
- [ ] `GET /api/transactions/{id}` - Get transaction details
- [ ] `POST /api/transactions` - Create new transaction
- [ ] `GET /api/transactions/{id}/status` - Check transaction status
- [ ] `POST /api/transactions/{id}/cancel` - Cancel transaction

#### Beneficiary Endpoints
- [ ] `GET /api/beneficiaries` - List beneficiaries
- [ ] `POST /api/beneficiaries` - Add beneficiary
- [ ] `GET /api/beneficiaries/{id}` - Get beneficiary
- [ ] `PUT /api/beneficiaries/{id}` - Update beneficiary
- [ ] `DELETE /api/beneficiaries/{id}` - Delete beneficiary

#### FX Quote Endpoints
- [ ] `GET /api/quotes?fromCurrency=USD&toCurrency=INR&amount=500` - Get rate quote

### Priority 2: Refunds & Notifications

- [ ] `POST /api/transactions/{id}/refund` - Request refund
- [ ] `GET /api/transactions/{id}/refund-status` - Check refund status
- [ ] `GET /api/notifications` - Get user notifications
- [ ] `PUT /api/notifications/{id}/read` - Mark as read
- [ ] `DELETE /api/notifications/{id}` - Delete notification

### Priority 3: KYC Management

- [ ] `POST /api/kyc/submit` - Submit KYC documents
- [ ] `GET /api/kyc/status` - Get KYC status
- [ ] `GET /api/kyc/documents` - List uploaded documents

### Priority 4: Admin Operations

- [ ] `GET /api/compliance/cases` - List compliance cases
- [ ] `PUT /api/compliance/cases/{id}` - Update case status
- [ ] `GET /api/operations/metrics` - Get operations dashboard
- [ ] `GET /api/operations/settlements` - Get settlement batches
- [ ] `GET /api/treasury/rates` - Get FX rates
- [ ] `PUT /api/treasury/margins` - Update FX margin
- [ ] `GET /api/admin/users` - List users
- [ ] `PUT /api/admin/users/{id}` - Update user
- [ ] `GET /api/reports` - List reports
- [ ] `GET /api/reports/{id}/download` - Download report

---

## Phase 4: Testing

### Backend Testing (Before Connecting Frontend)

#### Unit Tests
- [ ] Test authentication logic
- [ ] Test transaction calculations
- [ ] Test FX rate conversion
- [ ] Test refund logic

#### Integration Tests
- [ ] Test all API endpoints
- [ ] Test database operations
- [ ] Test error handling
- [ ] Test validation rules

#### Manual Testing with Postman/Insomnia
- [ ] Test login endpoint (get token)
- [ ] Test protected endpoints (with token)
- [ ] Test error responses (401, 403, 400, 500)
- [ ] Test CORS headers
- [ ] Test request/response formats

### Frontend Testing

#### Test Environment Setup
```bash
# 1. Start backend
cd your-csharp-project
dotnet run  # Runs on http://localhost:5000

# 2. In new terminal, start frontend
cd swiftpay-frontend
pnpm dev  # Runs on http://localhost:3000
```

#### User Flow Testing
- [ ] Login flow (redirect, token storage)
- [ ] View transactions
- [ ] Add beneficiary
- [ ] Send money (create transaction)
- [ ] Request refund
- [ ] View notifications
- [ ] Navigation between pages

#### API Integration Testing
- [ ] Check Network tab in DevTools
- [ ] Verify auth headers present
- [ ] Check response format matches expected
- [ ] Test error scenarios (401, 500, timeout)
- [ ] Test loading states

---

## Phase 5: Deployment Preparation

### Environment Configuration

#### Development
- [ ] `.env` file created with:
  ```
  REACT_APP_API_URL=http://localhost:5000/api
  ```
- [ ] Backend running on localhost:5000
- [ ] CORS allows localhost:3000

#### Staging
- [ ] Deploy backend to staging server
- [ ] Update `REACT_APP_API_URL` in frontend env
- [ ] Test full flow on staging
- [ ] Verify SSL/HTTPS (if required)

#### Production
- [ ] Deploy backend to production
- [ ] Update `REACT_APP_API_URL` to production URL
- [ ] Configure production CORS
- [ ] Set up HTTPS
- [ ] Configure database backups
- [ ] Set up monitoring/logging

### Build & Deployment

#### Frontend Build
```bash
# Build for production
pnpm build

# Output: /dist folder (static files)
```

#### Deploy Frontend Static Files
- [ ] Build production bundle (`pnpm build`)
- [ ] Choose hosting provider:
  - [ ] Vercel (easiest for Next.js/React)
  - [ ] AWS S3 + CloudFront
  - [ ] Netlify
  - [ ] Azure Static Web Apps
  - [ ] Self-hosted (nginx)
- [ ] Upload `/dist` contents
- [ ] Configure environment variables on hosting platform
- [ ] Set up custom domain
- [ ] Enable HTTPS

#### Deploy Backend
- [ ] Choose hosting provider:
  - [ ] Azure App Service (recommended for .NET)
  - [ ] AWS Elastic Beanstalk
  - [ ] DigitalOcean
  - [ ] Self-hosted
- [ ] Deploy ASP.NET application
- [ ] Configure SQL Server (use managed service if possible)
- [ ] Set production connection string
- [ ] Run migrations
- [ ] Set up backups
- [ ] Configure health checks

---

## Phase 6: Production Verification

### Security Checklist
- [ ] HTTPS/SSL enabled on backend
- [ ] JWT tokens configured with secure signing key
- [ ] Passwords hashed with BCrypt
- [ ] SQL injection prevention (parameterized queries)
- [ ] CORS properly configured
- [ ] No sensitive data in error messages
- [ ] Rate limiting implemented
- [ ] Input validation on all endpoints

### Performance Checklist
- [ ] Database queries optimized (indexes)
- [ ] Caching implemented (if needed)
- [ ] Lazy loading on frontend
- [ ] Image optimization
- [ ] API response times < 200ms
- [ ] Frontend bundle size optimized

### Monitoring Setup
- [ ] Error logging (Sentry, App Insights)
- [ ] Performance monitoring
- [ ] Database monitoring
- [ ] Uptime monitoring
- [ ] User analytics

---

## Phase 7: Post-Launch

### Day 1-7: Active Monitoring
- [ ] Monitor error logs
- [ ] Check performance metrics
- [ ] Handle user issues
- [ ] Fix critical bugs immediately

### Day 8-30: Refinement
- [ ] Gather user feedback
- [ ] Fix UX issues
- [ ] Optimize slow endpoints
- [ ] Plan feature improvements

### Ongoing Maintenance
- [ ] Regular security updates
- [ ] Database backups (daily)
- [ ] Performance optimization
- [ ] Feature improvements
- [ ] User support

---

## Troubleshooting Guide

### API Connection Issues

**Frontend cannot connect to backend**
```
✓ Check backend is running
✓ Verify REACT_APP_API_URL is correct
✓ Check CORS configuration
✓ Inspect browser Network tab for errors
✓ Check backend logs for connection attempts
```

**401 Unauthorized errors**
```
✓ Check token is in localStorage
✓ Verify token format (should be JWT)
✓ Check token hasn't expired
✓ Verify backend validates token correctly
✓ Check Authorization header format: "Bearer {token}"
```

**CORS errors**
```
✓ Enable CORS in C# backend
✓ Allow frontend domain in CORS policy
✓ Check preflight request (OPTIONS)
✓ Verify credentials are handled correctly
```

**Database connection fails**
```
✓ Verify connection string is correct
✓ Check SQL Server is running
✓ Verify database exists
✓ Check firewall/network access
✓ Verify database credentials
```

---

## Sign-Off Checklist

Before going live, verify:

- [ ] All API endpoints implemented and tested
- [ ] Frontend connects to backend successfully
- [ ] User can login and stay authenticated
- [ ] Can create transactions end-to-end
- [ ] Can request refunds
- [ ] Notifications working
- [ ] Admin dashboards populated with data
- [ ] Error handling works gracefully
- [ ] Performance is acceptable
- [ ] Security measures in place
- [ ] Monitoring/logging configured
- [ ] Backup strategy in place
- [ ] Runbook/documentation created
- [ ] Team trained on system
- [ ] Support process defined

---

## Helpful Commands

### Frontend
```bash
pnpm dev          # Start dev server
pnpm build        # Build for production
pnpm preview      # Preview production build
```

### Backend (ASP.NET)
```bash
dotnet run                        # Run locally
dotnet build                      # Build
dotnet publish -c Release        # Publish
dotnet ef migrations add Init    # Create migration
dotnet ef database update        # Apply migration
```

### Testing
```bash
# Curl example
curl -X GET http://localhost:5000/api/transactions \
  -H "Authorization: Bearer YOUR_TOKEN"

# Node.js testing
node -e "
const axios = require('axios');
axios.get('http://localhost:5000/api/transactions', {
  headers: { Authorization: 'Bearer YOUR_TOKEN' }
}).then(r => console.log(r.data));
"
```

---

## Support Resources

- **Frontend Issues:** Check REACT_MIGRATION.md
- **API Issues:** Check API_INTEGRATION.md & CSHARP_BACKEND_EXAMPLES.md
- **Setup Questions:** Check this checklist
- **Backend Help:** See CSHARP_BACKEND_EXAMPLES.md

---

**Good luck with your SwiftPay launch! 🚀**

For questions or issues, refer to the comprehensive documentation in the project root.
