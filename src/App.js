import { BrowserRouter } from 'react-router-dom';
import Routes from './rotas';
import AuthProvider from './contexts/auth';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ToastContainer autoColse={3000}/> 
        <Routes/>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
