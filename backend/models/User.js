const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            minlength: 3,
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
        },
        role: {
            type: String,
            enum: ['user', 'admin', 'showroom-admin'],
            default: 'user',
        },
        showroomId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Showroom',
            default: null, // only used for showroom-admin
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        phone: {
            type: String,
            default: '',
        },
        address: {
            type: String,
            default: '',
        },
        drivingLicense: {
            type: String, // URL/Path to file
            default: '',
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        credits: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

// Hash password before save
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Password comparison method
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
