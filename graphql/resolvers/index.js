const bcrypt = require('bcryptjs');
const Event = require('../../models/event');
const User = require('../../models/user');

const events = eventIds => {
    return Event.find({_id: {$in: eventIds}})
        .then(events => {
            return events.map(event => {
                return { 
                    ...event._doc, 
                    _id: event.id, 
                    creator: user.bind(this, event.creator) 
                }
            });
        })
        .catch(
            err => {

        });
}

const user = userId => {
    return User.findById(userId)
        .then(user => {
            return {
                ...user._doc,
                _id: user.id,
                createdEvents: events.bind(this, user._doc.createdEvents)
            }
        })
        .catch(err => {
            throw err
        });
}

module.exports = {
    events: () => {
        return Event.find().then(events => {
            return events.map(event => {
                return {
                    ...event._doc, // exclude the metadata from our query
                    _id: event.id, //convert the id to string so graphQL can understand id by using the native method
                    creator: user.bind(this, event._doc.creator)
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
                id: result._doc._id.toString(), //basically how to convert id to a type gql understands 
                //without using mongoose .id method
                creator: user.bind(this, result._doc.creator)
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
}