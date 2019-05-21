import React from 'react';
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

import './App.css';

const httpLink = createHttpLink({
	uri: 'http://localhost:9000/graphql'
});

const client = new ApolloClient({
	link: httpLink,
	cache: new InMemoryCache()
})

function App() {
	return (
		<BrowserRouter>
			<ApolloProvider client={client}>
				<React.Fragment>
					<MainNavigation /> 
					<main className="main-content">
						<Switch>
							<Redirect from="/" to="/register" exact/>
							<Route path="/register" component={RegisterPage} />
							<Route path="/events" component={EventsPage} />
							<Route path="/bookings" component={BookingsPage} />
							<Route path="/login" component={LoginPage} />
						</Switch>
					</main>
				</React.Fragment>
			</ApolloProvider>
		</BrowserRouter>
	);
}

export default App;
