import React, { useState, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { StatsOverview } from './components/StatsOverview';
import { ClientFilters } from './components/ClientFilters';
import { ClientList } from './components/ClientList';
import { ClientDetailModal } from './components/ClientDetailModal';
import { ClientFormModal } from './components/ClientFormModal';
import { ConfirmModal } from './components/ConfirmModal';
import { StorageService } from './services/storage';
import type { Client, ClientFormData } from './types/client';
import { Check } from 'lucide-react';

export const App: React.FC = () => {
  const [clients, setClients] = useState<Client[]>(() => StorageService.getClients());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('todos');
  const [sortBy, setSortBy] = useState<'recent' | 'name' | 'appointment'>('recent');

  // Modales
  const [selectedClientForView, setSelectedClientForView] = useState<Client | null>(null);
  const [clientToEdit, setClientToEdit] = useState<Client | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);

  // Toast simple
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Filtrado y ordenamiento de clientes
  const filteredClients = useMemo(() => {
    let result = [...clients];

    // Filtro por estado
    if (selectedStatus !== 'todos') {
      result = result.filter((c) => c.status === selectedStatus);
    }

    // Filtro por búsqueda
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (c) =>
          c.fullName.toLowerCase().includes(q) ||
          c.dni.toLowerCase().includes(q) ||
          c.phone.toLowerCase().includes(q) ||
          c.procedure.toLowerCase().includes(q) ||
          (c.allergies && c.allergies.toLowerCase().includes(q))
      );
    }

    // Ordenamiento
    result.sort((a, b) => {
      if (sortBy === 'name') {
        return a.fullName.localeCompare(b.fullName, 'es');
      }
      if (sortBy === 'appointment') {
        if (!a.nextAppointmentDate) return 1;
        if (!b.nextAppointmentDate) return -1;
        return a.nextAppointmentDate.localeCompare(b.nextAppointmentDate);
      }
      // recent (por fecha de actualización/creación)
      const dateA = new Date(a.updatedAt || a.createdAt).getTime();
      const dateB = new Date(b.updatedAt || b.createdAt).getTime();
      return dateB - dateA;
    });

    return result;
  }, [clients, selectedStatus, searchQuery, sortBy]);

  // Manejadores CRUD
  const handleOpenNew = () => {
    setClientToEdit(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (client: Client) => {
    setClientToEdit(client);
    setIsFormOpen(true);
  };

  const handleSaveClient = (formData: ClientFormData) => {
    if (clientToEdit) {
      const updated = StorageService.updateClient(clientToEdit.id, formData);
      if (updated) {
        setClients(StorageService.getClients());
        if (selectedClientForView?.id === updated.id) {
          setSelectedClientForView(updated);
        }
        showToast(`Ficha de ${updated.fullName} actualizada.`);
      }
    } else {
      const created = StorageService.addClient(formData);
      setClients(StorageService.getClients());
      showToast(`Paciente ${created.fullName} registrado correctamente.`);
    }
  };

  const handleDeleteClient = () => {
    if (!clientToDelete) return;
    const name = clientToDelete.fullName;
    StorageService.deleteClient(clientToDelete.id);
    setClients(StorageService.getClients());
    if (selectedClientForView?.id === clientToDelete.id) {
      setSelectedClientForView(null);
    }
    setClientToDelete(null);
    showToast(`Paciente ${name} eliminado.`);
  };

  const handleResetData = () => {
    if (window.confirm('¿Desea restaurar los datos de pacientes de muestra para pruebas?')) {
      const sample = StorageService.resetDefaults();
      setClients(sample);
      showToast('Se restablecieron los datos de muestra.');
    }
  };

  return (
    <div className="app-layout">
      {/* Barra superior de navegación */}
      <Navbar
        onNewClient={handleOpenNew}
        onResetData={handleResetData}
        clientCount={clients.length}
      />

      {/* Contenedor principal de la aplicación */}
      <main className="main-content">
        <div className="content-container">
          {/* Métricas del consultorio */}
          <StatsOverview
            clients={clients}
            activeFilter={selectedStatus}
            onSelectFilter={setSelectedStatus}
          />

          {/* Filtros, búsqueda y orden */}
          <ClientFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
            sortBy={sortBy}
            onSortByChange={setSortBy}
            totalFiltered={filteredClients.length}
          />

          {/* Lista y tabla adaptable de clientes */}
          <ClientList
            clients={filteredClients}
            onView={(c) => setSelectedClientForView(c)}
            onEdit={(c) => handleOpenEdit(c)}
            onDelete={(c) => setClientToDelete(c)}
            onNewClient={handleOpenNew}
          />
        </div>
      </main>

      {/* Footer médico sobrio */}
      <footer className="app-footer">
        <div className="footer-container">
          <p>
            <strong>MediApp</strong> • Sistema de Registro & Ficha Clínica Quirúrgica
          </p>
          <p className="footer-sub">
            Diseñado para uso médico ágil en consultorio, móvil y quirófano.
          </p>
        </div>
      </footer>

      {/* Modales */}
      <ClientDetailModal
        client={selectedClientForView}
        isOpen={Boolean(selectedClientForView)}
        onClose={() => setSelectedClientForView(null)}
        onEdit={(c) => handleOpenEdit(c)}
        onDelete={(c) => setClientToDelete(c)}
      />

      {isFormOpen && (
        <ClientFormModal
          key={clientToEdit?.id ?? 'new-client'}
          isOpen={isFormOpen}
          initialData={clientToEdit}
          onClose={() => setIsFormOpen(false)}
          onSave={handleSaveClient}
        />
      )}

      <ConfirmModal
        isOpen={Boolean(clientToDelete)}
        client={clientToDelete}
        onConfirm={handleDeleteClient}
        onCancel={() => setClientToDelete(null)}
      />

      {/* Toast flotante */}
      {toastMessage && (
        <div className="toast-notification">
          <Check size={18} className="toast-icon" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default App;
