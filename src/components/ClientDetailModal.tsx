import React from 'react';
import {
  X,
  Phone,
  Mail,
  Calendar,
  AlertTriangle,
  Pencil,
  Trash2,
  MessageCircle,
  Clock,
  ShieldCheck,
  Stethoscope,
} from 'lucide-react';
import { type Client, STATUS_LABELS } from '../types/client';
import { calculateAge, formatDateDisplay, formatWhatsAppLink } from '../utils/formatters';

interface ClientDetailModalProps {
  client: Client | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (client: Client) => void;
  onDelete: (client: Client) => void;
}

export const ClientDetailModal: React.FC<ClientDetailModalProps> = ({
  client,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}) => {
  if (!isOpen || !client) return null;

  const age = calculateAge(client.birthDate);
  const statusCfg = STATUS_LABELS[client.status];
  const hasAllergies = client.allergies && client.allergies.toLowerCase() !== 'ninguna' && client.allergies.trim() !== '';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container modal-detail"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Header del Modal */}
        <div className="modal-header">
          <div>
            <span className="modal-subtitle">Ficha Médica & Quirúrgica</span>
            <h2 className="modal-title">{client.fullName}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn-close-modal"
            aria-label="Cerrar ficha"
          >
            <X size={20} />
          </button>
        </div>

        {/* Contenido del Modal */}
        <div className="modal-body">
          {/* Fila superior de Estado y Procedimiento */}
          <div className="detail-status-banner">
            <div className="banner-proc">
              <Stethoscope size={18} className="text-teal" />
              <div>
                <span className="banner-label">Procedimiento Principal</span>
                <span className="banner-value">{client.procedure}</span>
              </div>
            </div>
            <div>
              <span
                className="status-pill status-pill-large"
                style={{
                  backgroundColor: statusCfg.bg,
                  color: statusCfg.text,
                  borderColor: statusCfg.border,
                }}
              >
                {statusCfg.label}
              </span>
            </div>
          </div>

          {/* Alerta de alergias si existe */}
          {hasAllergies && (
            <div className="detail-allergy-box">
              <AlertTriangle size={18} className="text-amber" />
              <div>
                <strong>Alergias Conocidas:</strong>
                <p>{client.allergies}</p>
              </div>
            </div>
          )}

          {/* Bloque de Información Personal */}
          <div className="detail-section">
            <h3 className="detail-section-title">Datos del Paciente</h3>
            <div className="detail-grid-2">
              <div className="detail-field">
                <span className="field-label">DNI / Documento</span>
                <span className="field-value font-mono">{client.dni || 'No informado'}</span>
              </div>
              <div className="detail-field">
                <span className="field-label">Género y Edad</span>
                <span className="field-value">
                  {client.gender} {age !== null ? `(${age} años)` : ''}
                </span>
              </div>
              <div className="detail-field">
                <span className="field-label">Fecha de Nacimiento</span>
                <span className="field-value">
                  {client.birthDate ? formatDateDisplay(client.birthDate) : 'No informada'}
                </span>
              </div>
              <div className="detail-field">
                <span className="field-label">Próxima Consulta / Quirófano</span>
                <span className="field-value highlight-date">
                  <Calendar size={15} />
                  {formatDateDisplay(client.nextAppointmentDate)}
                </span>
              </div>
            </div>
          </div>

          {/* Bloque de Contacto */}
          <div className="detail-section">
            <h3 className="detail-section-title">Canales de Contacto Directo</h3>
            <div className="detail-contact-buttons">
              {client.phone ? (
                <>
                  <a
                    href={`tel:${client.phone.replace(/\s+/g, '')}`}
                    className="btn btn-secondary contact-action-btn"
                  >
                    <Phone size={16} />
                    <span>Llamar: {client.phone}</span>
                  </a>
                  <a
                    href={formatWhatsAppLink(client.phone, client.fullName)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-whatsapp contact-action-btn"
                  >
                    <MessageCircle size={16} />
                    <span>WhatsApp Directo</span>
                  </a>
                </>
              ) : (
                <span className="text-muted">Sin teléfono registrado</span>
              )}

              {client.email && (
                <a
                  href={`mailto:${client.email}`}
                  className="btn btn-secondary contact-action-btn"
                >
                  <Mail size={16} />
                  <span>{client.email}</span>
                </a>
              )}
            </div>
          </div>

          {/* Antecedentes Médicos */}
          <div className="detail-section">
            <h3 className="detail-section-title">
              <ShieldCheck size={16} /> Antecedentes & Exámenes Prequirúrgicos
            </h3>
            <div className="detail-text-block">
              {client.medicalHistory ? (
                <p>{client.medicalHistory}</p>
              ) : (
                <p className="text-muted italic">Sin antecedentes clínicos registrados.</p>
              )}
            </div>
          </div>

          {/* Notas Clínicas y de Evolución */}
          <div className="detail-section">
            <h3 className="detail-section-title">
              <Clock size={16} /> Notas Clínicas y Evolución de la Cirujana
            </h3>
            <div className="detail-text-block detail-notes-block">
              {client.clinicalNotes ? (
                <p>{client.clinicalNotes}</p>
              ) : (
                <p className="text-muted italic">No hay notas clínicas cargadas hasta el momento.</p>
              )}
            </div>
          </div>
        </div>

        {/* Footer del Modal con Acciones */}
        <div className="modal-footer">
          <button
            type="button"
            onClick={() => {
              onClose();
              onDelete(client);
            }}
            className="btn btn-danger-outline"
          >
            <Trash2 size={16} />
            <span>Eliminar Paciente</span>
          </button>

          <div className="modal-footer-right">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              Cerrar
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onEdit(client);
              }}
              className="btn btn-primary"
            >
              <Pencil size={16} />
              <span>Editar Datos</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
