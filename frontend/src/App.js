import React from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import { ApolloClient } from 'apollo-boost'
import { ApolloProvider } from 'react-apollo';
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'

import AuthPage from './pages/Auth';
import EventsPage from './pages/Events';
import BookingsPage from './pages/Bookings';
import MainNavigation from './components/Navigation/MainNavigation';

import './App.css';

const httpLink = createHttpLink({
	uri: 'http://localhost:9000'
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
							<Redirect from="/" to="/auth" exact/>
							<Route path="/auth" component={AuthPage} />
							<Route path="/events" component={EventsPage} />
							<Route path="/bookings" component={BookingsPage} />
						</Switch>
					</main>
				</React.Fragment>
			</ApolloProvider>
		</BrowserRouter>
	);
}

export default App;
