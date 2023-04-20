export function ifLocalStorageSetState(key, setState){
    if (JSON.parse(localStorage.getItem(key))){
        setState(JSON.parse(localStorage.getItem(key)))
    }
    return;
}

export function setLocalStorageAndState(key, value, setState){
    localStorage.setItem(
        key,
        JSON.stringify(value)
        );
    setState(value)
    return;
}

export function cleanLocalStorage(key){
    localStorage.removeItem(key)
    return;
}

export function checkUnsavedChanges(key1, key2, key3, key4, setState){
    if (JSON.parse(localStorage.getItem(key1)) || JSON.parse(localStorage.getItem(key2)) || JSON.parse(localStorage.getItem(key3)) || JSON.parse(localStorage.getItem(key4))){
        setState(true)
    }
    return;
}

// export function checkLocalToRemote(
//     local2, local3, local4,
//     post, 
//     setState
// ){
//     const title = JSON.parse(localStorage.getItem(local2))
//     const author = JSON.parse(localStorage.getItem(local3))
//     const description = JSON.parse(localStorage.getItem(local4))
//     console.log(description)
//     console.log(post.description)
//     console.log(title === post.title)
//     if (title !== post.title || author !== post.authorName || description !== post.description){
//         setState(true)
//     } 
// }