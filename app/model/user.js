const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define the user schema
const userSchema = new mongoose.Schema({
    name: { type: String, required: true},
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true }// Reference to roles
}, { timestamps: true });

// Hash the password before saving the user
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Method to compare provided password with stored hash
userSchema.methods.comparePassword = function(password) {
    return bcrypt.compare(password, this.password);
};

// Create and export the user model
module.exports = mongoose.model('User', userSchema);
