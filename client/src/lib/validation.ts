export interface LeadFormInput {
  nome: string;
  telefone: string;
  email: string;
  codigoImovel: string;
  tipoImovel?: string | null;
  faixaInteresse?: string | null;
}

export interface ValidationResult {
  isValid: boolean;
  message: string;
}

/**
 * Validates the Lead Form inputs.
 * Nome, Telefone, and Código do Imóvel are required.
 * Tipo de Imóvel and Faixa de Interesse are optional.
 */
export function validateLeadForm(input: LeadFormInput): ValidationResult {
  const { nome, telefone, email, codigoImovel } = input;

  // Required fields (now including tipoImovel and faixaInteresse)
  if (!nome || !telefone || !email || !codigoImovel || !input.tipoImovel || !input.faixaInteresse || !nome.trim() || !telefone.trim() || !email.trim() || !codigoImovel.trim()) {
    return { isValid: false, message: "Campo obrigatório." };
  }

  // Email basic validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return { isValid: false, message: "Informe um e-mail válido." };
  }

  // Phone validation (Brazilian formats like (11) 91234-5678 or 11912345678)
  const phoneDigits = telefone.replace(/\D/g, "");
  if (!/^[0-9]{10,11}$/.test(phoneDigits)) {
    return { isValid: false, message: "Informe um telefone válido." };
  }

  return { isValid: true, message: "Enviado com Sucesso!" };
}
