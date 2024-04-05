import { faker } from '@faker-js/faker';

import { stall } from './helper';

export interface IAccountsData {
  accounts: IAccount[];
  totalCount: number;
}

export interface IAccount {
  id: string;
  userName: string;
  email: string;
  createdAt: Date;
  lastLogin: Date;
  projects: number;
  connections: number;
}

const accountFixture = (): IAccount => ({
  id: faker.string.uuid(),
  userName: faker.internet.userName(),
  email: faker.internet.email(),
  createdAt: faker.date.past(),
  lastLogin: faker.date.recent(),
  projects: faker.number.int({ max: 100 }),
  connections: faker.number.int({ max: 20 }),
});

export const fetchAccounts = async (): Promise<IAccountsData> => {
  await stall(1000);
  const accounts = [...new Array(1027)].map(accountFixture);
  return {
    accounts,
    totalCount: accounts.length,
  };
};