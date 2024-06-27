import { type LucidModel, type ModelQueryBuilderContract } from '@adonisjs/lucid/types/model';
import { type StrictValues } from '@adonisjs/lucid/types/querybuilder';
import FiltersBeginWithStrict from './filters/filters_begin_with_strict.js';
import FiltersCallback from './filters/filters_callback.js';
import FiltersEndWithStrict from './filters/filters_end_with_strict.js';
import FiltersExact from './filters/filters_exact.js';
import FiltersPartial from './filters/filters_partial.js';
import FiltersTrashed from './filters/filters_trashed.js';
import { QueryBuilderRequest } from './query_builder_request.js';
import { type Filter } from './types.js';

export default class AllowedFilter<Model extends LucidModel> {
  protected name: string;

  protected filterClass: Filter<Model>;

  protected internalName: string;

  protected ignored: string[];

  protected default?: StrictValues | null;

  protected _hasDefault = false;

  protected _nullable = false;

  public constructor(name: string, filterClass: Filter<Model>, internalName?: string) {
    this.name = name;
    this.filterClass = filterClass;
    this.ignored = [];
    this.internalName = internalName ?? name;
  }

  public filter(query: ModelQueryBuilderContract<Model>, value: StrictValues): void {
    const valueToFilter = this.resolveValueForFiltering(value);

    if (valueToFilter === null) {
      return;
    }

    this.filterClass.invoke(query, valueToFilter, this.internalName);
  }

  public static setFilterArrayValueDelimiter(delimiter?: string): void {
    if (delimiter) {
      QueryBuilderRequest.setFilterArrayValueDelimiter(delimiter);
    }
  }

  public static exact<Model extends LucidModel>(
    name: string,
    internalName?: string,
    arrayValueDelimiter?: string,
  ): AllowedFilter<Model> {
    AllowedFilter.setFilterArrayValueDelimiter(arrayValueDelimiter);

    return new AllowedFilter(name, new FiltersExact(), internalName);
  }

  public static partial<Model extends LucidModel>(
    name: string,
    internalName?: string,
    arrayValueDelimiter?: string,
  ): AllowedFilter<Model> {
    AllowedFilter.setFilterArrayValueDelimiter(arrayValueDelimiter);

    return new AllowedFilter(name, new FiltersPartial(), internalName);
  }

  public static beginsWithStrict<Model extends LucidModel>(
    name: string,
    internalName?: string,
    arrayValueDelimiter?: string,
  ): AllowedFilter<Model> {
    AllowedFilter.setFilterArrayValueDelimiter(arrayValueDelimiter);

    return new AllowedFilter(name, new FiltersBeginWithStrict(), internalName);
  }

  public static endsWithStrict<Model extends LucidModel>(
    name: string,
    internalName?: string,
    arrayValueDelimiter?: string,
  ): AllowedFilter<Model> {
    AllowedFilter.setFilterArrayValueDelimiter(arrayValueDelimiter);

    return new AllowedFilter(name, new FiltersEndWithStrict(), internalName);
  }

  public static callback<Model extends LucidModel>(
    name: string,
    callback: (
      query: ModelQueryBuilderContract<Model>,
      value: StrictValues,
      property: string,
    ) => void,
    internalName?: string,
    arrayValueDelimiter?: string,
  ): AllowedFilter<Model> {
    AllowedFilter.setFilterArrayValueDelimiter(arrayValueDelimiter);

    return new AllowedFilter(name, new FiltersCallback(callback), internalName);
  }

  public static trashed<Model extends LucidModel>(
    name = 'trashed',
    internalName?: string,
  ): AllowedFilter<Model> {
    return new AllowedFilter(name, new FiltersTrashed(), internalName);
  }

  public static custom<Model extends LucidModel>(
    name: string,
    filterClass: Filter<Model>,
    internalName?: string,
    arrayValueDelimiter?: string,
  ): AllowedFilter<Model> {
    AllowedFilter.setFilterArrayValueDelimiter(arrayValueDelimiter);

    return new AllowedFilter(name, filterClass, internalName);
  }

  public getFilterClass(): Filter<Model> {
    return this.filterClass;
  }

  public getName(): string {
    return this.name;
  }

  public isForFilter(filterName: string): boolean {
    return this.name === filterName;
  }

  public ignore(...values: string[]): this {
    this.ignored = [...this.ignored, ...values];

    return this;
  }

  public getIgnored(): string[] {
    return this.ignored;
  }

  public getInternalName(): string {
    return this.internalName;
  }

  public setDefault(value: StrictValues | null): this {
    this._hasDefault = true;
    this.default = value;

    if (value === null) {
      this.setNullable(true);
    }

    return this;
  }

  public getDefault(): StrictValues | null | undefined {
    return this.default;
  }

  public hasDefault(): boolean {
    return this._hasDefault;
  }

  public setNullable(nullable = true): this {
    this._nullable = nullable;

    return this;
  }

  public unsetDefault(): this {
    this._hasDefault = false;
    this.default = undefined;

    return this;
  }

  protected resolveValueForFiltering(value: StrictValues): StrictValues | null {
    if (Array.isArray(value)) {
      const remainingProperties = value.map((subValue) => this.resolveValueForFiltering(subValue));

      return remainingProperties.length > 0 ? (remainingProperties as StrictValues) : null;
    }

    return this.ignored.includes(value.toString()) ? null : value;
  }
}
