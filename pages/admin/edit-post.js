import React, { useState, useEffect } from 'react';
import { connectToDatabase } from "../../lib/mongodb";
import { ObjectId } from "mongodb";
import { useSession } from 'next-auth/react';
import Editor from '../../components/editor';
import Restricted from "../../components/restricted";
import Layout from "../../components/layout";
import Head from "next/head";
import Header from "../../components/header";
import { data, text } from "../../lib/data";
import Alert from "../../components/alert";
import Link from 'next/link';
import styles from '../../styles/dashboard.module.css'
import { checkLocalToRemoteOnEditor, ifLocalStorageSetState } from "../../lib/local-store";
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
    const { data: session } = useSession()
    const [value, setValue] = useState(post.body)
    const [unsavedChangesOnValue, setUnsavedChangesOnValue] = useState()
    const [title, setTitle] = useState(post.title)
    const [authorName, setAuthorName] = useState(post.authorName)
    const [description, setDescription] = useState(post.description)
    const [status, setStatus] = useState()
    const [unsavedChanges, setUnsavedChanges] = useState()
    const {asPath} = useRouter()

    useEffect(() => {
        ifLocalStorageSetState('edit-postText', setValue)
        ifLocalStorageSetState('edit-postTitle', setTitle)
        ifLocalStorageSetState('edit-postAuthor', setAuthorName)
        ifLocalStorageSetState('edit-postDescription', setDescription)
    }, [])

    useEffect(() => {
        const unsavedChangesInForm = checkLocalToRemoteOnForm('edit-postTitle',
        'edit-postAuthor',
        'edit-postDescription', post)
        if (unsavedChangesInForm){
            setUnsavedChanges(true)
        }
        const unsavedChangesOnEditor = checkLocalToRemoteOnEditor('edit-postText', post)
        if (unsavedChangesOnEditor){
            setUnsavedChangesOnValue(true)
        }
    }, [unsavedChanges, unsavedChangesOnValue])

    const handleData = (data) => {
        setLocalStorageAndState('edit-postText', data, setValue)
        if (data === post.body){
            setUnsavedChangesOnValue(false)
        }
    }

    const handleFormChange = (e) => {
        const postTitle = e.target.form.title.value;
        const authorName = e.target.form.author.value;
        const description = e.target.form.description.value;
        setLocalStorageAndState('edit-postAuthor', authorName, setAuthorName)
        setLocalStorageAndState('edit-postDescription', description, setDescription)
        setLocalStorageAndState('edit-postTitle', postTitle, setTitle)
        setUnsavedChanges(true)
        if ( postTitle === post.title && authorName === post.authorName && description === post.description){
            setUnsavedChanges(false)
        }
    }

    function cancelAction() {
        setStatus(null)
    }

    const updatePost = async (newText, newTitle, newAuthorName, newDescription) => {
        if (newText === post.body && newTitle === post.title && newAuthorName === post.authorName && newDescription === post.description) {
            setStatus({ alert: "bodyAlert", message: `${text.editPost.noModifications}` })
            return
        }

        setStatus({ alert: "messageAlert", message: `${text.editPost.savingChanges}` })

        const newData = {
            id: post.id,
            fileName: post.fileName,
            newText: newText,
            newTitle: newTitle,
            newAuthorName: newAuthorName,
            newDescription: newDescription
        }

        const response = await fetch(`${BASE_URL}/update-post`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${SAVE_TOKEN}`
            },
            referrerPolicy: 'no-referrer',
            body: JSON.stringify(newData)
        })
        if (response.ok) {
            setStatus({ alert: "messageAndRefresh", message: `${text.editPost.changesHaveBeenSaved}` })
            cleanLocalStorage('edit-postText')
            cleanLocalStorage('edit-postTitle')
            cleanLocalStorage('edit-postAuthor')
            cleanLocalStorage('edit-postDescription')
        } else {
            const errorMsg = await response.json();
            setStatus({alert: "bodyAlert", message: errorMsg})
        }
        return;
    }

    const handleUpdate = async () => {
        updatePost(value, title, authorName, description)
    }

    const handleDiscardChanges = () => {
        cleanLocalStorage('edit-postText')
        cleanLocalStorage('edit-postTitle')
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
                        <Alert data={status} cancelAction={cancelAction} downloadFile={undefined} deletePost={undefined} resetCounter={undefined} url={asPath} discardChanges={handleDiscardChanges} />
                    ) : (
                        <div>
                            <Editor postBody={value} handleData={handleData} parentUnsavedChanges={unsavedChangesOnValue} setParentUnsavedChanged={setUnsavedChangesOnValue}/>

                            <form encType="multipart/form-data">
                                <label htmlFor="title">{text.addPostForm.title}</label>
                                <input type="text" name="title" placeholder={text.addPostForm.title} value={title} onChange={handleFormChange} />
                                <label htmlFor="author">{text.addPostForm.authorName}</label>
                                <input type="text" name="author" placeholder={text.addPostForm.authorPlaceholder} value={authorName} onChange={handleFormChange} />
                                <label htmlFor="description">{text.addPostForm.description}</label>
                                <textarea id="description" name="description" placeholder={`(${text.addPostForm.optional})`} value={description} onChange={handleFormChange} />
                            </form>
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

    console.log(post)

    const result = {
        authorName: post.author,
        date: post.date,
        title: post.title,
        id: post._id,
        contentHtml: post.contentHtml,
        body: post.body,
        fileName: post.fileName,
        visits: post.visits,
        description: post.description
    }

    return {
        props: {
            post: JSON.parse(JSON.stringify(result))
        }
    }
}