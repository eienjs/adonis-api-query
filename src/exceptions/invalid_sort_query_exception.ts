import { Exception } from '@adonisjs/core/exceptions';

export default class InvalidSortQueryException extends Exception {
  public static status = 400;

  public static code = 'E_API_QUERY_INVALID_SORT';

  public static sortsNotAllowed(
    unknownSorts: string[],
    allowedSorts: string[],
  ): InvalidSortQueryException {
    const allowedSort = allowedSorts.join(', ');
    const unknownSort = unknownSorts.join(', ');

    return new InvalidSortQueryException(
      `Requested sort(s) '${unknownSort}' is not allowed. Allowed sort(s) are '${allowedSort}'`,
    );
  }
}
