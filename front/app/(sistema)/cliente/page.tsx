import Link from "@/node_modules/next/link";

export default function clientes(){

    return(
    
    <div>
        <div>
            <h1>
                Gestao de clientes
            </h1>
            <Link href="/clientes/novo"></Link>
        </div>

        <div>
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>id</th>
                            <th>nome</th>
                            <th>cpf</th>
                            <th>senha</th>
                            <th>email</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                1
                                tiago
                                124587011
                                1234
                                tiago@email.com
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        
       
         
         
    </div>)

}