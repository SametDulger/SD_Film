import React, { useState, useMemo } from 'react';
import { useAuth } from '../AuthContext';
import Home from '../pages/Home';
import Films from '../pages/Films';
import AdminPanel from '../pages/AdminPanel';
import CoordinatorPanel from '../pages/CoordinatorPanel';
import AccountantPanel from '../pages/AccountantPanel';
import WarehousePanel from '../pages/WarehousePanel';
import CourierPanel from '../pages/CourierPanel';
import FilmEntryPanel from '../pages/FilmEntryPanel';
import CustomerPanel from '../pages/CustomerPanel';

interface TabDef {
  key: string;
  label: string;
  component: React.ReactNode;
  roles?: string[];
  public?: boolean;
}

const MainLayout: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('home');

  const tabs: TabDef[] = useMemo(() => [
    { key: 'home', label: 'Ana Sayfa', component: <Home />, public: true },
    { key: 'films', label: 'Filmler', component: <Films />, public: true },
    { key: 'admin', label: 'Admin Paneli', component: <AdminPanel />, roles: ['Admin'] },
    { key: 'coordinator', label: 'Koordinatör', component: <CoordinatorPanel />, roles: ['Admin', 'Coordinator'] },
    { key: 'accountant', label: 'Muhasebe', component: <AccountantPanel />, roles: ['Admin', 'Accountant'] },
    { key: 'warehouse', label: 'Depo', component: <WarehousePanel />, roles: ['Admin', 'Warehouse'] },
    { key: 'courier', label: 'Kurye', component: <CourierPanel />, roles: ['Admin', 'Courier'] },
    { key: 'filmentry', label: 'Film Giriş', component: <FilmEntryPanel />, roles: ['Admin', 'FilmEntry'] },
    { key: 'customer', label: 'Müşteri Paneli', component: <CustomerPanel />, roles: ['Admin', 'Customer'] },
  ], []);

  const availableTabs = useMemo(() => {
    return tabs.filter(tab => {
      if (tab.public) return true;
      if (!user) return false;
      if (!tab.roles) return true;
      return tab.roles.includes(user.role);
    });
  }, [user, tabs]);

  React.useEffect(() => {
    if (availableTabs.length > 0 && !availableTabs.find(tab => tab.key === activeTab)) {
      setActiveTab(availableTabs[0].key);
    }
  }, [availableTabs, activeTab]);

  return (
    <div style={{ padding: '2rem', maxWidth: '1600px', margin: '0 auto' }}>
      <div className="card">
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          {availableTabs.map(tab => (
            <button
              key={tab.key}
              className={`btn ${activeTab === tab.key ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      
      <div>
        {availableTabs.map(tab => (
          <div key={tab.key} style={{ display: activeTab === tab.key ? 'block' : 'none' }}>
            {tab.component}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MainLayout; 