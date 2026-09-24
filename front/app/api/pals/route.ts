// Força o Next.js a sempre rodar essa rota dinamicamente (sem cache estático)
export const dynamic = "force-dynamic";
// Define que essa API vai rodar no ambiente Node.js (precisa por causa do fs/path)
export const runtime = "nodejs";

// Importa a classe de resposta do Next.js para retornar JSON
import { NextResponse } from "next/server";
// Importa o módulo de arquivos do Node para ler pastas e arquivos
import fs from "fs";
// Importa o módulo de caminhos para montar caminhos de pastas corretamente
import path from "path";

// Define o formato de um Pal que vem do JSON remoto
type RemotePal = {
  name: string;
  combiRank: number;
  combiPriority?: number;
  breedable?: boolean;
  uniqueOnly?: boolean;
  paldex?: number;
  icon?: string;
  suffix?: string;
};

// Define o formato de uma combinação única (pais fixos geram um filho)
type RemoteUniqueCombo = {
  parents: [string, string];
  child: string;
  ga?: string;
  gb?: string;
};

// Define o formato geral do arquivo pals.json
type RemoteData = {
  dataVersion?: string;
  generatedAt?: string;
  pals: RemotePal[];
  uniqueCombos?: RemoteUniqueCombo[];
};

// Define o formato final que sua API vai enviar pro frontend
export type PalEntry = {
  name: string;
  key: string; // nome normalizado para comparação
  fileName: string | null; // nome do arquivo PNG encontrado ou null

  combiRank: number;
  tieBreak: number; // usado para desempate
  combiPriority: number;

  hasFile: boolean; // se tem ou não imagem local

  paldex?: number;
  suffix?: string;

  breedable: boolean;
  uniqueOnly: boolean;
};

// Função que normaliza um nome para virar uma chave comparável
function normalizeKey(value: string): string {
  return value
    .toLowerCase() // deixa tudo minúsculo
    .replace(/\.[^/.]+$/, "") // remove extensão .png, .jpg etc
    .replace(/^t_/, "") // remove prefixo t_ se existir
    .replace(/_(?:m|f)$/i, "") // remove _m ou _f do final (male/female curto)
    .replace(/_(?:male|female)$/i, "") // remove _male ou _female do final
    .replace(/[^a-z0-9]/g, ""); // remove tudo que não for letra ou número
}

/**
 * Procura os PNGs dentro de:
 * public/palicons
 */
function getLocalIcons(): string[] {
  // Monta o caminho absoluto até a pasta public/palicons
  const iconsDirectory = path.join(
    process.cwd(),
    "public",
    "palicons"
  );

  // Se a pasta não existe, retorna lista vazia pra não quebrar
  if (!fs.existsSync(iconsDirectory)) {
    return [];
  }

  // Lê todos os arquivos da pasta e filtra só imagens
  return fs
    .readdirSync(iconsDirectory)
    .filter((file) =>
      /\.(png|jpg|jpeg|webp)$/i.test(file)
    );
}

/**
 * Tenta relacionar o Pal do JSON com o PNG existente no projeto.
 */
function findLocalIcon(
  pal: RemotePal,
  localIcons: string[]
): string | null {
  // Lista de nomes possíveis pra procurar: tenta o campo icon e depois o name
  const possibleNames = [
    pal.icon ?? "",
    pal.name
  ];

  // Testa cada nome possível
  for (const possibleName of possibleNames) {
    if (!possibleName) {
      continue; // pula se estiver vazio
    }

    // Normaliza o nome possível pra virar chave
    const key = normalizeKey(
      path.basename(possibleName)
    );

    // Procura na lista de arquivos locais um que tenha a mesma chave normalizada
    const found = localIcons.find(
      (file) =>
        normalizeKey(file) === key
    );

    // Se achou, retorna o nome do arquivo
    if (found) {
      return found;
    }
  }

  // Se não achou nenhum, retorna null
  return null;
}

// Função principal da API - é chamada quando fazem GET em /api/pals
export async function GET() {
  try {
    /**
     * ==========================================
     * 1. LOCALIZA O JSON
     * ==========================================
     */
    // Monta o caminho até o arquivo public/data/pals.json
    const dataPath = path.join(
      process.cwd(),
      "public",
      "data",
      "pals.json"
    );

    /**
     * Verifica se o arquivo existe.
     */
    if (!fs.existsSync(dataPath)) {
      // Se não existe, retorna erro 404 pro frontend
      return NextResponse.json(
        {
          error:
            "O arquivo public/data/pals.json não foi encontrado."
        },
        {
          status: 404
        }
      );
    }

    /**
     * ==========================================
     * 2. LÊ O JSON LOCAL
     * ==========================================
     */
    // Lê o conteúdo do arquivo como texto
    const fileContent =
      fs.readFileSync(
        dataPath,
        "utf-8"
      );

    // Converte o texto JSON para objeto JavaScript
    const data =
      JSON.parse(
        fileContent
      ) as RemoteData;

    /**
     * ==========================================
     * 3. LÊ OS PNGs
     * ==========================================
     */
    // Pega a lista de todos os ícones PNG/JPG existentes na pasta
    const localIcons =
      getLocalIcons();

    /**
     * ==========================================
     * 4. CONVERTE OS DADOS
     * ==========================================
     */
    // Cria a lista final de Pals já tratada
    const pals: PalEntry[] =
      (data.pals ?? [])
        .filter((pal) => {
          // Filtra só Pals com combiRank válido, maior que 0 e que podem cruzar
          return (
            Number.isFinite(
              pal.combiRank
            ) &&
            pal.combiRank > 0 &&
            pal.breedable !== false
          );
        })
        .map((pal) => {
          // Para cada Pal, tenta achar o arquivo de ícone correspondente
          const fileName =
            findLocalIcon(
              pal,
              localIcons
            );

          // Define a prioridade de combinação, se não tiver usa combiRank * 100
          const combiPriority =
            pal.combiPriority ??
            pal.combiRank * 100;

          // Retorna o objeto no formato PalEntry que o frontend espera
          return {
            name: pal.name,

            key: normalizeKey(
              pal.name
            ),

            fileName,

            combiRank:
              pal.combiRank,

            tieBreak:
              combiPriority,

            combiPriority,

            hasFile:
              fileName !== null,

            paldex:
              pal.paldex,

            suffix:
              pal.suffix,

            breedable:
              pal.breedable !== false,

            uniqueOnly:
              pal.uniqueOnly === true
          };
        })
        .sort(
          (a, b) =>
            a.combiRank -
            b.combiRank
        ); // Ordena do menor combiRank para o maior

    /**
     * ==========================================
     * 5. COMBINAÇÕES ESPECIAIS
     * ==========================================
     */
    // Pega as combinações únicas do JSON, se não tiver usa array vazio
    const uniqueCombos =
      data.uniqueCombos ?? [];

    /**
     * ==========================================
     * 6. POOL GENÉRICO
     * ==========================================
     */
    // Cria o pool de Pals genéricos (que podem cruzar e não são só de combinação única)
    const genericPool =
      pals.filter(
        (pal) =>
          pal.breedable &&
          !pal.uniqueOnly &&
          pal.combiRank > 0
      );

    /**
     * ==========================================
     * 7. RETORNA PARA O FRONTEND
     * ==========================================
     */
    // Retorna tudo em JSON para o frontend usar
    return NextResponse.json({
      pals, // lista completa tratada

      uniqueCombos, // lista de combinações especiais

      genericPoolSize:
        genericPool.length, // tamanho do pool genérico

      totalFiles:
        localIcons.length, // total de arquivos de imagem encontrados

      uniquePals:
        pals.filter(
          (pal) =>
            pal.uniqueOnly
        ).length, // quantidade de Pals que são uniqueOnly

      dataVersion:
        data.dataVersion ??
        "dados locais", // versão dos dados

      generatedAt:
        data.generatedAt ??
        null, // data de geração do JSON

      source:
        "Dados locais do projeto"
    });
  } catch (error) {
    // Se der qualquer erro no try, loga no console do servidor
    console.error(
      "Erro na API de Pals:",
      error
    );

    // Retorna erro 500 pro frontend
    return NextResponse.json(
      {
        error:
          "Não foi possível carregar os dados dos Pals."
      },
      {
        status: 500
      }
    );
  }
}