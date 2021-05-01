import { GetServerSideProps } from 'next';
import Head from 'next/head';

import { stripe } from 'services/stripe';
import { formatCurrency } from 'utils/helpers';
import { SubscribeButton } from 'components/SubscribeButton';

import styles from './home.module.scss';

interface Props {
  product: {
    priceId: string;
    amount: string;
  };
}

const Home = (props: Props) => {
  const { product } = props;

  return (
    <>
      <Head>
        <title>Home | ig.news</title>
      </Head>

      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👏 Hey, welcome</span>

          <h1>
            News about the <span>React</span> world.
          </h1>

          <p>
            Get access about all the publications <br />
            <span>for {product.amount} month</span>
          </p>

          <SubscribeButton priceId={product.priceId} />
        </section>

        <img src="/images/avatar.svg" alt="Girl coding" />
      </main>
    </>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const price = await stripe.prices.retrieve('price_1ImKVUIkpQdfiLhQNKgCEQJs');

  const product = {
    priceId: price.id,
    amount: formatCurrency(price.unit_amount / 100),
  };

  return {
    props: {
      product,
    },
  };
};
