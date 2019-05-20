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
    
    submitHandler = createUser => (event) => {
        event.preventDefault();
        const email = this.state.email;
        const password = this.state.password

        if(email.trim().length === 0 || password.trim().length === 0 ) return;
        
        createUser({
            variables: {
              email: event.email.value,
              password: event.password.value
            }
          });
        
    }

    render() {
        return(
            <Mutation mutation={CREATE_USER}>
                {(createUser, {loading,error} ) => {
                        if(error) return <h1> {error.graphQLErrors[0].message} </h1>;
                        if(loading) return <h1> Loading... </h1>

                        return(
                            <form className="auth-form" onSubmit={ 
                                e => {
                                    e.preventDefault()
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
                                    <button type="submit"> Submit </button>
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

