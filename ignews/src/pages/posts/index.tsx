import { GetStaticProps } from 'next';
import Link from 'next/link';
import Prismic from '@prismicio/client';
import Head from 'next/head';
import { getPrismicClient } from 'services/prismic';
import { RichText } from 'prismic-dom';

import { formatDate } from 'utils/helpers';
import { Pages } from 'utils/paths';

import styles from './styles.module.scss';

interface Post {
  slug: string;
  title: string;
  excerpt: string;
  updatedAt: string;
}
interface PostsProps {
  posts: Post[];
}

const Posts = (props: PostsProps) => {
  const { posts } = props;

  return (
    <>
      <Head>
        <title>Posts | ig.news</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          {posts.map(post => (
            <Link href={`${Pages.POSTS}/${post.slug}`} key={post.slug}>
              <a>
                <time>{post.updatedAt}</time>
                <strong>{post.title}</strong>
                <p>{post.excerpt}</p>
              </a>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
};

export default Posts;

export const getStaticProps: GetStaticProps<PostsProps> = async () => {
  const prismic = getPrismicClient();

  const response = await prismic.query(
    [Prismic.predicates.at('document.type', 'post')],
    {
      fetch: ['post.title', 'post.content'],
      pageSize: 100,
    },
  );

  const posts = response.results.map(post => {
    const firstParagraph = post.data.content.find(
      content => content.type === 'paragraph',
    )?.text;

    return {
      slug: post.uid,
      title: RichText.asText(post.data.title),
      excerpt: firstParagraph ?? '',
      updatedAt: formatDate(post.last_publication_date),
    };
  });

  return {
    props: { posts },
  };
};
