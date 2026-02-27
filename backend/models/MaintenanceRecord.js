const mongoose = require('mongoose');

const maintenanceRecordSchema = new mongoose.Schema(
    {
        carId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Car',
            required: true,
        },
        showroomId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Showroom',
        },
        date: {
            type: Date,
            required: true,
            default: Date.now,
        },
        reason: {
            type: String,
            required: true,
        },
        cost: {
            type: Number,
            required: true,
            default: 0,
        },
        description: {
            type: String,
            default: '',
        },
        performedBy: {
            type: String,
            default: '',
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('MaintenanceRecord', maintenanceRecordSchema);
