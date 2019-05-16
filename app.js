const express = require('express');
const graphQlHttp = require('express-graphql');
const mongoose = require('mongoose');

const graphQlSchema = require('./graphql/schema');
const graphQlResolvers = require('./graphql/resolvers');
const isAuth = require('./middleware/is-auth')

const app = express();

app.use(express.json());

app.use(isAuth);

app.use('/graphql', graphQlHttp({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql:true,
}));

mongoose
    .connect(
        `mongodb+srv://${
            process.env.MONGO_USER
        }:${
            process.env.MONGO_PASSWORD
        }@cluster0-hgcuo.mongodb.net/${
                process.env.MONGO_DB
            }?retryWrites=true`
        )
    .then(() =>{
        app.listen(9000, () => console.log('Server up and running...'));
    }).catch(err => {
        console.log(err);
    })

