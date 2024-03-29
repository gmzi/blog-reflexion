
const myKey = "bR-Edit-Post";

export function savePostInLocal(id, key, value){
    let posts = JSON.parse(localStorage.getItem(myKey)) || {};
    // if exists, update, else create
    if (posts.hasOwnProperty(id)){
        if (posts[id].hasOwnProperty(key)){
            posts[id][key] = value;
        } else {
            posts[id][key] = value;
        }
    } else {
        posts[id] = {[key]: value}
    }
    // save in local
    localStorage.setItem(myKey, JSON.stringify(posts))
}

export function getPostFromLocal(id, property){
    let posts = JSON.parse(localStorage.getItem(myKey)) || {};
    if (posts.hasOwnProperty(id)){
        if (property && posts[id].hasOwnProperty(property)){
            return posts[id][property];
        } else {
            return posts;
        }
    }
    else {
        return null;
    }
}

export function getDataFromLocal(key){
    let data = JSON.parse(localStorage.getItem(key));
    return data
}

export function deletePostFromLocal(id){
    let posts = JSON.parse(localStorage.getItem(myKey)) || {};
    if (posts.hasOwnProperty(id)){
        delete posts[id];
        localStorage.setItem(myKey, JSON.stringify(posts))
    }
}

// --------------------------------------

export function ifLocalStorageSetState(postID, queryID, key, setState){
    if (JSON.parse(localStorage.getItem(key))){
        setState(JSON.parse(localStorage.getItem(key)))
    }
    return;
}

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

export function checkUnsavedChanges(key1, key2, key3, key4, setState){
    if (JSON.parse(localStorage.getItem(key1)) || JSON.parse(localStorage.getItem(key2)) || JSON.parse(localStorage.getItem(key3)) || JSON.parse(localStorage.getItem(key4))){
        setState(true)
    }
    return;
}

export function checkLocalToRemoteOnForm(postID, property, post){
    // const author = JSON.parse(localStorage.getItem(local2))
    // const description = JSON.parse(localStorage.getItem(local3))
    const localProperty = getPostFromLocal(postID, property);
    if (localProperty === post.property){
        return false;
    } else {
        return true;
    }
}

export function checkLocalToRemoteOnEditor(postID, property, postPreview){
    // const editorBody = JSON.parse(localStorage.getItem(local))
    const editorBody = getPostFromLocal(postID, property)
    if (editorBody === null){
        return false
    }
    if (postPreview === property){
        return false
    } else {
        return true
    }
}

//-----------------------------------------------

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