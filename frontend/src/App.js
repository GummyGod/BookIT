import React, {Component} from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import { ApolloClient } from 'apollo-boost'
import { ApolloProvider } from 'react-apollo';
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { setContext } from 'apollo-link-context';

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
const authLink = setContext((_, { headers }) => {
	const token = localStorage.getItem('token')
  
	return {
	  headers: {
		...headers,
		...(token && { authorization: `Bearer ${token}` })
	  }
	}
  })
const client = new ApolloClient({
	link: authLink.concat(httpLink),
	cache: new InMemoryCache()
})
class App extends Component {
	state = {
		userId: null,
	}
	login = (token,userId) => {
		localStorage.setItem('token', token);
		localStorage.setItem('userId', userId);
		this.setState({userId})
	}

	logout = () => {
		localStorage.removeItem('token');
		localStorage.removeItem('userId');
		this.setState({userId: null});
	}
	render() {
		const hasToken = localStorage.getItem('token');
		return(
			<BrowserRouter>
				<ApolloProvider client={client}>
					<React.Fragment>
						<AuthContext.Provider value={
								{
									token: localStorage.getItem('token'), 
									userId: this.state.userId || localStorage.getItem('userId'), 
									login: this.login, 
									logout:this.logout
								}
							}>
							<MainNavigation /> 
							<main className="main-content">
								<Switch>
									{hasToken && <Redirect from="/" to="/events" exact/>}
									{hasToken && <Redirect from="/register" to="/events" exact/>}
									{hasToken && <Redirect from="/login" to="/events" exact/>}
									{!hasToken && <Route path="/register" component={RegisterPage} />}
									<Route path="/events" component={EventsPage} />
									{hasToken && <Route path="/bookings" component={BookingsPage} />}
									{!hasToken && <Route path="/login" component={LoginPage} />}
									{!hasToken && <Redirect to="/login" exact/>}
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
