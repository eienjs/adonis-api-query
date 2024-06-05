import { Exception } from '@adonisjs/core/exceptions';

export default class InvalidIncludeQueryException extends Exception {
  public static status = 400;

  public static code = 'E_API_QUERY_INVALID_INCLUDE';

  public static includesNotAllowed(
    unknownIncludes: string[],
    allowedIncludes: string[],
  ): InvalidIncludeQueryException {
    const allowedInclude = allowedIncludes.join(', ');
    const unknownInclude = unknownIncludes.join(', ');

    return new InvalidIncludeQueryException(
      `Requested include(s) '${unknownInclude}' is not allowed. Allowed include(s) are '${allowedInclude}'`,
    );
  }
}
