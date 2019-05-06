const { dateToString } = require('../../helpers/date')
const Booking = require('../../models/booking');
const { singleEvent, user } = require('./merge');

const transformBookings = booking => {
    return {
        ...booking._doc, 
        _id: booking.id, 
        user: user.bind(this, booking._doc.user),
        event: singleEvent.bind(this, booking._doc.event),
        createdAt: dateToString(booking._doc.createdAt),
        updatedAt: dateToString(booking._doc.updatedAt),
    }
};

module.exports = {
    bookings: async () => {
        try {
            const bookings = await Booking.find();
            return bookings.map(booking => {
                return transformBookings(booking);
            });
        } catch (err) {
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
        return transformBookings(result);
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