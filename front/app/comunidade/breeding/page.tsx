"use client";

import { useEffect, useMemo, useState } from "react";

type Gender = "M" | "F";

type Pal = {
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

type UniqueCombo = {
  parents: [string, string];
  child: string;
  ga?: string;
  gb?: string;
};

type ApiResponse = {
  pals: Pal[];
  uniqueCombos: UniqueCombo[];

  genericPoolSize?: number;
  totalFiles?: number;
  uniquePals?: number;

  dataVersion?: string;
  generatedAt?: string;
  source?: string;
};

export default function BreedingPage() {
  const [pals, setPals] =
    useState<Pal[]>([]);

  const [uniqueCombos, setUniqueCombos] =
    useState<UniqueCombo[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [parent1, setParent1] =
    useState<Pal | null>(null);

  const [parent2, setParent2] =
    useState<Pal | null>(null);

  const [p1Gender, setP1Gender] =
    useState<Gender>("M");

  const [p2Gender, setP2Gender] =
    useState<Gender>("F");

  const [search1, setSearch1] =
    useState("");

  const [search2, setSearch2] =
    useState("");

  const [child, setChild] =
    useState<Pal | null>(null);

  const [reason, setReason] =
    useState("");

  /**
   * ==========================================
   * CARREGAR DADOS
   * ==========================================
   */
  useEffect(() => {
    async function loadPals() {
      try {
        setLoading(true);
        setError(null);

        const response =
          await fetch(
            "/api/pals",
            {
              cache: "no-store"
            }
          );

        if (!response.ok) {
          throw new Error(
            "Erro ao carregar os Pals."
          );
        }

        const data =
          (await response.json()) as ApiResponse;

        setPals(
          data.pals ?? []
        );

        setUniqueCombos(
          data.uniqueCombos ?? []
        );
      } catch (err) {
        console.error(err);

        setError(
          "Não foi possível carregar os dados dos Pals."
        );
      } finally {
        setLoading(false);
      }
    }

    loadPals();
  }, []);

  /**
   * ==========================================
   * NORMALIZAÇÃO
   * ==========================================
   */
  function normalize(
    value: string
  ): string {
    return value
      .toLowerCase()
      .normalize("NFD")
      .replace(
        /[\u0300-\u036f]/g,
        ""
      )
      .replace(
        /[^a-z0-9]/g,
        ""
      );
  }

  function samePal(
    a: string,
    b: string
  ): boolean {
    return (
      normalize(a) ===
      normalize(b)
    );
  }

  function findPal(
    name: string
  ): Pal | undefined {
    return pals.find(
      (pal) =>
        samePal(
          pal.name,
          name
        )
    );
  }

  /**
   * ==========================================
   * COMBINAÇÕES ESPECIAIS
   * ==========================================
   */
  function findUniqueCombo():
    | {
        combo: UniqueCombo;
        direct: boolean;
      }
    | null {
    if (
      !parent1 ||
      !parent2
    ) {
      return null;
    }

    for (
      const combo of uniqueCombos
    ) {
      const [a, b] =
        combo.parents;

      const direct =
        samePal(
          parent1.name,
          a
        ) &&
        samePal(
          parent2.name,
          b
        );

      const reverse =
        samePal(
          parent1.name,
          b
        ) &&
        samePal(
          parent2.name,
          a
        );

      if (
        direct ||
        reverse
      ) {
        return {
          combo,
          direct
        };
      }
    }

    return null;
  }

  /**
   * ==========================================
   * GÊNERO DOS COMBOS ESPECIAIS
   * ==========================================
   */
  function genderMatchesUniqueCombo(
    combo: UniqueCombo,
    direct: boolean
  ): boolean {
    if (
      !combo.ga &&
      !combo.gb
    ) {
      return true;
    }

    if (direct) {
      if (
        combo.ga &&
        combo.ga !== p1Gender
      ) {
        return false;
      }

      if (
        combo.gb &&
        combo.gb !== p2Gender
      ) {
        return false;
      }

      return true;
    }

    if (
      combo.ga &&
      combo.ga !== p2Gender
    ) {
      return false;
    }

    if (
      combo.gb &&
      combo.gb !== p1Gender
    ) {
      return false;
    }

    return true;
  }

  /**
   * ==========================================
   * CALCULAR BREEDING
   * ==========================================
   */
  function calculateBreeding() {
    setChild(null);
    setReason("");

    if (
      !parent1 ||
      !parent2
    ) {
      setReason(
        "Selecione os dois Pals."
      );

      return;
    }

    /**
     * 1. COMBO ESPECIAL
     */
    const uniqueResult =
      findUniqueCombo();

    if (uniqueResult) {
      const {
        combo,
        direct
      } = uniqueResult;

      if (
        genderMatchesUniqueCombo(
          combo,
          direct
        )
      ) {
        const specialChild =
          findPal(
            combo.child
          );

        if (specialChild) {
          setChild(
            specialChild
          );

          setReason(
            "Combinação especial."
          );

          return;
        }
      }
    }

    /**
     * 2. MESMA ESPÉCIE
     */
    if (
      samePal(
        parent1.name,
        parent2.name
      )
    ) {
      setChild(
        parent1
      );

      setReason(
        "Pais da mesma espécie."
      );

      return;
    }

    /**
     * 3. MACHO + FÊMEA
     */
    if (
      p1Gender ===
      p2Gender
    ) {
      setReason(
        "Para breeding normal, selecione um macho e uma fêmea."
      );

      return;
    }

    /**
     * 4. RANK ALVO
     *
     * floor(
     *   (rankA + rankB + 1) / 2
     * )
     */
    const targetRank =
      Math.floor(
        (
          parent1.combiRank +
          parent2.combiRank +
          1
        ) / 2
      );

    /**
     * 5. POOL GENÉRICO
     */
    const genericPool =
      pals.filter(
        (pal) =>
          pal.breedable &&
          !pal.uniqueOnly &&
          pal.combiRank > 0
      );

    if (
      genericPool.length === 0
    ) {
      setReason(
        "Não existem candidatos válidos para breeding."
      );

      return;
    }

    /**
     * 6. ENCONTRA O MELHOR FILHO
     */
    let bestPal:
      | Pal
      | null = null;

    let bestDistance =
      Number.POSITIVE_INFINITY;

    let bestPriority =
      Number.NEGATIVE_INFINITY;

    let bestPaldex =
      Number.POSITIVE_INFINITY;

    for (
      const candidate of genericPool
    ) {
      const distance =
        Math.abs(
          candidate.combiRank -
          targetRank
        );

      /**
       * Menor distância.
       */
      if (
        distance <
        bestDistance
      ) {
        bestPal =
          candidate;

        bestDistance =
          distance;

        bestPriority =
          candidate.combiPriority;

        bestPaldex =
          candidate.paldex ??
          Number.POSITIVE_INFINITY;

        continue;
      }

      /**
       * Maior prioridade em caso
       * de empate.
       */
      if (
        distance ===
          bestDistance &&
        candidate.combiPriority >
          bestPriority
      ) {
        bestPal =
          candidate;

        bestPriority =
          candidate.combiPriority;

        bestPaldex =
          candidate.paldex ??
          Number.POSITIVE_INFINITY;

        continue;
      }

      /**
       * PalDex como desempate final.
       */
      if (
        distance ===
          bestDistance &&
        candidate.combiPriority ===
          bestPriority &&
        (
          candidate.paldex ??
          Number.POSITIVE_INFINITY
        ) < bestPaldex
      ) {
        bestPal =
          candidate;

        bestPaldex =
          candidate.paldex ??
          Number.POSITIVE_INFINITY;
      }
    }

    if (!bestPal) {
      setReason(
        "Nenhum filho foi encontrado."
      );

      return;
    }

    setChild(
      bestPal
    );

    setReason(
      `Rank alvo: ${targetRank}`
    );
  }

  /**
   * ==========================================
   * PESQUISA PAL 1
   * ==========================================
   */
  const filteredPals1 =
    useMemo(() => {
      const search =
        normalize(search1);

      if (!search) {
        return pals;
      }

      return pals.filter(
        (pal) =>
          normalize(
            pal.name
          ).includes(search) ||
          normalize(
            pal.key
          ).includes(search) ||
          String(
            pal.paldex ?? ""
          ).includes(search)
      );
    }, [
      pals,
      search1
    ]);

  /**
   * ==========================================
   * PESQUISA PAL 2
   * ==========================================
   */
  const filteredPals2 =
    useMemo(() => {
      const search =
        normalize(search2);

      if (!search) {
        return pals;
      }

      return pals.filter(
        (pal) =>
          normalize(
            pal.name
          ).includes(search) ||
          normalize(
            pal.key
          ).includes(search) ||
          String(
            pal.paldex ?? ""
          ).includes(search)
      );
    }, [
      pals,
      search2
    ]);

  /**
   * ==========================================
   * CAMINHO DA IMAGEM
   * ==========================================
   */
  function getImage(
    pal: Pal | null
  ): string | null {
    if (
      !pal ||
      !pal.fileName
    ) {
      return null;
    }

    return `/palicons/${encodeURIComponent(
      pal.fileName
    )}`;
  }

  /**
   * ==========================================
   * COMPONENTE DA IMAGEM
   * ==========================================
   */
  function PalImage({
    pal,
    size = 100
  }: {
    pal: Pal | null;
    size?: number;
  }) {
    const image =
      getImage(pal);

    if (!image) {
      return (
        <div
          style={{
            width: size,
            height: size,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 12,
            background: "#222",
            color: "#aaa",
            fontSize: 12
          }}
        >
          Sem imagem
        </div>
      );
    }

    return (
      <img
        src={image}
        alt={
          pal?.name ??
          "Pal"
        }
        width={size}
        height={size}
        style={{
          objectFit:
            "contain"
        }}
      />
    );
  }

  /**
   * ==========================================
   * LOADING
   * ==========================================
   */
  if (loading) {
    return (
      <main
        style={{
          padding: 40,
          textAlign:
            "center"
        }}
      >
        <h1>
          Calculadora de Breeding
        </h1>

        <p>
          Carregando Pals...
        </p>
      </main>
    );
  }

  /**
   * ==========================================
   * ERRO
   * ==========================================
   */
  if (error) {
    return (
      <main
        style={{
          padding: 40,
          textAlign:
            "center"
        }}
      >
        <h1>
          Calculadora de Breeding
        </h1>

        <p
          style={{
            color: "red"
          }}
        >
          {error}
        </p>

        <button
          onClick={() =>
            window.location.reload()
          }
        >
          Tentar novamente
        </button>
      </main>
    );
  }

  /**
   * ==========================================
   * INTERFACE
   * ==========================================
   */
  return (
    <main
      style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: 30
      }}
    >
      <h1
        style={{
          textAlign:
            "center",
          marginBottom: 10
        }}
      >
        Calculadora de
        Breeding Palworld
      </h1>

      <p
        style={{
          textAlign:
            "center",
          color: "#999",
          marginBottom: 30
        }}
      >
        Selecione dois Pals
        para calcular o
        possível filho.
      </p>

      {/* ========================================
          PAIS
      ======================================== */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "1fr 1fr",
          gap: 30
        }}
      >
        {/* PAL 1 */}

        <section
          style={{
            border:
              "1px solid #333",
            borderRadius: 16,
            padding: 20
          }}
        >
          <h2>
            Pal 1
          </h2>

          <input
            type="text"
            placeholder="Pesquisar Pal..."
            value={search1}
            onChange={(e) =>
              setSearch1(
                e.target.value
              )
            }
            style={{
              width: "100%",
              padding: 12,
              marginBottom: 15,
              borderRadius: 8,
              border:
                "1px solid #444"
            }}
          />

          <select
            value={
              parent1?.key ??
              ""
            }
            onChange={(e) => {
              const selected =
                pals.find(
                  (pal) =>
                    pal.key ===
                    e.target.value
                ) ?? null;

              setParent1(
                selected
              );
            }}
            style={{
              width: "100%",
              padding: 12,
              marginBottom: 15,
              borderRadius: 8
            }}
          >
            <option value="">
              Selecione o Pal
            </option>

            {filteredPals1.map(
              (pal) => (
                <option
                  key={pal.key}
                  value={pal.key}
                >
                  {pal.paldex
                    ? `#${pal.paldex} `
                    : ""}
                  {pal.name}
                </option>
              )
            )}
          </select>

          <div
            style={{
              display:
                "flex",
              justifyContent:
                "center",
              marginBottom: 15
            }}
          >
            <PalImage
              pal={parent1}
              size={120}
            />
          </div>

          {parent1 && (
            <div
              style={{
                textAlign:
                  "center"
              }}
            >
              <h3>
                {parent1.name}
              </h3>

              <p>
                Combi Rank:{" "}
                {
                  parent1.combiRank
                }
              </p>

              <p>
                Priority:{" "}
                {
                  parent1.combiPriority
                }
              </p>

              <select
                value={
                  p1Gender
                }
                onChange={(e) =>
                  setP1Gender(
                    e.target
                      .value as Gender
                  )
                }
                style={{
                  padding: 10,
                  borderRadius: 8
                }}
              >
                <option value="M">
                  ♂ Macho
                </option>

                <option value="F">
                  ♀ Fêmea
                </option>
              </select>
            </div>
          )}
        </section>

        {/* PAL 2 */}

        <section
          style={{
            border:
              "1px solid #333",
            borderRadius: 16,
            padding: 20
          }}
        >
          <h2>
            Pal 2
          </h2>

          <input
            type="text"
            placeholder="Pesquisar Pal..."
            value={search2}
            onChange={(e) =>
              setSearch2(
                e.target.value
              )
            }
            style={{
              width: "100%",
              padding: 12,
              marginBottom: 15,
              borderRadius: 8,
              border:
                "1px solid #444"
            }}
          />

          <select
            value={
              parent2?.key ??
              ""
            }
            onChange={(e) => {
              const selected =
                pals.find(
                  (pal) =>
                    pal.key ===
                    e.target.value
                ) ?? null;

              setParent2(
                selected
              );
            }}
            style={{
              width: "100%",
              padding: 12,
              marginBottom: 15,
              borderRadius: 8
            }}
          >
            <option value="">
              Selecione o Pal
            </option>

            {filteredPals2.map(
              (pal) => (
                <option
                  key={pal.key}
                  value={pal.key}
                >
                  {pal.paldex
                    ? `#${pal.paldex} `
                    : ""}
                  {pal.name}
                </option>
              )
            )}
          </select>

          <div
            style={{
              display:
                "flex",
              justifyContent:
                "center",
              marginBottom: 15
            }}
          >
            <PalImage
              pal={parent2}
              size={120}
            />
          </div>

          {parent2 && (
            <div
              style={{
                textAlign:
                  "center"
              }}
            >
              <h3>
                {parent2.name}
              </h3>

              <p>
                Combi Rank:{" "}
                {
                  parent2.combiRank
                }
              </p>

              <p>
                Priority:{" "}
                {
                  parent2.combiPriority
                }
              </p>

              <select
                value={
                  p2Gender
                }
                onChange={(e) =>
                  setP2Gender(
                    e.target
                      .value as Gender
                  )
                }
                style={{
                  padding: 10,
                  borderRadius: 8
                }}
              >
                <option value="M">
                  ♂ Macho
                </option>

                <option value="F">
                  ♀ Fêmea
                </option>
              </select>
            </div>
          )}
        </section>
      </div>

      {/* ========================================
          BOTÃO
      ======================================== */}

      <div
        style={{
          textAlign:
            "center",
          margin:
            "30px 0"
        }}
      >
        <button
          onClick={
            calculateBreeding
          }
          style={{
            padding:
              "14px 30px",
            borderRadius: 10,
            border: "none",
            cursor:
              "pointer",
            fontSize: 16,
            fontWeight:
              "bold"
          }}
        >
          Calcular Breeding
        </button>
      </div>

      {/* ========================================
          MOTIVO / RANK
      ======================================== */}

      {reason && (
        <p
          style={{
            textAlign:
              "center",
            marginBottom: 20
          }}
        >
          {reason}
        </p>
      )}

      {/* ========================================
          RESULTADO
      ======================================== */}

      {child && (
        <section
          style={{
            maxWidth: 500,
            margin:
              "0 auto",
            padding: 25,
            border:
              "1px solid #444",
            borderRadius: 16,
            textAlign:
              "center"
          }}
        >
          <h2>
            Resultado
          </h2>

          <PalImage
            pal={child}
            size={180}
          />

          <h2>
            {child.name}
          </h2>

          {child.paldex && (
            <p>
              PalDex: #
              {child.paldex}
            </p>
          )}

          <p>
            Combi Rank:{" "}
            {child.combiRank}
          </p>

          <p>
            Combi Priority:{" "}
            {
              child.combiPriority
            }
          </p>
        </section>
      )}

      {/* ========================================
          EXPLICAÇÃO
      ======================================== */}

      <section
        style={{
          marginTop: 40,
          padding: 20,
          borderRadius: 12,
          background:
            "rgba(255,255,255,0.03)"
        }}
      >
        <h3>
          Como o cálculo funciona
        </h3>

        <p>
          1. Primeiro são
          verificadas as
          combinações especiais.
        </p>

        <p>
          2. Se os dois pais
          forem da mesma espécie,
          o resultado será a
          própria espécie.
        </p>

        <p>
          3. Para breeding normal,
          é necessário um macho
          e uma fêmea.
        </p>

        <p>
          4. O rank alvo é
          calculado usando:
        </p>

        <pre
          style={{
            padding: 15,
            borderRadius: 8,
            overflowX:
              "auto"
          }}
        >
{`floor((rankA + rankB + 1) / 2)`}
        </pre>

        <p>
          5. O sistema procura
          o Pal cujo Combi Rank
          esteja mais próximo
          do valor calculado.
        </p>

        <p>
          6. Em caso de empate,
          é utilizada a maior
          Combi Priority.
        </p>
      </section>
    </main>
  );
}