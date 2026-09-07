import Link from "next/link";

export default function Produto() {
    return (
        <div>
            <div>
                <h1>Gestão de produtos</h1>

                <Link href="/produtos/novo">
                    Novo produto
                </Link>
            </div>

            <div>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nome</th>
                            <th>Tipo</th>
                            <th>Preço</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>Produto</td>
                            <td>Pall</td>
                            <td>R$ 10,00</td>
                        </tr>
                        <tr>
                            <td>2</td>
                            <td>Produto</td>
                            <td>Equipamento</td>
                            <td>R$ 15,00</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
   
    
}
