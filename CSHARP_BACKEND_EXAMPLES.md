# C# ASP.NET Backend Examples

Sample endpoints your backend should implement. These examples show the expected request/response format.

## Base Response Format

All endpoints should return this JSON structure:

```csharp
public class ApiResponse<T>
{
    public bool Success { get; set; }
    public T Data { get; set; }
    public string Message { get; set; }
    public string Error { get; set; }
}
```

---

## Authentication Endpoints

### Login
**Endpoint:** `POST /api/auth/login`

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user-123",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "Customer"
    }
  },
  "message": "Login successful"
}
```

### C# Implementation
```csharp
[HttpPost("auth/login")]
public async Task<IActionResult> Login([FromBody] LoginRequest request)
{
    var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
    
    if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
        return Unauthorized(new { success = false, error = "Invalid credentials" });
    
    var token = _tokenService.GenerateJwtToken(user);
    
    return Ok(new ApiResponse<dynamic>
    {
        Success = true,
        Data = new { token, user = new { user.Id, user.Email, user.Name, user.Role } },
        Message = "Login successful"
    });
}
```

---

## Transactions Endpoints

### Get All Transactions
**Endpoint:** `GET /api/transactions?limit=10`

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "TXN-2024-48291",
      "date": "2024-04-12T10:30:00Z",
      "beneficiary": "Ravi Kumar",
      "country": "India",
      "sendAmount": 500,
      "sendCurrency": "USD",
      "receiveAmount": 41725,
      "receiveCurrency": "INR",
      "rate": 83.45,
      "status": "Paid",
      "purpose": "Family Support",
      "payoutMethod": "Bank Transfer"
    },
    ...
  ]
}
```

### C# Implementation
```csharp
[HttpGet("transactions")]
[Authorize]
public async Task<IActionResult> GetTransactions([FromQuery] int? limit)
{
    var userId = User.FindFirst(ClaimTypes.NameIdentifier).Value;
    
    var transactions = await _context.Transactions
        .Where(t => t.UserId == userId)
        .OrderByDescending(t => t.CreatedAt)
        .Take(limit ?? 10)
        .Select(t => new
        {
            t.Id,
            t.CreatedAt,
            t.BeneficiaryName,
            t.Country,
            t.SendAmount,
            t.SendCurrency,
            t.ReceiveAmount,
            t.ReceiveCurrency,
            t.ExchangeRate,
            t.Status,
            t.Purpose,
            t.PayoutMethod
        })
        .ToListAsync();
    
    return Ok(new ApiResponse<dynamic>
    {
        Success = true,
        Data = transactions
    });
}
```

---

### Create Transaction
**Endpoint:** `POST /api/transactions`

**Request:**
```json
{
  "beneficiaryId": "benef-456",
  "sendAmount": 500,
  "sendCurrency": "USD",
  "receiveCurrency": "INR",
  "purpose": "Family Support"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "TXN-2024-48291",
    "status": "Queued",
    "receiveAmount": 41725,
    "rate": 83.45,
    "estimatedDelivery": "2024-04-14T10:30:00Z"
  },
  "message": "Transaction created successfully"
}
```

### C# Implementation
```csharp
[HttpPost("transactions")]
[Authorize]
public async Task<IActionResult> CreateTransaction([FromBody] CreateTransactionRequest request)
{
    var userId = User.FindFirst(ClaimTypes.NameIdentifier).Value;
    var beneficiary = await _context.Beneficiaries.FindAsync(request.BeneficiaryId);
    
    if (beneficiary?.UserId != userId)
        return Forbid();
    
    var rate = await _fxService.GetRate(request.SendCurrency, request.ReceiveCurrency);
    var receiveAmount = request.SendAmount * rate;
    
    var transaction = new Transaction
    {
        Id = $"TXN-{DateTime.Now:yyyy-ddHHmm-ssff}",
        UserId = userId,
        BeneficiaryId = request.BeneficiaryId,
        SendAmount = request.SendAmount,
        SendCurrency = request.SendCurrency,
        ReceiveAmount = receiveAmount,
        ReceiveCurrency = request.ReceiveCurrency,
        ExchangeRate = rate,
        Status = "Queued",
        Purpose = request.Purpose,
        CreatedAt = DateTime.UtcNow
    };
    
    _context.Transactions.Add(transaction);
    await _context.SaveChangesAsync();
    
    return CreatedAtAction(nameof(GetTransaction), new { id = transaction.Id },
        new ApiResponse<dynamic>
        {
            Success = true,
            Data = new
            {
                transaction.Id,
                transaction.Status,
                transaction.ReceiveAmount,
                transaction.ExchangeRate,
                EstimatedDelivery = DateTime.UtcNow.AddDays(3)
            }
        });
}
```

---

## Beneficiaries Endpoints

### Get Beneficiaries
**Endpoint:** `GET /api/beneficiaries`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "benef-456",
      "name": "Ravi Kumar",
      "country": "India",
      "accountNumber": "****5678",
      "bankName": "ICICI Bank",
      "payoutMethod": "Bank Transfer"
    }
  ]
}
```

### C# Implementation
```csharp
[HttpGet("beneficiaries")]
[Authorize]
public async Task<IActionResult> GetBeneficiaries()
{
    var userId = User.FindFirst(ClaimTypes.NameIdentifier).Value;
    
    var beneficiaries = await _context.Beneficiaries
        .Where(b => b.UserId == userId)
        .Select(b => new
        {
            b.Id,
            b.Name,
            b.Country,
            AccountNumber = $"****{b.AccountNumber.Substring(b.AccountNumber.Length - 4)}",
            b.BankName,
            b.PayoutMethod
        })
        .ToListAsync();
    
    return Ok(new ApiResponse<dynamic>
    {
        Success = true,
        Data = beneficiaries
    });
}
```

### Add Beneficiary
**Endpoint:** `POST /api/beneficiaries`

**Request:**
```json
{
  "name": "Ravi Kumar",
  "country": "India",
  "accountNumber": "1234567890",
  "bankName": "ICICI Bank",
  "bankCode": "ICICIBANK",
  "payoutMethod": "Bank Transfer"
}
```

**C# Implementation:**
```csharp
[HttpPost("beneficiaries")]
[Authorize]
public async Task<IActionResult> AddBeneficiary([FromBody] AddBeneficiaryRequest request)
{
    var userId = User.FindFirst(ClaimTypes.NameIdentifier).Value;
    
    var beneficiary = new Beneficiary
    {
        Id = Guid.NewGuid().ToString(),
        UserId = userId,
        Name = request.Name,
        Country = request.Country,
        AccountNumber = request.AccountNumber,
        BankName = request.BankName,
        BankCode = request.BankCode,
        PayoutMethod = request.PayoutMethod,
        CreatedAt = DateTime.UtcNow
    };
    
    _context.Beneficiaries.Add(beneficiary);
    await _context.SaveChangesAsync();
    
    return Ok(new ApiResponse<dynamic>
    {
        Success = true,
        Data = beneficiary,
        Message = "Beneficiary added successfully"
    });
}
```

---

## Refund Endpoints

### Request Refund
**Endpoint:** `POST /api/transactions/{transactionId}/refund`

**Request:**
```json
{
  "reason": "wrong_amount",
  "notes": "Sent wrong amount, please refund"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "refundId": "REF-2024-12345",
    "transactionId": "TXN-2024-48291",
    "amount": 500,
    "status": "Processing",
    "expectedCompletion": "2024-04-14T00:00:00Z"
  },
  "message": "Refund requested successfully"
}
```

### C# Implementation
```csharp
[HttpPost("transactions/{transactionId}/refund")]
[Authorize]
public async Task<IActionResult> RequestRefund(string transactionId, [FromBody] RefundRequest request)
{
    var userId = User.FindFirst(ClaimTypes.NameIdentifier).Value;
    var transaction = await _context.Transactions.FindAsync(transactionId);
    
    if (transaction?.UserId != userId || transaction.Status == "Refunded")
        return BadRequest(new { success = false, error = "Cannot refund this transaction" });
    
    var refund = new Refund
    {
        Id = $"REF-{DateTime.Now:yyyy-ddHHmm-ssff}",
        TransactionId = transactionId,
        Amount = transaction.SendAmount,
        Reason = request.Reason,
        Notes = request.Notes,
        Status = "Processing",
        CreatedAt = DateTime.UtcNow
    };
    
    transaction.Status = "RefundInitiated";
    
    _context.Refunds.Add(refund);
    _context.SaveChanges();
    
    return Ok(new ApiResponse<dynamic>
    {
        Success = true,
        Data = new
        {
            refund.Id,
            refund.TransactionId,
            refund.Amount,
            refund.Status,
            ExpectedCompletion = DateTime.UtcNow.AddDays(3)
        }
    });
}
```

---

## FX Quote Endpoints

### Get Exchange Rate
**Endpoint:** `GET /api/quotes?fromCurrency=USD&toCurrency=INR&amount=500`

**Response:**
```json
{
  "success": true,
  "data": {
    "fromCurrency": "USD",
    "toCurrency": "INR",
    "amount": 500,
    "rate": 83.45,
    "receiveAmount": 41725,
    "fee": 2.50,
    "netReceiveAmount": 41722.50,
    "rateLockedUntil": "2024-04-12T11:15:00Z"
  }
}
```

### C# Implementation
```csharp
[HttpGet("quotes")]
public async Task<IActionResult> GetQuote(
    [FromQuery] string fromCurrency, 
    [FromQuery] string toCurrency, 
    [FromQuery] decimal amount)
{
    var rate = await _fxService.GetLiveRate(fromCurrency, toCurrency);
    var receiveAmount = amount * rate;
    var fee = amount * 0.005m; // 0.5% fee
    
    return Ok(new ApiResponse<dynamic>
    {
        Success = true,
        Data = new
        {
            fromCurrency,
            toCurrency,
            amount,
            rate,
            receiveAmount,
            fee,
            NetReceiveAmount = receiveAmount - fee,
            RateLockedUntil = DateTime.UtcNow.AddSeconds(120)
        }
    });
}
```

---

## Compliance Endpoints

### Get Compliance Cases
**Endpoint:** `GET /api/compliance/cases?filter=pending`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "CASE-2024-001",
      "transactionId": "TXN-2024-48291",
      "reason": "High transaction amount",
      "severity": "High",
      "status": "Pending",
      "createdAt": "2024-04-12T10:30:00Z"
    }
  ]
}
```

### C# Implementation
```csharp
[HttpGet("compliance/cases")]
[Authorize(Roles = "Compliance,Admin")]
public async Task<IActionResult> GetComplianceCases([FromQuery] string filter = null)
{
    var query = _context.ComplianceCases.AsQueryable();
    
    if (!string.IsNullOrEmpty(filter))
        query = query.Where(c => c.Status.ToLower() == filter.ToLower());
    
    var cases = await query
        .OrderByDescending(c => c.CreatedAt)
        .Select(c => new
        {
            c.Id,
            c.TransactionId,
            c.Reason,
            c.Severity,
            c.Status,
            c.CreatedAt
        })
        .ToListAsync();
    
    return Ok(new ApiResponse<dynamic>
    {
        Success = true,
        Data = cases
    });
}
```

---

## Setup Requirements

### Database Schema
```sql
CREATE TABLE Users (
    Id NVARCHAR(MAX) PRIMARY KEY,
    Email NVARCHAR(255) UNIQUE NOT NULL,
    PasswordHash NVARCHAR(MAX) NOT NULL,
    Name NVARCHAR(255),
    Role NVARCHAR(50),
    CreatedAt DATETIME2
);

CREATE TABLE Transactions (
    Id NVARCHAR(MAX) PRIMARY KEY,
    UserId NVARCHAR(MAX) NOT NULL,
    BeneficiaryId NVARCHAR(MAX),
    SendAmount DECIMAL(18,2),
    SendCurrency NVARCHAR(3),
    ReceiveAmount DECIMAL(18,2),
    ReceiveCurrency NVARCHAR(3),
    ExchangeRate DECIMAL(18,6),
    Status NVARCHAR(50),
    Purpose NVARCHAR(255),
    PayoutMethod NVARCHAR(50),
    CreatedAt DATETIME2,
    FOREIGN KEY (UserId) REFERENCES Users(Id)
);

CREATE TABLE Beneficiaries (
    Id NVARCHAR(MAX) PRIMARY KEY,
    UserId NVARCHAR(MAX) NOT NULL,
    Name NVARCHAR(255),
    Country NVARCHAR(100),
    AccountNumber NVARCHAR(255),
    BankName NVARCHAR(255),
    BankCode NVARCHAR(50),
    PayoutMethod NVARCHAR(50),
    CreatedAt DATETIME2,
    FOREIGN KEY (UserId) REFERENCES Users(Id)
);

CREATE TABLE Refunds (
    Id NVARCHAR(MAX) PRIMARY KEY,
    TransactionId NVARCHAR(MAX) NOT NULL,
    Amount DECIMAL(18,2),
    Reason NVARCHAR(100),
    Notes NVARCHAR(MAX),
    Status NVARCHAR(50),
    CreatedAt DATETIME2,
    FOREIGN KEY (TransactionId) REFERENCES Transactions(Id)
);
```

### Program.cs Configuration
```csharp
var builder = WebApplicationBuilder.CreateBuilder(args);

// Add services
builder.Services.AddControllers();
builder.Services.AddDbContext<SwiftPayContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "http://localhost:5173")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

// Add JWT Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"])),
            ValidateIssuer = false,
            ValidateAudience = false
        };
    });

var app = builder.Build();

app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
```

---

## Testing with curl

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

### Get Transactions (with token)
```bash
curl -X GET http://localhost:5000/api/transactions \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Create Transaction
```bash
curl -X POST http://localhost:5000/api/transactions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "beneficiaryId": "benef-456",
    "sendAmount": 500,
    "sendCurrency": "USD",
    "receiveCurrency": "INR",
    "purpose": "Family Support"
  }'
```

---

## Notes

- All timestamps should be in UTC ISO 8601 format
- Status enum values: Queued, Routing, Paid, ComplianceHold, Cancelled, Refunded
- Use DECIMAL(18,2) for monetary amounts
- Always validate user ownership before returning data
- Return 401 for authentication errors, 403 for authorization errors, 400 for validation errors
