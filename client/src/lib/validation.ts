export interface LeadFormInput {
  nome: string;
  telefone: string;
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
  const { nome, telefone, codigoImovel } = input;
  
  if (
    !nome || 
    !telefone || 
    !codigoImovel || 
    !nome.trim() || 
    !telefone.trim() || 
    !codigoImovel.trim()
  ) {
    return {
      isValid: false,
      message: "Por favor, preencha todos os campos obrigatórios."
    };
  }

  return {
    isValid: true,
    message: "Enviado com Sucesso!"
  };
}
