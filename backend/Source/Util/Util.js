const firebase = require('firebase')
const config = require('./firebaseConfig')

const currentTime = async()=>{
    var date = new Date();

    date.setHours(date.getHours()+7);

    var dateFormat = date.toISOString().slice(0,19).replace('T',' ');
    
    return dateFormat;
}
const getPositionCar = async () => {
    firebase.initializeApp(config);
    const rootRef = firebase.database().ref();
    const latRef = rootRef.child('lat');
    const lngRef = rootRef.child('lng');

    try {
        const latSnapshot = await latRef.once('value');
        const lngSnapshot = await lngRef.once('value');

        const lat = latSnapshot.val() / 1000000;
        const lng = lngSnapshot.val() / 1000000;

        return {
            latitude: lat,
            longitude: lng
        };
    } catch (error) {
        console.error('Error retrieving data:', error);
        throw error;
    }
}


module.exports={
    currentTime,
    getPositionCar
}