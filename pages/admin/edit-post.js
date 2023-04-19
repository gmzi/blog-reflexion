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
import { ifLocalStorageSetState } from "../../lib/local-store";
import { setLocalStorageAndState } from "../../lib/local-store";
import { cleanLocalStorage } from "../../lib/local-store";

const MONGODB_COLLECTION = process.env.MONGODB_COLLECTION;
const API_URL = process.env.NEXT_PUBLIC_BASE_URL;
const URL = process.env.NEXT_PUBLIC_URL;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const SAVE_TOKEN = process.env.NEXT_PUBLIC_SAVE_TOKEN;

export default function EditPost({ post }) {
    const { data: session } = useSession()
    const [value, setValue] = useState(post.body)
    const [title, setTitle] = useState(post.title)
    const [authorName, setAuthorName] = useState(post.authorName)
    const [description, setDescription] = useState(post.description)
    const [status, setStatus] = useState()
    const [unsavedChanges, setUnsavedChanges] = useState();

    useEffect(() => {
        ifLocalStorageSetState('edit-postText', setValue)
        ifLocalStorageSetState('edit-postTitle', setTitle)
        ifLocalStorageSetState('edit-postAuthor', setAuthorName)
        ifLocalStorageSetState('edit-postDescription', setDescription)
    }, [])

    const handleData = (data) => {
        setLocalStorageAndState('edit-postText', data, setValue)
    }

    const handleFormChange = (e) => {
        setUnsavedChanges(true)
        const authorName = e.target.form.author.value;
        const description = e.target.form.description.value;
        const postTitle = e.target.form.title.value;
        setLocalStorageAndState('edit-postAuthor', authorName, setAuthorName)
        setLocalStorageAndState('edit-postDescription', description, setDescription)
        setLocalStorageAndState('edit-postTitle', postTitle, setTitle)
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
            return true;
        } else {
            const errorMsg = await response.json();
            return errorMsg
        }
        return;
    }

    const handleUpdate = async () => {
        const updated = await updatePost(value, title, authorName, description)
        if (updated){
            setUnsavedChanges(false)
            cleanLocalStorage('edit-postText')
            cleanLocalStorage('edit-postTitle')
            cleanLocalStorage('edit-postAuthor')
            cleanLocalStorage('edit-postDescription')
            return;
        } else {
            setStatus({alert: "bodyAlert", message: updated.error})
            return;
        }
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
                        <Alert data={status} cancelAction={cancelAction} downloadFile={undefined} deletePost={undefined} resetCounter={undefined} />
                    ) : (
                        <div>
                            <Editor postBody={value} handleData={handleData}/>

                            <form onChange={handleFormChange} encType="multipart/form-data">
                                <label htmlFor="title">{text.addPostForm.title}</label>
                                <input type="text" name="title" placeholder={text.addPostForm.title} value={title}/>
                                <label htmlFor="author">{text.addPostForm.authorName}</label>
                                <input type="text" name="author" placeholder={text.addPostForm.authorPlaceholder} value={authorName}/>
                                <label htmlFor="description">{text.addPostForm.description}</label>
                                <textarea id="description" name="description" placeholder={`(${text.addPostForm.optional})`} value={description}/>
                            </form>
                            <div className={styles.btnContainer}>
                                <button className="btnPublish" onClick={handleUpdate}>{text.editor.saveChanges}</button>
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
        description: post.description
    }

    return {
        props: {
            post: JSON.parse(JSON.stringify(result))
        }
    }
}