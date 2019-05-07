const Booking = require('../../models/booking');
const Event = require('../../models/event');
const {transformBookings, transformEvent} = require('./merge');

module.exports = {
    bookings: async (args,req) => {
        if (!req.isAuth) {
            throw new Error('Unathenticated!');
        }
        try {
            const bookings = await Booking.find();
            return bookings.map(booking => {
                return transformBookings(booking);
            });
        } catch (err) {
            throw err;
        }
    },

    bookEvent: async (args,req) => {
        if (!req.isAuth) {
            throw new Error('Unathenticated!');
        }
        const fetchedEvent = await Event.findOne({_id: args.eventId });
        const booking = new Booking({
            user: '5ca3a46d5a17062d2819846e',
            event: fetchedEvent
        });
        const result = await booking.save();
        return transformBookings(result);
    },
    cancelBooking: async (args,req) => {
        if (!req.isAuth) {
            throw new Error('Unathenticated!');
        }
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