import { Link } from 'react-router-dom';
import { useState } from 'react';
import './logar.css';
import logo from '../../assets/logo.png';

function Logar() {

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  function handleSubmit(e){
    e.preventDefault();
    alert('clicou')
  }

    return (
      <div className= "container-center">
        <div className="login">
          <div className="logo-area">
            <img src={logo} alt="Sistema Logo"/>
          </div>
          <form onSubmit={handleSubmit}>
            <h1>Entrar</h1>
            <input type="text" placeholder="email@email.com" value={email} onChange={ (e)=> setEmail(e.target.value) } />
            <input type="password" placeholder="******" value={senha} onChange={ (e)=> setSenha(e.target.value) }/>
            <button type="submit">Acessar</button>
          </form>
          <Link to="/register"> Criar uma conta</Link>
        </div>
      </div>
    );
  }
  
  export default Logar;
  