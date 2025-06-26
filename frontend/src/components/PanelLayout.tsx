import React, { useMemo } from 'react';
import { useAuth } from '../AuthContext';
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
  roles: string[];
}

const PanelLayout: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = React.useState('');

  const tabs: TabDef[] = useMemo(() => [
    { key: 'admin', label: 'Admin', component: <AdminPanel />, roles: ['Admin'] },
    { key: 'coordinator', label: 'Koordinatör', component: <CoordinatorPanel />, roles: ['Admin', 'Coordinator'] },
    { key: 'accountant', label: 'Muhasebe', component: <AccountantPanel />, roles: ['Admin', 'Accountant'] },
    { key: 'warehouse', label: 'Depo', component: <WarehousePanel />, roles: ['Admin', 'Warehouse'] },
    { key: 'courier', label: 'Kurye', component: <CourierPanel />, roles: ['Admin', 'Courier'] },
    { key: 'filmentry', label: 'Film Giriş', component: <FilmEntryPanel />, roles: ['Admin', 'FilmEntry'] },
    { key: 'customer', label: 'Müşteri', component: <CustomerPanel />, roles: ['Admin', 'Customer'] },
  ], []);

  const availableTabs = useMemo(() => {
    if (!user) return [];
    return tabs.filter(tab => tab.roles.includes(user.role));
  }, [user, tabs]);

  React.useEffect(() => {
    if (availableTabs.length > 0) setActiveTab(availableTabs[0].key);
  }, [availableTabs]);

  if (!user) return null;

  return (
    <div>
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

export default PanelLayout; 