import { useState, useEffect } from "react";
import { useSession } from 'next-auth/react';
import Layout from "../../components/layout"
import Head from "next/head"
import Header from '../../components/header'
import Link from "next/link"
import { data } from "../../lib/data"
import Alert from '../../components/alert'
import Restricted from "../../components/restricted";
import MetadataForm from "../../components/forms/metadataForm";
import ImagesUploadForm from "../../components/forms/imagesUploadForm";
import { text } from '../../lib/data'
import styles from '../../styles/dashboard.module.css'
import Editor from "../../components/editor";
import { ifLocalStorageSetState } from "../../lib/local-store";
import { setLocalStorageAndState } from "../../lib/local-store";
import { cleanLocalStorage } from "../../lib/local-store";
import { checkUnsavedChangesOnForm } from "../../lib/local-store";
import { checkUnsavedChangesOnEditor } from "../../lib/local-store";
import { useRouter } from "next/router";
import { generateBoundaryString } from "../../lib/boundaryString";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const SAVE_TOKEN = process.env.NEXT_PUBLIC_SAVE_TOKEN;

const textGuides = {
    image: text.writePost.image,
    title: text.writePost.title,
    body: text.writePost.body
}

const placeholder = `${textGuides.image} \n ${textGuides.title} \n ${textGuides.body}`
const authorPlaceholder = `${text.addPostForm.authorPlaceholder}`
const descriptionPlaceholder = `${text.addPostForm.optional}`

export default function WritePost() {
    const { data: session } = useSession()
    const [value, setValue] = useState(placeholder);
    const [unsavedChangesOnValue, setUnsavedChangesOnValue] = useState()
    const [authorName, setAuthorName] = useState()
    const [description, setDescription] = useState()
    const [status, setStatus] = useState();
    const [published, setPublished] = useState();
    const [unsavedChanges, setUnsavedChanges] = useState()
    const {asPath} = useRouter()

    useEffect(() => {
        ifLocalStorageSetState('postText', setValue)
        ifLocalStorageSetState('postAuthor', setAuthorName)
        ifLocalStorageSetState('postDescription', setDescription)
    }, [])

    useEffect(() => {
        const unsavedChangesOnEditor = checkUnsavedChangesOnEditor('postText', placeholder)
        if (unsavedChangesOnEditor){
            setUnsavedChangesOnValue(true)
        }
    }, [unsavedChangesOnValue])

    useEffect(() => {
        const unsavedChangesOnForm = checkUnsavedChangesOnForm('postAuthor',
        'postDescription')
        if (unsavedChangesOnForm){
            setUnsavedChanges(true)
        }
    }, [unsavedChanges])

    const handleData = (data) => {
        setLocalStorageAndState('postText', data, setValue)
        if (data === placeholder) {
            setUnsavedChangesOnValue(false)
        }
    }

    const handleFormChange = (e) => {
        e.preventDefault()
        const authorName = e.target.form.author.value;
        const description = e.target.form.description.value;
        setLocalStorageAndState('postAuthor', authorName, setAuthorName)
        setLocalStorageAndState('postDescription', description, setDescription)
        setUnsavedChanges(true)
        if (authorName === '' && description === ''){
            setUnsavedChanges(false)
        }
    }

    function cancelAction() {
        setStatus(null)
    }

    const publishPost = async (value, authorName, description) => {

        const rawData = {
            fileContent: value,
            authorName: authorName || "Default",
            description: description || " "
        }

        const format = await fetch(`${BASE_URL}/format-data`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${SAVE_TOKEN}`
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

        const postData = await format.json()
        const newPost = postData.newPost

        setStatus({ alert: "messageAlert", message: `${text.writePost.publishing}` })

        const publish = await fetch(`${BASE_URL}/save-post`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${SAVE_TOKEN}`
            },
            referrerPolicy: 'no-referrer',
            body: JSON.stringify(newPost)
        })

        if (publish.ok) {
            // CLEAN CLOUDINARY blog-reflexion/posts, see manual for more. Don't enable until is tested.
            // const cleanImagesFolderREq = await fetch(`${BASE_URL}/images/clean-folder`)
            // const cleanFolder = await cleanImagesFolderREq.json()
            setStatus({ alert: "messageAlert", message: `${text.writePost.postPublished}` })
            setUnsavedChanges(false)
            setPublished(true)
            setUnsavedChangesOnValue(false)
            cleanLocalStorage('postText')
            cleanLocalStorage('postAuthor')
            cleanLocalStorage('postDescription')
        } else {
            const errorMsg = await publish.json();
            setStatus({ alert: "bodyAlert", message: errorMsg.error })
            return;
        }
        return
    }

    const handlePublish = (e) => {
        e.preventDefault()
        publishPost(value, authorName, description)
    }

    const handleDiscardChanges = () => {
        cleanLocalStorage('postText')
        cleanLocalStorage('postAuthor')
        cleanLocalStorage('postDescription')
        setStatus({ alert: "messageAndRefresh-Discard", message: `${text.editPost.changesHaveBeenDiscarded}`})
    }

    const alertToDiscard = () => {
        setStatus({ alert: "discardChanges", message: `${text.editPost.confirmDiscardChanges}`})
    }

    if (session) {
        return (
            <Layout home dashboard>
                <Head>
                    <title>{data.title} - {text.writePost.writePost}</title>
                </Head>
                <Header />
                    <section>
                        <h2>{text.writePost.newPost}</h2>
                        {status ? (
                            <Alert data={status} cancelAction={cancelAction} downloadFile={undefined} deletePost={undefined} resetCounter={undefined} url={asPath} discardChanges={handleDiscardChanges} />
                        ):(
                            <>
                                <div>    
                                    <Editor postBody={value} handleData={handleData} parentUnsavedChanges={unsavedChangesOnValue} setParentUnsavedChanged={setUnsavedChangesOnValue}/>

                                    <ImagesUploadForm/>
                                    
                                    <MetadataForm handleChange={handleFormChange} authorName={authorName} description={description}/>
                                </div>
                                <div className={styles.btnContainer}>
                                    {unsavedChanges || unsavedChangesOnValue ? (
                                        <>
                                            <button className="btnPublish" onClick={handlePublish}>{text.editor.saveChanges}</button>
                                            <button className="btnDelete" onClick={alertToDiscard}>{text.editor.discardChanges}</button>    
                                        </>
                                        ) : (
                                        <>  
                                            <button className="btnPublish-disabled">{text.editor.saveChanges}</button>
                                            <button className="btnDelete-disabled">{text.editor.discardChanges}</button>    
                                        </>
                                    )}
                                </div>
                            </>
                        )}
                    </section>
                    <div className={styles.btnContainer}>
                        <Link href='/admin/dashboard'>
                            <a>← {text.writePost.goDashboard}</a>
                        </Link>
                    </div>
            </Layout>
            
        )
    }

    return (
        <Restricted />
    )
}