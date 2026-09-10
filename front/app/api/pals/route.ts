export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

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

type RemoteUniqueCombo = {
  parents: [string, string];
  child: string;
  ga?: string;
  gb?: string;
};

type RemoteData = {
  dataVersion?: string;
  generatedAt?: string;
  pals: RemotePal[];
  uniqueCombos?: RemoteUniqueCombo[];
};

export type PalEntry = {
  name: string;
  key: string;
  fileName: string | null;

  combiRank: number;
  tieBreak: number;
  combiPriority: number;

  hasFile: boolean;

  paldex?: number;
  suffix?: string;

  breedable: boolean;
  uniqueOnly: boolean;
};

function normalizeKey(value: string): string {
  return value
    .toLowerCase()
    .replace(/\.[^/.]+$/, "")
    .replace(/^t_/, "")
    .replace(/_(?:m|f)$/i, "")
    .replace(/_(?:male|female)$/i, "")
    .replace(/[^a-z0-9]/g, "");
}

/**
 * Procura os PNGs dentro de:
 *
 * public/palicons
 */
function getLocalIcons(): string[] {
  const iconsDirectory = path.join(
    process.cwd(),
    "public",
    "palicons"
  );

  if (!fs.existsSync(iconsDirectory)) {
    return [];
  }

  return fs
    .readdirSync(iconsDirectory)
    .filter((file) =>
      /\.(png|jpg|jpeg|webp)$/i.test(file)
    );
}

/**
 * Tenta relacionar o Pal do JSON
 * com o PNG existente no projeto.
 */
function findLocalIcon(
  pal: RemotePal,
  localIcons: string[]
): string | null {
  const possibleNames = [
    pal.icon ?? "",
    pal.name
  ];

  for (const possibleName of possibleNames) {
    if (!possibleName) {
      continue;
    }

    const key = normalizeKey(
      path.basename(possibleName)
    );

    const found = localIcons.find(
      (file) =>
        normalizeKey(file) === key
    );

    if (found) {
      return found;
    }
  }

  return null;
}

export async function GET() {
  try {
    /**
     * ==========================================
     * 1. LOCALIZA O JSON
     * ==========================================
     */
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
    const fileContent =
      fs.readFileSync(
        dataPath,
        "utf-8"
      );

    const data =
      JSON.parse(
        fileContent
      ) as RemoteData;

    /**
     * ==========================================
     * 3. LÊ OS PNGs
     * ==========================================
     */
    const localIcons =
      getLocalIcons();

    /**
     * ==========================================
     * 4. CONVERTE OS DADOS
     * ==========================================
     */
    const pals: PalEntry[] =
      (data.pals ?? [])
        .filter((pal) => {
          return (
            Number.isFinite(
              pal.combiRank
            ) &&
            pal.combiRank > 0 &&
            pal.breedable !== false
          );
        })
        .map((pal) => {
          const fileName =
            findLocalIcon(
              pal,
              localIcons
            );

          const combiPriority =
            pal.combiPriority ??
            pal.combiRank * 100;

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
        );

    /**
     * ==========================================
     * 5. COMBINAÇÕES ESPECIAIS
     * ==========================================
     */
    const uniqueCombos =
      data.uniqueCombos ?? [];

    /**
     * ==========================================
     * 6. POOL GENÉRICO
     * ==========================================
     */
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
    return NextResponse.json({
      pals,

      uniqueCombos,

      genericPoolSize:
        genericPool.length,

      totalFiles:
        localIcons.length,

      uniquePals:
        pals.filter(
          (pal) =>
            pal.uniqueOnly
        ).length,

      dataVersion:
        data.dataVersion ??
        "dados locais",

      generatedAt:
        data.generatedAt ??
        null,

      source:
        "Dados locais do projeto"
    });
  } catch (error) {
    console.error(
      "Erro na API de Pals:",
      error
    );

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