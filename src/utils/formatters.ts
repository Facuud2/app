export const calculateAge = (birthDateString?: string): number | null => {
  if (!birthDateString) return null;
  const birth = new Date(birthDateString);
  if (isNaN(birth.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age >= 0 ? age : null;
};

export const formatDateDisplay = (dateString?: string): string => {
  if (!dateString) return 'Sin fecha programada';
  const parts = dateString.split('-');
  if (parts.length === 3) {
    const [year, month, day] = parts;
    return `${day}/${month}/${year}`;
  }
  return dateString;
};

export const formatWhatsAppLink = (phone: string, clientName: string): string => {
  const cleanNumber = phone.replace(/[^0-9]/g, '');
  const message = encodeURIComponent(`Hola ${clientName}, te escribo desde el consultorio de MediApp.`);
  return `https://wa.me/${cleanNumber}?text=${message}`;
};
