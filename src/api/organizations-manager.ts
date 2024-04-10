import { faker } from '@faker-js/faker';

import { ListView, PageFilter, stall } from './helper';

export interface OrganizationsData {
  organizations: Organization[];
  totalCount: number;
}

export interface Organization {
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

export interface OwnerDetails {
  id: string;
  username: string;
}

export interface OrganizationDetails {
  id: string;
  name: string;
  slug: string;
  email: string;
  subscription: any;
  status: any;
  owners: OwnerDetails[];
}

const organizationFixture = (): Organization => ({
  id: faker.string.uuid(),
  name: faker.company.name(),
  slug: faker.internet.userName(),
  email: faker.internet.email(),
});

export const fetchOrganizations = async (view: OrganizationListView): Promise<OrganizationsData> => {
  console.log('fetchOrganizations view', view);
  await stall();
  const organizations = [...new Array(20)].map(organizationFixture);
  return {
    organizations,
    totalCount: 1027,
  };
};

const ownerDetailsFixture = (): OwnerDetails => {
  return {
    id: faker.string.uuid(),
    username: faker.internet.userName(),
  };
};

const organizationDetailsFixture = (): OrganizationDetails => {
  return {
    id: faker.string.uuid(),
    name: faker.company.name(),
    slug: faker.internet.userName(),
    email: faker.internet.email(),
    subscription: null,
    status: null,
    owners: [...new Array(faker.number.int({ max: 100 }))].map(ownerDetailsFixture),
  };
};

export const fetchDetails = async (id: string): Promise<OrganizationDetails> => {
  console.log('organization fetchDetails', id);
  await stall();
  return organizationDetailsFixture();
};
