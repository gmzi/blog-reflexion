import Link from 'next/link';
import Date from '../components/date';
import Layout from '../components/layout';
import utilStyles from '../styles/utils.module.css';
import { connectToDatabase } from '../lib/mongodb';
import { data, text } from '../lib/data';
import Image from 'next/image';

const MONGODB_COLLECTION = process.env.MONGODB_COLLECTION;

export default function Home({ posts }) {
  return (
    <Layout home>
      <section>
        {!posts.length ? (
          <p>No posts yet...</p>
        ) : (
          <ul className={utilStyles.cardList}>
            {posts.map(({ _id, fileName, title, author, date, image_url }) => (
              <li className={utilStyles.cardListItem} key={_id}>
                <div className={utilStyles.cardContainer}>
                  <Link href={`/posts/${fileName}`} passHref>
                    <div className={utilStyles.card}>
                      {/* <div className={utilStyles.imgContainer}>
                        <img src={image_url} alt="test" />
                      </div> */}
                      <Image width={500} height={500} src={image_url} />
                      <a>
                        <span>{title}</span>{' '}
                        <span className="postDate">
                          {text.index.by} {author}
                        </span>
                      </a>
                    </div>
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </Layout>
  );
}

export async function getStaticProps() {
  const { db } = await connectToDatabase();

  const query = {};
  const sort = { date: -1, fileName: 1 };

  const posts = await db
    .collection(MONGODB_COLLECTION)
    .find(query)
    .sort(sort)
    .toArray();

  return {
    props: {
      posts: JSON.parse(JSON.stringify(posts)),
    },
  };
}

/*
<Link href={`/posts/${fileName}`}>
  <a><span>{title}</span><span className={utilStyles.lightText}> {text.index.by} {author}</span></a>
</Link>
*/
