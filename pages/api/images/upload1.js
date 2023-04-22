import { v2 as cloudinary} from 'cloudinary'
import middleware from '../../../middleware/middleware';
import nextConnect from 'next-connect';
import HttpStatus from 'http-status-codes';


const BASE_URL = process.env.BASE_URL;
const SAVE_TOKEN = process.env.SAVE_TOKEN;
const MONGODB_COLLECTION = process.env.MONGODB_COLLECTION;
const REVALIDATE_TOKEN = process.env.REVALIDATE_TOKEN;

const CLOUDINARY_CLOUD_NAME= process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY= process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET= process.env.CLOUDINARY_API_SECRET;

cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET
});


const handler = nextConnect();

handler.use(middleware);

handler.post(async (req, res) => {
    try{
        const files = req.files;
        const body = req.body
        console.log('----------------------------------------')
        console.log(files)
        console.log(body)

        const image = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({folder: 'blog-reflexion/logos'},
            (error, result) => {
                if (error){
                    reject(error);
                }
                resolve(result)
            })
            .end(files)
        });

        // console.log(image)

        res.status(HttpStatus.OK).json({});

    } catch (err) {
        console.log(err)
        res.status(HttpStatus.BAD_REQUEST).json({error: err.message});
    }
})

export const config = {
    api: {
        bodyParser: false
    }
}

export default handler;

// export default async function handler(req, res) {
//     if (req.method !== 'POST') {
//         return res.status(400).json({ error: "request verb" })
//     }
//     try{
//         if (!req.headers.authorization) {
//             return res.status(400).json({ error: "auth missing" })
//         }
//         const authHeader = req.headers.authorization;
//         const token = authHeader.replace(/^[Bb]earer /, "").trim();
//         if (token !== SAVE_TOKEN) {
//             return res.status(403).json({ error: "bad token" })
//         }
//         console.log('line 38')
        
        
//         res.status(200).json({ name: 'John Doe' })
//     } catch(e){
//         console.log(e)
//         res.status(500).json({summary: 'server failed on upload image', error: JSON.stringify(e)})
//     }  
// }

// return new Promise((resolve) => {
        //     const busboy = Busboy({ headers: req.headers });
        //     console.log(JSON.stringify(req.headers, null, 2));
        //     busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
        //       console.log(
        //         '---------*******************************************************************',
        //         'File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype,
        //       );
        //       file.on('data', function (data) {
        //         console.log('File [' + fieldname + '] got ' + data.length + ' bytes');
        //       });
        //       file.on('end', function () {
        //         console.log('File [' + fieldname + '] Finished');
        //       });
        //     });
        //     busboy.on('field', function (fieldname, val) {
        //       console.log('Field [' + fieldname + ']: value: ' + inspect(val));
        //     });
        //     busboy.on('finish', function () {
        //       console.log('Done parsing form!');
        
        //       resolve(1);
        //     });
        //     req.pipe(busboy);
        //   });
        
        // const form = formidable({multiples:true});
        // const data = await new Promise((resolve, reject) => {
        //   form.parse(req, (error, fields, files) => {
        //     if (error) {
        //       reject(error);
        //     } else {
        //       resolve({ fields, files });
        //     }
        //   });
        // });
        // console.log(Object.keys(data).length);
        // console.log(Object.keys(data.files).length);
        // console.log(data.files)
        // console.log(data.fields)
        // const image = req.body.image1;
        // const result = await cloudinary.uploader.upload(image, {folder: 'blog-reflexion/logos'});
        // console.log(result)

        

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

