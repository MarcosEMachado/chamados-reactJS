import { Switch } from 'react-router-dom';
import Route from './Route';

import Logar from '../paginas/Logar';
import SignUp from '../paginas/SignUp';
import Dashboard from '../paginas/Dashboard';

export default function Routes(){
    return(
        <Switch>
            <Route exact path='/' component={Logar} />
            <Route exact path='/register' component={SignUp} />
            <Route exact path='/dashboard' component={Dashboard} isPrivate />
        </Switch>
    );
}