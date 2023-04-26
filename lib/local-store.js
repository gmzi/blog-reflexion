
const myKey = "bR-Edit-Post";

export function savePostInLocal(id, text="", author="", description=""){
    // Retrieve existing posts from local storage, if any

    let posts = JSON.parse(localStorage.getItem(myKey)) || {};

    // Update or create the post in the object
    posts[id] = {
        text: text || posts[id]?.text || "",
        author: author || posts[id]?.author || "",
        description: description || posts[id]?.description || ""
    }
    // Save the updated object back to local storage
    localStorage.setItem(myKey, JSON.stringify(posts))
}

export function getPostFromLocal(id){
    let posts = JSON.parse(localStorage.getItem(myKey)) || {};
    if (id in posts){
        return posts[id];
    } else {
        return null;
    }
}


// --------------------------------------


export function ifLocalStorageSetState(postID, queryID, key, setState){
    if (JSON.parse(localStorage.getItem(key))){
        setState(JSON.parse(localStorage.getItem(key)))
    }
    return;
}

// export function setLocalStorageAndState(key, value, setState){
//     localStorage.setItem(
//         key,
//         JSON.stringify(value)
//         );
//     setState(value)
//     return;
// }

function postInLocalStorage(key, postID, queryID){
    const localObj = JSON.parse(localStorage.getItem(key))
    if (localObj){
        const localPostID = localObj.postID;
        if (localPostID === postID)
        return localObj;
    } else {
        return false
    } 
}

function createLocalStoragePost(key, obj){
    localStorage.setItem(
        key, 
        JSON.stringify(obj)
    );
    return;
}

export function setLocalStorageAndState(key, queryID, obj, prop, value, setState){
    const localPost = postInLocalStorage(key, obj.postID, queryID);
    if (postInLocalStorage){
        const updated = {...localPost, [prop]: value}
        localStorage.setItem(
        `${key}.${updated.postID}`,
         JSON.stringify(updated)
        );
        setState(value)
        return;
    } else {
        const updatedObj = {...obj, [prop]: value};
        createLocalStoragePost(key, updatedObj)
        setState(value)
        return;
    }
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
    local2, local3,
    post 
){
    const author = JSON.parse(localStorage.getItem(local2))
    const description = JSON.parse(localStorage.getItem(local3))
    if (author === null || description === null){
        return false
    }
    if (author === post.authorName && description === post.description){
        return false
    } else {
        return true
    }
}

export function checkLocalToRemoteOnEditor(local, postPreview){
    const editorBody = JSON.parse(localStorage.getItem(local))
    if (editorBody === null){
        return false
    }
    if (editorBody === postPreview){
        return false
    } else {
        return true
    }
}

export function checkUnsavedChangesOnForm(local2, local3){
    const localAuthor = JSON.parse(localStorage.getItem(local2))
    const localDescription = JSON.parse(localStorage.getItem(local3))
    if (localAuthor === null && localDescription === null){
        return false; 
    }
    if (localAuthor === '' && localDescription === ''){
        return false;
    } else {
        return true;
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