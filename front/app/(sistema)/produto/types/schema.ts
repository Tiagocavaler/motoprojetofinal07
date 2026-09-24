// Tipo igual a sua Entity Produto.java da print

// O que o front ENVIA para o Java criar um produto
// Igualzinho aos campos da sua Entity: nome, descricao, preco, tipo, imagemUrl
export interface ProdutoRequest {
  nome: string; // private String nome;
  descricao: string; // private String descricao;
  preco: number; // private Double preco; -> number no TS
  tipo: string; // private String tipo;
  imagemUrl: string; // private String imagemUrl;
}

// O que o Java DEVOLVE pro front (tem o id a mais)
export interface ProdutoResponse {
  id: number; // private Long id; -> number no TS
  nome: string;
  descricao: string;
  preco: number;
  tipo: string;
  imagemUrl: string;
}