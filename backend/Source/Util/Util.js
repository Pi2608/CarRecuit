const firebase = require('firebase')
const imageToBase64 = require('image-to-base64')
const decode = require ('node-base64-image').decode
const path = require('path');
const fs = require('fs').promises

const currentTime = async()=>{
    var date = new Date();

    date.setHours(date.getHours()+7);

    return date;
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
        await decode(base64Code, { fname: savePath, ext: 'png' });
        return 'http://localhost:4000/img/'+name+'.png'
    } catch (error) {
        console.error('Error decoding image:', error);
    }
};

const deleteAllImages = async() =>{
    const projectPath = path.resolve();
    const photos = projectPath + '/Source/photos/'
    const files = await fs.readdir(photos);
        for (const file of files) {
            if (file !== 'note.txt') {
                const filePath = path.join(photos, file);
                await fs.unlink(filePath);
            }
        }
}

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

const inputDate = async(date)=>{
    console.log(date)
    const newDate = new Date(date)
    newDate.setHours(newDate.getHours()+7)
    return newDate
}

const checkOverlap = async(dateStart1, dateEnd1, dateStart2, dateEnd2)=>{
    const start1 = new Date(dateStart1);
    const end1 = new Date(dateEnd1);
    const start2 = new Date(dateStart2);
    const end2 = new Date(dateEnd2);
    console.log(start1, end1, start2, end2)
    // Check if any of the start dates are after the other's end date
    if (start1 > end2 || start2 > end1) {
        return false; // No overlap
    }

    return true; // Overlap
}


module.exports={
    currentTime,
    getPositionCar,
    encodeImage,
    decodeImage,
    generateRandomString,
    calculatePeriod,
    compareDates,
    deleteAllImages,
    inputDate,
    checkOverlap
}