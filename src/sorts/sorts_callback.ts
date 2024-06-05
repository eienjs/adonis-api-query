import { type LucidModel, type ModelQueryBuilderContract } from '@adonisjs/lucid/types/model';
import { type Sort } from '../types.js';

export default class SortsCallback<Model extends LucidModel> implements Sort<Model> {
  public constructor(
    private readonly callback: (
      query: ModelQueryBuilderContract<Model>,
      descending: boolean,
      property: string,
    ) => void,
  ) {}

  public invoke(
    query: ModelQueryBuilderContract<Model>,
    descending: boolean,
    property: string,
  ): void {
    this.callback(query, descending, property);
  }
}
