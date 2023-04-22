export function generateImageLink(url, caption){
    const link = `
    ![image](${url})\nFigure: ${caption}
    `
    return link
}