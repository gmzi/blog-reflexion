import React, { useState, useEffect } from "react";
import Layout from "./layout"
import Head from "next/head"
import Header from './header'
import Link from "next/link"
import { text } from "../lib/data";
import rehypeSanitize from "rehype-sanitize";
import { grabText } from "../lib/grabText";
import Alert from './alert'
import styles from '../styles/dashboard.module.css'
import utilStyles from '../styles/utils.module.css'
import { useRouter } from "next/router";



// -----------------------------------------------------------
// NEXT.JS configuration for @uiw
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";

const MDEditor = dynamic(
    () => import("@uiw/react-md-editor"),
    {
        loading: () => <p>{text.editor.loading}</p>,
        ssr: false
    },
);
// ------------------------------------------------------------ 

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const SAVE_TOKEN = process.env.NEXT_PUBLIC_SAVE_TOKEN;

export default function Editor({ body, id, updatePost }) {

    const [value, setValue] = useState(body);
    const [status, setStatus] = useState();
    const [published, setPublished] = useState();
    const router = useRouter()
    const [unsavedChanges, setUnsavedChanges] = useState();

    useEffect(() => {
        const confirmationMessage = `${text.editor.youHaveUnsaved}`;
        const beforeUnloadHandler = (e) => {
            (e || window.event).returnValue = confirmationMessage;
            return confirmationMessage; // Gecko + Webkit, Safari, Chrome etc.
        };
        const beforeRouteHandler = (url) => {
            if (router.pathname !== url && !confirm(confirmationMessage)) {
                // to inform NProgress or something ...
                router.events.emit('routeChangeError');
                // tslint:disable-next-line: no-string-throw
                throw `Route change to "${url}" was aborted (this error can be safely ignored). See https://github.com/zeit/next.js/issues/2476.`;
            }
        };
        if (unsavedChanges) {
            window.addEventListener('beforeunload', beforeUnloadHandler);
            router.events.on('routeChangeStart', beforeRouteHandler);
        } else {
            window.removeEventListener('beforeunload', beforeUnloadHandler);
            router.events.off('routeChangeStart', beforeRouteHandler);
        }
        return () => {
            window.removeEventListener('beforeunload', beforeUnloadHandler);
            router.events.off('routeChangeStart', beforeRouteHandler);
        };
    }, [unsavedChanges]);





    const handleChange = (e) => {
        setUnsavedChanges(true)
        // localStorage.setItem(
        //     `blogText-${id}`,
        //     JSON.stringify(e)
        // );
        setValue(e)
    }


    function cancelAction() {
        setStatus(null)
    }

    const handleUpdate = () => {
        setUnsavedChanges(false)
        updatePost(value)
    }

    return (
        <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
            {published ? (
                <Alert data={status} cancelAction={cancelAction} downloadFile={undefined} deletePost={undefined} resetCounter={undefined} />
            ) : (
                <div className={`${styles.parent}`}>
                    {status ? (
                        <Alert data={status} cancelAction={cancelAction} downloadFile={undefined} deletePost={undefined} resetCounter={undefined} />
                    ) : null}
                    <div>
                        <MDEditor className={styles.editor} value={value} onChange={handleChange} textareaProps={{ spellCheck: true }}
                            previewOptions={{
                                rehypePlugins: [[rehypeSanitize]]
                            }}
                        />
                    </div>
                    <div className={styles.btnContainer}>
                        <button className={`${styles.button} ${styles.buttonPublish}`} onClick={handleUpdate}>{text.editor.saveChanges}</button>
                    </div>
                </div>
            )}
        </section >
    )
}