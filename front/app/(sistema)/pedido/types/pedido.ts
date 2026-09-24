import { apiRequest } from '@/lib/api';
import { PedidoRequest, PedidoResponse } from './schema';

const API = '/api/pedidos'; // Rota do Next

export const pedidoClient = {
  // GET /api/pedidos -> busca todos
  list: (): Promise<PedidoResponse[]> => apiRequest(API),
  
  // POST /api/pedidos -> cria com cliente_id + lista de produto_id
  create: (data: PedidoRequest) => apiRequest<PedidoResponse>(API, { method: 'POST', body: data }),
  
  // DELETE /api/pedidos/{id}
  remove: (id: number) => apiRequest(`${API}/${id}`, { method: 'DELETE' }),
}