import * as requestsManager from '../../api/requests-manager'
import {useQuery} from "@tanstack/react-query";

const requestsKeys = {
  all: ['requests'] as const
}

export const useAllRequests = (options:object = {}) => {
  return useQuery({
    queryKey: requestsKeys.all,
    queryFn: requestsManager.fetchRequests,
    ...options
  })
}
