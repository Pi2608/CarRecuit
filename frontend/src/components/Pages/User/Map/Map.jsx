import React, { useState, useEffect } from 'react';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';
import Header from "../../../Items/Header/Header";
import axios from 'axios';
import "./Map.css";

function App({ google }) {
    const [cars, setCars] = useState([]);
    const [locations, setLocations] = useState([]);

    useEffect(() => {
        window.scrollTo(0, 0);
        getAllCar();
    }, []);

    async function getAllCar() {
        try {
            const response = await axios.get('http://localhost:4000/car/')
            const carListData = response.data;
            // Create an array of promises for each image loading
            const imagePromises = carListData.map((car) => {
                return new Promise((resolve) => {
                    const img = new Image();
                    img.src = car.imgUrl;
                    img.onload = () => resolve({ ...car, loaded: true });
                });
            });

            // Wait for all images to be loaded before updating state
            const loadedCarList = await Promise.all(imagePromises);
            setCars(loadedCarList)
            console.log(cars)
        } catch (error) {
            console.log(error)
        }
    }

    async function getCarLocation(cars) {
        try {
            const newLocations = [];
            for (const car of cars) {
                const response = await axios.get(`http://localhost:4000/location/car?carId=${car.id}&typeLocationId=1`)
                const location = response.data
                location.link = `http://localhost:5173/car/cardetail/${car.id}`
                location.img = car.imgUrl
                newLocations.push(location)
            }
            setLocations(newLocations)
        } catch (error) {
            console.log(error);
        }
    }

    const handleMarkerClick = (link) => {
        window.location.href = link; // Redirect to the provided link
    };

    useEffect(() => {
        getCarLocation(cars)
    }, [cars])

    return (
        <div id="Map">
            <Header />
            <div className="Map-container">
                <Map
                    google={google}
                    zoom={14}
                    initialCenter={{ lat: 10.818022561717207, lng: 106.62924888382491 }}
                >
                    {locations.map(location => (
                        <Marker
                            key={location.id}
                            position={{ lat: location.latitude, lng: location.longitude}}
                            icon={{
                                url: location.img, // Set the imgUrl as the icon's URL
                                scaledSize: new google.maps.Size(50, 50), // Adjust the size of the icon
                                origin: new google.maps.Point(0, 0), // Set origin
                                anchor: new google.maps.Point(25, 25), // Set anchor
                            }}
                            onClick={() => handleMarkerClick(location.link)} // Redirect on marker click
                            className="marker-icon"
                        ></Marker>
                    ))}
                </Map>
            </div>
        </div>
    )
}

export default GoogleApiWrapper({
    apiKey: 'AIzaSyCJiep3pi_EF0gPf7DoPvi2GAKztfngD68'
})(App);
