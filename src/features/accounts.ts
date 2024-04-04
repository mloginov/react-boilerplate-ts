import * as accountsManager from '../api/accounts-manager'
import {useQuery} from "@tanstack/react-query";

const accountsKeys = {
  all: ['accounts'] as const,
  lists: () => [...accountsKeys.all, 'list'] as const,
  list: (page: number) => [...accountsKeys.lists(), page] as const,
  details: () => [...accountsKeys.all, 'detail'] as const,
  detail: (id: number) => [...accountsKeys.details(), id] as const,
}

export const useAccounts = (page: number, options:object = {}) => {
  return useQuery({
    queryKey: accountsKeys.list(page),
    queryFn: accountsManager.fetchAccounts,
    ...options
  })
}
