import { v2 as cloudinary} from 'cloudinary'
import middleware from '../../../middleware/middleware';
import nextConnect from 'next-connect';
import HttpStatus from 'http-status-codes';
import busboy from 'busboy';


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

export const config = {
    api: {
        bodyParser: false
    }
}

export default async function handler(req, res){
    try{
        const bb = busboy({headers: req.headers})
        bb.on('file', (fieldname, file, filename, encoding, mimetype) => {
            const chunks = [];
            file.on('data', (chunk) => {
                chunks.push(chunk);
            });
            file.on('end', async () => {
                const buffer = Buffer.concat(chunks)
                const image = await new Promise((resolve, reject) => {
                    cloudinary.uploader.upload_stream({folder: 'blog-reflexion/logos'},
                    (error, result) => {
                        if (error){
                            // reject(error);
                            res.status(500).json({error: error.message})
                            reject(error)
                        }
                        resolve(result)
                    })
                    .end(buffer)
                });
                const metadata =
                {
                    asset_id: image.asset_id,                   
                    public_id: image.public_id,
                    width: image.width,
                    height: image.height,
                    format: image.format,
                    created_at: image.created_at, 
                    tags: image.tags,
                    bytes: image.bytes,
                    secure_url: image.secure_url,
                }
                return res.status(200).json({metadata})
            })
        })
        bb.on('finish', () => {
            // console.log('all done')
            return;
        })
        req.pipe(bb)
    } catch(e){
        res.status(500).json({error: e.message})
    }
}

