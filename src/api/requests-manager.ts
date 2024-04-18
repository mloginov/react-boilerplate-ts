import { faker } from '@faker-js/faker';

import { stall } from './helper';
import { RequestsView } from '../features/requests';

export enum RequestType {
  UNIVERSITY = 'university',
  BOOTCAMPS = 'bootcamps',
  PROF_TRAINING = 'profTraining',
  K12 = 'k12',
  ENTERPRISE = 'enterprise',
}

export enum RequestState {
  REQUEST = 'request',
  APPROVED = 'approved',
  MORE_INFO = 'more_info',
  DENIED = 'denied',
}
const requestStateArr = [RequestState.APPROVED, RequestState.REQUEST, RequestState.DENIED, RequestState.MORE_INFO];

export interface Request {
  id: string;
  orgName: string;
  userName: string;
  type: RequestType;
  email: string;
  state: RequestState;
  createdAt: Date;
  demoAt?: Date;
}

const requestFixture = (type: RequestType): Request => {
  const state = faker.helpers.arrayElement(requestStateArr);
  return {
    id: faker.string.uuid(),
    orgName: faker.company.name(),
    userName: faker.person.fullName(),
    email: faker.internet.email(),
    type: type,
    state,
    createdAt: faker.date.recent(),
    demoAt: state === RequestState.APPROVED ? faker.date.soon() : undefined,
  };
};

const requestsCountFixture = (): Record<string, number> => {
  return {
    [RequestType.UNIVERSITY]: faker.number.int({ max: 100 }),
    [RequestType.BOOTCAMPS]: faker.number.int({ max: 100 }),
    [RequestType.PROF_TRAINING]: faker.number.int({ max: 100 }),
    [RequestType.K12]: faker.number.int({ max: 100 }),
    [RequestType.ENTERPRISE]: faker.number.int({ max: 100 }),
  };
};

export const fetchRequestsCount = async (): Promise<Record<string, number>> => {
  await stall();
  return requestsCountFixture();
};

export const fetchRequests = async (view: RequestsView): Promise<Request[]> => {
  console.log('fetchRequests', view);
  await stall();
  return [...new Array(100)].map((_) => requestFixture(view.type));
};
