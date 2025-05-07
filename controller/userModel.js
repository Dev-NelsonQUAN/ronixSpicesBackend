const { Schema } = require("mongoose");

const userSchema = new Schema({
    fullname: {},
    email: {},
    phoneNumber: {},
  },
  { timestamps: true }
);

module.exports = model('user', userSchema)