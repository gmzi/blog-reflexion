const BASE_URL = process.env.NEXT_PUBLIC_URL;
import languages from './languages.json'

export const data = {
    // Current languages support: 'EN' for english, 'ES' for spanish.
    language: 'ES',
    name: "reflexión en música",
    title: "reflexión en música",
    description: "ensayos, artículos, conferencias, reseñas y notas sobre estética musical",
    ogImage: `${BASE_URL}/og-image5.png`,
    social: [
        // { name: "github", url: "https://github.com" },
        // { name: "instagram", url: "https://www.instagram.com" },
        // { name: "youtube", url: "https://www.youtube.com" },
        // { name: "facebook", url: "https://www.facebook.com" },
        // { name: "twitter", url: "https://www.twitter.com" }
    ],
    contactUrl: "https://discord.gg/FsvK9twEuk"
}

export const text = languages[data.language] || languages.EN;
