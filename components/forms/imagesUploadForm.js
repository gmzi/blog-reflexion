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


const server_url = process.env.NEXT_PUBLIC_NEW_POST_URL;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const SAVE_TOKEN = process.env.NEXT_PUBLIC_SAVE_TOKEN;

export default function ImagesUploadForm() {
    return (
        
            <form id="myForm" method="POST" encType="multipart/form-data" action={`${BASE_URL}/images/upload`}>
                <input type="file" id="image1" name="image1" />
                <input type="submit" value="Submit"/>
            </form> 
    )
}