import React, { Component } from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

import './Register.css';

const LOGIN = gql`
mutation login($email: String!, $password: String!) {
    login(
        email: $email
        password: $password
    ) {
        userId
    }
}
`;
console.log(LOGIN);

class LoginPage extends Component {
    state = {
        email: '',
        password: ''
    }
    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }
    
    render() {
        return(
            <div className="auth-form">
                <div className="form-control">
                    <label htmlFor="email">E-Mail</label>
                    <input name="email" type="email" id="email" onChange={this.handleChange} />
                </div>
                <div className="form-control">
                    <label htmlFor="password">Password</label>
                    <input name ="password" type="password" id="password" onChange={this.handleChange} />
                </div>
                <div className="form-actions">
                <Mutation mutation={LOGIN}>
                    {(login, {loading,error}) => {
                        if(loading)  return(<h1> Loading... </h1>);
                        if(error) return(<h1> Something went wrong... </h1>)
                        return(
                            <button onClick={
                                e => {
                                e.preventDefault();
                                    login({
                                        variables: {
                                            email: this.state.email,
                                            password: this.state.password
                                        }
                                    })
                                }}>
                                Login
                            </button>
                        );
                    }}
                </Mutation>
                </div>
            </div>
        )
    }
}

export default LoginPage;

