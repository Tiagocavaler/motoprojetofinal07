// Status é String no seu Java, não Enum: "PENDENTE" ou "ENTREGUE"
export type StatusPedido = "PENDENTE" | "ENTREGUE";

// O que o front MANDA pro Java criar
// No Java você tem: private Cliente cliente e private List<Produto> produtos
// Então mandamos só os IDs
export interface PedidoRequest {
  clienteId: number; // vai virar o objeto Cliente no Java
  produtosIds: number[]; // vai virar a List<Produto> no Java
  status: StatusPedido;
}

// O que o Java DEVOLVE pro front
export interface PedidoResponse {
  id: number; // Long no Java, number no TS
  dataPedido: string; // LocalDateTime vem como string
  status: string;
  cliente: {
    id: number;
    nome: string;
  };
  produtos: {
    id: number;
    nome: string; // ou nome da sua entidade Produto
  }[];
}