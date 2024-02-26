const firebase = require('firebase')
const config = require('./firebaseConfig')
const imageToBase64 = require('image-to-base64')
const decode = require ('node-base64-image').decode
const path = require('path');

const currentTime = async()=>{
    var date = new Date();

    date.setHours(date.getHours()+7);

    var dateFormat = date.toISOString().slice(0,19).replace('T',' ');
    
    return dateFormat;
}
const calculatePeriod= async(startDate, endDate)=> {
    const startDateTime = new Date(startDate);
    const endDateTime = new Date(endDate);

    // Tính toán số milliseconds giữa hai thời điểm
    const timeDifference = Math.abs(endDateTime - startDateTime);

    // Chuyển đổi milliseconds thành ngày, giờ, phút và giây
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

    return days+':'+hours+':'+minutes+':'+seconds;
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
const encodeImage = async(path)=>{
    try {
        const response = await imageToBase64(path);
        return response;
    } catch (error) {
        console.log(error);
        throw error;
    }
}
const decodeImage = async (base64Code, name) => {
    const projectPath = path.resolve();
    const savePath = projectPath + '/Source/photos/' + name
    try {
        await decode(base64Code, { fname: savePath, ext: 'jpg' });
        return 'http://localhost:4000/img/'+name+'.jpg'
    } catch (error) {
        console.error('Error decoding image:', error);
    }
};

const generateRandomString = async(length)=> {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

const compareDates= async(startDate, endDate) =>{
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);
    
    if (startDateObj > endDateObj) {
        return false;
    } else {
        return true;
    }
}

module.exports={
    currentTime,
    getPositionCar,
    encodeImage,
    decodeImage,
    generateRandomString,
    calculatePeriod,
    compareDates
}