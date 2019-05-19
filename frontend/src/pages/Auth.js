import React, { Component } from 'react';
import { gql } from "apollo-boost";

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
        return(
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
        );
    }
}

export default AuthPage;

