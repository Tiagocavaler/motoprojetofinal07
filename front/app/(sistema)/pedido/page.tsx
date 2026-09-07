import Link from "next/link";

export default function pedido() {
    return (
        <div>
            <div>
                <h1>Gestão de pedidos</h1>

                <Link href="/pedidos/novo">
</Link>
            </div>

            <div>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>dataPedido</th>
                            <th>status</th>
                            <th>Cliente</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>2023-01-01</td>
                            <td>Pendente</td>
                            <td>Cliente 1</td>
                        </tr>
                        <tr>
                            <td>2</td>
                            <td>2023-01-02</td>
                            <td>Entregue</td>
                            <td>Cliente 2</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
   
    
}