import Link from 'next/link';
import Date from '../components/date';
import Layout from '../components/layout';
import utilStyles from '../styles/utils.module.css';
import { connectToDatabase } from '../lib/mongodb';
import { data, text } from '../lib/data';

const MONGODB_COLLECTION = process.env.MONGODB_COLLECTION;

export default function Home({ posts }) {
  return (
    <Layout home>
      <section>
        {!posts.length ? (
          <p>No posts yet...</p>
        ) : (
          <div className={utilStyles.container}>
            {posts.map(({ _id, fileName, title, author, date, image_url }) => (
              <Link href={`/posts/${fileName}`} passHref key={_id}>
                <div className={utilStyles.box}>
                  <img src={image_url} alt="test" />
                  <h2>{title}</h2>
                  <span className="postDate">
                    {text.index.by} {author}
                  </span>
                </div>
              </Link>
            ))}
          </div>
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
