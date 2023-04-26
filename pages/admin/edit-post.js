import React, { useState, useEffect } from 'react';
import { connectToDatabase } from "../../lib/mongodb";
import { ObjectId } from "mongodb";
import { useSession } from 'next-auth/react';
import Editor from '../../components/editor';
import Restricted from "../../components/restricted";
import Layout from "../../components/layout";
import ImagesUploadForm from '../../components/forms/imagesUploadForm';
import MetadataForm from '../../components/forms/metadataForm';
import NotFound from '../../components/notFound';
import Head from "next/head";
import Header from "../../components/header";
import { data, text } from "../../lib/data";
import Alert from "../../components/alert";
import Link from 'next/link';
import styles from '../../styles/dashboard.module.css'
import { checkLocalToRemoteOnEditor, getPostFromLocal, ifLocalStorageSetState, savePostInLocal } from "../../lib/local-store";
import { setLocalStorageAndState } from "../../lib/local-store";
import { cleanLocalStorage } from "../../lib/local-store";
import { checkLocalToRemoteOnForm } from '../../lib/local-store';
import {checkUnsavedChanges } from "../../lib/local-store";
import { useRouter } from 'next/router';

const MONGODB_COLLECTION = process.env.MONGODB_COLLECTION;
const API_URL = process.env.NEXT_PUBLIC_BASE_URL;
const URL = process.env.NEXT_PUBLIC_URL;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const SAVE_TOKEN = process.env.NEXT_PUBLIC_SAVE_TOKEN;

export default function EditPost({ post }) {

    if (!post){
        return (
            <NotFound/>
        )
    }

    const postPreview = `![image](${post.image_url})
# ${post.title}
${post.body}`


    const { data: session } = useSession()
    const [value, setValue] = useState(postPreview)
    const [unsavedChangesOnValue, setUnsavedChangesOnValue] = useState()
    const [title, setTitle] = useState(post.title)
    const [authorName, setAuthorName] = useState(post.authorName)
    const [description, setDescription] = useState(post.description)
    const [status, setStatus] = useState()
    const [unsavedChanges, setUnsavedChanges] = useState()
    // const {asPath} = useRouter()
    const router = useRouter()

    const postID = post.id;
    const queryID = router.query.id

    useEffect(() => {
        // ifLocalStorageSetState(postID, queryID, 'edit-postText', setValue)
        const localPost = getPostFromLocal(postID)
        if (localPost){
            setValue(localPost.text)
            setAuthorName(localPost.author)
            setDescription(localPost.description)
        }
        // ifLocalStorageSetState(postID, queryID, 'edit-postAuthor', setAuthorName)
        // ifLocalStorageSetState(postID, queryID, 'edit-postDescription', setDescription)
    }, [])

    useEffect(() => {
        const unsavedChangesOnEditor = checkLocalToRemoteOnEditor('edit-postText', postPreview)
        if (unsavedChangesOnEditor){
            setUnsavedChangesOnValue(true)
        }
    }, [unsavedChangesOnValue])

    useEffect(() => {
        const unsavedChangesOnForm = checkLocalToRemoteOnForm('edit-postAuthor',
        'edit-postDescription', post)
        if (unsavedChangesOnForm){
            setUnsavedChanges(true)
        }
    }, [unsavedChanges])

    const handleData = (data) => {
        // setLocalStorageAndState(localStoredPost, data, setValue)
        savePostInLocal(postID, data, undefined, undefined )
        setValue(data)
        if (data === postPreview){
            setUnsavedChangesOnValue(false)
        }
    }

    const handleFormChange = (e) => {
        e.preventDefault()
        const authorName = e.target.form.author.value;
        const description = e.target.form.description.value;
        // setLocalStorageAndState('edit-postAuthor', authorName, setAuthorName)
        // setLocalStorageAndState('edit-postDescription', description, setDescription)
        savePostInLocal(postID, undefined, authorName, undefined )
        setAuthorName(authorName)
        savePostInLocal(postID, undefined, undefined, description )
        setDescription(description)

        setUnsavedChanges(true)
        if (authorName === post.authorName && description === post.description){
            setUnsavedChanges(false)
        }
    }

    function cancelAction() {
        setStatus(null)
    }

    const updatePost = async (newValues, newAuthorName, newDescription) => {
        if (newValues === postPreview && newAuthorName === post.authorName && newDescription === post.description) {
            setStatus({ alert: "bodyAlert", message: `${text.editPost.noModifications}` })
            return
        }

        const rawData = {
            fileContent: newValues,
            authorName: authorName || "Default",
            description: description || ""
        }

        const format = await fetch(`${BASE_URL}/edit-format-data`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${SAVE_TOKEN}`,
                'Origin': `${BASE_URL}/pages/edit-post`
            },
            referrerPolicy: 'no-referrer',
            body: JSON.stringify(rawData)
        })

        if (!format.ok) {
            if (format.status === 409) {
                const errorMsg = await format.json();
                if (errorMsg.title === "missing") {
                    setStatus({ alert: "bodyAlert", message: `${text.writePost.missingImage}` })
                    return
                }
                if (errorMsg.title === "missing") {
                    setStatus({ alert: "bodyAlert", message: `${text.writePost.missingTitle}` })
                    return
                }
                if (errorMsg.title === "duplicated") {
                    setStatus({ alert: "bodyAlert", message: `${text.writePost.titleExists}` })
                    return;
                }
                if (errorMsg.title === "body") {
                    setStatus({ alert: "bodyAlert", message: `${text.writePost.noText}` })
                    return;
                }
            }
            setStatus({ alert: "bodyAlert", message: `${text.writePost.errorFormatting}` })
            return;
        }

        const parseUpdatedData = await format.json();
        const updatedData = parseUpdatedData.updatedPost;

        updatedData.id = post.id;
        updatedData.fileName = post.fileName

        setStatus({ alert: "messageAlert", message: `${text.editPost.savingChanges}` })

        const update = await fetch(`${BASE_URL}/update-post`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${SAVE_TOKEN}`
            },
            referrerPolicy: 'no-referrer',
            body: JSON.stringify(updatedData)
        })

        if (update.ok) {
            setStatus({ alert: "messageAndRefresh", message: `${text.editPost.changesHaveBeenSaved}` })
            setUnsavedChanges(false)
            setUnsavedChangesOnValue(false)
            cleanLocalStorage('edit-postText')
            cleanLocalStorage('edit-postAuthor')
            cleanLocalStorage('edit-postDescription')
        } else {
            setStatus({alert: "bodyAlert", message: 'error updating'})
            return;
        }
        return;
    }

    const handleUpdate = async (e) => {
        e.preventDefault()
        updatePost(value, authorName, description)
    }

    const handleDiscardChanges = () => {
        cleanLocalStorage('edit-postText')
        cleanLocalStorage('edit-postAuthor')
        cleanLocalStorage('edit-postDescription')
        setStatus({ alert: "messageAndRefresh-Discard", message: `${text.editPost.changesHaveBeenDiscarded}`})
    }

    const alertToDiscard = () => {
        setStatus({ alert: "discardChanges", message: `${text.editPost.confirmDiscardChanges}`})
    }

    if (session) {
        return (
            <Layout home dashboard>
                <Head>
                    <title>{data.title} - {text.editPost.editPost} </title>
                </Head>
                <Header />
                <section>
                    <h2>{text.editPost.editPost}</h2>
                    {status ? (
                        <Alert data={status} cancelAction={cancelAction} downloadFile={undefined} deletePost={undefined} resetCounter={undefined} url={router.asPath} discardChanges={handleDiscardChanges} />
                    ) : (
                        <div>
                            <Editor postBody={value} handleData={handleData} parentUnsavedChanges={unsavedChangesOnValue} setParentUnsavedChanged={setUnsavedChangesOnValue}/>

                            <ImagesUploadForm/>

                            <MetadataForm handleChange={handleFormChange} authorName={authorName} description={description}/>

                            {/* <form encType="multipart/form-data">
                                <label htmlFor="title">{text.addPostForm.title}</label>
                                <input type="text" name="title" placeholder={text.addPostForm.title} value={title} onChange={handleFormChange} />
                                <label htmlFor="author">{text.addPostForm.authorName}</label>
                                <input type="text" name="author" placeholder={text.addPostForm.authorPlaceholder} value={authorName} onChange={handleFormChange} />
                                <label htmlFor="description">{text.addPostForm.description}</label>
                                <textarea id="description" name="description" placeholder={`(${text.addPostForm.optional})`} value={description} onChange={handleFormChange} />
                            </form> */}
                            <div className={styles.btnContainer}>
                                {unsavedChanges || unsavedChangesOnValue ? (
                                    <>
                                        <button className="btnPublish" onClick={handleUpdate}>{text.editor.saveChanges}</button>
                                        <button className="btnDelete" onClick={alertToDiscard}>{text.editor.discardChanges}</button>    
                                    </>
                                ) :(
                                    <>  
                                        <button className="btnPublish-disabled">{text.editor.saveChanges}</button>
                                        <button className="btnDelete-disabled">{text.editor.discardChanges}</button>    
                                    </>
                                )}
                                
                            </div>
                        </div>
                    )
                }
                </section>
                <div className={styles.btnContainer}>
                    <Link href='/admin/dashboard'>
                        <a>← {text.addPostForm.goDashboard}</a>
                    </Link>
                </div>
            </Layout>
        )
    }

    return (
        <Restricted />
    )
}


export async function getServerSideProps({ query }) {

    const { db } = await connectToDatabase()

    const dbQuery = { _id: ObjectId(query.id) }
    const post = await db
        .collection(MONGODB_COLLECTION)
        .findOne(dbQuery)

    if (!post) {
        return {
            props: {
                post: false,
            }
        }
    }

    const result = {
        authorName: post.author,
        date: post.date,
        title: post.title,
        id: post._id,
        contentHtml: post.contentHtml,
        body: post.body,
        fileName: post.fileName,
        visits: post.visits,
        description: post.description,
        body_images: post.body_images,
        contains_images: post.contains_images,
        image_url: post.image_url
    }

    return {
        props: {
            post: JSON.parse(JSON.stringify(result))
        }
    }
}