import React, {Component} from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import { ApolloClient } from 'apollo-boost'
import { ApolloProvider } from 'react-apollo';
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'

import RegisterPage from './pages/Register';
import EventsPage from './pages/Events';
import BookingsPage from './pages/Bookings';
import LoginPage from './pages/Login';
import MainNavigation from './components/Navigation/MainNavigation';
import AuthContext from './context/auth-context';

import './App.css';

const httpLink = createHttpLink({
	uri: 'http://localhost:9000/graphql'
});

const client = new ApolloClient({
	link: httpLink,
	cache: new InMemoryCache()
})
class App extends Component {
	state = {
		token:null,
		userId: null
	}
	login = (token,userId,tokenExpiration) => {
		this.setState({ token:token, userId: userId });
	}

	logout = () => {
		this.setState({token:null, userId: null});
	}
	render() {
		return(
			<BrowserRouter>
				<ApolloProvider client={client}>
					<React.Fragment>
						<AuthContext.Provider value={
								{
									token: this.state.token, 
									userId: this.state.userId, 
									login: this.login, 
									logout:this.logout
								}
							}>
							<MainNavigation /> 
							<main className="main-content">
								<Switch>
									<Redirect from="/" to="/login" exact/>
									<Route path="/register" component={RegisterPage} />
									<Route path="/events" component={EventsPage} />
									<Route path="/bookings" component={BookingsPage} />
									<Route path="/login" component={LoginPage} />
								</Switch>
							</main>
						</AuthContext.Provider>
					</React.Fragment>
				</ApolloProvider>
			</BrowserRouter>
		)
	}
}	
export default App;
