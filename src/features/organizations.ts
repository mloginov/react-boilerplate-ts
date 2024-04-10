import * as organizationsManager from '../api/organizations-manager';
import { useQuery } from '@tanstack/react-query';
import { OrganizationListView } from '../api/organizations-manager';

const organizationsKeys = {
  all: ['organizations'] as const,
  lists: () => [...organizationsKeys.all, 'list'] as const,
  list: (view: OrganizationListView) => [...organizationsKeys.lists(), view] as const,
  details: () => [...organizationsKeys.all, 'detail'] as const,
  detail: (id: string) => [...organizationsKeys.details(), id] as const,
};

export const useOrganizations = (view: OrganizationListView, options: object = {}) => {
  return useQuery({
    queryKey: organizationsKeys.list(view),
    queryFn: () => organizationsManager.fetchOrganizations(view),
    ...options,
  });
};

export const useOrganizationDetails = (id: string, options: object = {}) => {
  return useQuery({
    queryKey: organizationsKeys.detail(id),
    queryFn: () => organizationsManager.fetchDetails(id),
    ...options,
  });
};
