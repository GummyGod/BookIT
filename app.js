const express = require('express');
const graphQlHttp = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Event = require('./models/event');
const User = require('./models/user');

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

        type User {
            _id: ID!
            email: String!
            password: String
        }


        input UserInput {
            email: String!
            password: String!
        }

        type RootQuery {
            events: [Event!]!
        }

        type RootMutation {
            createEvent(eventInput: EventInput): Event
            createUser(userInput: UserInput): User
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
        createEvent: args => {
            //generate evt object
            const event = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price, //hack to make sure whatever we get here should be converted to a number
                date: new Date(args.eventInput.date),
                creator: '5c97dbfbc3405b80dec4954a' //hardcode this atm, will make logic later
            });
            let createdEvent;

            //save evt to db
            return event.save()
            .then((result) => {
                //save the createdEvent here so no bugs below
                createdEvent = {
                    ...result._doc, //exclude the metadata from our query
                    id: result._doc._id.toString() //basically how to convert id to a type gql understands 
                    //without using mongoose .id method
                };
                return User.findById('5c97dbfbc3405b80dec4954a') // find user(hardcoded atm)
                .then(user => {
                    if(!user) { //check if user exists
                        throw new Error('User not found!') 
                    }
                    user.createdEvents.push(event) // add created event to the user who created it
                    return user.save();
                })
                .then((result) => {
                    return createdEvent;
                })
            })
            .catch(err => {
                console.log(err)
                throw err;
            });
        },
        createUser: args => {
            return User.findOne({email:args.userInput.email})
                .then(user => {
                if(user) {
                    throw new Error('User exists already!')
                }

                return bcrypt //encrypt pw
                .hash(args.userInput.password, 12)
                }).then(hashedPassword => { //chain promises 
                    const user = new User({
                        email: args.userInput.email,
                        password: hashedPassword
                    });
                    return user.save() //save to the db
                })
                .then(result => { //we get this because user.save is a promise too
                    return {
                        ...result._doc, 
                        _id: result.id,
                        password: null //so it can never be retrieved, this is not the password that gets saved to the db
                    }
                })
                .catch(err => {
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

