// http://localhost:3000/api/images/clean-folder
/**Detect assets that were uploaded but are not being used in any post, nor as main images or body
 * images. Once detected, move those assets to blog-reflexion/trash. I'm leaving them there until
 * we test the method, empty trash folder is a todo. 
 */

import { v2 as cloudinary} from 'cloudinary'

const CLOUDINARY_CLOUD_NAME= process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY= process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET= process.env.CLOUDINARY_API_SECRET;

const BASE_URL = process.env.BASE_URL;

cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET
});

export default async function handler(req, res) {
    try {
        // GET POSTS FROM MONGODB, EXTRACT MAIN IMAGE AND BODY IMAGES OF EACH POST
        const postsRequest = await fetch(`${BASE_URL}/api/retrieve-posts`);
        if (postsRequest.status !== 200){
            return res.status(500).json({error: "failed retrieving posts"})
        }
        const posts = await postsRequest.json();
    
        const imageIdRegex = /\/([^\/]+)\.(jpg|png)/;
        const mainImageIDS = [];
        const bodyIDS = [];
    
        posts.forEach((post) => {
            const match = post.image_url.match(imageIdRegex);
            if (match){
                mainImageIDS.push(match[1])
            } else {
                mainImageIDS.push(post.image_url)
            }
            if (post.contains_images){
                post.body_images.map((id) => {
                    bodyIDS.push(id)
                })
            }
        })
        const inUseImages = [...mainImageIDS, ... bodyIDS]

        const assetsToTrash = [];

        // GET IMAGES ON CLOUDINARY
        const allStoredImages = await cloudinary.search.expression('folder=blog-reflexion/posts/*')
        .sort_by('public_id', 'desc').execute().then(response => {
                const resources = response.resources;
                if (!resources.length){
                    return res.status(200).json({message: "no items in folder"})
                } 
                resources.forEach((asset) => {
                    if (!inUseImages.includes(asset.filename)){
                        assetsToTrash.push(asset)
                    }
                })
                assetsToTrash.forEach((asset) => {
                    cloudinary.uploader.rename(asset.public_id, `blog-reflexion/trash/${asset.filename}`)
                })
                res.status(200).json({success: `${assetsToTrash.length} assets have been moved to Trash folder`})
            })

        // Promise.all([allStoredImages]).then(function() {res.status(200).json({success: `${assetsToTrash.length} assets have been moved to Trash folder`})});

        } catch(e) {
            res.status(500).json({error: e})
         }

}

