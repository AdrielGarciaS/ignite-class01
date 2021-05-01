import styles from './styles.module.scss';

interface Props {
  priceId: string;
}

export const SubscribeButton = (props: Props) => {
  const { priceId } = props;

  return (
    <button type="button" className={styles.subscribeButton}>
      Subscribe now
    </button>
  );
};
