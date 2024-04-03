import { faker } from '@faker-js/faker';

import { stall } from './helper';

const types = [
  'university',
  'bootcamps',
  'profTraining',
  'school',
  'enterprise',
];

export interface IRequest {
  id: string,
  name: string,
  type: string
}

const requestFixture = (): IRequest => ({
  id: faker.string.uuid(),
  name: `${faker.location.city()} Request`,
  type: faker.helpers.arrayElement(types),
});

export const fetchRequests = async (): Promise<IRequest[]> => {
  await stall();
  return [...new Array(15)].map(requestFixture);
};
