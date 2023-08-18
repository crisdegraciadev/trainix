export type Filters<T> = Partial<T>;

type FilterObject<T> = {
  where: Partial<T>;
};

export const buildFilters = <T>(filters?: Filters<T>): FilterObject<T> => {
  if (!filters) {
    return { where: {} };
  }

  const constraints = Object.entries(filters);
  return constraints.reduce(({ where }, [key, val]) => ({ where: { ...where, [key]: val } }), { where: {} });
};
