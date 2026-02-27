const mongoose = require('mongoose');

const showroomSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        location: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            default: '',
        },
        phone: {
            type: String,
            default: '',
        },
        email: {
            type: String,
            default: '',
        },
        image: {
            type: String,
            default: '',
        },
        logo: {
            type: String,
            default: '',
        },
        address: {
            type: String,
            default: '',
        },
        city: {
            type: String,
            default: '',
        },
        state: {
            type: String,
            default: '',
        },
        pincode: {
            type: String,
            default: '',
        },
        coordinates: {
            lat: { type: Number },
            lng: { type: Number },
        },
        businessHours: {
            open: { type: String, default: '09:00' },
            close: { type: String, default: '20:00' },
        },
        documents: [
            {
                name: { type: String },
                url: { type: String },
                status: { type: String, enum: ['Pending', 'Verified', 'Rejected'], default: 'Pending' }
            }
        ],
        adminId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null, // The showroom-admin assigned to this showroom
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Showroom', showroomSchema);
