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