// Funciones de validación reutilizables
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone) => {
  const phoneRegex = /^9\s?\d{4}\s?\d{4}$/;
  return phoneRegex.test(phone.replace(/\s/g, ""));
};

export const isValidDate = (date) => {
  const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/;
  return dateRegex.test(date);
};

export const isValidPassword = (password) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
};

export const isOver50 = (birthDate) => {
  if (!isValidDate(birthDate)) return false;
  const parts = birthDate.split("/");
  const year = parseInt(parts[2]);
  const currentYear = new Date().getFullYear();
  return currentYear - year >= 50;
};

export const isStudentEmail = (email) => {
  return email.endsWith("@duoc.cl") || email.endsWith("@duocuc.cl");
};
