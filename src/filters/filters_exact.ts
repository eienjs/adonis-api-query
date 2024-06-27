import { type LucidModel, type ModelQueryBuilderContract } from '@adonisjs/lucid/types/model';
import { type StrictValues } from '@adonisjs/lucid/types/querybuilder';
import { type Filter } from '../types.js';

export default class FiltersExact<Model extends LucidModel> implements Filter<Model> {
  public invoke(
    query: ModelQueryBuilderContract<Model>,
    value: StrictValues,
    property: string,
  ): void {
    if (Array.isArray(value)) {
      void query.whereIn(property, value);

      return;
    }

    void query.where(property, '=', value);
  }
}
