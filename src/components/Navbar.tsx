import React from 'react';
import { Plus, Activity, RefreshCw } from 'lucide-react';

interface NavbarProps {
  onNewClient: () => void;
  onResetData: () => void;
  clientCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ onNewClient, onResetData, clientCount }) => {
  const todayFormatted = new Intl.DateTimeFormat('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date());

  const capitalizedDate = todayFormatted.charAt(0).toUpperCase() + todayFormatted.slice(1);

  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <div className="navbar-logo-icon">
            <Activity size={22} strokeWidth={2.4} />
          </div>
          <div>
            <div className="brand-row">
              <span className="brand-name">MediApp</span>
              <span className="brand-tag">Cirugía & Registro</span>
            </div>
            <p className="brand-date">{capitalizedDate} • {clientCount} pacientes registrados</p>
          </div>
        </div>

        <div className="navbar-actions">
          <button
            type="button"
            onClick={onResetData}
            title="Restablecer datos de muestra"
            className="btn btn-secondary btn-icon-only"
            aria-label="Restaurar datos de muestra"
          >
            <RefreshCw size={17} />
          </button>

          <button
            type="button"
            onClick={onNewClient}
            className="btn btn-primary"
          >
            <Plus size={18} strokeWidth={2.4} />
            <span>Registrar Paciente</span>
          </button>
        </div>
      </div>
    </header>
  );
};
