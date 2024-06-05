import { SortDirection } from '../enums/sort_direction.js';

export default class InvalidDirectionException extends Error {
  public static make(sort: string): InvalidDirectionException {
    return new InvalidDirectionException(
      `The direction should be either '${SortDirection.Descending}' or '${SortDirection.Ascending}'. ${sort} given`,
    );
  }
}
