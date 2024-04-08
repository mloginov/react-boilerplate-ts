export const getSortModelFromQuery = (searchParams: URLSearchParams) => {
  if (!searchParams.get('field') || !searchParams.get('sort')) {
    return [];
  }
  const sort = searchParams.get('sort');
  return [
    {
      field: searchParams.get('field') as string,
      sort: sort === 'asc' ? ('asc' as const) : sort === 'desc' ? ('desc' as const) : null,
    },
  ];
};
