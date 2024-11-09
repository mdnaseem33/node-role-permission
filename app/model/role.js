const mongoose = require('mongoose');

// Define the role schema
const roleSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    permissions: [{type: String }]
}, { timestamps: true });

// Create and export the role model
module.exports = mongoose.model('Role', roleSchema);
