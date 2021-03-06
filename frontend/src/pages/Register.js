import React, { Component } from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

import './Register.css';

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
class RegisterPage extends Component {
    state = {
        email: '',
        password: ''
    }
    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }
    

    render() {
        return(
            <Mutation mutation={CREATE_USER}>
                {(createUser, {loading,error} ) => {
                        if(error) return <h1> Something went wrong... </h1>;
                        if(loading) return <h1> Loading... </h1>

                        return(
                            <form className="auth-form" onSubmit={ 
                                e => {
                                    e.preventDefault();
                                    createUser({
                                        variables: {
                                            email: this.state.email,
                                            password: this.state.password
                                        }
                                    })
                                }
                            }>
                                <div className="form-control">
                                    <label htmlFor="email">E-Mail</label>
                                    <input name="email" type="email" id="email" onChange={this.handleChange} />
                                </div>
                                <div className="form-control">
                                    <label htmlFor="password">Password</label>
                                    <input name ="password" type="password" id="password" onChange={this.handleChange} />
                                </div>
                                <div className="form-actions">
                                    <button type="submit"> Register </button>
                                </div>
                            </form>
                        )
                    }
                }
            </Mutation>
        );
    }
}

export default RegisterPage;

