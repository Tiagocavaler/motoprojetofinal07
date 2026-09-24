import { supabase } from './supabase'

// ===== PRODUTOS - SÓ O QUE ADMIN LIBEROU =====
export async function getProdutos() {
  const { data, error } = await supabase
   .from('produtos')
   .select('*')
   .eq('ativo_na_loja', true)
   .gt('estoque', 0)
   .order('nome')
  if (error) throw error
  return data
}

// ===== CARRINHO =====
export async function getCarrinho() {
  const { data, error } = await supabase
   .from('carrinho')
   .select('*, produtos(*)')
   .order('created_at', { ascending: false }) // era criado_em, no banco é created_at
  if (error) throw error
  return data
}

export async function addCarrinho(produto_id: string) {
  const { data: existente } = await supabase
   .from('carrinho')
   .select('*')
   .eq('produto_id', produto_id)
   .maybeSingle() // maybeSingle pra não quebrar se não existir

  if (existente) {
    const { data, error } = await supabase
     .from('carrinho')
     .update({ quantidade: existente.quantidade + 1 })
     .eq('id', existente.id)
     .select()
    if (error) throw error
    return data
  } else {
    const { data, error } = await supabase
     .from('carrinho')
     .insert([{ produto_id, quantidade: 1 }])
     .select()
    if (error) throw error
    return data
  }
}

export async function removerCarrinho(id: string) {
  const { error } = await supabase.from('carrinho').delete().eq('id', id)
  if (error) throw error
}

export async function limparCarrinho() {
  const { error } = await supabase.from('carrinho').delete().gt('quantidade', 0)
  if (error) throw error
}

// ===== PEDIDOS =====
export async function criarPedido(total: number, itens: any[]) {
  const { data, error } = await supabase
   .from('pedidos')
   .insert([{ total, itens, status: 'pendente' }]) // no banco é pendente, não aguardando_pagamento
   .select()
  if (error) throw error
  return data[0]
}

export async function confirmarPagamentoPix(pedidoId: string) {
  const { data, error } = await supabase
   .from('pedidos')
   .update({ status: 'pago' })
   .eq('id', pedidoId)
   .select()
  if (error) throw error
  return data
}

export async function getMeusPedidos() {
  const { data, error } = await supabase
   .from('pedidos')
   .select('*')
   .order('created_at', { ascending: false }) // era criado_em
  if (error) throw error
  return data
}