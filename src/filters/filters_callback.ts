import { type LucidModel, type ModelQueryBuilderContract } from '@adonisjs/lucid/types/model';
import { type StrictValues } from '@adonisjs/lucid/types/querybuilder';
import { type Filter } from '../types.js';

export default class FiltersCallback<Model extends LucidModel> implements Filter<Model> {
  public constructor(
    private readonly callback: (
      query: ModelQueryBuilderContract<Model>,
      value: StrictValues,
      property: string,
    ) => void,
  ) {}

  public invoke(
    query: ModelQueryBuilderContract<Model>,
    value: StrictValues,
    property: string,
  ): void {
    this.callback(query, value, property);
  }
}
