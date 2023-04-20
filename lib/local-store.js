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

export function checkLocalToRemoteOnForm(
    local1, local2, local3,
    post 
){
    const title = JSON.parse(localStorage.getItem(local1))
    const author = JSON.parse(localStorage.getItem(local2))
    const description = JSON.parse(localStorage.getItem(local3))
    if (title === null || author === null || description === null){
        return false
    }
    if (title === post.title && author === post.authorName && description === post.description){
        return false
    } else {
        return true
    }
}

export function checkLocalToRemoteOnEditor(local, post){
    const editorBody = JSON.parse(localStorage.getItem(local))
    if (editorBody === null){
        return false
    }
    if (editorBody === post.body){
        return false
    } else {
        return true
    }
}

export function checkUnsavedChangesOnForm(local2, local3){
    const localAuthor = JSON.parse(localStorage.getItem(local2))
    const localDescription = JSON.parse(localStorage.getItem(local3))
    if (localAuthor !== null || localDescription !== null){
        return true
    } else {
        return false
    }
}

export function checkUnsavedChangesOnEditor(local, placeholder){
    const localText = JSON.parse(localStorage.getItem(local))
    if (localText === placeholder || localText === null){
        return false
    } else {
        return true
    }
}