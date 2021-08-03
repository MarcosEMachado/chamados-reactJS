import { Switch } from 'react-router-dom';
import Route from './Route';

import Logar from '../paginas/Logar';
import SignUp from '../paginas/SignUp';
import Dashboard from '../paginas/Dashboard';
import Profile from '../paginas/Profile';

export default function Routes(){
    return(
        <Switch>
            <Route exact path='/' component={Logar} />
            <Route exact path='/register' component={SignUp} />
            <Route exact path='/dashboard' component={Dashboard} isPrivate />
            <Route exact path='/profile' component={Profile} isPrivate />
        </Switch>
    );
}