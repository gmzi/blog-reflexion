// http://localhost:3000/api/images/clean-folder

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

    const allPostImageIDs = [...mainImageIDS, ... bodyIDS]

    const allStoredImages = cloudinary.search.expression('folder=blog-reflexion/posts/* AND resource_type:image')
    .sort_by('public_id', 'desc').max_results(30).execute().then(result => {
            console.log(result)
        })

        
    // lines.forEach(line => {
    //     if (line.includes("![image](")){
    //         const match = line.match(imageIdRegex)
    //         if (match){
    //             images.push(match[1])
    //         } else {
    //             images.push(line)
    //         }
    //     }
    // })

    // LOOP over MONGODB posts.forEach: grab image_url and if 
    // post.contains_images
    /**
     * mongoDBPOSTS.forEach((post) => {
     *  mainIMages.push(post.image_url)
     * if (post.contains_images){
     *    post.contains_images.map((image_id) => {
     *      bodyImages.push(image_id)
     *      })
     * }
     * 
     * const mainImagesUrls =  mainIMAGES.forEach((image_url) => {
     *      regex to extract id from full url
     *  } )
     * 
     * const allIMAGES = [...mainImages, ...bodyImages]
     * 
     * CLOUDINARY images.forEach((image) => {
     *      if (!allIMAGES.include(image)){
     *      await cloudinary.uploader.destroy(image)
     *      }
     *  })
     * })
     * 
    */

    // TO DELETE, GRAB public_id FROM IMAGE OBJECT

    // const image = 'blog-reflexion/logos/nloo0aq1hbpl9fhlnpx0';

    // const result = await cloudinary.uploader.destroy(image);

    // console.log(result)
    
    res.status(200).json({ posts: posts })

}

