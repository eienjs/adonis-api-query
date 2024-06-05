import { type LucidModel, type ModelQueryBuilderContract } from '@adonisjs/lucid/types/model';
import { type ExtractModelRelations } from '@adonisjs/lucid/types/relations';
import { type Include, type IncludeCallback } from '../types.js';

export default class IncludedCallback<Model extends LucidModel> implements Include<Model> {
  public constructor(protected callback: IncludeCallback<InstanceType<Model>>) {}

  public invoke(
    query: ModelQueryBuilderContract<Model>,
    include: ExtractModelRelations<InstanceType<Model>>,
  ): void {
    void query.preload(include, this.callback);
  }
}
