import { ObjectId } from "mongodb";
import { connectToDatabase } from "../../lib/mongodb";

const BASE_URL = process.env.BASE_URL;
const REVALIDATE_TOKEN = process.env.REVALIDATE_TOKEN;
const SAVE_TOKEN = process.env.SAVE_TOKEN;

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(400).json({ error: "request verb" })
    }
    try {
        if (!req.headers.authorization) {
            return res.status(400).json({ error: "auth missing" })
        }

        const authHeader = req.headers.authorization;
        const token = authHeader.replace(/^[Bb]earer /, "").trim();

        if (token !== SAVE_TOKEN) {
            return res.status(403).json({ error: "bad token" })
        }

        const newImageUrl = req.body.image_url;
        const newTitle = req.body.title;
        const newContains = req.body.contains_images;
        const newBodyImages = req.body.body_images;
        const newAuthor = req.body.author;
        const newDescription = req.body.description;
        const newBody = req.body.body;
        const newContentHtml = req.body.contentHtml;

        const id = req.body.id;
        const fileName = req.body.fileName;

        const updateDateObj = new Date();
        const updateDate = updateDateObj.toISOString();

        const { db } = await connectToDatabase();

        const filter = { _id: ObjectId(id) }

        const updateDocument = {
            $set: {
                image_url: newImageUrl,
                contains_images: newContains,
                body_images: newBodyImages,
                contentHtml: newContentHtml,
                body: newBody,
                title: newTitle,
                author: newAuthor,
                description: newDescription,
                lastMod: updateDate
            }
        }

        const update = await db
            .collection(`${process.env.MONGODB_COLLECTION}`)
            .updateOne(filter, updateDocument)

        if (update.acknowledged) {
            const path = req.body.fileName;
            // REVALIDATE ON-DEMAND
            const revalidatePost = await fetch(`${BASE_URL}/api/revalidate-post?secret=${REVALIDATE_TOKEN}&path=${path}`)
            const revalidateIndex = await fetch(`${BASE_URL}/api/revalidate-index?secret=${REVALIDATE_TOKEN}`)
            if (revalidatePost.ok && revalidateIndex.ok) {
                res.status(200).json({ message: 'success' })
            } else {
                console.log('REVALIDATION FAILED?------------------------------')
                console.log(revalidatePost)
                console.log(revalidateIndex)
                res.status(500).json({ error: "failed revalidating" })
            }
        } else {
            console.log('UPDATE FAILED?------------------------------')
            console.log(update)
            res.status(502).json({ error: "not acknowledged in db" })
        }
    } catch (e) {
        console.log(e)
        return res.status(500)
    }
}

