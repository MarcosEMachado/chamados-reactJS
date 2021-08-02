import { useContext } from 'react';
import { AuthContext } from '../../contexts/auth';

export default function Dashboard(){

    const { user, signOut } = useContext(AuthContext); 

    return(
        <div>
            <h1>PAGINA Dashboard user: {user.nome}</h1>
            <button onClick={()=> signOut() }>SAIR</button>
        </div>
    )
}