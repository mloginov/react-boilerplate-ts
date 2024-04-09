import * as projectsManager from '../api/projects-manager';
import { useQuery } from '@tanstack/react-query';
import { ProjectsListView } from '../api/projects-manager';

const projectsKeys = {
  all: ['projects'] as const,
  lists: () => [...projectsKeys.all, 'list'] as const,
  list: (view: ProjectsListView) => [...projectsKeys.lists(), view] as const,
  details: () => [...projectsKeys.all, 'detail'] as const,
  detail: (id: string) => [...projectsKeys.details(), id] as const,
};

export const useProjects = (view: ProjectsListView, options: object = {}) => {
  return useQuery({
    queryKey: projectsKeys.list(view),
    queryFn: () => projectsManager.fetchProjects(view),
    ...options,
  });
};
