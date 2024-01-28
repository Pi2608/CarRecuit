var userRouter = require('./Source/Routers/UserRouter')

const express = require ('express');
const app = express()

app.use('/User', userRouter)

app.listen (3000, ()=>{
    console.log('Server started on port')
})

const filterCars = async (Cars, carTypeId, minPrice, maxPrice, seats, typeOfFuels) => {
    try {
        // Apply filters based on the provided criteria
        const filteredCars = Cars.filter(car => {
            if (carTypeId && car.carTypeId !== carTypeId) {
                return false;
            }

            if (minPrice && car.price < minPrice) {
                return false;
            }

            if (maxPrice && car.price > maxPrice) {
                return false;
            }

            if (seats && car.seats !== seats) {
                return false;
            }

            if (typeOfFuels && car.typeOfFuels !== typeOfFuels) {
                return false;
            }

            // If all conditions pass, include the car in the filtered result
            return true;
        });

        // Do something with the filteredCars array, e.g., return it or perform further operations.

        console.log('Filtered Cars:', filteredCars);

    } catch (err) {
        console.error('Error:', err);
    }
};

// Example usage:
const carsList = [
    { carId: 1, carTypeId: 1, price: 15000, seats: 5, typeOfFuels: 'Petrol' },
    { carId: 2, carTypeId: 2, price: 20000, seats: 7, typeOfFuels: 'Diesel' },
    // ... other cars
];

filterCars(carsList, 1, 10000, 30000, null, 'Petrol');