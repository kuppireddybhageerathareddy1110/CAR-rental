const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        car: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Car',
            required: true,
        },
        showroomId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Showroom',
            default: null,
        },
        bookedTimeSlots: {
            from: { type: String, required: true },
            to: { type: String, required: true },
        },
        totalHours: {
            type: Number,
            required: true,
        },
        totalAmount: {
            type: Number,
            required: true,
        },
        driverRequired: {
            type: Boolean,
            default: false,
        },
        transactionId: {
            type: String,
            default: '',
        },
        paymentStatus: {
            type: String,
            enum: ['pending', 'paid', 'failed'],
            default: 'pending',
        },
        bookingStatus: {
            type: String,
            enum: ['confirmed', 'cancelled', 'completed', 'in-progress', 'accepted', 'picked-up', 'returned'],
            default: 'confirmed',
        },
        creditsEarned: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);
