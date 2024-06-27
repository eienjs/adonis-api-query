import { type LucidModel, type ModelQueryBuilderContract } from '@adonisjs/lucid/types/model';
import { type StrictValues } from '@adonisjs/lucid/types/querybuilder';
import { type Filter } from '../types.js';

export default class FiltersPartial<Model extends LucidModel> implements Filter<Model> {
  public invoke(
    query: ModelQueryBuilderContract<Model>,
    value: StrictValues,
    property: string,
  ): void {
    if (Array.isArray(value)) {
      if (value.filter((item) => item.toString().length > 0).length === 0) {
        return;
      }

      void query.where((subQuery) => {
        for (const partialValue of value.filter((item) => item.toString().length > 0)) {
          void subQuery.orWhereILike(property, `%${partialValue}%`);
        }
      });
    }

    void query.whereILike(property, `%${value}%`);
  }
}
