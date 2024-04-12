import { faker } from '@faker-js/faker';

import { ListView, PageFilter, stall } from './helper';

export interface OrganizationsData {
  organizations: OrganizationShort[];
  totalCount: number;
}

export interface OrganizationShort {
  id: string;
  email: string;
  name: string;
  slug: string;
}

export interface OrganizationViewFilter extends PageFilter {
  name?: string | null;
  slug?: string | null;
  email?: string | null;
}

export interface OrganizationListView extends ListView {
  filter: OrganizationViewFilter;
}

export interface OwnerInfo {
  id: string;
  username: string;
}

enum SubscriptionState {
  Active = 'active',
  Pending = 'pending',
}

export interface Subscription {
  id: string;
  planId: string;
  maxUsers: number;
  state: SubscriptionState;
  trialExpire: Date;
  startDate?: Date;
  endDate: Date;
  gigaBoxes: number;
  isSelfPay: boolean;
}

interface OrganizationDetails {
  vm: boolean;
  showBooks: boolean;
  showBehaviourPlagiarism: boolean;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  email: string;
  subscription: Subscription | null | undefined;
  eduStatus: any;
  owners: OwnerInfo[];
  details: OrganizationDetails;
}

const organizationShortFixture = (): OrganizationShort => ({
  id: faker.string.uuid(),
  name: faker.company.name(),
  slug: faker.internet.userName(),
  email: faker.internet.email(),
});

export const fetchOrganizations = async (view: OrganizationListView): Promise<OrganizationsData> => {
  console.log('fetchOrganizations view', view);
  await stall();
  const organizations = [...new Array(20)].map(organizationShortFixture);
  return {
    organizations,
    totalCount: 1027,
  };
};

const ownerDetailsFixture = (): OwnerInfo => {
  return {
    id: faker.string.uuid(),
    username: faker.internet.userName(),
  };
};

const organizationDetailsFixture = (): OrganizationDetails => {
  return {
    vm: faker.datatype.boolean(),
    showBooks: faker.datatype.boolean(),
    showBehaviourPlagiarism: faker.datatype.boolean(),
  };
};

const subscriptionFixture = (): Subscription => {
  return {
    id: faker.string.uuid(),
    planId: faker.word.noun(),
    maxUsers: faker.number.int({ max: 1000 }),
    state: faker.helpers.arrayElement([SubscriptionState.Active, SubscriptionState.Pending]),
    trialExpire: faker.date.future(),
    startDate: faker.date.recent(),
    endDate: faker.date.soon(),
    gigaBoxes: faker.number.int({ max: 10 }),
    isSelfPay: faker.datatype.boolean(),
  };
};

const organizationFixture = (): Organization => {
  return {
    id: faker.string.uuid(),
    name: faker.company.name(),
    slug: faker.internet.userName(),
    email: faker.internet.email(),
    subscription: subscriptionFixture(),
    eduStatus: null,
    owners: [...new Array(faker.number.int({ max: 100 }))].map(ownerDetailsFixture),
    details: organizationDetailsFixture(),
  };
};

export const fetchDetails = async (id: string): Promise<Organization> => {
  console.log('organization fetchDetails', id);
  await stall();
  return organizationFixture();
};
