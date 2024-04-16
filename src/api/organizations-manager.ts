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

enum Gigaboxes {
  '1GB' = '1gb',
  '2GB' = '2gb',
  '4GB' = '4gb',
  '8GB' = '8gb',
  '16GB' = '16gb',
  'GPU' = 'gpu',
  'CGROUPV1 ' = 'cgroupv1',
}

enum SelfPayPlans {
  plan1 = 'plan1',
  plan2 = 'plan2',
  plan3 = 'plan3',
  plan4 = 'plan4',
  plan5 = 'plan5',
}

export interface PlanRecord {
  id: string;
  name: string;
}

export const selfPayPlans: PlanRecord[] = [
  { id: SelfPayPlans.plan1, name: '90$ - 1 month' },
  { id: SelfPayPlans.plan2, name: '190$ - 2 month' },
  { id: SelfPayPlans.plan3, name: '290$ - 4 month' },
  { id: SelfPayPlans.plan4, name: '390$ - 8 month' },
  { id: SelfPayPlans.plan5, name: '490$ - 12 month' },
];

const getGigaboxesFixture = (): Record<string, number> => {
  return {
    [Gigaboxes['1GB']]: faker.number.int({ max: 10 }),
    [Gigaboxes['2GB']]: faker.number.int({ max: 10 }),
    [Gigaboxes['4GB']]: faker.number.int({ max: 10 }),
    [Gigaboxes['8GB']]: faker.number.int({ max: 10 }),
    [Gigaboxes['16GB']]: faker.number.int({ max: 10 }),
    [Gigaboxes['GPU']]: faker.number.int({ max: 10 }),
    [Gigaboxes['CGROUPV1 ']]: faker.number.int({ max: 10 }),
  };
};

export interface Subscription {
  id: string;
  planId: string;
  maxUsers: number;
  state: SubscriptionState;
  trialExpire: Date;
  startDate?: Date;
  endDate: Date;
  gigaBoxes: Record<string, number>;
  isSelfPay: boolean;
  selfPayPlans?: string[];
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
    gigaBoxes: getGigaboxesFixture(),
    isSelfPay: faker.datatype.boolean(),
    selfPayPlans: faker.helpers.arrayElements(selfPayPlans.map((item) => item.id)),
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
