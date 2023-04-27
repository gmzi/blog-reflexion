import React, { useState, useEffect } from 'react'
import Layout from '../../components/layout'
import { data, text } from '../../lib/data';
import { useRouter } from 'next/router';
import Head from "next/head";
import Link from 'next/link';
import styles from '../../components/addPostForm.module.css'
import dashboardStyles from '../../styles/dashboard.module.css'
import PreviewPost from '../../components/previewPost';
import Header from '../../components/header';
import { grabText } from '../../lib/grabText'
import { useSession } from 'next-auth/react';
import Restricted from '../../components/restricted';
import Alert from '../../components/alert';
import ImagesUploadForm from '../../components/forms/imagesUploadForm';


const server_url = process.env.NEXT_PUBLIC_NEW_POST_URL;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const SAVE_TOKEN = process.env.NEXT_PUBLIC_SAVE_TOKEN;

export default function UploadPost() {

    const router = useRouter()
    const { data: session } = useSession()
    const [newPost, setNewPost] = useState()
    const [preview, setPreview] = useState()
    const [publishStatus, setPublishStatus] = useState()
    const [alert, setAlert] = useState()
    const [emptyField, setEmptyField] = useState()

    const refreshData = () => {
        router.replace(router.asPath)
        return;
    }

    const handleChange = (e) => {
        setEmptyField(null)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const authorName = e.target.author.value.trim();
        const description = e.target.description.value.trim();

        if (!authorName) {
            setEmptyField({ alert: "messageAlert", message: `${text.addPostForm.fillAuthorName}` })
            return;
        }

        if (description.length > 255) {
            setEmptyField({ alert: "messageAlert", message: `${text.addPostForm.longDescription}` })
            return;
        }

        if (!e.target.myFile.files.length) {
            setEmptyField({ alert: "messageAlert", message: `${text.addPostForm.attach}` })
            return;
        }

        const fileContent = await grabText(e.target.myFile.files[0])

        const rawData = {
            fileContent: fileContent,
            authorName: authorName || "Default",
            description: description || " "
        }

        const response = await fetch(`${BASE_URL}/format-data`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${SAVE_TOKEN}`
            },
            referrerPolicy: 'no-referrer',
            body: JSON.stringify(rawData)
        })

        if (!response.ok) {
            if (response.status === 409) {
                setAlert({ alert: "titleAlert", message: `${text.addPostForm.titleDuplicate}` })
                return;
            }
            setAlert({ alert: "titleAlert", message: `${text.addPostForm.errorFormatting}` })
            return;
        }

        const postData = await response.json();
        const newData = postData.newPost
        setNewPost(newData)
        setPreview(true)
    }

    async function publish() {
        setPublishStatus("publishing...")
        const response = await fetch(`${BASE_URL}/save-post`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${SAVE_TOKEN}`
            },
            referrerPolicy: 'no-referrer',
            body: JSON.stringify(newPost)
        })
        if (response.ok) {
            setPublishStatus(`${text.addPostForm.postPublished}`)
            refreshData();
        } else {
            setPublishStatus(`${text.addPostForm.failedPublishing}`)
        }
        return;
    }

    function restart() {
        setPreview(null)
        setNewPost(null)
        return;
    }

    async function handleDownload() {
        const element = document.createElement("a");

        const response = await fetch(`${BASE_URL}/sample-file`, {})
        const postData = await response.json()
        
        const file = new Blob([postData],
            { type: 'text/plain;charset=utf-8' });
        element.href = URL.createObjectURL(file);
        element.download = `syntax-sample.md`;
        document.body.appendChild(element);
        element.click();
    }

    if (preview) {
        return (
            <PreviewPost post={newPost} publish={publish} restart={restart} publishStatus={publishStatus} />
        )
    }

    if (session) {
        return (
            <Layout home dashboard>
                <Head>
                    <title>{data.title} - {text.addPostForm.addPost}</title>
                </Head>
                <Header />
                <section>
                    <h1>{text.addPostForm.createNew}</h1>
                    {emptyField &&
                        <Alert data={emptyField} />
                    }
                    {alert ? (
                        <div className={styles.alertWrapper}>
                            <Alert data={alert} cancelDeletion={refreshData} downloadFile={null} deletePost={null} />
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} onChange={handleChange} method="post" encType="multipart/form-data">
                            <label htmlFor="author">{text.addPostForm.authorName}</label>
                            <input type="text" name="author" placeholder={text.addPostForm.authorPlaceholder} />
                            <label htmlFor="description">{text.addPostForm.description}</label>
                            <textarea id="description" name="description" placeholder={`(${text.addPostForm.optional})`} />
                            <label className={styles.uploadBtn} htmlFor="myFile">{text.addPostForm.file}</label>
                            <input className={dashboardStyles.button} type="file" name="myFile" accept=".md" />
                            <div className={styles.buttonPreviewContainer}>
                                <button className="btnPreview" type="submit">{text.addPostForm.preview}</button>
                            </div>
                        </form>
                    )}
                    <div className="guidelinesContainer">
                        <ol className="guidelines">
                            <h4>{text.addPostForm.guidelines}</h4>
                            <li>
                                <button className="btnDownload" onClick={handleDownload}>{text.addPostForm.downloadSample}</button>
                            </li>
                            <li>
                                <Link href="https://daringfireball.net/projects/markdown/syntax">
                                    <span>{text.addPostForm.cheatSheet} <a target="_blank">here</a></span>
                                </Link>
                            </li>
                        </ol>
                    </div>

                    <ImagesUploadForm/>
                </section>
                <div className={styles.linkContainer}>
                    <Link href='/admin/dashboard'>
                        <a>← {text.addPostForm.goDashboard}</a>
                    </Link>
                </div>
            </Layout >
        )
    }

    return (
        <Restricted />
    )
}

// -------------------------------------------------------------
// import AddPostForm from "../../components/addPostForm";

// export default function UploadPost() {

//     return (
//         <AddPostForm />
//     )
// }