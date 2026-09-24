export const dynamic = "force-dynamic"; // Rota sempre dinâmica
import { NextResponse } from "next/server"; // Resposta do Next
import { supabase } from "@/lib/supabaseClient"; // Seu client
import { createClient } from "@supabase/supabase-js"; // Client admin pra contar

// Client com service_role pra poder ler a tabela de limites (cola sua SERVICE_KEY no .env)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Pega em Settings > API Keys > service_role
);

export async function POST(req: Request){
  try{
    const { email } = await req.json(); // Pega email do front
    if(!email) return NextResponse.json({ error: "Email obrigatório" }, { status: 400 });

    // Pega começo do dia de hoje (00:00)
    const hoje = new Date();
    hoje.setHours(0,0,0,0);

    // Conta quantos pedidos esse email fez hoje
    const { data: tentativas, error } = await supabaseAdmin
      .from("password_reset_limits")
      .select("id")
      .eq("email", email)
      .gte("created_at", hoje.toISOString());

    if(error) throw error;

    // REGRA 1: Máximo 3 por dia
    if(tentativas && tentativas.length >= 3){
      return NextResponse.json({ error: "Limite de 3 recuperações por dia atingido. Tente amanhã." }, { status: 429 });
    }

    // REGRA 2 e 3: Manda o e-mail real do Supabase
    const { error: errSupabase } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/atualizar-senha`,
    });
    if(errSupabase) throw errSupabase;

    // Salva essa tentativa na nossa tabela
    await supabaseAdmin.from("password_reset_limits").insert({ email, used: false });

    return NextResponse.json({ message: "E-mail enviado" });
  }catch(e:any){
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}