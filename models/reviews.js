const mongoose= require('mongoose');

const {Schema}= mongoose;

const reviewSchema= new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    rating: {
        type: Number
    },
    body: {
        type: [String, 'You must have review'], 
        required: true
    }
})

module.exports= mongoose.model('Review', reviewSchema);