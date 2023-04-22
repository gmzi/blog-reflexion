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

export default function ImagesUploadForm() {
    const [file, setFile] = useState()
    const [caption, setCaption] = useState("")
    const [data, setData] = useState()

    // useEffect(() => {
    // }, [file])

    const handleFileChange = (e) => {
        e.preventDefault();
        const file = e.target.files[0];
        setFile(file)
    }

    const handleCaptionChange = (e) => {
        e.preventDefault()
        const caption = e.target.value;
        setCaption(caption)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!file){
            console.log('no file selected, set status and alerts logic')
            return;
        }
        const formData = new FormData();
        formData.append("file", file);

        const upload = await fetch(`${BASE_URL}/images/upload`, {
            method: 'POST',
            body: formData
        })

        if (!upload.ok){
            console.log('upload failed')
            return;
        }
        const data = await upload.json();
        const imageLink = generateImageLink(data.metadata.secure_url, caption)
        setData(imageLink)
    }

    return (
        <>
        {data ? <p>{data}</p> : (     
        <form id="myForm" method="POST" encType="multipart/form-data" onSubmit={handleSubmit}>
            <input type="file" id="image1" name="file" onChange={handleFileChange} accept="image/png, image/jpeg" />
            <input type="submit" value="Submit"/>
            <label htmlFor="caption">Caption:</label>
            <input type="text" name="caption" id="caption" placeholder='(optional)' value={caption} onChange={handleCaptionChange}/>
        </form> 
        )}
        </>
    )
}