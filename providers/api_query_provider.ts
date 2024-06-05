import { type Request } from '@adonisjs/core/http';
import { type ApplicationService } from '@adonisjs/core/types';
import {
  type LucidModel,
  type ModelAttributes,
  type ModelQueryBuilderContract,
} from '@adonisjs/lucid/types/model';
import { type ExtractModelRelations } from '@adonisjs/lucid/types/relations';
import type AllowedFilter from '../src/allowed_filter.js';
import type AllowedInclude from '../src/allowed_include.js';
import type AllowedSort from '../src/allowed_sort.js';
import { type QueryBuilderRequest } from '../src/query_builder_request.js';

declare module '@adonisjs/lucid/orm' {
  interface ModelQueryBuilder {
    setRequest(request: Request): ModelQueryBuilder;
    getRequest(): QueryBuilderRequest;
    $queryBuilderRequest?: QueryBuilderRequest;

    allowedSorts<Model extends LucidModel, Attributes = ModelAttributes<InstanceType<Model>>>(
      sorts: keyof Attributes | (keyof Attributes)[] | AllowedSort<Model> | AllowedSort<Model>[],
    ): ModelQueryBuilderContract<Model>;
    defaultSort<Model extends LucidModel, Attributes = ModelAttributes<InstanceType<Model>>>(
      sorts: keyof Attributes | (keyof Attributes)[] | AllowedSort<Model> | AllowedSort<Model>[],
    ): ModelQueryBuilderContract<Model>;

    allowedIncludes<
      Model extends LucidModel,
      Name extends ExtractModelRelations<InstanceType<Model>>,
    >(
      includes: Name | Name[] | AllowedInclude<Model> | AllowedInclude<Model>[] | string | string[],
    ): ModelQueryBuilderContract<Model>;

    allowedFilters<Model extends LucidModel, Attributes = ModelAttributes<InstanceType<Model>>>(
      filters:
        | keyof Attributes
        | (keyof Attributes)[]
        | AllowedFilter<Model>
        | AllowedFilter<Model>[]
        | string
        | string[],
    ): ModelQueryBuilderContract<Model>;
  }
}

declare module '@adonisjs/lucid/types/model' {
  interface ModelQueryBuilderContract<Model extends LucidModel, Result = InstanceType<Model>> {
    setRequest(request: Request): ModelQueryBuilderContract<Model, Result>;
    getRequest(): QueryBuilderRequest;

    allowedSorts<Attributes = ModelAttributes<InstanceType<Model>>>(
      sorts: keyof Attributes | (keyof Attributes)[] | AllowedSort<Model> | AllowedSort<Model>[],
    ): ModelQueryBuilderContract<Model, Result>;
    defaultSort<Attributes = ModelAttributes<InstanceType<Model>>>(
      sorts: keyof Attributes | (keyof Attributes)[] | AllowedSort<Model> | AllowedSort<Model>[],
    ): ModelQueryBuilderContract<Model, Result>;

    allowedIncludes<Name extends ExtractModelRelations<InstanceType<Model>>>(
      includes: Name | Name[] | AllowedInclude<Model> | AllowedInclude<Model>[] | string | string[],
    ): ModelQueryBuilderContract<Model, Result>;

    allowedFilters<Attributes = ModelAttributes<InstanceType<Model>>>(
      filters:
        | keyof Attributes
        | (keyof Attributes)[]
        | AllowedFilter<Model>
        | AllowedFilter<Model>[]
        | string
        | string[],
    ): ModelQueryBuilderContract<Model, Result>;
  }
}

export default class ApiQueryProvider {
  public constructor(protected app: ApplicationService) {}

  public register(): void {
    // Empty
  }

  public async boot(): Promise<void> {
    await import('../src/bindings/request_query.js');
    await import('../src/bindings/sorts_query.js');
    await import('../src/bindings/filters_query.js');
    await import('../src/bindings/includes_query.js');
  }
}
