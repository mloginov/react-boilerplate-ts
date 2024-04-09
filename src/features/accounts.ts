import * as accountsManager from '../api/accounts-manager';
import { useQuery } from '@tanstack/react-query';
import { AccountListView } from '../api/accounts-manager';

const accountsKeys = {
  all: ['accounts'] as const,
  lists: () => [...accountsKeys.all, 'list'] as const,
  list: (view: AccountListView) => [...accountsKeys.lists(), view] as const,
  details: () => [...accountsKeys.all, 'detail'] as const,
  detail: (id: string) => [...accountsKeys.details(), id] as const,
};

export const useAccounts = (view: AccountListView, options: object = {}) => {
  return useQuery({
    queryKey: accountsKeys.list(view),
    queryFn: () => accountsManager.fetchAccounts(view),
    ...options,
  });
};

export const useAccountDetails = (id: string, options: object = {}) => {
  return useQuery({
    queryKey: accountsKeys.detail(id),
    queryFn: () => accountsManager.fetchDetails(id),
    ...options,
  });
};
