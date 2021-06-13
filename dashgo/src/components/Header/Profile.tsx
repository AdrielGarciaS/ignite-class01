import { Flex, Box, Text, Avatar } from '@chakra-ui/react';

interface ProfileProps {
  showProfileData: boolean;
}

export const Profile = (props: ProfileProps) => {
  const { showProfileData } = props;

  return (
    <Flex align="center">
      {showProfileData && (
        <Box mr="4" textAlign="right">
          <Text>Adriel Garcia</Text>
          <Text color="gray.300" fontSize="small">
            adrielgarcia@live.com
          </Text>
        </Box>
      )}

      <Avatar
        size="md"
        name="Adriel Garcia"
        src="https://github.com/adrielgarcias.png"
      />
    </Flex>
  );
};
