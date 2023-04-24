export function generateImageLink(url, caption){
    const link = `\n![image](${url})\nFigure: ${caption}\n
`
    return link
}