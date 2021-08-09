import { Redirect, Switch } from 'react-router-dom';
import Route from './Route';

import Logar from '../paginas/Logar';
import SignUp from '../paginas/SignUp';
import Dashboard from '../paginas/Dashboard';
import Profile from '../paginas/Profile';
import Customers from '../paginas/Customers';
import New from '../paginas/New';

export default function Routes(){
    return(
        <Switch>
            <Route exact path='/' component={Logar} />
            <Route exact path='/register' component={SignUp} />
            <Route exact path='/dashboard' component={Dashboard} isPrivate />
            <Route exact path='/profile' component={Profile} isPrivate />
            <Route exact path='/customers' component={Customers} isPrivate />
            <Route exact path='/new' component={New} isPrivate />
            <Route exact path='/new/:id' component={New} isPrivate />

            <Route path="*" render={ () => <Redirect to="/" /> } />
        </Switch>
    );
}