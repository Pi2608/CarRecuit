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
            setCars(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    async function getCarLocation(cars) {
        try {
            const newLocations = [];
            for (const car of cars) {
                const response = await axios.get(`http://localhost:4000/location/car/?carId=${car.id}&typeLocationId=1`)
                newLocations.push(response.data)
            }
            setLocations(newLocations)
        } catch (error) {
            console.log(error);
        }
    }

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
                            position={{ lat: location.latitude, lng: location.longitude }}
                        />
                    ))}
                </Map>
            </div>
        </div>
    )
}

export default GoogleApiWrapper({
    apiKey: 'AIzaSyCJiep3pi_EF0gPf7DoPvi2GAKztfngD68'
})(App);