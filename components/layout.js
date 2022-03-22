import Head from 'next/head'
import styles from './layout.module.css'
import Link from 'next/link'
import Logo from '../components/logo'
import LogoAdmin from '../components/logo-admin'
import Footer from './Footer'
import { data, text } from '../lib/data'

const BASE_URL = process.env.BASE_URL
const URL = process.env.NEXT_PUBLIC_URL;

export default function Layout({ children, home, post, dashboard }) {

    return (
        <>
            <Head>
                {post ? (
                    <>
                        {/* Base meta tags */}
                        <meta httpEquiv='Content-Language' content={data.language} />
                        <link rel="icon" href="/favicon.ico" />
                        {/* OpenGraph */}
                        <meta property="og:site_name" content={data.name} />
                        <meta property="og:image" content={data.ogImage} />
                        {/* Twitter */}
                        <meta name="twitter:card" content="summary_large_image" />
                        <meta name="twitter:image" content={data.ogImage} />
                    </>

                ) : (
                    <>
                        {/* Base meta tags */}
                        <meta httpEquiv='Content-Language' content={data.language} />
                        <link rel="icon" href="/favicon.ico" />
                        <meta name="title" content={data.title} />
                        <meta name="description" content={data.description} />
                        {/* OpenGraph */}
                        <meta property="og:site_name" content={data.name} />
                        <meta property="og:title" content={data.title} />
                        <meta property="og:description" content={data.description} />
                        <meta property="og:image" content={data.ogImage} />
                        <meta property="og:url" content={URL} />
                        {/* Twitter */}
                        <meta name="twitter:card" content="summary_large_image" />
                        <meta name="twitter:title" content={data.title} />
                        <meta name="twitter:description" content={data.description} />
                        <meta name="twitter:image" content={data.ogImage} />
                    </>
                )}

            </Head>
            <nav className={styles.nav}>
                {dashboard ? (
                    // eslint-disable-next-line @next/next/no-html-link-for-pages
                    <a className={styles.logoLink} href="/"><Logo /></a>
                ) : (
                    <Link href="/">
                        <a className={styles.logoLink}>
                            <Logo />
                        </a>
                    </Link>
                )}

                <Link href={`${data.contactUrl}`}>
                    <a className={styles.chat} target="_blank" rel="no-referrer">
                        {text.layout.comment}
                    </a>
                </Link>
                <Link href="/admin/dashboard">
                    <a>
                        <LogoAdmin />
                    </a>
                </Link>
            </nav>
            <div className={styles.container}>
                <main className={styles.main}>{children}</main>
                {!home && (
                    <div className={styles.backToHome}>
                        <Link href='/'>
                            <a>← {text.layout.home}</a>
                        </Link>
                    </div>
                )}
                {home &&
                    !dashboard &&
                    <footer className={styles.footer}>
                        {data.social.map((s, i) => (
                            < a href={s.url} target="_blank" rel="noopener noreferrer" key={`${i}-${s.name}`} >{s.name}</a >
                        ))}
                    </footer>
                }
            </div>
        </>
    )

}