import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/client';
import Head from 'next/head';
import { RichText } from 'prismic-dom';
import { getPrismicClient } from 'services/prismic';
import { formatDate } from 'utils/helpers';
import { Pages } from 'utils/paths';

import styles from './post.module.scss';

interface Props {
  post: {
    slug: string;
    title: string;
    content: string;
    updatedAt: string;
  };
}

export const Post = (props: Props) => {
  const { post } = props;

  return (
    <>
      <Head>
        <title>{post.title} | ig.news</title>
      </Head>

      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{post.title}</h1>
          <time>{post.updatedAt}</time>

          <div
            className={styles.postContent}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
      </main>
    </>
  );
};

export default Post;

export const getServerSideProps: GetServerSideProps<Props> = async ({
  req,
  params,
}) => {
  const session = await getSession({ req });
  const { slug } = params;

  console.log(session);

  if (!session.activeSubscription) {
    return {
      redirect: {
        destination: Pages.HOME,
        permanent: false,
      },
    };
  }

  const prismic = getPrismicClient(req);

  const response = await prismic.getByUID('post', String(slug), {});

  const post = {
    slug: String(slug),
    title: RichText.asText(response.data.title),
    content: RichText.asHtml(response.data.content),
    updatedAt: formatDate(response.last_publication_date),
  };

  return {
    props: { post },
  };
};
