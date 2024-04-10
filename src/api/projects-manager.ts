import { faker } from '@faker-js/faker';

import { ListView, PageFilter, stall } from './helper';

export interface ProjectsViewFilter extends PageFilter {
  name?: string | null;
}

export interface ProjectsListView extends ListView {
  filter: ProjectsViewFilter;
}

export interface Project {
  id: string;
  name: string;
  fileServer: string;
  createdAt: Date;
  lastAccessed: Date;
  private: boolean;
}

const projectFixture = (): Project => {
  return {
    id: faker.string.uuid(),
    name: faker.internet.userName(),
    fileServer: faker.internet.domainName(),
    createdAt: faker.date.past(),
    lastAccessed: faker.date.recent(),
    private: faker.datatype.boolean(),
  };
};

export const fetchProjects = async (view: ProjectsListView): Promise<Project[]> => {
  console.log('fetchProjects view', view);
  await stall();
  return [...new Array(20)].map(projectFixture);
};
