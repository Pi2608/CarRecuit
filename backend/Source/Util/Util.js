const arduino = require('./ArduinoConfig')

const currentTime = async()=>{
    var date = new Date();

    date.setHours(date.getHours()+7);

    var dateFormat = date.toISOString().slice(0,19).replace('T',' ');
    
    return dateFormat;
}

const getPositionCar = async()=>{
    await arduino.waitForData();
    const output = arduino.getOutputString();
    return output
}

module.exports={
    currentTime,
    getPositionCar
}