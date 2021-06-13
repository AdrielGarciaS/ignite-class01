import { Flex, Box, Text, Avatar } from '@chakra-ui/react';

export const Profile = () => {
  return (
    <Flex align="center">
      <Box mr="4" textAlign="right">
        <Text>Adriel Garcia</Text>
        <Text color="gray.300" fontSize="small">
          adrielgarcia@live.com
        </Text>
      </Box>

      <Avatar
        size="md"
        name="Adriel Garcia"
        src="https://github.com/adrielgarcias.png"
      />
    </Flex>
  );
};
