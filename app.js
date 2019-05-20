const express = require('express');
const graphQlHttp = require('express-graphql');
const mongoose = require('mongoose');
const cors = require('cors');

const graphQlSchema = require('./graphql/schema');
const graphQlResolvers = require('./graphql/resolvers');
const isAuth = require('./middleware/is-auth')

const app = express();

app.options('/graphql', function(_req, res, next) {
    res.header('Allow', 'GET, POST, OPTIONS');
    next();
});


app.use(cors());
const corsSettings = {
    origin: [
      `https://localhost:3000`,
      `wss://localhost:3000`,
    
    ]
};
  
app.use('*', cors(corsSettings));

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

