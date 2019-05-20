import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

const CREATE_USER = gql`
    mutation {
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

export default graphql(CREATE_USER, {
    name: 'createUser',
    props: ({createUser}) => ({
        createUser:(email, password) => 
            createUser({
                variables: {
                    email,
                    password
                }
            })
    })
})