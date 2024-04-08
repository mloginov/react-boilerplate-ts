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
  await stall(1000);
  const accounts = [...new Array(20)].map(accountFixture);
  return {
    accounts,
    totalCount: 1027,
  };
};
