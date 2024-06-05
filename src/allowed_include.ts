import { type LucidModel, type ModelQueryBuilderContract } from '@adonisjs/lucid/types/model';
import { type ExtractModelRelations } from '@adonisjs/lucid/types/relations';
import IncludedCallback from './includes/included_callback.js';
import IncludedCount from './includes/included_count.js';
import IncludedRelationship from './includes/included_relationship.js';
import { type Include, type IncludeCallback } from './types.js';

export default class AllowedInclude<Model extends LucidModel> {
  protected name: string;

  protected includeClass: Include<Model>;

  protected internalName: string;

  public constructor(name: string, includeClass: Include<Model>, internalName?: string) {
    this.name = name;
    this.includeClass = includeClass;
    this.internalName = internalName ?? name;
  }

  public static relationship<Model extends LucidModel>(
    name: string,
    internalName?: string,
  ): AllowedInclude<Model> {
    return new AllowedInclude(name, new IncludedRelationship(), internalName);
  }

  public static count<Model extends LucidModel>(
    name: string,
    internalName?: string,
  ): AllowedInclude<Model> {
    return new AllowedInclude(name, new IncludedCount(), internalName);
  }

  public static callback<Model extends LucidModel>(
    name: string,
    callback: IncludeCallback<InstanceType<Model>>,
    internalName?: string,
  ): AllowedInclude<Model> {
    return new AllowedInclude(name, new IncludedCallback(callback), internalName);
  }

  public static custom<Model extends LucidModel>(
    name: string,
    includeClass: Include<Model>,
    internalName?: string,
  ): AllowedInclude<Model> {
    return new AllowedInclude(name, includeClass, internalName);
  }

  public include(query: ModelQueryBuilderContract<Model>): void {
    this.includeClass.invoke(
      query,
      this.internalName as ExtractModelRelations<InstanceType<Model>>,
    );
  }

  public getName(): string {
    return this.name;
  }

  public isForInclude(includeName: string): boolean {
    return this.name === includeName;
  }
}
