"use client"; // Diz que é componente do navegador, não do servidor

import { useEffect, useState, FormEvent } from "react"; // Hooks do React
import { clienteClient } from "./types/cliente"; // Nosso cliente que fala com a API
import { ClienteResponse, EnumStatusCliente } from "./types/schema"; // Tipos

export default function ClientePage(){
  // Lista de clientes que vem do banco
  const [clientes, setClientes] = useState<ClienteResponse[]>([]);
  
  // Formulário controlado - guarda o que você digita
  const [form, setForm] = useState({ nome: "", cpf: "", email: "", senha: "", status: EnumStatusCliente.ATIVO });

  // Função que carrega clientes do banco
  async function carregar(){ setClientes(await clienteClient.list()); }
  
  // Quando abre a tela, carrega a lista automaticamente
  useEffect(() => { carregar(); }, []);

  // Quando clica em CADASTRAR
  async function handleCreate(e: FormEvent){
    e.preventDefault(); // Não recarrega a página
    try{
      await clienteClient.create(form); // Manda pro Java salvar
      setForm({ nome:"", cpf:"", email:"", senha:"", status: EnumStatusCliente.ATIVO }); // Limpa form
      carregar(); // Atualiza a lista
    }catch(err){ alert((err as Error).message) }
  }

  return (
    <div>
      {/* Seu JSX do form e tabela aqui - me manda print do resto que eu completo */}
    </div>
  )
}