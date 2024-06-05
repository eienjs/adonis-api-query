import { type LucidModel, type ModelQueryBuilderContract } from '@adonisjs/lucid/types/model';
import { type RawQueryBindings, type StrictValues } from '@adonisjs/lucid/types/querybuilder';
import { type Filter } from '../types.js';
import FiltersExact from './filters_exact.js';

export default class FiltersPartial<Model extends LucidModel>
  extends FiltersExact<Model>
  implements Filter<Model>
{
  public invoke(
    query: ModelQueryBuilderContract<Model>,
    value: StrictValues,
    property: string,
  ): void {
    if (this.addRelationConstraint && this.isRelationProperty(query, property)) {
      this.withRelationConstraint(query, value, property);

      return;
    }

    const databaseDriver = this.getDatabaseDriver(query);

    if (Array.isArray(value)) {
      if (value.filter((item) => item.toString().length > 0).length === 0) {
        return;
      }

      void query.where((subQuery) => {
        for (const partialValue of value.filter((item) => item.toString().length > 0)) {
          const subRawParameter = this.getWhereRawParameters(
            partialValue,
            property,
            databaseDriver,
          );
          void subQuery.orWhereRaw(subRawParameter.sql, subRawParameter.bindings);
        }
      });
    }

    const rawParameter = this.getWhereRawParameters(value, property, databaseDriver);
    void query.whereRaw(rawParameter.sql, rawParameter.bindings);
  }

  protected getDatabaseDriver(query: ModelQueryBuilderContract<Model>): string {
    return query.client.dialect.name;
  }

  protected getWhereRawParameters(
    value: StrictValues,
    property: string,
    driver: string,
  ): { sql: string; bindings: RawQueryBindings } {
    const resolvedValue = value.toString().toLowerCase();

    return {
      sql: `LOWER(${property}) LIKE ?${this.maybeSpecifyEscapeChar(driver)}`,
      bindings: [`%${this.escapeLike(resolvedValue)}%`],
    };
  }

  protected escapeLike(value: string): string {
    return value
      .replaceAll('\\', '\\\\')
      .replaceAll('_', String.raw` \\_`)
      .replaceAll('%', String.raw`\\%`);
  }

  protected maybeSpecifyEscapeChar(driver: string): string {
    if (!['sqlite3', 'postgres', 'mssql'].includes(driver)) {
      return '';
    }

    return String.raw` ESCAPE '\'`;
  }
}
