// http://localhost:3000/api/images/delete

import { v2 as cloudinary} from 'cloudinary'

const CLOUDINARY_CLOUD_NAME= process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY= process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET= process.env.CLOUDINARY_API_SECRET;

cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET
});

export default async function handler(req, res) {

    // TO DELETE, GRAB public_id FROM IMAGE OBJECT

    const image = 'blog-reflexion/logos/nloo0aq1hbpl9fhlnpx0';

    const result = await cloudinary.uploader.destroy(image);

    console.log(result)
    
    res.status(200).json({ name: 'John Doe' })

}

