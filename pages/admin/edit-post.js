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
import { checkLocalToRemoteOnEditor, deletePostFromLocal, getPostFromLocal, ifLocalStorageSetState, savePostInLocal } from "../../lib/local-store";
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

    const postPreview = `![image](${post.image_url})\n\n # ${post.title}\n ${post.body}`


    const { data: session } = useSession()
    const [value, setValue] = useState(postPreview)
    const [title, setTitle] = useState(post.title)
    const [authorName, setAuthorName] = useState(post.authorName)
    const [description, setDescription] = useState(post.description)
    const [status, setStatus] = useState()
    const [unsavedChangesOnValue, setUnsavedChangesOnValue] = useState()
    const [unsavedChanges, setUnsavedChanges] = useState()
    // const {asPath} = useRouter()
    const router = useRouter()

    const postID = post.id;
    const queryID = router.query.id
    let debounceTimer;

    useEffect(() => {
        const localPost = getPostFromLocal(postID)
        if(!localPost){return}
        // const localStoredPostID = Object.keys(localPost)[0]
        if (localPost[postID]?.text){setValue(localPost[postID].text)}
        if (localPost[postID]?.authorName){setAuthorName(localPost[postID].authorName)}
        if (localPost[postID]?.description){setDescription(localPost[postID].description)}
        // if(localStoredPostID === postID){
        //     setUnsavedChanges(true)
        // }
    }, [])

    useEffect(() => {
        const localDataOnEditor = getPostFromLocal(postID)
        if (!localDataOnEditor){return}
        if (localDataOnEditor[postID]?.text !== postPreview){
            setUnsavedChangesOnValue(true)
        } else {
            setUnsavedChangesOnValue(false)
        }
    }, [])

    useEffect(() => {
        const metaDataOnLocal = getPostFromLocal(postID)
        if (!metaDataOnLocal){return}
        if (metaDataOnLocal[postID]?.authorName !== post.authorName || 
            metaDataOnLocal[postID]?.description !== post.description){
            setUnsavedChanges(true)
        } else {
            setUnsavedChanges(false)
        }
    }, [])

    
    const handleData = (data) => {
        savePostInLocal(postID, "text", data)
        setValue(data)

        clearTimeout(debounceTimer)
        debounceTimer = setTimeout(() => {
            if (data !== postPreview){
                setUnsavedChangesOnValue(true)
            } else {
                setUnsavedChangesOnValue(false)
            }
        }, 1000)
        // if (data !== postPreview){
        //     setUnsavedChangesOnValue(true)
        // } else {
        //     setUnsavedChangesOnValue(false)
        // }
    }

    const handleFormChange = (e) => {
        const formAuthorName = e.target.form.author.value;
        const formDescription = e.target.form.description.value;
        // savePostInLocal(postID, {"authorName": formAuthorName, "description": formDescription})
        savePostInLocal(postID, "authorName", formAuthorName)
        setAuthorName(formAuthorName)
        savePostInLocal(postID, "description", formDescription)
        setDescription(formDescription)
        if (formAuthorName !== post.authorName || formDescription !== post.description){
            setUnsavedChanges(true)
        } else {
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
            deletePostFromLocal(postID)
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
        deletePostFromLocal(postID)
        setUnsavedChanges(false)
        setUnsavedChangesOnValue(false)
        setStatus({ alert: "messageAndRefresh-Discard", message: `${text.editPost.changesHaveBeenDiscarded}`})
    }

    const alertToDiscard = () => {
        setStatus({ alert: "discardChanges", message: `${text.editPost.confirmDiscardChanges}`})
    }

    if (!post){
        return (
            <NotFound/>
        )
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