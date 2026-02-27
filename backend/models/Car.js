const mongoose = require('mongoose');

const carSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        image: {
            type: String,
            required: true,
        },
        images: {
            type: [String],
            default: [],
        },
        brand: {
            type: String,
            default: '',
        },
        mileage: {
            type: String,
            default: '',
        },
        rentPerHour: {
            type: Number,
            required: true,
        },
        capacity: {
            type: Number,
            required: true,
        },
        fuelType: {
            type: String,
            enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG'],
            required: true,
        },
        transmission: {
            type: String,
            enum: ['Automatic', 'Manual'],
            default: 'Manual',
        },
        category: {
            type: String,
            enum: ['Sedan', 'SUV', 'Hatchback', 'Luxury', 'Sports', 'Van'],
            default: 'Sedan',
        },
        variant: {
            type: String,
            default: '',
        },
        year: {
            type: Number,
        },
        registrationNumber: {
            type: String,
            default: '',
        },
        color: {
            type: String,
            default: '',
        },
        vin: {
            type: String,
            default: '',
        },
        pricePerDay: {
            type: Number,
            default: 0,
        },
        pricePerWeek: {
            type: Number,
            default: 0,
        },
        pricePerMonth: {
            type: Number,
            default: 0,
        },
        documents: [
            {
                name: { type: String },
                url: { type: String },
            }
        ],
        showroomId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Showroom',
            default: null, // null means it's a global/admin car
        },
        bookedTimeSlots: [
            {
                from: { type: String },
                to: { type: String },
            },
        ],
        status: {
            type: String,
            enum: ['Available', 'Booked', 'Rented', 'Maintenance', 'Disabled', 'Out of Service'],
            default: 'Available',
        },
        maintenanceStatus: {
            type: String,
            enum: ['Healthy', 'Servicing', 'Repair Required'],
            default: 'Healthy',
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Car', carSchema);
