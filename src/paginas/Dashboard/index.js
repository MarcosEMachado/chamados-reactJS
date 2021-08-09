import { useState, useEffect } from 'react';
import './dashboard.css';
import Header from '../../components/Header';
import Title from '../../components/Title';
import { FiMessageSquare , FiPlus, FiEdit2 } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import firebase from '../../services/firebaseConnection';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import Modal from '../../components/Modal';

const listRef = firebase.firestore().collection('chamados').orderBy('created', 'desc');

export default function Dashboard(){

    const [chamados, setChamados] = useState([]);
    const [load, setLoad] = useState(true);
    const [loadMore, setLoadMore] = useState(false);
    const [isEmpty, setIsEmpty] = useState(false);
    const [lastDocs, setLastDocs] = useState();

    const [showModal, setShowModal] =useState();
    const [chamado, setChamado] = useState();

    useEffect(()=>{

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

        loadChamados();

        //???para que isso
        return ()=>{}
    },[]);

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

    async function handleMore(){
        setLoadMore(true);

        await listRef.startAfter(lastDocs).limit(5)
        .get()
        .then((snapshot)=> {
            updateState(snapshot);
            toast.success('Carregando mas chamados, aguarde!')
        }).catch((err)=>{
            console.log(err);
            toast.error('Erro ao caregar mais chamados :(');
            setLoadMore(false);
        });

    }

    function modalShow(chamado){
        setShowModal(!showModal);
        setChamado(chamado);
    }

    if(load){
        return(
            <div>
                <Header/>
                <div className="content">
                    <Title name="Chamados">
                        <FiMessageSquare size={25}/>
                    </Title>
                    <div className="container dashboard">
                    <span>Buscando chamado...</span>
                    </div>
                </div>
            </div>
        )
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
                                    <th scope="col">ID</th>
                                    <th scope="col">Cliente</th>
                                    <th scope="col">Assunto</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Cadastrado em</th>
                                    <th scope="col">#</th>
                                </tr>
                            </thead>
                            <tbody>
                                {chamados.map((item, index)=>{
                                    return(
                                        <tr key={index}>
                                            <td data-label="ID">{item.id}</td>
                                            <td data-label="Cliente">{item.cliente}</td>
                                            <td data-label="Assunto">{item.assunto}</td>
                                            <td data-label="Status">
                                                <span className="badge" style={{background: item.status === 'Aberto' ? '#5cb85c' : '#999' }}>{item.status}</span>
                                            </td>
                                            <td data-label="DtCadastro">{item.createdFormated}</td>
                                            <td data-label="#">
                                                <button className="action" style={{background: '#3583f6'}} onClick={()=> modalShow(item)} >
                                                    <FiMessageSquare color="#FFF" size={17}/>
                                                </button>
                                                <Link className="action" style={{background: '#F6a935'}} to={`/new/${item.id}`} >
                                                    <FiEdit2 color="#FFF" size={17}/>
                                                </Link>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>

                        {loadMore && <span>Buscando mas chamados...</span>}
                        {!loadMore && !isEmpty && <button className="btn-more" onClick={handleMore}>Buscar<FiPlus size={25}/></button>}
                    </>
                )}
                
            </div>

            {showModal && (
                <Modal
                    conteudo={chamado}
                    close={modalShow}
                />
            )}
        </div>
    )
}