import { Box, Stack, Icon, Text, Link } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { RiContactsLine, RiDashboardLine } from 'react-icons/ri';

interface NavSectionProps {
  title: string;
  children: ReactNode;
}

export const NavSection = (props: NavSectionProps) => {
  const { title, children } = props;

  return (
    <Box>
      <Text fontWeight="bold" color="gray.400" fontSize="small">
        {title}
      </Text>
      <Stack spacing="4" mt="8" align="stretch">
        {children}
      </Stack>
    </Box>
  );
};
