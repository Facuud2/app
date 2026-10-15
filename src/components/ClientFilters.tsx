import React from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { STATUS_LABELS } from '../types/client';

interface ClientFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  sortBy: 'recent' | 'name' | 'appointment';
  onSortByChange: (sortBy: 'recent' | 'name' | 'appointment') => void;
  totalFiltered: number;
}

export const ClientFilters: React.FC<ClientFiltersProps> = ({
  searchQuery,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  sortBy,
  onSortByChange,
  totalFiltered,
}) => {
  const statusOptions: { value: string; label: string }[] = [
    { value: 'todos', label: 'Todos' },
    { value: 'consulta', label: STATUS_LABELS.consulta.label },
    { value: 'programado', label: STATUS_LABELS.programado.label },
    { value: 'postoperatorio', label: STATUS_LABELS.postoperatorio.label },
    { value: 'control', label: STATUS_LABELS.control.label },
    { value: 'alta', label: STATUS_LABELS.alta.label },
  ];

  return (
    <div className="filter-panel">
      <div className="filter-top-row">
        {/* Campo de búsqueda */}
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Buscar por paciente, DNI, teléfono o cirugía..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="search-input"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="search-clear-btn"
              aria-label="Limpiar búsqueda"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Ordenamiento */}
        <div className="sort-box">
          <SlidersHorizontal size={16} className="sort-icon" />
          <span className="sort-label">Ordenar:</span>
          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value as 'recent' | 'name' | 'appointment')}
            className="sort-select"
          >
            <option value="recent">Modificado recientemente</option>
            <option value="name">Alfabético (A-Z)</option>
            <option value="appointment">Próxima cita / fecha</option>
          </select>
        </div>
      </div>

      {/* Tabs de estados */}
      <div className="status-tabs-wrapper">
        <div className="status-tabs" role="tablist">
          {statusOptions.map((opt) => {
            const isActive = selectedStatus === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => onStatusChange(opt.value)}
                className={`status-tab ${isActive ? 'status-tab-active' : ''}`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        <div className="results-badge">
          {totalFiltered} {totalFiltered === 1 ? 'resultado' : 'resultados'}
        </div>
      </div>
    </div>
  );
};
