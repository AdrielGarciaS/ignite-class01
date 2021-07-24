import { useQuery } from 'react-query';
import { api } from 'services/api';
import { formatDateToApp } from 'util/helper';

export const getUsers = async (): Promise<User[]> => {
  const response = await api.get('users');
  const users = response.data.users.map(user => ({
    ...user,
    createdAt: formatDateToApp(user.createdAt),
  }));

  return users;
};

const fiveSeconds = 1000 * 5;

export const useUsers = () => {
  return useQuery('users', getUsers, {
    staleTime: fiveSeconds,
  });
};
