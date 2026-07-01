import { describe, it, expect } from "vitest";
import { validateLeadForm } from "./validation";

describe("validateLeadForm", () => {
  // Test case 1: Test validation with all fields filled
  it("should validate successfully when all fields are filled", () => {
    const input = {
      nome: "Roberto da Silva",
      telefone: "(11) 98765-4321",
      codigoImovel: "C-101",
      tipoImovel: "Casa",
      faixaInteresse: "R$ 1.000.000 a R$ 2.000.000",
    };

    const result = validateLeadForm(input);
    expect(result.isValid).toBe(true);
    expect(result.message).toBe("Enviado com Sucesso!");
  });

  // Test case 2: Test validation leaving Name empty
  it("should fail validation when name is empty", () => {
    const input = {
      nome: "",
      telefone: "(11) 98765-4321",
      codigoImovel: "C-101",
      tipoImovel: "Casa",
      faixaInteresse: "R$ 1.000.000 a R$ 2.000.000",
    };

    const result = validateLeadForm(input);
    expect(result.isValid).toBe(false);
    expect(result.message).toBe("Por favor, preencha todos os campos obrigatórios.");
  });

  // Test case 3: Test validation leaving Phone empty
  it("should fail validation when phone is empty", () => {
    const input = {
      nome: "Roberto da Silva",
      telefone: "   ",
      codigoImovel: "C-101",
      tipoImovel: "Casa",
      faixaInteresse: "R$ 1.000.000 a R$ 2.000.000",
    };

    const result = validateLeadForm(input);
    expect(result.isValid).toBe(false);
    expect(result.message).toBe("Por favor, preencha todos os campos obrigatórios.");
  });

  // Test case 4: Test validation leaving Property Code empty
  it("should fail validation when property code is empty", () => {
    const input = {
      nome: "Roberto da Silva",
      telefone: "(11) 98765-4321",
      codigoImovel: "",
      tipoImovel: "Casa",
      faixaInteresse: "R$ 1.000.000 a R$ 2.000.000",
    };

    const result = validateLeadForm(input);
    expect(result.isValid).toBe(false);
    expect(result.message).toBe("Por favor, preencha todos os campos obrigatórios.");
  });

  // Test case 5: Confirm that optional fields do not block submission
  it("should validate successfully when optional fields are omitted or null", () => {
    const input = {
      nome: "Roberto da Silva",
      telefone: "(11) 98765-4321",
      codigoImovel: "C-101",
      tipoImovel: null,
      faixaInteresse: undefined,
    };

    const result = validateLeadForm(input);
    expect(result.isValid).toBe(true);
    expect(result.message).toBe("Enviado com Sucesso!");
  });
});
