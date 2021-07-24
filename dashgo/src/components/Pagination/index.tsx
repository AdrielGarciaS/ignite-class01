import { HStack, Stack, Box, Text } from '@chakra-ui/react';
import { PaginationItem } from './PaginationItem';

interface Props {
  totalCountOfRegisters: number;
  registerPerPage?: number;
  currentPage?: number;
  onPageChange(page: number): void;
}

const siblingsCount = 1;

const generatePagesArray = (from: number, to: number) => {
  return Array.from({ length: to - from }, (_, index) => {
    return from + index + 1;
  }).filter(page => page > 0);
};

export const Pagination = (props: Props) => {
  const {
    totalCountOfRegisters,
    currentPage = 1,
    registerPerPage = 10,
    onPageChange,
  } = props;
  const lastPage = Math.ceil(totalCountOfRegisters / registerPerPage);

  const generatePreviousPages = () => {
    if (currentPage <= 1) return [];

    const from = currentPage - 1 - siblingsCount;
    const to = currentPage - 1;

    return generatePagesArray(from, to);
  };

  const generateNextPages = () => {
    if (currentPage === lastPage) return [];

    const from = currentPage;
    const to = Math.min(currentPage + siblingsCount, lastPage);

    return generatePagesArray(from, to);
  };

  const previousPages = generatePreviousPages();
  const nextPages = generateNextPages();

  const showFirstPage = currentPage > 1 + siblingsCount;
  const showLastPage = currentPage + siblingsCount < lastPage;
  const showPreviousPagesEllipsis = currentPage > 2 + siblingsCount;
  const showNextPagesEllipsis = currentPage + 1 + siblingsCount < lastPage;

  const showPreviousPages = Boolean(previousPages.length);
  const showNextPages = Boolean(nextPages.length);

  return (
    <Stack
      mt="8"
      justify="space-between"
      align="center"
      spacing="6"
      direction={['column', 'row']}
    >
      <Box>
        <strong>0</strong> - <strong>10</strong> de <strong>100</strong>
      </Box>

      <HStack spacing="2">
        {showFirstPage && (
          <>
            <PaginationItem number={1} />

            {showPreviousPagesEllipsis && (
              <Text color="gray.300" w="6" textAlign="center">
                ...
              </Text>
            )}
          </>
        )}

        {showPreviousPages &&
          previousPages.map(page => (
            <PaginationItem key={page} number={page} />
          ))}

        <PaginationItem number={currentPage} isCurrent />

        {showNextPages &&
          nextPages.map(page => <PaginationItem key={page} number={page} />)}

        {showLastPage && (
          <>
            {showNextPagesEllipsis && (
              <Text color="gray.300" w="6" textAlign="center">
                ...
              </Text>
            )}

            <PaginationItem number={lastPage} />
          </>
        )}
      </HStack>
    </Stack>
  );
};
