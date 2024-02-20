const { decodeImage } = require('./Source/Util/Util');
const encode = require('node-base64-image').encode;

async function testDecodeImage() {
    try {
        const url = 'https://e1.pxfuel.com/desktop-wallpaper/639/821/desktop-wallpaper-2560x1440-anime-city-1440p-resolution-anime-city.jpg';
        const options = {
            string: true,
            headers: {
                "User-Agent": "my-app"
            }
        };

        const image = await encode(url, options);

        const decodedPath = await decodeImage(image, 'car1');
        console.log('Decoded image path:', decodedPath);

    } catch (error) {
        console.error('Error in testDecodeImage:', error);
    }
}

testDecodeImage();
