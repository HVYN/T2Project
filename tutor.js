var mongoose = require('mongoose');
var TutorSchema = new mongoose.schema({
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },

    name: {
        type: String,
        required: true,
        trim: true,
    },

    subject: {
        type: String,
        required: true,
        trim: true,
    },

    password: {
        type: String,
        required: true
    }

});

var tutor = mongoose.model('tutor', TutorSchema);
module.exports = tutor;


