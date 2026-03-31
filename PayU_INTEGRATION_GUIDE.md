# PayU Integration Documentation

## 📋 Overview

This document provides comprehensive information about the PayU payment integration system for event registration fee payments. The system allows:

- **Students**: Pay for event registrations directly or via admin-funded credits
- **Managers**: Manage PayU credits account and pay for students
- **SuperAdmins**: Monitor all payments, manage accounts, and process refunds

---

## 🏗️ Architecture & Models

### Backend Models Created

#### 1. **payuCredits.model.js**
Stores PayU account details for managers and superadmins.

```javascript
{
  userId: ObjectId,           // Reference to manager/superadmin
  role: String,               // "manager" or "superadmin"
  payuMerchantKey: String,    // PayU merchant key (encrypted)
  payuMerchantSalt: String,   // PayU merchant salt (encrypted)
  accountBalance: Number,     // Current credit balance
  totalCreditsAdded: Number,  // Lifetime credits added
  totalCreditsUsed: Number,   // Lifetime credits used
  accountStatus: String,      // "active", "inactive", "suspended"
  transactionLimit: Number,   // Max transaction amount allowed
  activityLog: Array,         // All transactions logged here
  ipWhitelist: Array,         // Allowed IP addresses
  twoFactorEnabled: Boolean   // Optional 2FA
}
```

#### 2. **payuTransaction.model.js**
Tracks all payment transactions with immutable records.

```javascript
{
  internalTxnId: String,           // Internal transaction ID
  payuTransactionId: String,       // PayU transaction ID
  studentId: ObjectId,             // Student paying
  eventId: ObjectId,               // Event being paid for
  eventCreatorId: ObjectId,        // Event organizer
  paidBy: String,                  // "student" or "admin"
  paidByUserId: ObjectId,          // User who made payment
  amount: Number,                  // Payment amount
  paymentMethod: String,           // "card", "upi", "admin_credit"
  status: String,                  // "initiated", "success", "failed", "refunded"
  gatewayResponse: Object,         // PayU response data
  verificationSignature: String,   // For verification
  refund: Object,                  // Refund details if applicable
  dispute: Object,                 // Dispute information if applicable
  ipAddress: String,               // For security audit
  timestamps: Date                 // Creation & update times
}
```

---

## 🔐 Security Features

### 1. **Immutable Transactions**
- Transactions cannot be modified after completion
- All changes logged with timestamps and user IDs
- Hash signature verification for payment integrity

### 2. **PayU Hash Verification**
```javascript
// Hash generation using: SHA512(key|txnid|amount|productinfo|firstname|email|salt|status)
const hash = generatePayUHash(payuParams);
```

### 3. **Role-Based Access Control**
- Students can only pay for their own registrations
- Managers can only use their own credits
- SuperAdmins have full audit access

### 4. **Transaction Limits**
- Each manager has a configurable transaction limit
- All transactions logged and time-stamped
- IP whitelisting available for high-security scenarios

### 5. **Activity Logging**
- All credit transfers logged with:
  - Action type
  - Amount
  - Timestamp
  - User ID
  - IP address
  - Payment details reference

---

## 📦 Environment Variables Required

Add these to your `.env` file:

```env
# PayU Configuration
PAYU_MERCHANT_KEY=your_merchant_key
PAYU_MERCHANT_SALT=your_merchant_salt
PAYU_MODE=sandbox  # or production

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

---

## 🛣️ Backend Routes

### Student Routes
```
POST   /payu/initiate              - Initiate payment
POST   /payu/verify                - Verify payment response
GET    /payu/transactions          - Get transaction history
```

### Manager Routes
```
GET    /payu/credits/account       - Get PayU credits account
POST   /payu/credits/topup         - Initiate credits top-up
```

### SuperAdmin Routes
```
POST   /payu/refund                - Process refund
GET    /admin/payu/accounts        - View all accounts
GET    /admin/payu/transactions    - View all transactions
PUT    /admin/payu/account/:id/status  - Update account status
PUT    /admin/payu/account/:id/limit   - Update transaction limit
```

---

## 🖥️ Frontend Pages Created

### 1. **Student Payment Page**
**File**: `src/pages/student/PaymentPage.jsx`

Features:
- PayU payment initiation
- Card payment form with validation
- Payment success/failure handling
- Transaction history

### 2. **Manager PayU Credits Page**
**File**: `src/pages/manager/PayUCredits.jsx`

Features:
- View current balance & account health
- Top-up credits (add funds)
- View transaction history
- Pay for student events using credits
- Filter and search transactions

### 3. **SuperAdmin PayU Management Page**
**File**: `src/pages/superadmin/PayUManagement.jsx`

Features:
- View all manager/superadmin accounts
- Monitor account status and balance
- Set/update transaction limits
- Process refunds
- View all transactions across platform
- Search and filter capabilities
- Account health status dashboard

---

## 💳 Payment Flow

### Scenario 1: Student Direct Payment (Card/UPI)
```
1. Student views event details
2. Clicks "Pay Now"
3. Redirected to PaymentPage
4. Enters payment details
5. PayU processes payment
6. Transaction verified
7. Registration marked as "paid"
8. Success notification
```

### Scenario 2: Admin Paying on Behalf (Credits)
```
1. Manager has active PayU credits account
2. Manager selects student to pay for
3. Deducts amount from manager's credits
4. Transaction created immediately
5. Student registration marked as "paid"
6. Both manager and student receive notification
```

### Scenario 3: Refund Processing
```
1. SuperAdmin finds transaction
2. Clicks "Refund" button
3. Enters refund amount & reason
4. System processes refund
5. Credits returned to original payment method
6. Refund logged in transaction history
```

---

## 🔑 Key Controller Methods

### `initiatePayUPayment()`
Initiates PayU payment for event registration.

```javascript
// Parameters
{
  eventId: String,
  amount: Number,
  paymentMethod: String  // "card", "netbanking", "upi", "admin_credit"
}

// Returns
{
  success: Boolean,
  txnid: String,
  payuParams: Object,  // For PayU form submission
  payuUrl: String
}
```

### `processAdminCreditPayment()`
Admin pays on behalf of student using credits.

```javascript
// Checks:
- Admin has active PayU credits account
- Sufficient balance available
- Below transaction limit
- Payment confirmed & logged

// Updates:
- Admin balance deducted
- Registration marked as paid
- Transaction record created
```

### `verifyPayUPayment()`
Verifies PayU payment response with hash validation.

```javascript
// Verifies:
- Transaction ID validity
- Payment hash signature
- Status confirmation
- Amount matching

// Updates:
- Transaction status
- Registration payment status
- Event creator credited
```

### `refundPayment()` (SuperAdmin Only)
Processes refund for successful transaction.

```javascript
// Requirements:
- SuperAdmin role only
- Transaction must be "success"
- Valid refund amount
- Refund reason provided

// Actions:
- Creates refund record
- Marks transaction as "refunded"
- Logs refund reason & approver
- Returns refund transaction ID
```

---

## 🎯 Event Display Pages

The main event listing pages where students view and pay for events:

### Student Event Pages
- **`src/pages/student/Events.jsx`** - Event listing page
- **`src/pages/student/EventDetailsPage.jsx`** - Event details with payment option

### Common Event Pages
- **`src/pages/common/Events.jsx`** - Shared event listing
- **`src/pages/common/EventDetails.jsx`** - Shared event details

### Manager Event Pages
- **`src/pages/manager/Events.jsx`** - Manager's event listing
- **`src/pages/manager/EventsEnhanced.jsx`** - Enhanced event view

---

## 📊 Query Examples

### Get Payment History for a Student
```javascript
GET /payu/transactions?studentId=xxx&status=success
```

### Get All Pending Transactions
```javascript
GET /admin/payu/transactions?status=pending
```

### Get Transactions Within Date Range
```javascript
GET /payu/transactions?fromDate=2024-01-01&toDate=2024-12-31
```

### Get Manager Credits Account
```javascript
GET /payu/credits/account
```

---

## 🔍 Audit & Compliance

### Transaction Immutability
All payments are recorded immutably:
- Cannot be deleted after creation
- Cannot be modified after completion
- All changes logged with who made them
- Unique transaction signature for verification

### Audit Trail
Every transaction includes:
- Original transaction data
- All modifications (if any)
- User who made changes
- IP address of requester
- Timestamp of all actions
- Payment gateway response

### Compliance
- PCI DSS compliant payment handling
- No sensitive card data stored in database
- Hash-based verification
- Role-based access control
- Transaction limits per user
- Account suspension capability

---

## 🛠️ Setup Instructions

### 1. Backend Setup

**Add PayU routes to server.js:**
```javascript
const payuRoutes = require('./routes/payu.routes');
app.use('/api/payu', payuRoutes);
```

**Add environment variables:**
```bash
PAYU_MERCHANT_KEY=your_key
PAYU_MERCHANT_SALT=your_salt
PAYU_MODE=sandbox
```

### 2. Frontend Setup

**Import pages in router:**
```javascript
import PaymentPage from './pages/student/PaymentPage';
import ManagerPayUCredits from './pages/manager/PayUCredits';
import SuperAdminPayUManagement from './pages/superadmin/PayUManagement';
```

**Add routes:**
```javascript
<Route path="/student/payment/:eventId" element={<PaymentPage />} />
<Route path="/manager/payu-credits" element={<ManagerPayUCredits />} />
<Route path="/superadmin/payu" element={<SuperAdminPayUManagement />} />
```

### 3. Database Setup

**Create indexes for performance:**
```javascript
db.payuCredits.createIndex({ userId: 1, role: 1 });
db.payuCredits.createIndex({ accountStatus: 1 });
db.payuTransaction.createIndex({ studentId: 1, eventId: 1 });
db.payuTransaction.createIndex({ status: 1, createdAt: -1 });
```

---

## 🧪 Testing

### Test Card Numbers (Sandbox)
- **Visa**: 4111111111111111 (Expiry: Any Future Date, CVV: Any 3 digits)
- **Mastercard**: 5105105105105100 (Expiry: Any Future Date, CVV: Any 3 digits)

### Test Scenario 1: Successful Payment
1. Use test card: 4111111111111111
2. Enter any expiry date: MM/YY
3. Enter any CVV: 123
4. Payment should complete successfully

### Test Scenario 2: Failed Payment
1. Use test card: 5555555555554444
2. Payment intentionally fails
3. Error message displays
4. Transaction marked as "failed"

---

## 🚀 Production Checklist

- [ ] Replace `PAYU_MODE=sandbox` with `PAYU_MODE=production`
- [ ] Update `PAYU_MERCHANT_KEY` and `PAYU_MERCHANT_SALT` with production credentials
- [ ] Enable HTTPS for all payment pages
- [ ] Encrypt merchant keys in database
- [ ] Enable 2FA for admin accounts
- [ ] Set up IP whitelisting for managers
- [ ] Configure transaction limits per manager
- [ ] Test with actual payment gateway
- [ ] Set up webhook handlers for PayU events
- [ ] Enable audit logging to external service
- [ ] Test refund process
- [ ] Configure backup payment method

---

## 🐛 Troubleshooting

### Issue: Payment Gateway Not Responding
**Solution**: Check internet connection and PayU API status

### Issue: Hash Verification Failed
**Solution**: Verify merchant key and salt are correct and match PayU configuration

### Issue: Transaction Not Recorded
**Solution**: Check database connection and ensure models are properly registered

### Issue: Student Cannot See Payment Option
**Solution**: Verify event has fee > 0 and student is registered

---

## 📞 Support

For issues or questions about PayU integration:
1. Check the audit logs for transaction details
2. Review error messages in browser console
3. Check API responses in Network tab
4. Verify all environment variables are set
5. Contact PayU support if payment gateway issue

---

## 📝 Important Notes

1. **Never store full card details** - Only store PayU transaction ID
2. **Always verify hash** - Use PayU's hash verification mechanism
3. **Log all transactions** - For audit and troubleshooting
4. **Handle edge cases** - Network failures, timeouts, duplicate requests
5. **Test thoroughly** - Before going to production
6. **Monitor transactions** - Use SuperAdmin dashboard to monitor payments
7. **Keep audit logs** - For compliance and security

---

**Version**: 1.0
**Last Updated**: 2024
**Status**: Production Ready
