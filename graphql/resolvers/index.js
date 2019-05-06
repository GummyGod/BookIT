const bcrypt = require('bcryptjs');
const Event = require('../../models/event');
const User = require('../../models/user');
const Booking = require('../../models/booking');

const transformEvent = event => {
    return { 
        ...event._doc, 
        _id: event.id, 
        creator: user.bind(this, event.creator) 
    }
}

const events = async eventIds => {
    try {
        const events = await Event.find({ _id: { $in: eventIds } })

        return events.map(event => {
            return transformEvent(event);
        });

    } catch(err) {
        throw err;
    }
}

const singleEvent = async eventId => {
    try {
        const event = await Event.findById(eventId);
        return transformEvent(event);
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
                return transformEvent(event);
            });
        } catch(err) {
            throw err;
        }
        
    },
    bookings: async () => {
        try {
            const bookings = await Booking.find();
            return bookings.map(booking => {
                return { 
                    ...booking._doc, 
                    _id: booking.id, 
                    user: user.bind(this, booking._doc.user),
                    event: singleEvent.bind(this, booking._doc.event),
                    createdAt: new Date(booking._doc.createdAt).toISOString(),
                    updatedAt: new Date(booking._doc.updatedAt).toISOString(),
                }
            });
        } catch (err) {
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
            createdEvent = transformEvent(result);
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
    },
    bookEvent: async args => {
        const fetchedEvent = await Event.findOne({_id: args.eventId });
        const booking = new Booking({
            user: '5ca3a46d5a17062d2819846e',
            event: fetchedEvent
        });
        const result = await booking.save();
        return { 
            ...result._doc,
            _id: result.id,
            user: user.bind(this, booking._doc.user),
            event: singleEvent.bind(this, booking._doc.event),
            createdAt: new Date(result._doc.createdAt).toISOString(),
            updatedAt: new Date(result._doc.updatedAt).toISOString(),
        }
    },
    cancelBooking: async args => {
        try {
            const booking = await Booking.findById(args.bookingId).populate('event');
            const event = transformEvent(booking.event);
            await Booking.deleteOne({_id: args.bookingId});
            return event;
            
        } catch(err) {
            throw err;
        }
    },
}