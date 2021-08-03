import { useState, useContext } from 'react';
import './profile.css';
import Header from '../../components/Header';
import Title from '../../components/Title';
import { FiSettings, FiUpload } from 'react-icons/fi';
import { AuthContext } from '../../contexts/auth';
import avatar from '../../assets/avatar.png';
import firebase from '../../services/firebaseConnection';
import { toast } from 'react-toastify';

export default function Profile(){
    const { user, signOut, setUser, storageUser } = useContext(AuthContext);

    const [nome, setNome] = useState(user && user.nome);
    const [email, setEmail] = useState(user && user.email);
    const [avatarUrl, setAvatarUrl] = useState(user && user.avatarUrl);
    const [imgAvatar, setImgAvatar] = useState(null);

    function handleFile(e){
        if(e.target.files[0]){
            const image = e.target.files[0];

            if(image.type === 'image/jpeg' || image.type === 'image/png'){
                setImgAvatar(image);
                setAvatarUrl(URL.createObjectURL(image));
            }else{
                toast.error('Tipo da imagem errado!');
                toast.error('Só aceitamos .JPEG ou .PNG');
                setImgAvatar(null);
                return null;
            }
        }
    }

    async function handleUpload(){
        const uid = user.uid;

        const uploadTask = await firebase.storage()
        .ref(`images/${uid}/${imgAvatar.name}`)
        .put(imgAvatar)
        .then( async ()=>{
            toast.success('Foto enviada com sucesso!');

            await firebase.storage().ref(`images/${uid}`)
            .child(imgAvatar.name).getDownloadURL()
            .then(async (url)=> {
                let urlStorage = url;

                await firebase.firestore().collection('users')
                .doc(uid)
                .update({
                    avatarUrl: urlStorage,
                    nome: nome
                }).then(()=>{
                   let data = {
                       ...user,
                       avatarUrl: urlStorage,
                       nome: nome
                   };
                   toast.success('Dados atualizado com sucesso!');
                   setUser(data);
                   sessionStorage(data);
                }).catch((err)=>{
                    console.log('erro no update com a url da imagem!');
                    console.log(err);
                })
            })

        }).catch((err)=>{
            toast.error('Erro ao fazer o Upload da imagem!');
            console.log(err);
        })

    }

    async function salvar(e){
        e.preventDefault();

        if(imgAvatar === null && nome !== ''){
            await firebase.firestore().collection('users')
            .doc(user.uid)
            .update({
                nome: nome
            }).then(()=>{
                let data = {
                    ...user,
                    nome: nome
                };
                setUser(data);
                storageUser(data);

                toast.success('Cadastro atualizado com sucesso! :)');
            }).catch((err)=>{
                toast.error('Erro ao atualizar :(');
                console.log(err);
            })
        }else if (imgAvatar !== null && nome !== ''){
            handleUpload();
        }
    }

    return(
        <div>
            <Header/>
            <div className="content">
                <Title name="Meu perfil">
                    <FiSettings size={25} />
                </Title>
            
                <div className="container">
                    <form className="form-profile" onSubmit={salvar}>
                        <label className="label-avatar">
                            <span>
                                <FiUpload color="#fff" size={25}/>
                            </span>
                            <input type="file" accept="image/*" onChange={handleFile}/><br/>
                            {avatarUrl === null ?
                                <img src={avatar} width="250" height="250" alt="Foto de perfil do usuário"/>
                                :
                                <img src={avatarUrl} width="250" height="250" alt="Foto de perfil do usuário"/>
                            }
                        </label>
                        <label>Nome</label>
                        <input type="text" value={nome} onChange={ (e) => setNome(e.target.value)} />

                        <label>Email</label>
                        <input type="text" value={email} disabled={true} />

                        <button type="submit">Salvar</button>
                    </form>
                </div>
                <div className="container">
                    <button className="logout-btn" onClick={()=> signOut() }>Sair</button>
                </div>
            </div>
        </div>
    )
}