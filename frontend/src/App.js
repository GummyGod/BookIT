import React from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import { ApolloClient } from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

import AuthPage from './pages/Auth';
import EventsPage from './pages/Events';
import BookingsPage from './pages/Bookings';
import MainNavigation from './components/Navigation/MainNavigation';

import './App.css';

const client = new ApolloClient({
	uri: "localhost:9000/graphql"
  });

function App() {
	return (
		<ApolloProvider client={client}>
			<BrowserRouter>
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
			</BrowserRouter>
		</ApolloProvider>
	);
}

export default App;
