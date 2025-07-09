import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ShipmentProvider } from './context/ShipmentContext';
import AuthGuard from './components/Auth/AuthGuard';
import Header from './components/Layout/Header';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import Dashboard from './components/Dashboard/Dashboard';
import CreateShipment from './components/Shipment/CreateShipment';
import TrackShipment from './components/Shipment/TrackShipment';
import PaymentSuccess from './components/Payment/PaymentSuccess';
import AdminPanel from './components/Admin/AdminPanel';

function App() {
  return (
    <AuthProvider>
      <ShipmentProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Header />
            <main>
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/track" element={<TrackShipment />} />
                <Route path="/track/:trackingId" element={<TrackShipment />} />
                
                <Route path="/dashboard" element={
                  <AuthGuard>
                    <Dashboard />
                  </AuthGuard>
                } />
                
                <Route path="/create-shipment" element={
                  <AuthGuard>
                    <CreateShipment />
                  </AuthGuard>
                } />
                
                <Route path="/payment-success" element={
                  <AuthGuard>
                    <PaymentSuccess />
                  </AuthGuard>
                } />
                
                <Route path="/admin" element={
                  <AuthGuard>
                    <AdminPanel />
                  </AuthGuard>
                } />
              </Routes>
            </main>
            <Toaster position="top-right" />
          </div>
        </Router>
      </ShipmentProvider>
    </AuthProvider>
  );
}

export default App;