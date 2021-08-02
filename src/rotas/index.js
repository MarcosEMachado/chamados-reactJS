import { Switch } from 'react-router-dom';
import Route from './Route';

import Logar from '../paginas/Logar';
import Deslogar from '../paginas/Deslogar';
import Dashboard from '../paginas/Dashboard';

export default function Routes(){
    return(
        <Switch>
            <Route exact path='/' component={Logar} />
            <Route exact path='/register' component={Deslogar} />
            <Route exact path='/dashboard' component={Dashboard} isPrivate />
        </Switch>
    );
}