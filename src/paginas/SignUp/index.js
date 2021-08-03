import { Link } from 'react-router-dom';
import { useState, useContext } from 'react';
import logo from '../../assets/logo.png';
import { AuthContext } from '../../contexts/auth';

function SignUp() {

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const { signUp, loadingAuth } = useContext(AuthContext);

  function handleSubmit(e){
    e.preventDefault();
    //alert('clicou')
    if(nome !== '' && email !== '' && senha !== ''){
      signUp(email, senha, nome);
    }
  }

    return (
      <div className= "container-center">
        <div className="login">
          <div className="logo-area">
            <img src={logo} alt="Sistema Logo"/>
          </div>
          <form onSubmit={handleSubmit}>
            <h1>Cadastra</h1>
            <input type="text" placeholder="Seu nome" value={nome} onChange={ (e)=> setNome(e.target.value) } />
            <input type="text" placeholder="email@email.com" value={email} onChange={ (e)=> setEmail(e.target.value) } />
            <input type="password" placeholder="******" value={senha} onChange={ (e)=> setSenha(e.target.value) }/>
            <button type="submit">{loadingAuth ? 'Carregando...' : 'Salvar'}</button>
          </form>
          <Link to="/"> Ja tenho uma conta </Link>
        </div>
      </div>
    );
  }
  
  export default SignUp;
  