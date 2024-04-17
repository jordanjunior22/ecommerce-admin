import { v2 as cloudinary } from 'cloudinary';
const fs = require('fs');
const path = require('path');

cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.CLOUD_API_KEY, 
  api_secret: process.env.CLOUD_API_SECRET,
});

export async function POST(Request) {
  const formData = await Request.formData();
  const files = formData.getAll('files');
  const uploadPromises = [];
  const links = []; // Array to store uploaded URLs

  for (const file of files) {
    const fileName = file.name;
    const timestamp = Date.now();

    const byteArrayBuffer = fs.readFileSync(fileName);

    const uploadPromise = new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'ecommerce',
          public_id: `image_${timestamp}`, // Optional: Provide a custom public_id
        },
        (error, result) => {
          if (error) {
            console.error(error);
            reject('Error uploading image to Cloudinary');
          } else {
            links.push(result.secure_url); // Push the URL to the array
            resolve(result.secure_url);
          }
        }
      ).end(byteArrayBuffer);
    });

    uploadPromises.push(uploadPromise);
  }

  try {
    await Promise.all(uploadPromises);
    return Response.json({ data: { links } });
  } catch (error) {
    console.error(error);
    return Response.json({ error });
  }
}
