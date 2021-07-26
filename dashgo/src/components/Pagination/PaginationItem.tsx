import { Button } from '@chakra-ui/react';

interface PaginationItemProps {
  number: number;
  isCurrent?: boolean;
  onPageChange(page: number): void;
}

export const PaginationItem = (props: PaginationItemProps) => {
  const { isCurrent = false, number, onPageChange } = props;

  const onClick = () => {
    onPageChange(number);
  };

  if (isCurrent) {
    return (
      <Button
        size="sm"
        fontSize="xs"
        w="4"
        colorScheme="pink"
        disabled
        _disabled={{
          bg: 'pink.500',
          cursor: 'default',
        }}
      >
        {number}
      </Button>
    );
  }

  return (
    <Button
      size="sm"
      fontSize="xs"
      w="4"
      colorScheme="pink"
      bg="gray.700"
      _hover={{
        bg: 'gray.500',
      }}
      onClick={onClick}
    >
      {number}
    </Button>
  );
};
