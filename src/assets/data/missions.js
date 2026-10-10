
const emailPattern =
  "^[A-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[A-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@" +
  "[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?" +
  "(?:\\.[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?)+$";

export const missions = [
  {
    id: 1,
    title: "Phone Protocol",
    subtitle: "Validación telefónica",
    description:
      "Construye una expresión que acepte exactamente 8 dígitos. " +
      "El guion después del cuarto dígito es opcional.",
    hint: "Usa [0-9], {4}, -? y anclas ^ $.",
    reference: "^[0-9]{4}-?[0-9]{4}$",
    tests: [
      { input: "12345678", expected: true },
      { input: "87654321", expected: true },
      { input: "1234-5678", expected: true },
      { input: "0000-0000", expected: true },
      { input: "9999-1234", expected: true },
      { input: "1234567", expected: false },
      { input: "123456789", expected: false },
      { input: "123-45678", expected: false },
      { input: "1234--5678", expected: false },
      { input: "abcd5678", expected: false },
    ],
  },
  {
    id: 2,
    title: "DPI Guardian",
    subtitle: "Identidad guatemalteca",
    description:
      "Valida 13 dígitos en bloques de 4, 5 y 4. " +
      "Cada espacio separador es opcional.",
    hint: "Prueba [0-9]{4}, [0-9]{5}, [0-9]{4} y ?.",
    reference: "^[0-9]{4} ?[0-9]{5} ?[0-9]{4}$",
    tests: [
      { input: "1234567890101", expected: true },
      { input: "1234 56789 0101", expected: true },
      { input: "1234 567890101", expected: true },
      { input: "123456789 0101", expected: true },
      { input: "0000 00000 0000", expected: true },
      { input: "123 456789 0101", expected: false },
      { input: "1234 56789 010", expected: false },
      { input: "1234 56789 0101 2", expected: false },
      { input: "1234  56789 0101", expected: false },
      { input: "1234-56789-0101", expected: false },
    ],
  },
  {
    id: 3,
    title: "Email Singularity",
    subtitle: "Validación de correo",
    description:
      "Acepta una parte local con puntos internos, un dominio " +
      "válido y una o más extensiones separadas por puntos.",
    hint: "No olvides escapar el punto con \\\\. y usar el modificador i.",
    reference: emailPattern,
    flags: "i",
    tests: [
      { input: "ana@gmail.com", expected: true },
      { input: "usuario.nombre@empresa.com.gt", expected: true },
      { input: "ana+clase@correo.org", expected: true },
      { input: "USER_01@SUB.DOMAIN.COM", expected: true },
      { input: "a-b@ejemplo.net", expected: true },
      { input: "ana@", expected: false },
      { input: "@empresa.com", expected: false },
      { input: "ana..perez@empresa.com", expected: false },
      { input: "ana@empresa", expected: false },
      { input: "ana @empresa.com", expected: false },
      { input: "ana@-empresa.com", expected: false },
      { input: "ana@empresa..com", expected: false },
    ],
  },
];
