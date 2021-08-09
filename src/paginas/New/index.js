import { useEffect, useState, useContext } from 'react';
import Header from '../../components/Header';
import Title from '../../components/Title';
import { FiClipboard } from 'react-icons/fi';
import './new.css';
import { toast } from 'react-toastify';
import { AuthContext } from '../../contexts/auth';
import firebase from '../../services/firebaseConnection';
import { useHistory, useParams } from 'react-router-dom';

export default function New(){

    const [assuntos, setAssuntos] = useState([]);
    const [assunto, setAssunto] = useState(0)
    const [clientes, setClientes] = useState([]);
    const [clienteSelect, setClienteSelect] = useState(0);
    const [status, setStatus] = useState('Aberto');
    const [descricao, setDescricao] = useState('');
    const [loadC, setLoadC] = useState(true);
    const [loadA, setLoadA] = useState(true);

    const { id } = useParams();
    const history = useHistory();
    const [isUpdate, setIsUpdate] = useState(false);

    const { user } = useContext(AuthContext);

    useEffect(()=>{
        loadClientes();
        loadAssuntos();
        return ()=>{ }
    },[]);

    useEffect (()=>{

        async function loadId(){
            await firebase.firestore().collection('chamados').doc(id)
            .get()
            .then((snapshot)=>{
                setStatus(snapshot.data().status);
                setDescricao(snapshot.data().descricao);
    
                let index = clientes.findIndex(item => item.id === snapshot.data().clienteId);
                setClienteSelect(index);
    
                index = assuntos.findIndex(item => item.id === snapshot.data().assuntoId);
                setAssunto(index);
                setIsUpdate(true);
    
            }).catch((err)=>{
                toast.error('Erro ou tentar buscar o chamado pelo id');
                console.log(err);
                setIsUpdate(false);
            });
        }

        if(id){
            if(clientes.length !== 0 && assuntos.length !== 0 ){
                loadId();
            }
        }

    },[clientes, assuntos, id]);


    async function loadClientes() {
        await firebase.firestore().collection('customers')
            .get()
            .then((snapshot)=>{
                let lista = [];
    
                snapshot.forEach((doc)=> {
                    lista.push({
                        id: doc.id,
                        nomeFantasia: doc.data().nomeFantasia
                    })
                })
                if(lista.length === 0){
                    toast.error('Nenhuma empresa encontrada');
                    setClientes([ {id: 1, nomeFantasia: 'Cliente'} ]);
                    setLoadC(false);
                    return;
                }
    
                setClientes(lista);
                setLoadC(false);
    
            }).catch((err)=>{
                console.log(err);
                toast.error('Erro ao buscar os clientes');
                setClientes([ {id: 1, nomeFantasia: 'Cliente'} ]);
                setLoadC(false);
            });        
    }

    async function loadAssuntos() {
        await firebase.firestore().collection('assuntos')
            .get()
            .then((snapshot)=>{
                let lista = [];

                snapshot.forEach((doc)=>{
                    lista.push({
                        id: doc.id,
                        nome: doc.data().nome
                    });
                });
                if(lista.length === 0){
                    toast.error('Erro ao buscar os assuntos');
                    setAssuntos([{id: 0, nome: 'NA'}]);
                    setLoadA(false);
                    return; 
                }

                setAssuntos(lista);
                setLoadA(false);
                
            })
            .catch((err)=>{
                console.log(err);
                toast.error('Erro ao buscar os assuntos');
                setAssuntos([{id: 0, nome: 'NA'}]);
                setLoadA(false);
            });
    }

    async function register(e){
        e.preventDefault();
        await firebase.firestore().collection('chamados')
        .add({
            clienteId: clientes[clienteSelect].id,
            clienteNome: clientes[clienteSelect].nomeFantasia,
            assuntoId: assuntos[assunto].id,
            assuntoNome: assuntos[assunto].nome,
            status: status,
            descricao: descricao,
            created: new Date(),
            userIdCreatd: user.uid,
            updateDt: new Date(),
            userIdUpdate: user.uid
        }).then(()=>{
            toast.success('Chamado criado com sucesso!');
            history.push('/dashboard');
        }).catch((err)=>{
            toast.error('Erro ao criar o novo chamado, tente novamente');
            console.log(err);
        })
    }

    function changeAssunto(e){
        setAssunto(e.target.value);
    }

    function changeStatus(e){
        setStatus(e.target.value);
    }

    function changeCliente(e){
        setClienteSelect(e.target.value);
    }

    async function update(e) {
        e.preventDefault();
        await firebase.firestore().collection('chamados')
        .doc(id)
        .update({
            clienteId: clientes[clienteSelect].id,
            clienteNome: clientes[clienteSelect].nomeFantasia,
            assuntoId: assuntos[assunto].id,
            assuntoNome: assuntos[assunto].nome,
            status: status,
            descricao: descricao,
            updateDt: new Date(),
            userIdUpdate: user.uid
        }).then(()=>{
            toast.success('Chamado atualizado com sucesso!');
            history.push('/dashboard');
        }).catch((err)=>{
            toast.error('Erro ao atualizado o chamado, tente novamente :(');
            console.log(err);
        })
    }

    return(
        <div>
            <Header/>
            <div className="content">
                <Title name="Novo chamado">
                    <FiClipboard size={25} />
                </Title>

                <div className="container">
                    <form className="form-profile" onSubmit={isUpdate ? update : register}>
                        <label>Cliente</label>
                        {loadC ? (
                            <input type="text" disabled={true} value="Por Favor aguarde, carregando..." />
                        ):(
                            <select value={clienteSelect} onChange={changeCliente} >
                                { clientes.map((item, index)=>{
                                    return(
                                        <option key={item.id} value={index}>
                                            {item.nomeFantasia}
                                        </option>
                                    );
                                }) }
                            </select>
                        )}
                        
                        <label>Assunto</label>
                        {loadA ? (
                            <input type="text" disabled={true} value="Por Favor aguarde, carregando..." />
                        ):(
                            <select value={assunto} onChange={changeAssunto}>
                                { assuntos.map((item, index)=>{
                                    return(
                                        <option key={item.id}
                                            value={index}>
                                            {item.nome}
                                        </option>
                                    );
                                })}
                            </select>
                        )}
                        <label>Status</label>
                        <div className="status">
                            <input 
                            type="radio"
                            name="radio"
                            value="Aberto"
                            onChange={changeStatus}
                            checked={ status === 'Aberto' }
                            />
                            <span>Em Aberto</span>

                            <input 
                            type="radio"
                            name="radio"
                            value="Progresso"
                            onChange={changeStatus}
                            checked={ status === 'Progresso' }
                            />
                            <span>Progresso</span>

                            <input 
                            type="radio"
                            name="radio"
                            value="Atendido"
                            onChange={changeStatus}
                            checked={ status === 'Atendido' }
                            />
                            <span>Atendido</span>
                        </div>
                        <label>Complemento</label>
                        <textarea
                            type="text"
                            placeholder="Descreva seu problema."
                            value={descricao}
                            onChange={(e)=> setDescricao(e.target.value)}
                            />
                        {isUpdate ? ( 
                            <button type="submit">Salvar</button>
                        ):(
                            <button type="submit">Criar</button>
                        )}
                        
                    </form>
                </div>

            </div>
        </div>
    )
}