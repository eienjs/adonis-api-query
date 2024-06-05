import { type LucidModel, type ModelQueryBuilderContract } from '@adonisjs/lucid/types/model';
import { type ExtractModelRelations } from '@adonisjs/lucid/types/relations';
import { type Include } from '../types.js';

export default class IncludedRelationship<Model extends LucidModel> implements Include<Model> {
  public invoke(
    query: ModelQueryBuilderContract<Model>,
    include: ExtractModelRelations<InstanceType<Model>>,
  ): void {
    void query.preload(include);
  }
}
