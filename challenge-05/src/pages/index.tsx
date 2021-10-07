import { Button, Box, Center } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';

import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

export default function Home(): JSX.Element {
  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    'images',
    async context => {
      const { pageParam = null } = context;

      const response = await api.get('/images', {
        params: { after: pageParam },
      });

      return response.data;
    },
    {
      getNextPageParam: lastPage => {
        if (lastPage.after) return lastPage.after;

        return null;
      },
    }
  );

  const formattedData = useMemo(() => {
    return data?.pages.map(page => page.data).flat(Infinity);
  }, [data]);

  if (isLoading) return <Loading />;

  if (isError) return <Error />;

  return (
    <>
      <Header />

      <Box maxW={1120} px={20} mx="auto" my={20}>
        <CardList cards={formattedData} />

        {hasNextPage && (
          <Center>
            <Button
              isLoading={isFetchingNextPage}
              onClick={() => fetchNextPage()}
              mt="2.5rem"
              w="25rem"
            >
              Carregar mais
            </Button>
          </Center>
        )}
      </Box>
    </>
  );
}
