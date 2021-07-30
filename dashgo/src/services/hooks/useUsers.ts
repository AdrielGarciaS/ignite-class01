import { useQuery, UseQueryOptions, UseQueryResult } from 'react-query';
import { api } from 'services/api';
import { formatDateToApp } from 'util/helper';

interface GetUsersParams {
  page?: number;
}

export interface GetUsersResponse {
  users: User[];
  totalCount: number;
}

export const getUsers = async (
  params?: GetUsersParams,
): Promise<GetUsersResponse> => {
  const { page = 1 } = params ?? {};

  const response = await api.get('users', { params: { page } });

  const totalCount = Number(response.headers['x-total-count']);

  const users = response.data.users.map(user => ({
    ...user,
    createdAt: formatDateToApp(user.createdAt),
  }));

  return { users, totalCount };
};

const tenMinutes = 1000 * 60 * 10;

interface UseUsersParams {
  page?: number;
}

export const useUsers = (
  params?: UseUsersParams,
  options?: UseQueryOptions,
) => {
  const { page = 1 } = params ?? {};

  return useQuery(['users', page], () => getUsers({ page }), {
    staleTime: tenMinutes,
    ...options,
  }) as UseQueryResult<GetUsersResponse, unknown>;
};
