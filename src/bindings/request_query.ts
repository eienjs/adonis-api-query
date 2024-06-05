import { type Request } from '@adonisjs/core/http';
import { ModelQueryBuilder } from '@adonisjs/lucid/orm';
import { E_API_QUERY_MISSING_QUERY_BUILDER_REQUEST } from '../errors.js';
import { QueryBuilderRequest } from '../query_builder_request.js';

ModelQueryBuilder.macro('setRequest', function (this: ModelQueryBuilder, request: Request) {
  this.$queryBuilderRequest = new QueryBuilderRequest(request);

  return this;
});

ModelQueryBuilder.macro('getRequest', function (this: ModelQueryBuilder) {
  if (!this.$queryBuilderRequest) {
    throw E_API_QUERY_MISSING_QUERY_BUILDER_REQUEST;
  }

  return this.$queryBuilderRequest;
});

declare module '@adonisjs/lucid/orm' {
  interface ModelQueryBuilder {
    setRequest(request: Request): ModelQueryBuilder;
    getRequest(): QueryBuilderRequest;

    $queryBuilderRequest?: QueryBuilderRequest;
  }
}

declare module '@adonisjs/lucid/types/model' {
  interface ModelQueryBuilderContract<Model extends LucidModel, Result = InstanceType<Model>> {
    setRequest(request: Request): ModelQueryBuilderContract<Model, Result>;
    getRequest(): QueryBuilderRequest;
  }
}
