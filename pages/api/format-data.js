import { connectToDatabase } from '../../lib/mongodb';
import { parseMdToHtml } from '../../lib/posts';
import {checkAndJoin} from '../../lib/checkAndJoin'

const SAVE_TOKEN = process.env.SAVE_TOKEN;

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(400).json({ error: "request verb" })
    }
    try {
        if (!req.headers.authorization) {
            return res.status(400).json({ msg: "auth missing" })
        }

        const authHeader = req.headers.authorization;
        const token = authHeader.replace(/^[Bb]earer /, "").trim();

        // res.locals.user = jwt.verify(token, SECRET_KEY);

        if (token !== SAVE_TOKEN) {
            return res.status(403).json({ msg: "bad token" })
        }

        // Read incoming file
        const fileContent = req.body.fileContent;

        // store main image url and post title
        let mainImageUrlRaw;
        let titleRaw;

        // spread file into storable object, detect main header and image url
        const mainBody = fileContent.split(/\r?\n/).filter((line, i) => {
            if (line.includes('![image]')) {
                mainImageUrlRaw = line;
                return line
            }
            if (line.includes('# ')) {
                titleRaw = line;
                return line
            }
        })

        const titlePosition = fileContent.split(/\r?\n/).filter((line, i) => {
            if (line.includes('# ')){
                return i 
            }
        })
        console.log(titlePosition)
        return;

        const {titleRav, titleIndex} = titlePosition

        let imageUrlsRaw = [];
        let textBody = '';

    
        // CHECK FOR NO MAIN IMAGE
        if (mainImageUrlRaw === undefined){
            return res.status(409).json({title: "missing"})
        }
        // CHECK FOR NO POST TITLE
        if (titleRaw === undefined) {
            return res.status(409).json({ title: "missing" });
        }

        const urlRegex = /\((https?:\/\/[^\s)]+)\)/;
        const mainImageUrlMatch = mainImageUrlRaw.match(urlRegex);

        if (!mainImageUrlMatch) {
            return res.status(500).json({title: "failed extracting image url"})
        }

        const mainImageUrl = mainImageUrlMatch[1];
        const cleanTitle = titleRaw.replace(/[#*]/g, '').trim()
        const textTitle = cleanTitle;
        const fileName = `${cleanTitle.replace(/\s/g, '-')}`
        const date = new Date();
        const authorName = req.body.authorName.trim()
        const description = req.body.description.trim()
        // const fileBodyOld = fileContent.split('\n').slice(2).join('\n')
        const {fileBody, containsImages, images} = checkAndJoin(fileContent.split(2), urlRegex)

        // CHECK FOR EMPTY BODY 
        if (!fileBody.length) {
            return res.status(409).json({ title: "body" });
        }

        const contentHtml = await parseMdToHtml(fileBody)


        // CHECK IF POST TITLE IS REPEATED, except for sample-file, that 
        // will format without checking DB.
        if (!req.body.formatOnly) {
            const { db } = await connectToDatabase()
            const repeatedTitle = await db
                .collection(`${process.env.MONGODB_COLLECTION}`)
                .findOne({ title: textTitle })
            if (repeatedTitle) {
                return res.status(409).json({ title: "duplicated" });
            }
        }

        const newPost = {
            "image_url": mainImageUrl,
            "title": textTitle,
            "contains_images": containsImages,
            "body_images": images,
            "date": date,
            "author": authorName,
            "description": description,
            "fileName": fileName,
            "body": fileBody,
            "contentHtml": contentHtml,
            "lastMod": date
        }

        const result = JSON.stringify({ newPost: newPost })

        return res.status(200).json(result)

    } catch (e) {
        console.log(e)
        res.status(500).json({ error: JSON.stringify(e) })
    }
}

