import { fileBody } from "../../lib/fileReader"

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const SAVE_TOKEN = process.env.NEXT_PUBLIC_SAVE_TOKEN;

export default async function handler(req, res) {
    
    try {
    const fileContent = await fileBody;
    
    const result = JSON.stringify(fileContent)

    res.status(200).json(result)

    } catch (e) {
        console.log(e)
        res.status(500).json({ error: e.message })
    }
}