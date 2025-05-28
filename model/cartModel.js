const mongoose = require('mongoose');


const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [
       {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        qty: {
            type: Number,
            min: 1,
            required: true
        }
       }
    ],
}, { timestamps: true})

module.exports = mongoose.model('Cart', cartSchema);