const mongoose = require ('mongoose');
const cities = require ('./cities');
const {places, descriptors} = require ('./seedHelpers');
const Campground = require ('../models/campground');

mongoose.connect ('mongodb://127.0.0.1:27017/yelp-camp')

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log('Database connected')
});

const sample = (array) => array[Math.floor(Math.random()*array.length)];

const seedDB = async () => {
    await Campground.deleteMany ({});
    for (let i=0; i< 50; i++){
        const random1000 = Math.floor(Math.random()*1000);
        const price = Math.floor(Math.random()*40)+20;
        const camp = new Campground ({
            author: '652530f15deaf519df4557a9',
            geometry: { 
              type: 'Point', 
              coordinates: [ cities[random1000].longitude, cities[random1000].latitude ] },
            title: `${sample(descriptors)} ${sample(places)}`,
            description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deleniti quae, doloribus placeat aperiam animi nemo quibusdam aspernatur id",
            images:  [
                {
                  url: 'https://res.cloudinary.com/dwt1oilzu/image/upload/v1697375832/YelpCamp/htfsrciz7kkq3azpqkra.jpg',
                  filename: 'YelpCamp/htfsrciz7kkq3azpqkra'
    
                },
                {
                  url: 'https://res.cloudinary.com/dwt1oilzu/image/upload/v1697375832/YelpCamp/dnwz2sn2bujwha2afkgi.jpg',
                  filename: 'YelpCamp/dnwz2sn2bujwha2afkgi'
                },
                {
                  url: 'https://res.cloudinary.com/dwt1oilzu/image/upload/v1697375848/YelpCamp/znsf1gka53ag3om4rmv8.jpg',
                  filename: 'YelpCamp/znsf1gka53ag3om4rmv8'
                }
              ],
            price, 
            city: cities[random1000].city,
            state: cities[random1000].state
    })
    await camp.save();
}}

seedDB().then(() => {
    mongoose.connection.close()
});

