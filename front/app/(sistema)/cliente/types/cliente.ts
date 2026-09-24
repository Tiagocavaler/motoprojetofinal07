import { apiRequest } from '@/lib/api'; // Função que faz o fetch para o backend
import { ClienteRequest, ClienteResponse } from './schema'; // Tipos do cliente

const API = '/api/clientes'; // Rota do Next que chama o Java

// Cliente HTTP - todas as chamadas da tela de cliente
export const clienteClient = {
  list: (): Promise<ClienteResponse[]> => apiRequest(API), // Busca todos os clientes
  create: (data: ClienteRequest) => apiRequest(API, { method: 'POST', body: data }), // Cria novo cliente
  remove: (id: number) => apiRequest(`${API}/${id}`, { method: 'DELETE' }), // Deleta cliente
}