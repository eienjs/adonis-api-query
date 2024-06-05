import app from '@adonisjs/core/services/app';
import { ModelQueryBuilder } from '@adonisjs/lucid/orm';
import {
  type LucidModel,
  type ModelAttributes,
  type ModelQueryBuilderContract,
} from '@adonisjs/lucid/types/model';
import { type StrictValues } from '@adonisjs/lucid/types/querybuilder';
import AllowedFilter from '../allowed_filter.js';
import { E_API_QUERY_INVALID_FILTER } from '../errors.js';
import { type QueryBuilderRequest } from '../query_builder_request.js';

const ensureAllFiltersExist = <Model extends LucidModel>(
  allowedFilters: AllowedFilter<Model>[],
  request: QueryBuilderRequest,
): void => {
  const disableInvalidFilterQueryException: boolean = app.config.get(
    'apiquery.disableInvalidFilterQueryException',
    false,
  );
  if (disableInvalidFilterQueryException) {
    return;
  }

  const filterNames = [...request.filters().keys()];
  const allowedFilterNames = allowedFilters.map((allowedFilter) => allowedFilter.getName());
  const unknownFilters = filterNames.filter((filter) => !allowedFilterNames.includes(filter));

  if (unknownFilters.length > 0) {
    throw E_API_QUERY_INVALID_FILTER.filtersNotAllowed(unknownFilters, allowedFilterNames);
  }
};

const addRequestedFiltersToQuery = <Model extends LucidModel>(
  query: ModelQueryBuilderContract<Model>,
  allowedFilters: AllowedFilter<Model>[],
  request: QueryBuilderRequest,
): void => {
  for (const filter of allowedFilters) {
    if (request.filters().has(filter.getName())) {
      const value = request.filters().get(filter.getName());
      filter.filter(query, value as StrictValues);

      continue;
    }

    if (filter.hasDefault()) {
      filter.filter(query, filter.getDefault()!);
    }
  }
};

ModelQueryBuilder.macro('allowedFilters', function <
  Model extends LucidModel,
  Attributes = ModelAttributes<InstanceType<Model>>,
>(this: ModelQueryBuilderContract<Model>, filters: keyof Attributes | (keyof Attributes)[] | AllowedFilter<Model> | AllowedFilter<Model>[] | string | string[]) {
  const listfilters = Array.isArray(filters) ? filters : [filters];
  const allowedFilters = listfilters.map((filter) => {
    if (filter instanceof AllowedFilter) {
      return filter;
    }

    return AllowedFilter.partial(filter.toString());
  });

  const request = this.getRequest();

  ensureAllFiltersExist(allowedFilters, request);
  addRequestedFiltersToQuery(this, allowedFilters, request);

  return this;
});
