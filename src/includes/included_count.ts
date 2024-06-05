import app from '@adonisjs/core/services/app';
import { type LucidModel, type ModelQueryBuilderContract } from '@adonisjs/lucid/types/model';
import { type ExtractModelRelations } from '@adonisjs/lucid/types/relations';
import { type Include } from '../types.js';

export default class IncludedCount<Model extends LucidModel> implements Include<Model> {
  private countSuffix: string;

  public constructor() {
    this.countSuffix = app.config.get('apiquery.countSuffix', 'Count');
  }

  public invoke(
    query: ModelQueryBuilderContract<Model>,
    include: ExtractModelRelations<InstanceType<Model>> | string,
  ): void {
    const relationship = include.toString().split(this.countSuffix)[0] as ExtractModelRelations<
      InstanceType<Model>
    >;

    void query.withCount(relationship);
  }
}
