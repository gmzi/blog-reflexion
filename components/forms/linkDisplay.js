import React, { useState, useEffect } from 'react'
import { data, text } from '../../lib/data';
import styles from '../addPostForm.module.css'
import dashboardStyles from '../../styles/dashboard.module.css'
import Alert from '../alert';


const server_url = process.env.NEXT_PUBLIC_NEW_POST_URL;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const SAVE_TOKEN = process.env.NEXT_PUBLIC_SAVE_TOKEN;

export default function LinkDisplay({url, state}) {
    const [copied, setCopied] = useState()

    const handleClick = (e) => {
        e.preventDefault();
        state(false)
    }

    const handleCopyToClipboard = (e) => {
        e.preventDefault()
        navigator.clipboard.writeText(url)
        setCopied(true)
    }

    return (
        <div className={"linkDisplay"}>
            <p>{url}</p>
            <button onClick={handleClick}>Upload new image</button>
            {copied ? (
                <button onClick={handleCopyToClipboard}>copied!</button>
            ): (
                <button onClick={handleCopyToClipboard}>copy to clipboard</button>
            )}
        </div> 
    )
}