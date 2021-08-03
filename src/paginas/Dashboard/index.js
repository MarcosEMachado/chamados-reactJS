import { useContext } from 'react';
import { AuthContext } from '../../contexts/auth';
import Header from '../../components/Header';

export default function Dashboard(){

    const { user } = useContext(AuthContext); 

    return(
        <div>
            <Header/>
            <h1>PAGINA Dashboard user: {user.nome}</h1>
        </div>
    )
}