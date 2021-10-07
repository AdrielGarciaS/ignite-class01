import { SimpleGrid, useDisclosure } from '@chakra-ui/react';
import { useState } from 'react';
import { Card } from './Card';
import { ModalViewImage } from './Modal/ViewImage';

interface Card {
  title: string;
  description: string;
  url: string;
  ts: number;
  id: string;
}

interface CardsProps {
  cards: Card[];
}

export function CardList({ cards }: CardsProps): JSX.Element {
  const [imgUrl, setImgUrl] = useState('');

  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleOpenViewImage = (imageUrl: string) => (): void => {
    setImgUrl(imageUrl);
    onOpen();
  };

  return (
    <>
      <SimpleGrid templateColumns="repeat(3, 1fr)" gap="2.5rem">
        {cards.map(card => (
          <Card
            key={card.id}
            data={card}
            viewImage={handleOpenViewImage(card.url)}
          />
        ))}
      </SimpleGrid>

      <ModalViewImage isOpen={isOpen} onClose={onClose} imgUrl={imgUrl} />
    </>
  );
}
