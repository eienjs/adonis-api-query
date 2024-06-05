import { type LucidModel, type ModelQueryBuilderContract } from '@adonisjs/lucid/types/model';
import { type StrictValues } from '@adonisjs/lucid/types/querybuilder';
import { type ExtractModelRelations } from '@adonisjs/lucid/types/relations';
import { type Filter } from '../types.js';

export default class FiltersExact<Model extends LucidModel> implements Filter<Model> {
  protected relationConstraints: string[] = [];

  public constructor(protected addRelationConstraint = true) {}

  public invoke(
    query: ModelQueryBuilderContract<Model>,
    value: StrictValues,
    property: string,
  ): void {
    if (this.addRelationConstraint && this.isRelationProperty(query, property)) {
      this.withRelationConstraint(query, value, property);

      return;
    }

    if (Array.isArray(value)) {
      void query.whereIn(property, value);

      return;
    }

    void query.where(property, '=', value);
  }

  protected isRelationProperty(query: ModelQueryBuilderContract<Model>, property: string): boolean {
    if (!property.includes('.')) {
      return false;
    }

    if (this.relationConstraints.includes(property)) {
      return false;
    }

    if (property.split('.').length > 2) {
      return false;
    }

    const firstRelationship = property.split('.')[0];

    return query.model.$hasRelation(firstRelationship);
  }

  protected withRelationConstraint(
    query: ModelQueryBuilderContract<Model>,
    value: StrictValues,
    property: string,
  ): void {
    const parts = property.split('.');
    const relation = parts.at(0)! as ExtractModelRelations<InstanceType<Model>>;
    const resolvedProperty = parts.at(1)!;

    void query.whereHas(relation, (subQuery) => {
      this.relationConstraints.push(resolvedProperty);

      this.invoke(subQuery as unknown as ModelQueryBuilderContract<Model>, value, resolvedProperty);
    });
  }
}
