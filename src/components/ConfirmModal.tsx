import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import type { Client } from '../types/client';

interface ConfirmModalProps {
  isOpen: boolean;
  client: Client | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  client,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen || !client) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div
        className="modal-container modal-confirm"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-header">
          <div className="confirm-header-icon">
            <AlertTriangle size={20} />
          </div>
          <h3 className="modal-title">Confirmar Eliminación</h3>
          <button
            type="button"
            onClick={onCancel}
            className="btn-close-modal"
            aria-label="Cerrar"
          >
            <X size={20} />
          </button>
        </div>

        <div className="modal-body confirm-body">
          <p>
            ¿Está segura de que desea eliminar el registro del paciente{' '}
            <strong>{client.fullName}</strong>?
          </p>
          <div className="confirm-patient-recap">
            <p><strong>DNI:</strong> {client.dni || 'Sin DNI'}</p>
            <p><strong>Procedimiento:</strong> {client.procedure}</p>
          </div>
          <p className="text-muted text-sm">
            Esta acción quitará al paciente de su base de datos local.
          </p>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-secondary"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="btn btn-danger"
          >
            <Trash2 size={16} />
            <span>Sí, eliminar paciente</span>
          </button>
        </div>
      </div>
    </div>
  );
};
