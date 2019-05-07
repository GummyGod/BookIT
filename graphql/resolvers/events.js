const Event = require('../../models/event');
const User = require('../../models/user');

const { transformEvent } = require('./merge');

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
    createEvent: async (args,req) => {
        if (!req.isAuth) {
            throw new Error('Unathenticated!');
        }
        //generate evt object
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price, //hack to make sure whatever we get here should be converted to a number
            date: new Date(args.eventInput.date),
            creator: req.userId
        });
        let createdEvent;
        try {
            const result = await event.save()
            //save the createdEvent here so no bugs below
            createdEvent = transformEvent(result);
            const creator = await User.findById(req.userId)

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
}