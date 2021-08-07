import { useState, useEffect } from 'react';
import './dashboard.css';
import Header from '../../components/Header';
import Title from '../../components/Title';
import { FiMessageSquare , FiPlus, FiEdit2 } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import firebase from '../../services/firebaseConnection';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

const listRef = firebase.firestore().collection('chamados').orderBy('created', 'desc');

export default function Dashboard(){

    const [chamados, setChamados] = useState([]);
    const [load, setLoad] = useState(true);
    const [loadMore, setLoadMore] = useState(false);
    const [isEmpty, setIsEmpty] = useState(false);
    const [lastDocs, setLastDocs] = useState();

    useEffect(()=>{
        loadChamados();

        //???para que isso
        return ()=>{}
    },[]);

    async function loadChamados() {
        await listRef.limit(5).get()
        .then((snapshot)=> {
            updateState(snapshot);
        }).catch((err)=>{
            console.log(err);
            toast.error('Erro ao caregar os chamados :(');
            setLoadMore(false);
        });

        setLoad(false);
    }

    async function updateState(snapshot) {
        const isCollectionEmpty = snapshot.size === 0;

        if(!isCollectionEmpty){
            let lista = [];

            snapshot.forEach((doc)=>{
                lista.push({
                    id: doc.id,
                    assunto: doc.data().assuntoNome,
                    cliente: doc.data().clienteNome,
                    clienteId: doc.data().clienteId,
                    created: doc.data().created,
                    createdFormated: format(doc.data().created.toDate(), 'dd/MM/yyyy HH:mm'),
                    status: doc.data().status,
                    complemento: doc.data().complemento
                })
            })
            
            const lastDoc = snapshot.docs[snapshot.docs.length -1];// pega o ultimo doc

            setChamados(chamados => [...chamados, ...lista]);
            setLastDocs(lastDoc);
        }else{
            setIsEmpty(true);
        }

        setLoadMore(false);

    }

    return(
        <div>
            <Header/>
            <div className="content">
                <Title name="Chamados">
                    <FiMessageSquare size={25}/>
                </Title>

                {chamados.length === 0 ? (
                    <div className="container dashboard">
                        <span>Nenhum chamado registrado...</span>
                        <Link to="/new" className="new" >
                            <FiPlus size={25}/>
                            Novo Chamado
                        </Link>
                    </div>
                ) : (
                    <>
                        <Link to="/new" className="new" >
                            <FiPlus size={25}/>
                            Novo Chamado
                        </Link>
                        <table>
                            <thead>
                                <tr>
                                    <th scope="col">Numero</th>
                                    <th scope="col">Cliente</th>
                                    <th scope="col">Assunto</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Cadastrado em</th>
                                    <th scope="col">#</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td data-label="Numero">1</td>
                                    <td data-label="Cliente">Sujeito</td>
                                    <td data-label="Assunto">Suporte</td>
                                    <td data-label="Status">
                                        <span className="badge" style={{background: '#5cb85c'}}>Em aberto</span>
                                    </td>
                                    <td data-label="DtCadastro">20/06/2021</td>
                                    <td data-label="#">
                                        <button className="action" style={{background: '#3583f6'}}>
                                            <FiMessageSquare color="#FFF" size={17}/>
                                        </button>
                                        <button className="action" style={{background: '#F6a935'}}>
                                            <FiEdit2 color="#FFF" size={17}/>
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </>
                )}
                
            </div>
        </div>
    )
}