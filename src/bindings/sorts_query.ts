import app from '@adonisjs/core/services/app';
import { ModelQueryBuilder } from '@adonisjs/lucid/orm';
import {
  type LucidModel,
  type ModelAttributes,
  type ModelQueryBuilderContract,
} from '@adonisjs/lucid/types/model';
import AllowedSort from '../allowed_sort.js';
import { E_API_QUERY_INVALID_SORT } from '../errors.js';
import { type QueryBuilderRequest } from '../query_builder_request.js';

const ltrim = (value: string, delimiter: string): string => {
  const withLine = value.startsWith(delimiter);

  return withLine ? value.slice(1) : value;
};

const ensureAllSortsExist = <Model extends LucidModel>(
  allowedSorts: AllowedSort<Model>[],
  request: QueryBuilderRequest,
): void => {
  const disableInvalidSortQueryException: boolean = app.config.get(
    'apiquery.disableInvalidSortQueryException',
    false,
  );
  if (disableInvalidSortQueryException) {
    return;
  }

  const requestedSortNames = request.sorts().map((sort) => ltrim(sort, '-'));
  const allowedSortNames = allowedSorts.map((sort) => sort.getName());
  const unknownSorts = requestedSortNames.filter((sort) => !allowedSortNames.includes(sort));

  if (unknownSorts.length > 0) {
    throw E_API_QUERY_INVALID_SORT.sortsNotAllowed(unknownSorts, allowedSortNames);
  }
};

const addRequestedSortsToQuery = <Model extends LucidModel>(
  query: ModelQueryBuilderContract<Model>,
  allowedSorts: AllowedSort<Model>[],
  request: QueryBuilderRequest,
): void => {
  for (const property of request.sorts()) {
    const descending = property.startsWith('-');
    const key = ltrim(property, '-');
    const sort = allowedSorts.find((element) => element.isSort(key));

    sort?.sort(query, descending);
  }
};

ModelQueryBuilder.macro('allowedSorts', function <
  Model extends LucidModel,
  Attributes = ModelAttributes<InstanceType<Model>>,
>(this: ModelQueryBuilderContract<Model>, sorts: keyof Attributes | (keyof Attributes)[] | AllowedSort<Model> | AllowedSort<Model>[]) {
  const listSorts = Array.isArray(sorts) ? sorts : [sorts];
  const allowedSorts = listSorts.map((sort) => {
    if (sort instanceof AllowedSort) {
      return sort;
    }

    return AllowedSort.field(ltrim(sort.toString(), '-'));
  });

  const request = this.getRequest();

  ensureAllSortsExist(allowedSorts, request);
  addRequestedSortsToQuery(this, allowedSorts, request);

  return this;
});

ModelQueryBuilder.macro('defaultSort', function <
  Model extends LucidModel,
  Attributes = ModelAttributes<InstanceType<Model>>,
>(this: ModelQueryBuilderContract<Model>, sorts: keyof Attributes | (keyof Attributes)[] | AllowedSort<Model> | AllowedSort<Model>[]) {
  const request = this.getRequest();

  if (request.sorts().length > 0) {
    // We've got requested sorts. No need to parse defaults.

    return this;
  }

  const listSorts = Array.isArray(sorts) ? sorts : [sorts];
  const allowedSorts = listSorts.map((sort) => {
    if (sort instanceof AllowedSort) {
      return sort;
    }

    return AllowedSort.field(ltrim(sort.toString(), '-'));
  });

  for (const sort of allowedSorts) {
    sort.sort(this);
  }

  return this;
});

declare module '@adonisjs/lucid/orm' {
  interface ModelQueryBuilder {
    allowedSorts<Model extends LucidModel, Attributes = ModelAttributes<InstanceType<Model>>>(
      sorts: keyof Attributes | (keyof Attributes)[] | AllowedSort<Model> | AllowedSort<Model>[],
    ): ModelQueryBuilderContract<Model>;

    defaultSort<Model extends LucidModel, Attributes = ModelAttributes<InstanceType<Model>>>(
      sorts: keyof Attributes | (keyof Attributes)[] | AllowedSort<Model> | AllowedSort<Model>[],
    ): ModelQueryBuilderContract<Model>;
  }
}

declare module '@adonisjs/lucid/types/model' {
  interface ModelQueryBuilderContract<Model extends LucidModel, Result = InstanceType<Model>> {
    allowedSorts<Attributes = ModelAttributes<InstanceType<Model>>>(
      sorts: keyof Attributes | (keyof Attributes)[] | AllowedSort<Model> | AllowedSort<Model>[],
    ): ModelQueryBuilderContract<Model, Result>;

    defaultSort<Attributes = ModelAttributes<InstanceType<Model>>>(
      sorts: keyof Attributes | (keyof Attributes)[] | AllowedSort<Model> | AllowedSort<Model>[],
    ): ModelQueryBuilderContract<Model, Result>;
  }
}
