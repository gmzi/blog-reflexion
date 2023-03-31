import utilStyles from '../styles/utils.module.css';

export default function PostComponent({ post }) {
  return (
    <article className={utilStyles.article}>
      <img src={post.image_url} alt="image" />
      <h1 className="postHeading">{post.title}</h1>
      <div
        className="postContent"
        dangerouslySetInnerHTML={{ __html: post.contentHtml }}
      />
    </article>
  );
}
