export function checkAndJoin(lines, urlRegex){
    const images = [];
    lines.forEach(line => {
        if (line.includes("![image](")){
            const match = line.match(urlRegex)
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