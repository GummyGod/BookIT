const express = require('express');
const graphQlHttp = require('express-graphql');
const { buildSchema } = require('graphql');

const app = express();

app.use(express.json());

app.use('/graphql', graphQlHttp({
    schema: buildSchema(`
        type RootQuery {
            events: [String!]!
        }

        type RootMutation {
            createEvent(name: String): String
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
        events: () => {
            return ['Cooking','Sailing', 'Coding all night'];
        },
        createEvent: (args) => {
            const eventName = args.name;
            return eventName;
        }
    },
    graphiql:true,
}));

app.listen(3000, () => console.log('Server up and running...'));
