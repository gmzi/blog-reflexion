import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Restricted from "./restricted";
import Layout from "./layout";
import Head from "next/head";
import Header from "./header";
import { data, text } from "../lib/data";
import Alert from "./alert";
import Link from 'next/link';
import styles from '../styles/dashboard.module.css'
import { useRouter } from 'next/router';

const MONGODB_COLLECTION = process.env.MONGODB_COLLECTION;
const API_URL = process.env.NEXT_PUBLIC_BASE_URL;
const URL = process.env.NEXT_PUBLIC_URL;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const SAVE_TOKEN = process.env.NEXT_PUBLIC_SAVE_TOKEN;

export default function NotFound() {
    const { data: session } = useSession()

    if (session) {
        return (
            <Layout home dashboard>
                <Head>
                    <title>not found</title>
                </Head>
                <Header />
                <section>
                    <h3>That&apos;s not found, sorry</h3>                    
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
        <Layout home>
                <Head>
                    <title>not found</title>
                </Head>
                <Header />
                <section>
                    <h3>That&apos;s not found, sorry</h3>                    
                </section>
                <div className={styles.btnContainer}>
                    <Link href='/'>
                        <a>← {text.addPostForm.home}</a>
                    </Link>
                </div>
            </Layout>
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