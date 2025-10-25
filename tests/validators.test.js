// tests/validators.test.js
import { isValidEmail, isValidPassword, isStudentEmail, isOver50 } from '../src/utils/validators'

describe('Validators', () => {
  describe('isValidEmail', () => {
    test('valida emails correctos', () => {
      expect(isValidEmail('test@example.com')).toBe(true)
      expect(isValidEmail('user.name@domain.co')).toBe(true)
      expect(isValidEmail('usuario+tag@gmail.com')).toBe(true)
    })

    test('rechaza emails incorrectos', () => {
      expect(isValidEmail('invalid-email')).toBe(false)
      expect(isValidEmail('user@')).toBe(false)
      expect(isValidEmail('@domain.com')).toBe(false)
      expect(isValidEmail('user@domain')).toBe(false)
      expect(isValidEmail('')).toBe(false)
      expect(isValidEmail(null)).toBe(false)
      expect(isValidEmail(undefined)).toBe(false)
    })
  })

  describe('isValidPassword', () => {
    test('valida contraseñas seguras', () => {
      expect(isValidPassword('Password123')).toBe(true)
      expect(isValidPassword('SecurePass1')).toBe(true)
      expect(isValidPassword('MiClave123')).toBe(true)
      expect(isValidPassword('Abcdefg1')).toBe(true)
    })

    test('rechaza contraseñas débiles', () => {
      expect(isValidPassword('short')).toBe(false)
      expect(isValidPassword('nouppercase123')).toBe(false)
      expect(isValidPassword('NOLOWERCASE123')).toBe(false)
      expect(isValidPassword('NoNumbersHere')).toBe(false)
      expect(isValidPassword('12345678')).toBe(false)
      expect(isValidPassword('abcdefgh')).toBe(false)
      expect(isValidPassword('ABCDEFGH')).toBe(false)
      expect(isValidPassword('')).toBe(false)
      expect(isValidPassword(null)).toBe(false)
    })

    test('valida longitud mínima de 8 caracteres', () => {
      expect(isValidPassword('Abc123')).toBe(false) // 6 caracteres
      expect(isValidPassword('Abcdef1')).toBe(false) // 7 caracteres
      expect(isValidPassword('Abcdef12')).toBe(true) // 8 caracteres
    })
  })

  describe('isStudentEmail', () => {
    test('identifica emails estudiantiles Duoc', () => {
      expect(isStudentEmail('estudiante@duoc.cl')).toBe(true)
      expect(isStudentEmail('alumno@duoc.cl')).toBe(true)
      expect(isStudentEmail('test@duocuc.cl')).toBe(true)
      expect(isStudentEmail('usuario@duocuc.cl')).toBe(true)
    })

    test('rechaza emails no estudiantiles', () => {
      expect(isStudentEmail('user@gmail.com')).toBe(false)
      expect(isStudentEmail('test@hotmail.com')).toBe(false)
      expect(isStudentEmail('empresa@empresa.cl')).toBe(false)
      expect(isStudentEmail('personal@yahoo.com')).toBe(false)
      expect(isStudentEmail('')).toBe(false)
      expect(isStudentEmail(null)).toBe(false)
    })

    test('es case insensitive para el dominio', () => {
      expect(isStudentEmail('estudiante@DUOC.CL')).toBe(true)
      expect(isStudentEmail('alumno@Duoc.cl')).toBe(true)
    })
  })

  describe('isOver50', () => {
    test('identifica mayores de 50 años', () => {
      expect(isOver50('01/01/1970')).toBe(true) // 54 años
      expect(isOver50('15/06/1960')).toBe(true) // 64 años
      expect(isOver50('31/12/1973')).toBe(true) // 50 años
    })

    test('rechaza menores de 50 años', () => {
      expect(isOver50('01/01/2010')).toBe(false) // 14 años
      expect(isOver50('15/06/2000')).toBe(false) // 24 años
      expect(isOver50('31/12/1999')).toBe(false) // 24 años
    })

    test('maneja casos edge', () => {
      expect(isOver50('01/01/1974')).toBe(true) // 50 años (dependiendo del año actual)
      expect(isOver50('31/12/1973')).toBe(true) // 50 años
    })

    test('maneja fechas inválidas', () => {
      expect(isOver50('invalid-date')).toBe(false)
      expect(isOver50('32/13/2020')).toBe(false)
      expect(isOver50('01-01-1970')).toBe(false)
      expect(isOver50('1970/01/01')).toBe(false)
      expect(isOver50('')).toBe(false)
      expect(isOver50(null)).toBe(false)
      expect(isOver50(undefined)).toBe(false)
    })

    test('valida formato DD/MM/AAAA estrictamente', () => {
      expect(isOver50('1/1/1970')).toBe(false) // Sin ceros a la izquierda
      expect(isOver50('01/1/1970')).toBe(false) // Mes sin cero
      expect(isOver50('01/01/70')).toBe(false)  // Año de 2 dígitos
    })
  })

  // Tests de integración entre validadores
  describe('Integración entre validadores', () => {
    test('email estudiantil + mayor de 50 activa múltiples beneficios', () => {
      const email = 'profesor@duoc.cl'
      const birthDate = '01/01/1970'
      
      expect(isStudentEmail(email)).toBe(true)
      expect(isOver50(birthDate)).toBe(true)
      expect(isValidEmail(email)).toBe(true)
    })

    test('email válido pero no estudiantil ni mayor de 50', () => {
      const email = 'joven@gmail.com'
      const birthDate = '01/01/2000'
      
      expect(isValidEmail(email)).toBe(true)
      expect(isStudentEmail(email)).toBe(false)
      expect(isOver50(birthDate)).toBe(false)
    })
  })
})