const REVALIDATE_TOKEN = process.env.REVALIDATE_TOKEN;

export default async function handler(req, res) {
    if (req.query.secret !== REVALIDATE_TOKEN) {
        return res.status(401).json({ message: 'Invalid token' })
    }

    try {
        await res.unstable_revalidate(`/posts/${req.query.path}`)
        return res.json({ revalidated: true })
    } catch (err) {
        // If there was an error, Next.js will continue
        // to show the last successfully generated page
        console.log('ERROR OON REVALIDATE POST')
        console.log(err)
        return res.status(500).send('Error revalidating')
    }
}