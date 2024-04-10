export interface PageFilter {
  page: number;
}

export interface ViewSort {
  field: string;
  sort: string | undefined | null;
}

export interface ListView {
  filter: PageFilter | null;
  sort: ViewSort | null;
}

export const stall = async (stallTime = 200): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, stallTime));
};
