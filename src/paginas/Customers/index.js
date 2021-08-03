import { useState } from 'react';
import './customers.css';
import Header from '../../components/Header';
import Title from '../../components/Title';
import { FiUser } from 'react-icons/fi';
import { toast } from 'react-toastify';
import firebase from '../../services/firebaseConnection';

export default function Customers (){

    const [nomeFan, setNomeFan] = useState('');
    const [cnpj, setCnpj] = useState('');
    const [endereco, setEndereco] = useState('');

    async function newCustomer(e){
        e.preventDefault();
        if(nomeFan !== '' && cnpj !== '' && endereco !== ''){
            await firebase.firestore().collection('customers')
            .add({
                nomeFantasia: nomeFan,
                cnpj: cnpj,
                endereco: endereco
            }).then(()=>{
                setEndereco('');
                setNomeFan('');
                setCnpj('');
                toast.info('Empresa cadastrada com sucesso!')
            }).catch((err)=>{
                console.log(err);
                toast.error('Erro ao cadastra a nova empresa. :(');
            })
        }else{
            toast.error('Todos os canpos são obrigatórios!');
        }
    }

    return(
        <div>
            <Header/>
            <div className="content">
                <Title name="Clientes">
                    <FiUser size={25}/>
                </Title>
                <div className="container">
                    <form className="form-profile customers" onSubmit={newCustomer}>
                        <label>Nome Fantasia</label>
                        <input type="text" placeholder="Nome da sua empresa" value={nomeFan} onChange={(e)=> setNomeFan(e.target.value)} />
                        <label>CNPJ Fantasia</label>
                        <input type="text" placeholder="00.000.000/0000-00" value={cnpj} onChange={(e)=> setCnpj(e.target.value)} />
                        <label>Endereço</label>
                        <input type="text" placeholder="Endereço da empresa" value={endereco} onChange={(e)=> setEndereco(e.target.value)} />
                        <button type="submit">Cadastra</button>
                    </form>
                </div>
            </div>
        </div>
    );
}