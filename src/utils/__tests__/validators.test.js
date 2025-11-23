import {
  isValidEmail,
  isValidPhone,
  isValidDate,
  isValidPassword,
  isOver50,
  isStudentEmail
} from '../validators';

describe('validators', () => {
  test('validates email formats', () => {
    expect(isValidEmail('user@example.com')).toBe(true);
    expect(isValidEmail('bad-email')).toBe(false);
  });

  test('validates phone numbers', () => {
    expect(isValidPhone('9 1234 5678')).toBe(true);
    expect(isValidPhone('123456')).toBe(false);
  });

  test('validates date format', () => {
    expect(isValidDate('31/12/2020')).toBe(true);
    expect(isValidDate('2020-12-31')).toBe(false);
  });

  test('validates passwords with complexity rules', () => {
    expect(isValidPassword('Abcdef1g')).toBe(true);
    expect(isValidPassword('abcdef')).toBe(false);
    expect(isValidPassword('ABC12345')).toBe(false);
  });

  test('detects when user is over 50 years old', () => {
    const fiftyYearsAgo = `${String(new Date().getDate()).padStart(2, '0')}/01/${new Date().getFullYear() - 60}`;
    expect(isOver50(fiftyYearsAgo)).toBe(true);
    expect(isOver50('01/01/2010')).toBe(false);
  });

  test('checks student email domains', () => {
    expect(isStudentEmail('alumno@duocuc.cl')).toBe(true);
    expect(isStudentEmail('user@example.com')).toBe(false);
  });
});
