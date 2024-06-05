import { Exception } from '@adonisjs/core/exceptions';

export default class InvalidFilterQueryException extends Exception {
  public static status = 400;

  public static code = 'E_API_QUERY_INVALID_FILTER';

  public static filtersNotAllowed(
    unknownFilters: string[],
    allowedFilters: string[],
  ): InvalidFilterQueryException {
    const allowedFilter = allowedFilters.join(', ');
    const unknownFilter = unknownFilters.join(', ');

    return new InvalidFilterQueryException(
      `Requested filter(s) '${unknownFilter}' are not allowed. Allowed filter(s) are '${allowedFilter}'`,
    );
  }
}
