const mongoose = require('mongoose');
const Car = require('./models/Car');
const Showroom = require('./models/Showroom');

const CAR_MODELS = [
    'Mercedes-Benz S-Class', 'BMW M8 Competition', 'Audi RS7', 'Porsche 911 GT3',
    'Lamborghini Huracan', 'Ferrari F8 Tributo', 'McLaren 720S', 'Aston Martin DB11',
    'Bentley Continental GT', 'Rolls-Royce Ghost', 'Range Rover Autobiography',
    'Lexus LC 500', 'Tesla Model S Plaid', 'Maserati GranTurismo', 'Jaguar F-Type',
    'Chevrolet Corvette Z06', 'Nissan GT-R', 'Audi R8 V10', 'Mercedes-AMG GT', 'Porsche Taycan',
    // VANS
    'Mercedes-Benz V-Class', 'Volkswagen Transporter', 'Toyota Alphard', 'Ford Transit Custom',
    // HATCHBACKS
    'Volkswagen Golf GTI', 'Mercedes-AMG A45', 'Audi RS3 Sportback', 'Honda Civic Type R',
    // MORE NEW CARS
    'Toyota Vellfire Executive', 'Isuzu D-Max V-Cross', 'Kia Carnival Limousine',
    'Hyundai i30 N-Line', 'Ford Focus RS', 'Mini Cooper JCW'
];

const CAR_IMAGES = [
    'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=800', // Porsche
    'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1614200187524-dc4b892acf16?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1621135802920-133df287f89c?auto=format&fit=crop&q=80&w=800', // Bentley
    'https://images.unsplash.com/photo-1541443131876-44b03de101c5?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1580274455191-1c62238fa333?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=800',
    // VANS IMAGES
    'http://localhost:5000/public/images/cars/vclass.png', // V-Class
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1200', // Transporter
    'http://localhost:5000/public/images/cars/alphard.png', // Toyota Alphard
    'https://images.unsplash.com/photo-1616422285623-13ff0162193c?auto=format&fit=crop&q=80&w=1200', // Ford Transit Custom
    // HATCHBACKS IMAGES
    'http://localhost:5000/public/images/cars/golf_gti.png', // Golf GTI
    'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=1200', // Mercedes A45
    'https://images.unsplash.com/photo-1621135802920-133df287f89c?auto=format&fit=crop&q=80&w=1200', // Audi RS3
    'https://images.unsplash.com/photo-1627916607164-7b20241db935?auto=format&fit=crop&q=80&w=1200'  // Civic Type R
];

const CATEGORIES = ['Luxury', 'Sports', 'Sedan', 'SUV', 'Van', 'Hatchback'];
const FUEL_TYPES = ['Petrol', 'Diesel', 'Electric', 'Hybrid'];
const TRANSMISSIONS = ['Automatic', 'Manual'];

const SHOWROOMS = [
    {
        name: 'DriveX Premium Bangalore',
        location: 'Indiranagar, Bangalore',
        description: 'Our flagship showroom featuring the finest luxury collection in Karnataka.',
        phone: '+91 98765 43210',
        email: 'bangalore@drivex.com',
        image: 'https://images.unsplash.com/photo-1562620644-85654f55304a?q=80&w=800&auto=format&fit=crop'
    },
    {
        name: 'DriveX Mumbai Hub',
        location: 'Worli, Mumbai',
        description: 'Experience speed and elegance in the heart of Mumbai.',
        phone: '+91 91234 56789',
        email: 'mumbai@drivex.com',
        image: 'https://images.unsplash.com/photo-1503376713210-6c9ab85c94fa?q=80&w=800&auto=format&fit=crop'
    },
    {
        name: 'DriveX Delhi Elite',
        location: 'Chanakyapuri, New Delhi',
        description: 'State-of-the-art facility serving the capital with premium mobility.',
        phone: '+91 99887 76655',
        email: 'delhi@drivex.com',
        image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=800&auto=format&fit=crop'
    }
];

const seedCars = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect('mongodb+srv://bhageeratha22bce20355:bhageerath@cluster0.d7aeb.mongodb.net/cardata', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB successfully!');

        console.log('Clearing existing data...');
        await Car.deleteMany({});
        await Showroom.deleteMany({});

        console.log('Seeding showrooms...');
        const createdShowrooms = await Showroom.insertMany(SHOWROOMS);
        console.log('Showrooms seeded!');

        const newCars = CAR_MODELS.map((model, i) => {
            let category = CATEGORIES[Math.floor(Math.random() * (CATEGORIES.length - 2))]; // Random default

            // Assign categories based on index/model
            if (model.includes('Class') || model.includes('V-Class') || model.includes('Transporter') || model.includes('Alphard') || model.includes('Transit')) {
                category = model.includes('V-') || model.includes('Transporter') || model.includes('Alphard') || model.includes('Transit') ? 'Van' : 'Luxury';
            } else if (model.includes('GTI') || model.includes('A45') || model.includes('RS3') || model.includes('Type R')) {
                category = 'Hatchback';
            } else if (model.includes('RS7') || model.includes('GT3') || model.includes('Huracan') || model.includes('F8') || model.includes('720S') || model.includes('GT-R') || model.includes('R8') || model.includes('GT') || model.includes('Corvette')) {
                category = 'Sports';
            }

            return {
                name: model,
                image: CAR_IMAGES[i % CAR_IMAGES.length],
                rentPerHour: category === 'Van' ? 1500 + Math.floor(Math.random() * 1000) : (category === 'Hatchback' ? 800 + Math.floor(Math.random() * 500) : 3000 + Math.floor(Math.random() * 3000)),
                capacity: category === 'Van' ? 7 + Math.floor(Math.random() * 2) : (category === 'Hatchback' ? 4 : 2 + Math.floor(Math.random() * 3)),
                fuelType: FUEL_TYPES[Math.floor(Math.random() * FUEL_TYPES.length)],
                transmission: TRANSMISSIONS[Math.floor(Math.random() * TRANSMISSIONS.length)],
                category: category,
                showroomId: createdShowrooms[i % createdShowrooms.length]._id,
                bookedTimeSlots: []
            };
        });

        console.log(`Seeding ${newCars.length} new cars linked to showrooms...`);
        await Car.insertMany(newCars);
        console.log('Database seeded successfully!');
        process.exit();
    } catch (err) {
        console.error('Failed to seed db', err);
        process.exit(1);
    }
};

seedCars();
