import { faker } from '@faker-js/faker';

import { stall } from './helper';

const types = ['university', 'bootcamps', 'profTraining', 'k12', 'enterprise'];

export interface Request {
  id: string;
  name: string;
  type: string;
}

const requestFixture = (): Request => ({
  id: faker.string.uuid(),
  name: `${faker.location.city()} Request`,
  type: faker.helpers.arrayElement(types),
});

export const fetchRequests = async (): Promise<Request[]> => {
  await stall(1000);
  return [...new Array(15)].map(requestFixture);
};
