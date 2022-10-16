const mongoose= require('mongoose');
const Campground= require('../models/campground');
const cities= require('./cities');
const {descriptors, places}= require('./seedHelpers');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/yelp-camp');
}

const sample= array => array[Math.floor(Math.random() * array.length)];

const seedDB = async()=>{
      await Campground.deleteMany({});
     
      for(let i=0; i<50; i++){
        const rand= Math.floor(Math.random() * 1000);
        const randPrice= Math.floor(Math.random() * 20) + 10;
           const Camp= new Campground({
            author: '62c4916c13ef5c78ac2e06c8',
            location: `${cities[rand].city}, ${cities[rand].state}`,
            title: `${sample(descriptors)}, ${sample(places)}`,
            images: [
              {
                url: 'https://res.cloudinary.com/dur5pirza/image/upload/v1659362914/YelpCamp/awkqogo7vynypmevw8jr.avif', 
                filename: 'YelpCamp/awkqogo7vynypmevw8jr'
              },
              {
                url: 'https://res.cloudinary.com/dur5pirza/image/upload/v1659362914/YelpCamp/hmhcsmadnecvd8msvbww.avif', 
                filename: 'YelpCamp/hmhcsmadnecvd8msvbww'
              }
            ],
            description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dolore laboriosam ullam possimus provident impedit doloribus minus architecto. Eum temporibus nisi quam? Impedit illo consectetur vero perspiciatis veritatis voluptates obcaecati magni.!',
            price: randPrice
        });
           await Camp.save();
      }
}

seedDB()
.then(()=>{
    mongoose.connection.close();
})


