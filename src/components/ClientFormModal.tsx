import React, { useState } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import { type Client, type ClientFormData, COMMON_PROCEDURES } from '../types/client';

interface ClientFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ClientFormData) => void;
  initialData?: Client | null;
}

export const ClientFormModal: React.FC<ClientFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const isEditing = Boolean(initialData);

  const isPredefined = initialData ? COMMON_PROCEDURES.includes(initialData.procedure) : true;

  const [formData, setFormData] = useState<ClientFormData>(() => ({
    fullName: initialData?.fullName || '',
    dni: initialData?.dni || '',
    phone: initialData?.phone || '',
    email: initialData?.email || '',
    birthDate: initialData?.birthDate || '',
    gender: initialData?.gender || 'Femenino',
    procedure: initialData
      ? (isPredefined ? initialData.procedure : 'OTRO_PERSONALIZADO')
      : 'Rinoplastia Ultrasónica',
    status: initialData?.status || 'consulta',
    nextAppointmentDate: initialData?.nextAppointmentDate || '',
    allergies: initialData?.allergies || '',
    medicalHistory: initialData?.medicalHistory || '',
    clinicalNotes: initialData?.clinicalNotes || '',
  }));

  const [customProcedure, setCustomProcedure] = useState<string>(() =>
    initialData && !isPredefined ? initialData.procedure : ''
  );
  const [useCustomProcedure, setUseCustomProcedure] = useState<boolean>(() =>
    Boolean(initialData && !isPredefined)
  );
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProcedureSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === 'OTRO_PERSONALIZADO') {
      setUseCustomProcedure(true);
      setFormData((prev) => ({ ...prev, procedure: customProcedure || 'Procedimiento quirúrgico' }));
    } else {
      setUseCustomProcedure(false);
      setFormData((prev) => ({ ...prev, procedure: val }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName.trim()) {
      setErrorMsg('Por favor ingrese el nombre completo del paciente.');
      return;
    }

    if (!formData.phone.trim()) {
      setErrorMsg('Por favor ingrese un número de teléfono o celular.');
      return;
    }

    const finalProcedure = useCustomProcedure
      ? customProcedure.trim() || 'Procedimiento a definir'
      : formData.procedure;

    onSave({
      ...formData,
      procedure: finalProcedure,
      fullName: formData.fullName.trim(),
      dni: formData.dni.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim(),
    });

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container modal-form"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-header">
          <div>
            <span className="modal-subtitle">
              {isEditing ? 'Modificación de Expediente' : 'Nuevo Registro'}
            </span>
            <h2 className="modal-title">
              {isEditing ? 'Editar Paciente' : 'Registrar Nuevo Paciente'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn-close-modal"
            aria-label="Cerrar formulario"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form-content">
          {errorMsg && (
            <div className="form-error-banner">
              <AlertCircle size={18} />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="modal-body">
            {/* Sección: Datos Personales */}
            <div className="form-section">
              <h3 className="form-section-title">1. Datos Personales</h3>
              
              <div className="form-group">
                <label className="form-label" htmlFor="fullName">
                  Nombre completo <span className="text-required">*</span>
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  placeholder="Ej: Sofia Beltrán"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label" htmlFor="dni">
                    DNI / Documento de Identidad
                  </label>
                  <input
                    id="dni"
                    name="dni"
                    type="text"
                    placeholder="Ej: 36.890.123"
                    value={formData.dni}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="gender">
                    Género
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="Femenino">Femenino</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label" htmlFor="phone">
                    Teléfono / WhatsApp <span className="text-required">*</span>
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    placeholder="Ej: +54 9 11 4000-1122"
                    value={formData.phone}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="birthDate">
                    Fecha de Nacimiento
                  </label>
                  <input
                    id="birthDate"
                    name="birthDate"
                    type="date"
                    value={formData.birthDate}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="email">
                  Correo Electrónico
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="ejemplo@paciente.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            </div>

            {/* Sección: Procedimiento y Estado */}
            <div className="form-section">
              <h3 className="form-section-title">2. Procedimiento & Estado Clínico</h3>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label" htmlFor="procedure-select">
                    Procedimiento Quirúrgico
                  </label>
                  <select
                    id="procedure-select"
                    value={useCustomProcedure ? 'OTRO_PERSONALIZADO' : formData.procedure}
                    onChange={handleProcedureSelect}
                    className="form-select"
                  >
                    {COMMON_PROCEDURES.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                    <option value="OTRO_PERSONALIZADO">Otro procedimiento específico...</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="status">
                    Estado Actual
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="consulta">Consulta inicial / Valoración</option>
                    <option value="programado">Quirófano programado</option>
                    <option value="postoperatorio">Postoperatorio</option>
                    <option value="control">En control</option>
                    <option value="alta">Alta médica definitiva</option>
                  </select>
                </div>
              </div>

              {useCustomProcedure && (
                <div className="form-group">
                  <label className="form-label" htmlFor="customProcedure">
                    Especificar Procedimiento
                  </label>
                  <input
                    id="customProcedure"
                    type="text"
                    placeholder="Describa la cirugía o tratamiento..."
                    value={customProcedure}
                    onChange={(e) => setCustomProcedure(e.target.value)}
                    className="form-input"
                  />
                </div>
              )}

              <div className="form-group">
                <label className="form-label" htmlFor="nextAppointmentDate">
                  Fecha de Próxima Cita / Cirugía
                </label>
                <input
                  id="nextAppointmentDate"
                  name="nextAppointmentDate"
                  type="date"
                  value={formData.nextAppointmentDate}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            </div>

            {/* Sección: Antecedentes y Notas Clínicas */}
            <div className="form-section">
              <h3 className="form-section-title">3. Antecedentes & Notas Médicas</h3>

              <div className="form-group">
                <label className="form-label text-warning-label" htmlFor="allergies">
                  Alergias o Reacciones Adversas
                </label>
                <input
                  id="allergies"
                  name="allergies"
                  type="text"
                  placeholder="Ej: Penicilina, Látex, AINEs (o 'Ninguna conocida')"
                  value={formData.allergies}
                  onChange={handleChange}
                  className="form-input form-input-warning"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="medicalHistory">
                  Antecedentes Clínicos / Prequirúrgicos
                </label>
                <textarea
                  id="medicalHistory"
                  name="medicalHistory"
                  rows={2}
                  placeholder="Cirugías previas, patologías de base, exámenes pendientes..."
                  value={formData.medicalHistory}
                  onChange={handleChange}
                  className="form-textarea"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="clinicalNotes">
                  Notas de Evolución e Indicaciones
                </label>
                <textarea
                  id="clinicalNotes"
                  name="clinicalNotes"
                  rows={3}
                  placeholder="Observaciones de la consulta, plan quirúrgico, evolución de heridas..."
                  value={formData.clinicalNotes}
                  onChange={handleChange}
                  className="form-textarea"
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              <Save size={16} />
              <span>{isEditing ? 'Guardar Cambios' : 'Registrar Paciente'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
