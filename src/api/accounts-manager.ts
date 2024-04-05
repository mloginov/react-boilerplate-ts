import { faker } from '@faker-js/faker';

import { stall } from './helper';

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

const accountFixture = (): Account => ({
  id: faker.string.uuid(),
  userName: faker.internet.userName(),
  email: faker.internet.email(),
  createdAt: faker.date.past(),
  lastLogin: faker.date.recent(),
  projects: faker.number.int({ max: 100 }),
  connections: faker.number.int({ max: 20 }),
});

export const fetchAccounts = async (): Promise<AccountsData> => {
  await stall(1000);
  const accounts = [...new Array(1027)].map(accountFixture);
  return {
    accounts,
    totalCount: accounts.length,
  };
};
