import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Shell } from '@/components/swiftpay/shell';
import { Topbar } from '@/components/swiftpay/topbar';

// Pages
import CustomerPortal from '@/pages/customer-portal';
import BeneficiariesPage from '@/pages/beneficiaries';
import HistoryPage from '@/pages/history';
import NotificationsPage from '@/pages/notifications';
import CompliancePage from '@/pages/compliance';
import OperationsPage from '@/pages/operations';
import SettlementPage from '@/pages/operations/settlement';
import TreasuryPage from '@/pages/treasury';
import AdminPage from '@/pages/admin';
import ReportsPage from '@/pages/reports';
import AgentPortal from '@/pages/agent';
import AgentKYC from '@/pages/agent/kyc';

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-background">
        <Shell />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Topbar />
          <main className="flex-1 overflow-auto">
            <Routes>
              {/* Customer Portal */}
              <Route path="/" element={<CustomerPortal />} />
              <Route path="/beneficiaries" element={<BeneficiariesPage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />

              {/* Compliance & Operations */}
              <Route path="/compliance" element={<CompliancePage />} />
              <Route path="/operations" element={<OperationsPage />} />
              <Route path="/operations/settlement" element={<SettlementPage />} />

              {/* Treasury & Admin */}
              <Route path="/treasury" element={<TreasuryPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/reports" element={<ReportsPage />} />

              {/* Agent Portal */}
              <Route path="/agent" element={<AgentPortal />} />
              <Route path="/agent/kyc" element={<AgentKYC />} />

              {/* Catch-all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
