const bcrypt = require('bcryptjs');
const Event = require('../../models/event');
const User = require('../../models/user');

const events = async eventIds => {
    try {
        const events = await Event.find({ _id: { $in: eventIds } })

        events.map(event => {
            return { 
                ...event._doc, 
                _id: event.id, 
                creator: user.bind(this, event.creator) 
            }
        });
        return events.map(event => event);    
    } catch(err) {
        throw err;
    }
}

const user = async userId => {
    try {
        const user = await User.findById(userId)
        
        return {
            ...user._doc,
            _id: user.id,
            createdEvents: events.bind(this, user._doc.createdEvents)
        }
    } catch(err) {
        throw err;
    }
}

module.exports = {
    events: async () => {
        try {
            const events = await Event.find()

            return events.map(event => {
                return {
                    ...event._doc, // exclude the metadata from our query
                    _id: event.id, //convert the id to string so graphQL can understand id by using the native method
                    creator: user.bind(this, event._doc.creator)
                };
            });
        } catch(err) {
            throw err;
        }
        
    },
    createEvent: async args => {
        //generate evt object
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price, //hack to make sure whatever we get here should be converted to a number
            date: new Date(args.eventInput.date),
            creator: '5ca3a46d5a17062d2819846e' //hardcode this atm, will make logic later
        });
        let createdEvent;
        try {
            const result = await event.save()
            //save the createdEvent here so no bugs below
            createdEvent = {
                ...result._doc, //exclude the metadata from our query
                id: result._doc._id.toString(), //basically how to convert id to a type gql understands 
                //without using mongoose .id method
                creator: user.bind(this, result._doc.creator)
            };
            const creator = await User.findById('5ca3a46d5a17062d2819846e') // find user(hardcoded atm)

            if(!creator) { //check if user exists
                throw new Error('User not found!') 
            }
            creator.createdEvents.push(event) // add created event to the user who created it
            await creator.save();

            return createdEvent;
        } catch(err) {
            console.log(err);
            throw err
        }
    },
    createUser: async args => {
        try {
            const existingUser = await User.findOne({email:args.userInput.email})
            if(existingUser) {
                throw new Error('User exists already!')
            }
            const hashedPassword = await bcrypt.hash(args.userInput.password, 12)
            const user = new User({
                email: args.userInput.email,
                password: hashedPassword
            });
            const result = await user.save() //save to the db
            return {
                ...result._doc, 
                _id: result.id,
                password: null //so it can never be retrieved, this is not the password that gets saved to the db
            }
        } catch(err) {
            throw err;
        }
    }
}