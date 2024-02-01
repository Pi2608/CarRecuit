const { getPositionCar } = require('./Source/Util/Util');

async function testGetPositionCar() {
    try {
        const position = await getPositionCar();
        console.log('Position:', position);
    } catch (error) {
        console.error('Error:', error);
    }
}

testGetPositionCar();