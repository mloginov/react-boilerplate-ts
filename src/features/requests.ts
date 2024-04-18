import * as requestsManager from '../api/requests-manager';
import { useQuery } from '@tanstack/react-query';
import { RequestType } from '../api/requests-manager';

export interface RequestsView {
  type?: RequestType;
  search?: string;
}

const requestsKeys = {
  all: ['requests'] as const,
  count: () => [...requestsKeys.all, 'count'] as const,
  lists: () => [...requestsKeys.all, 'list'] as const,
  list: (view: RequestsView) => [...requestsKeys.lists(), view] as const,
  details: () => [...requestsKeys.all, 'detail'] as const,
  detail: (id: string) => [...requestsKeys.details(), id] as const,
};

export const useRequestsCount = (options: object = {}) => {
  return useQuery({
    queryKey: requestsKeys.count(),
    queryFn: requestsManager.fetchRequestsCount,
    ...options,
  });
};

export const useRequests = (view: RequestsView, options: object = {}) => {
  return useQuery({
    queryKey: requestsKeys.list(view),
    queryFn: () => requestsManager.fetchRequests(view),
    ...options,
  });
};
