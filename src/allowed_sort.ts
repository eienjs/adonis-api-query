import { type LucidModel, type ModelQueryBuilderContract } from '@adonisjs/lucid/types/model';
import { SortDirection } from './enums/sort_direction.js';
import InvalidDirectionException from './exceptions/invalid_direction_exception.js';
import SortsCallback from './sorts/sorts_callback.js';
import SortsField from './sorts/sorts_field.js';
import { type Sort } from './types.js';

export default class AllowedSort<Model extends LucidModel> {
  protected defaultDirection: string;

  protected internalName: string;

  protected name: string;

  protected sortClass: Sort<Model>;

  public constructor(name: string, sortClass: Sort<Model>, internalName?: string) {
    this.name = name.replace(/^-\?/, '');
    this.sortClass = sortClass;
    this.defaultDirection = AllowedSort.parseSortDirection(name);
    this.internalName = internalName ?? this.name;
  }

  public static parseSortDirection(name: string): string {
    return name.startsWith('-') ? SortDirection.Descending : SortDirection.Ascending;
  }

  public sort(query: ModelQueryBuilderContract<Model>, descending?: boolean): void {
    const isDescending = descending ?? this.defaultDirection === SortDirection.Descending;

    this.sortClass.invoke(query, isDescending, this.internalName);
  }

  public static field<Model extends LucidModel>(
    name: string,
    internalName?: string,
  ): AllowedSort<Model> {
    return new AllowedSort(name, new SortsField(), internalName);
  }

  public static custom<Model extends LucidModel>(
    name: string,
    sortClass: Sort<Model>,
    internalName?: string,
  ): AllowedSort<Model> {
    return new AllowedSort(name, sortClass, internalName);
  }

  public static callback<Model extends LucidModel>(
    name: string,
    callback: ConstructorParameters<typeof SortsCallback<Model>>['0'],
    internalName?: string,
  ): AllowedSort<Model> {
    return new AllowedSort(name, new SortsCallback(callback), internalName);
  }

  public getName(): string {
    return this.name;
  }

  public isSort(sortName: string): boolean {
    return this.name === sortName;
  }

  public getInternalName(): string {
    return this.internalName;
  }

  public setDefaultDirection(defaultDirection: string): this {
    if (
      !([SortDirection.Ascending, SortDirection.Descending] as string[]).includes(defaultDirection)
    ) {
      throw InvalidDirectionException.make(defaultDirection);
    }

    this.defaultDirection = defaultDirection;

    return this;
  }
}
