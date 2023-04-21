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

    const image = 'https://pbs.twimg.com/profile_images/1623905047204577282/naEiBKDQ_400x400.jpg';

    const result = await cloudinary.uploader.upload(image, {folder: 'blog-reflexion/logos'});
    console.log(result)

    /**
    {
        asset_id: '15571c2fbe2e9bc402b7d8fb2f31eeaa',
        public_id: 'blog-reflexion/logos/nloo0aq1hbpl9fhlnpx0',
        version: 1682081649,
        version_id: '34de0099d32ab8347fe47ad945aeb236',
        signature: '5f954b535b3cf7780a7df2a12cb79b4646057a14',
        width: 400,
        height: 400,
        format: 'jpg',
        resource_type: 'image',
        created_at: '2023-04-21T12:54:09Z',
        tags: [],
        bytes: 26186,
        type: 'upload',
        etag: '3a89d8d3f01acae635172e4d10d54bc1',
        placeholder: false,
        url: 'http://res.cloudinary.com/imagesgmzi/image/upload/v1682081649/blog-reflexion/logos/nloo0aq1hbpl9fhlnpx0.jpg',
        secure_url: 'https://res.cloudinary.com/imagesgmzi/image/upload/v1682081649/blog-reflexion/logos/nloo0aq1hbpl9fhlnpx0.jpg',
        folder: 'blog-reflexion/logos',
        original_filename: 'naEiBKDQ_400x400',
        api_key: '926558468899168'
    }
     **/
    
    res.status(200).json({ name: 'John Doe' })

}

