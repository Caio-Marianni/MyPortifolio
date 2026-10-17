/* Limites do formulário de contato — o formulário usa no `maxLength` e a rota confere de novo,
   que é a fronteira de verdade. Sem import de banco: o formulário é componente de cliente. */
export const CONTACT_LIMITS = {
  name: 160,
  email: 120,
  message: 4000,
} as const;

/** Mesma checagem do `type="email"` do navegador, no essencial: algo@algo.algo, sem espaço. */
export const isEmail = (value: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
