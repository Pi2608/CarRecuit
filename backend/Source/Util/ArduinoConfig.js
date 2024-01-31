const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');

let outputString;

const port = new SerialPort({
    path: 'COM3',
    baudRate: 9600
});

const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

const waitForData = () => {
    return new Promise((resolve) => {
        parser.once('data', (data) => {
            outputString = data;
            resolve(data);
        });
    });
};

module.exports = {
    waitForData,
    getOutputString: () => outputString
};