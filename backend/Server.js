const { decodeImage } = require('./Source/Util/Util');
const encode = require('node-base64-image').encode;

async function testDecodeImage() {
    try {
        const url = 'https://i.pinimg.com/564x/85/e1/de/85e1de83cad075f523ed250de5df9220.jpg';
        const options = {
            string: true,
            headers: {
                "User-Agent": "my-app"
            }
        };

        const image = await encode(url, options);

        const decodedPath = await decodeImage(image, 'Test');
        console.log('Decoded image path:', decodedPath);

    } catch (error) {
        console.error('Error in testDecodeImage:', error);
    }
}

testDecodeImage();
