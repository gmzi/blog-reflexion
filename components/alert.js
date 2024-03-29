import Link from "next/link"
import styles from "./alert.module.css"
import { text } from "../lib/data"


export default function Alert({ data, cancelAction, downloadFile, deletePost, resetCounter, url, discardChanges }) {

    function handleCancel() {
        if (data.alert === "titleAlert") {
            refreshData()
            return;
        }
        cancelAction()
        return;
    }

    function handleReset() {
        resetCounter(data.id)
    }

    function handleDownload() {
        downloadFile(null, data.id)
    }

    function handleDelete() {
        deletePost(data.id, data.name)
    }

    function handleDiscardChanges(){
        discardChanges()
    }

    if (data.alert === "resetAlert") {
        return (
            <div className={styles.alert}>
                <div className="alertContainer">
                    <h4>{text.alert.resetCounter}</h4>
                    <p>{text.alert.thisAction}</p>
                    <div className={styles.btnContainer}>
                        <button onClick={handleCancel}>{text.alert.cancel}</button>
                        <button className="btnDelete" onClick={handleReset}>{text.alert.reset}</button>
                    </div>
                </div>
            </div>
        )
    }


    if (data.alert === "deletionAlert") {
        return (
            <div className={styles.alert}>
                <div className="alertContainer">
                    <h4>{text.alert.deleteCannot}</h4>
                    <p>{text.alert.youMight}</p>
                    <div className={styles.btnContainer}>
                        <button onClick={handleCancel}>{text.alert.cancel}</button>
                        <button onClick={handleDownload}>{text.alert.downloadPost}</button>
                        <button className="btnDelete" onClick={handleDelete}>{text.alert.deletePost}</button>
                    </div>
                </div>
            </div>
        )
    }

    if (data.alert === "discardChanges") {
        return (
            <div className={styles.alert}>
                <div className="alertContainer">
                    <h4>{data.message}</h4>
                    <div className={styles.btnContainer}>
                        <button onClick={handleCancel}>{text.alert.keepEditing}</button>
                        <button className="btnDelete" onClick={handleDiscardChanges}>{text.alert.discardChanges}</button>
                    </div>
                </div>
            </div>
        )
    }

    if (data.alert === 'titleAlert') {
        return (
            <div className="alertContainer">
                <p>{data.message}</p>
                <Link href="/admin/upload-post">
                    <a onClick={handleCancel}>{text.alert.ok}</a>
                </Link>
            </div>
        )
    }

    if (data.alert === 'bodyAlert') {
        return (
            <div className="alertContainer">
                <p>{data.message}</p>
                {/* <Link href="/admin/write-post"> */}
                <a onClick={handleCancel}>{text.alert.ok}</a>
                {/* </Link> */}
            </div>
        )
    }

    if (data.alert === 'messageAlert') {
        return (
            <div className="alertContainer">
                <p>{data.message}</p>
            </div>
        )
    }

    if (data.alert === 'messageAndRefresh') {
        return (
            <div className="alertContainer">
                <p>{data.message}</p>
                {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                <span><a href="/">{text.editPost.refreshIndex}</a> to see the changes</span>
            </div>
        )
    }

    if (data.alert === 'messageAndRefresh-Discard') {
        return (
            <div className="alertContainer">
                <p>{data.message}</p>
                {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                <span><a href={url}>{text.editPost.refresh}</a></span>
            </div>
        )
    }

    if (data.alert === 'default'){
        return (
            <div>
                <div className="alertContainer">
                <p>{data.message}</p>
                {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                {/* <span><a href={url}>{text.editPost.refresh}</a></span> */}
                <a onClick={handleCancel}>{text.alert.ok}</a>
            </div>
            </div>
        )
    }
}