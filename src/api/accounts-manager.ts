import { faker } from '@faker-js/faker';

import { ListView, PageFilter, stall } from './helper';

export interface AccountsData {
  accounts: Account[];
  totalCount: number;
}

export interface Account {
  id: string;
  userName: string;
  email: string;
  createdAt: Date;
  lastLogin: Date;
  projects: number;
  connections: number;
}

export interface AccountViewFilter extends PageFilter {
  username?: string | null;
  id?: string | null;
  email?: string | null;
  project?: string | null;
  domain?: string | null;
  suspended?: boolean;
}

export interface AccountListView extends ListView {
  filter: AccountViewFilter;
}

enum UserType {
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT',
}

export interface AccountDetails {
  id: string;
  userName: string;
  fullName: string;
  email: string;
  createdAt: Date;
  lastLogin: Date;
  subscription: any;
  status: any;
  projectsCount: number;
  type: UserType;
  ips: string[];
}

const accountFixture = (): Account => ({
  id: faker.string.uuid(),
  userName: faker.internet.userName(),
  email: faker.internet.email(),
  createdAt: faker.date.past(),
  lastLogin: faker.date.recent(),
  projects: faker.number.int({ max: 100 }),
  connections: faker.number.int({ max: 20 }),
});

export const fetchAccounts = async (view: AccountListView): Promise<AccountsData> => {
  console.log('fetchAccounts view', view);
  await stall();
  const accounts = [...new Array(20)].map(accountFixture);
  return {
    accounts,
    totalCount: 1027,
  };
};

const accountDetailsFixture = (): AccountDetails => {
  return {
    id: faker.string.uuid(),
    userName: faker.internet.userName(),
    fullName: faker.person.fullName(),
    email: faker.internet.email(),
    createdAt: faker.date.past(),
    lastLogin: faker.date.recent(),
    subscription: null,
    status: null,
    type: faker.helpers.arrayElement([UserType.STUDENT, UserType.TEACHER]),
    ips: [...new Array(faker.number.int({ min: 1, max: 10 }))].map(faker.internet.ip),
    projectsCount: faker.number.int({ max: 5000 }),
  };
};

export const fetchDetails = async (id: string): Promise<AccountDetails> => {
  console.log('account fetchDetails', id);
  await stall();
  return accountDetailsFixture();
};
