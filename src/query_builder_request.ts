import { type Request } from '@adonisjs/core/http';
import app from '@adonisjs/core/services/app';

export class QueryBuilderRequest {
  protected static includesArrayValueDelimiter = ',';

  protected static appendsArrayValueDelimiter = ',';

  protected static fieldsArrayValueDelimiter = ',';

  protected static sortsArrayValueDelimiter = ',';

  protected static filterArrayValueDelimiter = ',';

  public constructor(protected request: Request) {}

  public static setArrayValueDelimiter(delimiter: string): void {
    QueryBuilderRequest.filterArrayValueDelimiter = delimiter;
    QueryBuilderRequest.includesArrayValueDelimiter = delimiter;
    QueryBuilderRequest.appendsArrayValueDelimiter = delimiter;
    QueryBuilderRequest.fieldsArrayValueDelimiter = delimiter;
    QueryBuilderRequest.sortsArrayValueDelimiter = delimiter;
  }

  public includes(): string[] {
    const includeParameterName: string = app.config.get('apiquery.parameters.include', 'include');
    const includeParts = this.getRequestData(includeParameterName);

    if (Array.isArray(includeParts)) {
      return includeParts.filter((value) => typeof value === 'string') as string[];
    }

    // TODO: solve how to handle value different of string or array
    if (typeof includeParts !== 'string') {
      return [];
    }

    return includeParts
      .split(QueryBuilderRequest.getIncludesArrayValueDelimiter())
      .filter((value) => value !== '');
  }

  public sorts(): string[] {
    const sortParameterName: string = app.config.get('apiquery.parameters.sort', 'sort');
    const sortParts = this.getRequestData(sortParameterName);

    if (Array.isArray(sortParts)) {
      return sortParts.filter((value) => typeof value === 'string') as string[];
    }

    // TODO: solve how to handle value different of string or array
    if (typeof sortParts !== 'string') {
      return [];
    }

    return sortParts
      .split(QueryBuilderRequest.getSortsArrayValueDelimiter())
      .filter((value) => value !== '');
  }

  public filters(): Map<string, unknown> {
    const filterParameterName: string = app.config.get('apiquery.parameters.filter', 'filter');
    let filterParts: unknown = this.getRequestData(filterParameterName, '');

    if (typeof filterParts === 'string') {
      return new Map();
    }

    if (typeof filterParts !== 'object') {
      filterParts = {};
    }

    const entries = Object.entries(filterParts as object);
    const resultMap = new Map(entries);
    for (const [key, valueMap] of resultMap.entries()) {
      resultMap.set(key, this.getFilterValue(valueMap));
    }

    return resultMap;
  }

  protected getFilterValue(
    value: unknown,
  ): Map<string, unknown> | string[] | number | string | boolean | null | undefined {
    if (
      value === '' ||
      (typeof value === 'number' && value === 0) ||
      value === false ||
      value === null ||
      value === undefined ||
      value === '0'
    ) {
      return value;
    }

    if (typeof value === 'function') {
      return undefined;
    }

    if (typeof value === 'object') {
      const entries = Object.entries(value);
      const resultMap = new Map(entries);
      for (const [key, valueMap] of resultMap.entries()) {
        resultMap.set(key, this.getFilterValue(valueMap));
      }

      return resultMap;
    }

    if (typeof value === 'string') {
      if (value.includes(QueryBuilderRequest.getFilterArrayValueDelimiter())) {
        return value.split(QueryBuilderRequest.getFilterArrayValueDelimiter());
      }

      if (value === 'true') {
        return true;
      }

      if (value === 'false') {
        return false;
      }
    }

    return value as number | boolean;
  }

  protected getRequestData<T = unknown>(key: string, defaultValue?: T): T {
    return this.request.input(key, defaultValue) as T;
  }

  public static setIncludesArrayValueDelimiter(includesArrayValueDelimiter: string): void {
    QueryBuilderRequest.includesArrayValueDelimiter = includesArrayValueDelimiter;
  }

  public static setAppendsArrayValueDelimiter(appendsArrayValueDelimiter: string): void {
    QueryBuilderRequest.appendsArrayValueDelimiter = appendsArrayValueDelimiter;
  }

  public static setFieldsArrayValueDelimiter(fieldsArrayValueDelimiter: string): void {
    QueryBuilderRequest.fieldsArrayValueDelimiter = fieldsArrayValueDelimiter;
  }

  public static setSortsArrayValueDelimiter(sortsArrayValueDelimiter: string): void {
    QueryBuilderRequest.sortsArrayValueDelimiter = sortsArrayValueDelimiter;
  }

  public static setFilterArrayValueDelimiter(filterArrayValueDelimiter: string): void {
    QueryBuilderRequest.filterArrayValueDelimiter = filterArrayValueDelimiter;
  }

  public static getIncludesArrayValueDelimiter(): string {
    return QueryBuilderRequest.includesArrayValueDelimiter;
  }

  public static getAppendsArrayValueDelimiter(): string {
    return QueryBuilderRequest.appendsArrayValueDelimiter;
  }

  public static getFieldsArrayValueDelimiter(): string {
    return QueryBuilderRequest.fieldsArrayValueDelimiter;
  }

  public static getSortsArrayValueDelimiter(): string {
    return QueryBuilderRequest.sortsArrayValueDelimiter;
  }

  public static getFilterArrayValueDelimiter(): string {
    return QueryBuilderRequest.filterArrayValueDelimiter;
  }

  public static resetDelimiters(): void {
    QueryBuilderRequest.includesArrayValueDelimiter = ',';
    QueryBuilderRequest.appendsArrayValueDelimiter = ',';
    QueryBuilderRequest.fieldsArrayValueDelimiter = ',';
    QueryBuilderRequest.sortsArrayValueDelimiter = ',';
    QueryBuilderRequest.filterArrayValueDelimiter = ',';
  }
}
