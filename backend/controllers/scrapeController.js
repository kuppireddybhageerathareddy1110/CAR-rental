const axios = require('axios');
const cheerio = require('cheerio');
const mongoose = require('mongoose');
const Car = require('../models/Car');

exports.scrapeCars = async (req, res) => {
    try {
        const brands = ['BMW', 'Mercedes-Benz', 'Audi', 'Porsche', 'Lexus', 'Rolls-Royce', 'Bentley', 'Aston_Martin', 'Ferrari', 'Lamborghini', 'Tesla'];
        let scrapedCount = 0;
        const newCars = [];

        const categories = ['Luxury', 'Sports', 'Sedan', 'SUV'];
        const transmissions = ['Automatic', 'Manual'];
        const fuelTypes = ['Petrol', 'Diesel', 'Electric', 'Hybrid'];

        const headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        };

        for (const brand of brands) {
            try {
                const response = await axios.get(`https://en.wikipedia.org/wiki/List_of_${brand}_vehicles`, { headers });
                const $ = cheerio.load(response.data);

                $('table.wikitable tr td a').each((i, el) => {
                    const title = $(el).text().trim();
                    if (title.length > 3 && !title.includes('List') && !title.includes('History') && newCars.length < 30) {
                        const fullName = `${brand.replace('_', ' ')} ${title}`;
                        if (!newCars.find(c => c.name === fullName)) {
                            newCars.push({
                                name: fullName,
                                image: `https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=800`,
                                capacity: Math.floor(Math.random() * (7 - 2 + 1) + 2),
                                fuelType: fuelTypes[Math.floor(Math.random() * fuelTypes.length)],
                                category: categories[Math.floor(Math.random() * categories.length)],
                                bookedTimeSlots: [],
                                rentPerHour: Math.floor(Math.random() * (5000 - 1500 + 1) + 1500),
                                transmission: transmissions[Math.floor(Math.random() * transmissions.length)],
                                brand: brand.replace('_', ' '),
                                mileage: Math.floor(Math.random() * (25 - 8 + 1) + 8),
                                maintenanceStatus: 'Healthy'
                            });
                        }
                    }
                });
            } catch (err) {
                console.log(`Scrape failed for ${brand}`);
            }
            if (newCars.length >= 20) break;
        }

        if (newCars.length === 0) {
            // Minimal fallback
            newCars.push({
                name: 'Mercedes-Benz S-Class',
                image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=800',
                capacity: 5, fuelType: 'Petrol', category: 'Luxury', bookedTimeSlots: [],
                rentPerHour: 3500, transmission: 'Automatic', brand: 'Mercedes-Benz', mileage: 10, maintenanceStatus: 'Healthy'
            });
        }

        if (mongoose.connection.readyState !== 1) {
            if (!global.demoCars) global.demoCars = [];
            global.demoCars.push(...newCars);
            return res.status(200).json({ message: `[Demo] Scraped ${newCars.length} cars.`, cars: newCars });
        }

        const inserted = await Car.insertMany(newCars);
        res.status(200).json({ message: `Successfully scraped ${inserted.length} cars.`, cars: inserted });

    } catch (error) {
        console.error("Scraping error:", error);
        res.status(500).json({ message: "Failed to scrape cars", error: error.message });
    }
};
