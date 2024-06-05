import app from '@adonisjs/core/services/app';
import { ModelQueryBuilder } from '@adonisjs/lucid/orm';
import { type LucidModel, type ModelQueryBuilderContract } from '@adonisjs/lucid/types/model';
import { type ExtractModelRelations } from '@adonisjs/lucid/types/relations';
import AllowedInclude from '../allowed_include.js';
import { E_API_QUERY_INVALID_INCLUDE } from '../errors.js';
import { type QueryBuilderRequest } from '../query_builder_request.js';

const ensureAllIncludesExist = <Model extends LucidModel>(
  allowedIncludes: AllowedInclude<Model>[],
  request: QueryBuilderRequest,
): void => {
  const disableInvalidIncludesQueryException: boolean = app.config.get(
    'apiquery.disableInvalidIncludesQueryException',
    false,
  );
  if (disableInvalidIncludesQueryException) {
    return;
  }

  const requestedIncludesNames = request.includes();
  const allowedIncludesNames = allowedIncludes.map((allowedInclude) => allowedInclude.getName());
  const unknownIncludes = requestedIncludesNames.filter(
    (include) => !allowedIncludesNames.includes(include),
  );

  if (unknownIncludes.length > 0) {
    throw E_API_QUERY_INVALID_INCLUDE.includesNotAllowed(unknownIncludes, allowedIncludesNames);
  }
};

const addRequestedIncludesToQuery = <Model extends LucidModel>(
  query: ModelQueryBuilderContract<Model>,
  allowedIncludes: AllowedInclude<Model>[],
  request: QueryBuilderRequest,
): void => {
  for (const property of request.includes()) {
    const include = allowedIncludes.find((element) => element.isForInclude(property));

    include?.include(query);
  }
};

ModelQueryBuilder.macro('allowedIncludes', function <
  Model extends LucidModel,
  Name extends ExtractModelRelations<InstanceType<Model>>,
>(this: ModelQueryBuilderContract<Model>, includes: Name | Name[] | AllowedInclude<Model> | AllowedInclude<Model>[] | string | string[]) {
  const listIncludes = Array.isArray(includes) ? includes : [includes];
  const countSuffix: string = app.config.get('apiquery.countSuffix', 'Count');

  const allowedIncludes = listIncludes
    .map((include) => {
      if (include instanceof AllowedInclude) {
        return include;
      }

      if (typeof include === 'string' && include.endsWith(countSuffix)) {
        return AllowedInclude.count(include);
      }

      return AllowedInclude.relationship(include.toString());
    })
    .filter((value, index, self) => {
      return self.findIndex((v) => v.getName() === value.getName()) === index;
    });

  const request = this.getRequest();

  ensureAllIncludesExist(allowedIncludes, request);

  addRequestedIncludesToQuery(this, allowedIncludes, request);

  return this;
});
