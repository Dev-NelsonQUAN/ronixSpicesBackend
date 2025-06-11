const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({
    productName : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    image : {
        type: [String], 
        required: true,
        default: [],
    },
    price : {
        type: Number,
        required: true
    }, 
    category: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Product', productSchema)