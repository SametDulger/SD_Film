import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Films from './pages/Films';
import Login from './pages/Login';
import Register from './pages/Register';
import FilmDetail from './pages/FilmDetail';
import AdminPanel from './pages/AdminPanel';
import CoordinatorPanel from './pages/CoordinatorPanel';
import AccountantPanel from './pages/AccountantPanel';
import WarehousePanel from './pages/WarehousePanel';
import CourierPanel from './pages/CourierPanel';
import CustomerPanel from './pages/CustomerPanel';
import FilmEntryPanel from './pages/FilmEntryPanel';
import { AuthProvider, useAuth } from './AuthContext';

const PrivateRoute = ({ children, roles }: { children: React.ReactNode, roles?: string[] }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <main className="container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/films" element={<Films />} />
              <Route path="/films/:id" element={<FilmDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/admin" element={<PrivateRoute roles={["Admin"]}><AdminPanel /></PrivateRoute>} />
              <Route path="/coordinator" element={<PrivateRoute roles={["Admin","Coordinator"]}><CoordinatorPanel /></PrivateRoute>} />
              <Route path="/accountant" element={<PrivateRoute roles={["Admin","Accountant"]}><AccountantPanel /></PrivateRoute>} />
              <Route path="/warehouse" element={<PrivateRoute roles={["Admin","Warehouse"]}><WarehousePanel /></PrivateRoute>} />
              <Route path="/courier" element={<PrivateRoute roles={["Admin","Courier"]}><CourierPanel /></PrivateRoute>} />
              <Route path="/filmentry" element={<PrivateRoute roles={["Admin","FilmEntry"]}><FilmEntryPanel /></PrivateRoute>} />
              <Route path="/customer" element={<PrivateRoute roles={["Admin","Customer"]}><CustomerPanel /></PrivateRoute>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
