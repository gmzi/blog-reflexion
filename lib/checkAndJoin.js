export function checkAndJoin(lines){
    const images = [];
    const imageIdRegex = /\/([^\/]+)\.(jpg|png)/;
    lines.forEach(line => {
        if (line.includes("![image](")){
            const match = line.match(imageIdRegex)
            if (match){
                images.push(match[1])
            } else {
                images.push(line)
            }
        }
    })
    const joined = lines.join('\n')
    return {fileBody: joined, containsImages: images.length > 0, images};
}