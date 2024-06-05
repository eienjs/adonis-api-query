import { type LucidModel, type ModelQueryBuilderContract } from '@adonisjs/lucid/types/model';
import { type StrictValues } from '@adonisjs/lucid/types/querybuilder';
import { type Filter } from '../types.js';

export default class FiltersTrashed<Model extends LucidModel> implements Filter<Model> {
  public invoke(
    query: ModelQueryBuilderContract<Model>,
    value: StrictValues,
    _property: string,
  ): void {
    if (value === 'with' && 'withTrashed' in query) {
      (query as unknown as { withTrashed(): void }).withTrashed();

      return;
    }

    if (value === 'only' && 'onlyTrashed' in query) {
      (query as unknown as { onlyTrashed(): void }).onlyTrashed();
    }
  }
}
