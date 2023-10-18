const mongoose = require ('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');

const CampgroundSchema = new Schema ({
    title: String, 
    price: Number,
    location: String,
    city: String,
    state: String,
    description: String,
    geometry: {
        type: {
          type: String,
          enum: ['Point'], 
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      },
    images: [{
        url: String,
        filename: String
    }],
    author:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId, 
            ref: 'Review'
        }
    ]
});

CampgroundSchema.post('findOneAndDelete', async function (doc) {
    if(doc){
        await Review.deleteMany({
            _id: {$in: doc.reviews}
        })
    }
})

module.exports = mongoose.model ('Campground', CampgroundSchema);