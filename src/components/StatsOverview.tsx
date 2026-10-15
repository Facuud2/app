import React from 'react';
import { Users, CalendarClock, ShieldAlert, CheckCircle2 } from 'lucide-react';
import type { Client } from '../types/client';

interface StatsOverviewProps {
  clients: Client[];
  activeFilter: string;
  onSelectFilter: (status: string) => void;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({
  clients,
  activeFilter,
  onSelectFilter,
}) => {
  const total = clients.length;
  const inConsult = clients.filter((c) => c.status === 'consulta').length;
  const scheduled = clients.filter((c) => c.status === 'programado').length;
  const postOrControl = clients.filter((c) => c.status === 'postoperatorio' || c.status === 'control').length;

  const stats = [
    {
      id: 'all',
      title: 'Total Pacientes',
      count: total,
      icon: Users,
      color: '#0f766e',
      bg: '#f0fdfa',
      filterValue: 'todos',
    },
    {
      id: 'consulta',
      title: 'En Consulta / Valoración',
      count: inConsult,
      icon: CalendarClock,
      color: '#1d4ed8',
      bg: '#eff6ff',
      filterValue: 'consulta',
    },
    {
      id: 'programado',
      title: 'Quirófano Programado',
      count: scheduled,
      icon: ShieldAlert,
      color: '#b45309',
      bg: '#fffbeb',
      filterValue: 'programado',
    },
    {
      id: 'postop',
      title: 'Postoperatorio & Control',
      count: postOrControl,
      icon: CheckCircle2,
      color: '#7e22ce',
      bg: '#faf5ff',
      filterValue: 'postoperatorio',
    },
  ];

  return (
    <div className="stats-grid">
      {stats.map((s) => {
        const Icon = s.icon;
        const isSelected = activeFilter === s.filterValue;

        return (
          <div
            key={s.id}
            onClick={() => onSelectFilter(s.filterValue)}
            className={`stat-card ${isSelected ? 'stat-card-active' : ''}`}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onSelectFilter(s.filterValue);
              }
            }}
          >
            <div className="stat-icon-wrapper" style={{ backgroundColor: s.bg, color: s.color }}>
              <Icon size={20} />
            </div>
            <div className="stat-content">
              <span className="stat-title">{s.title}</span>
              <span className="stat-count">{s.count}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
