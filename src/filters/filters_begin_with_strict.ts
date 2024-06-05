import { type LucidModel } from '@adonisjs/lucid/types/model';
import { type RawQueryBindings, type StrictValues } from '@adonisjs/lucid/types/querybuilder';
import { type Filter } from '../types.js';
import FiltersPartial from './filters_partial.js';

export default class FiltersBeginWithStrict<Model extends LucidModel>
  extends FiltersPartial<Model>
  implements Filter<Model>
{
  protected getWhereRawParameters(
    value: StrictValues,
    property: string,
    driver: string,
  ): { sql: string; bindings: RawQueryBindings } {
    return {
      sql: `${property} LIKE ?${this.maybeSpecifyEscapeChar(driver)}`,
      bindings: [`${this.escapeLike(value.toString())}%`],
    };
  }
}
