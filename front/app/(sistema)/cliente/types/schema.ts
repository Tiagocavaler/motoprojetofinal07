// Tipo do status que vem do Java (ATIVO, INATIVO, BLOQUEADO)
export enum EnumStatusCliente {
  ATIVO = "ATIVO",
  INATIVO = "INATIVO",
  BLOQUEADO = "BLOQUEADO"
}

// O que o front ENVIA para o Java quando cria um cliente
export interface ClienteRequest {
  nome: string;
  cpf: string;
  senha: string;
  email: string;
  status: EnumStatusCliente;
}

// O que o Java DEVOLVE para o front quando lista
export interface ClienteResponse {
  id: number;
  nome: string;
  cpf: string;
  email: string;
  status: EnumStatusCliente;
}