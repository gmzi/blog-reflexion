export function generateBoundaryString(){
    let boundary = '------------------------'
    boundary += Math.random().toString().slice(2, 20);
    boundary += Math.random().toString().slice(2, 20);
    return boundary;
}