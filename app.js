const express = require('express');
const graphQlHttp = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');

const Event = require('./models/event');

const app = express();

app.use(express.json());

app.use('/graphql', graphQlHttp({
    schema: buildSchema(`
        type Event {
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        input EventInput {
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        type RootQuery {
            events: [Event!]!
        }

        type RootMutation {
            createEvent(eventInput: EventInput): Event
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
        events: () => {
            return Event.find().then(events => {
                return events.map(event => {
                    return {
                        ...event._doc, // exclude the metadata from our query
                        _id: event.id //convert the id to string so graphQL can understand id by using the native method
                    };
                });
            }).catch(err => {
            console.log(err);
                throw err;
            });
        },
        createEvent: (args) => {
            //generate evt object
            const event = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price, //hack to make sure whatever we get here should be converted to a number
                date: new Date(args.eventInput.date)
            });

            //save evt to db
            return event.save()
            .then((result) => {
                return {
                    ...result._doc, // exclude the metadata from our query
                    id: result._doc._id.toString() //basically how to convert id to a type gql understands 
                    //without using mongoose .id method
                };
            })
            .catch(err => {
                console.log(err)
                throw err;
            });
        }
    },
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
        app.listen(3000, () => console.log('Server up and running...'));
    }).catch(err => {
        console.log(err);
    })

