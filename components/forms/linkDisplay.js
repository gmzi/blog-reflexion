import React, { useState, useEffect } from 'react'
import Layout from '../layout'
import { data, text } from '../../lib/data';
import { useRouter } from 'next/router';
import Head from "next/head";
import Link from 'next/link';
import styles from '../addPostForm.module.css'
import dashboardStyles from '../../styles/dashboard.module.css'
import PreviewPost from '../previewPost';
import Header from '../header';
import { grabText } from '../../lib/grabText'
import { useSession } from 'next-auth/react';
import Restricted from '../restricted';
import Alert from '../alert';
import { generateBoundaryString } from '../../lib/boundaryString';
import { generateImageLink } from '../../lib/generateImageLink';


const server_url = process.env.NEXT_PUBLIC_NEW_POST_URL;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const SAVE_TOKEN = process.env.NEXT_PUBLIC_SAVE_TOKEN;

export default function LinkDisplay({url, state}) {
    const [file, setFile] = useState()
    const [caption, setCaption] = useState("")
    const [data, setData] = useState()

    const handleClick = (e) => {
        e.preventDefault();
        state(false)
    }

    return (
        <form id="linkDisplay">
            <input type="text" name="linkDisplay" id="linkDisplay" value={url}/>
            <button onClick={handleClick}>Upload new image</button>
        </form> 
    )
}