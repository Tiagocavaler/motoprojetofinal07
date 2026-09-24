import { apiRequest } from '../../../lib/api'; // Função que faz fetch, igual usamos no cliente
import { ProdutoRequest, ProdutoResponse } from './schema'; // Tipos que acabamos de criar

const API = '/api/produtos'; // Rota do Next que chama o Java

export const produtoClient = {
  // GET - Lista todos os produtos do banco
  list: (): Promise<ProdutoResponse[]> => apiRequest(API),

  // POST - Cria um produto novo no Java
  create: (data: ProdutoRequest) => apiRequest<ProdutoResponse>(API, { method: 'POST', body: data }),

  // DELETE - Deleta um produto pelo id
  remove: (id: number) => apiRequest(`${API}/${id}`, { method: 'DELETE' }),
}