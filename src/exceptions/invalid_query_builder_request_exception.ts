import { Exception } from '@adonisjs/core/exceptions';

export default new Exception(
  'QueryBuilderRequest is missing in chainable declaration of api query, call first setQueryBuilderRequest method',
  { code: 'E_API_QUERY_MISSING_QUERY_BUILDER_REQUEST', status: 500 },
);
