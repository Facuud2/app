import React from 'react';
import {
  Calendar,
  Phone,
  MessageCircle,
  Eye,
  Pencil,
  Trash2,
  AlertTriangle,
  FileText,
  User,
  Clock,
} from 'lucide-react';
import { type Client, STATUS_LABELS } from '../types/client';
import { calculateAge, formatDateDisplay, formatWhatsAppLink } from '../utils/formatters';

interface ClientListProps {
  clients: Client[];
  onView: (client: Client) => void;
  onEdit: (client: Client) => void;
  onDelete: (client: Client) => void;
  onNewClient: () => void;
}

export const ClientList: React.FC<ClientListProps> = ({
  clients,
  onView,
  onEdit,
  onDelete,
  onNewClient,
}) => {
  if (clients.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">
          <User size={36} strokeWidth={1.5} />
        </div>
        <h3 className="empty-state-title">No se encontraron pacientes</h3>
        <p className="empty-state-text">
          No hay registros que coincidan con la búsqueda o el filtro aplicado.
        </p>
        <button
          type="button"
          onClick={onNewClient}
          className="btn btn-primary"
        >
          Registrar nuevo paciente
        </button>
      </div>
    );
  }

  return (
    <div className="client-list-container">
      {/* Vista de tabla para Desktop / Tablet en apaisado */}
      <div className="desktop-table-wrapper">
        <table className="medical-table">
          <thead>
            <tr>
              <th>Paciente</th>
              <th>DNI / Identificación</th>
              <th>Procedimiento</th>
              <th>Estado</th>
              <th>Próxima Cita</th>
              <th>Contacto</th>
              <th className="text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => {
              const age = calculateAge(client.birthDate);
              const statusCfg = STATUS_LABELS[client.status];
              const hasAllergies = client.allergies && client.allergies.toLowerCase() !== 'ninguna' && client.allergies.trim() !== '';

              return (
                <tr key={client.id} className="table-row">
                  <td>
                    <div className="patient-name-cell">
                      <button
                        type="button"
                        onClick={() => onView(client)}
                        className="patient-name-link"
                      >
                        {client.fullName}
                      </button>
                      <div className="patient-submeta">
                        {age !== null ? `${age} años • ` : ''}
                        {client.gender}
                        {hasAllergies && (
                          <span className="allergy-tag" title={`Alergias: ${client.allergies}`}>
                            <AlertTriangle size={12} /> Alergia
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="id-code">{client.dni || '—'}</span>
                  </td>
                  <td>
                    <span className="procedure-badge">{client.procedure}</span>
                  </td>
                  <td>
                    <span
                      className="status-pill"
                      style={{
                        backgroundColor: statusCfg.bg,
                        color: statusCfg.text,
                        borderColor: statusCfg.border,
                      }}
                    >
                      {statusCfg.label}
                    </span>
                  </td>
                  <td>
                    {client.nextAppointmentDate ? (
                      <div className="date-cell">
                        <Calendar size={14} />
                        <span>{formatDateDisplay(client.nextAppointmentDate)}</span>
                      </div>
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </td>
                  <td>
                    <div className="contact-actions">
                      {client.phone && (
                        <>
                          <a
                            href={`tel:${client.phone.replace(/\s+/g, '')}`}
                            className="icon-btn-compact"
                            title={`Llamar a ${client.phone}`}
                          >
                            <Phone size={15} />
                          </a>
                          <a
                            href={formatWhatsAppLink(client.phone, client.fullName)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="icon-btn-compact whatsapp-btn"
                            title="Abrir WhatsApp"
                          >
                            <MessageCircle size={15} />
                          </a>
                        </>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="action-buttons-cell">
                      <button
                        type="button"
                        onClick={() => onView(client)}
                        className="btn-action"
                        title="Ver ficha clínica completa"
                      >
                        <Eye size={16} />
                        <span className="action-text">Ficha</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onEdit(client)}
                        className="btn-action"
                        title="Editar datos del paciente"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(client)}
                        className="btn-action btn-action-danger"
                        title="Eliminar paciente"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Vista de Tarjetas para Móviles / Pantallas pequeñas */}
      <div className="mobile-cards-grid">
        {clients.map((client) => {
          const age = calculateAge(client.birthDate);
          const statusCfg = STATUS_LABELS[client.status];
          const hasAllergies = client.allergies && client.allergies.toLowerCase() !== 'ninguna' && client.allergies.trim() !== '';

          return (
            <article key={client.id} className="mobile-patient-card">
              <div className="card-header-row">
                <div>
                  <h4 className="card-patient-name" onClick={() => onView(client)}>
                    {client.fullName}
                  </h4>
                  <p className="card-patient-details">
                    DNI: {client.dni || '—'} {age !== null ? `• ${age} años` : ''} • {client.gender}
                  </p>
                </div>
                <span
                  className="status-pill"
                  style={{
                    backgroundColor: statusCfg.bg,
                    color: statusCfg.text,
                    borderColor: statusCfg.border,
                  }}
                >
                  {statusCfg.label}
                </span>
              </div>

              <div className="card-procedure-row">
                <span className="procedure-label">Procedimiento:</span>
                <span className="card-procedure-text">{client.procedure}</span>
              </div>

              {hasAllergies && (
                <div className="card-allergy-alert">
                  <AlertTriangle size={14} />
                  <span><strong>Alergias:</strong> {client.allergies}</span>
                </div>
              )}

              {client.nextAppointmentDate && (
                <div className="card-date-row">
                  <Clock size={14} className="text-muted" />
                  <span>Próxima cita / control: <strong>{formatDateDisplay(client.nextAppointmentDate)}</strong></span>
                </div>
              )}

              {client.clinicalNotes && (
                <p className="card-notes-preview">
                  <FileText size={13} className="text-muted inline-icon" />
                  <span>{client.clinicalNotes}</span>
                </p>
              )}

              <div className="card-footer-actions">
                <div className="card-contact-group">
                  {client.phone && (
                    <>
                      <a
                        href={`tel:${client.phone.replace(/\s+/g, '')}`}
                        className="btn-touch btn-touch-phone"
                        title="Llamar"
                      >
                        <Phone size={15} />
                        <span>Llamar</span>
                      </a>
                      <a
                        href={formatWhatsAppLink(client.phone, client.fullName)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-touch btn-touch-whatsapp"
                        title="WhatsApp"
                      >
                        <MessageCircle size={15} />
                        <span>WhatsApp</span>
                      </a>
                    </>
                  )}
                </div>

                <div className="card-crud-group">
                  <button
                    type="button"
                    onClick={() => onView(client)}
                    className="btn-action-mobile"
                    title="Ver Ficha"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onEdit(client)}
                    className="btn-action-mobile"
                    title="Editar"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(client)}
                    className="btn-action-mobile btn-danger-mobile"
                    title="Eliminar"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};
