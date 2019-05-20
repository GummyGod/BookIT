import React, { Component } from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

import './Auth.css';

class AuthPage extends Component {
    state = {
        email: '',
        password: ''
    }
    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }
    
    submitHandler = (event) => {
        event.preventDefault();
        const email = this.state.email;
        const password = this.state.password

        if(email.trim().length === 0 || password.trim().length === 0 ) return;
    }

    render() {
        console.log(this.props);
        const CREATE_USER = gql`
            mutation createUser($email: String!, $password: String!) {
                createUser(
                    userInput: {
                        email: $email
                        password: $password
                    }
                ) {
                    _id
                    email
                }
            }
        `;
        return(
            <Mutation mutation={CREATE_USER} variables={this.state.email}>
                <form className="auth-form" onSubmit={this.submitHandler}>
                    <div className="form-control">
                        <label htmlFor="email">E-Mail</label>
                        <input name="email" type="email" id="email" onChange={this.handleChange} />
                    </div>
                    <p> {this.state.email}</p>
                    <div className="form-control">
                        <label htmlFor="password">Password</label>
                        <input name ="password" type="password" id="password" onChange={this.handleChange} />
                    </div>
                    <div className="form-actions">
                        <button type="submit"> Submit </button>
                        <button type="button"> Switch to Signup </button>
                    </div>
                </form>
            </Mutation>
        );
    }
}

export default AuthPage;

