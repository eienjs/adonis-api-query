import {
  type LucidModel,
  type LucidRow,
  type ModelQueryBuilderContract,
} from '@adonisjs/lucid/types/model';
import { type StrictValues } from '@adonisjs/lucid/types/querybuilder';
import { type ExtractModelRelations, type ModelRelations } from '@adonisjs/lucid/types/relations';

export type ApiQueryConfig = {
  parameters?: {
    include?: string;
    filter?: string;
    sort?: string;
    fields?: string;
    append?: string;
  };
  countSuffix?: string;
  existsSuffix?: string;
  disableInvalidFilterQueryException?: boolean;
  disableInvalidSortQueryException?: boolean;
  disableInvalidIncludesQueryException?: boolean;
  convertRelationNamesToSnakeCasePlural?: boolean;
};

export type ResolvedApiQueryConfig = Required<ApiQueryConfig>;

export type IncludeCallback<Model extends LucidRow> = <
  Name extends ExtractModelRelations<Model>,
  RelatedBuilder = Model[Name] extends ModelRelations<LucidModel> ? Model[Name]['builder'] : never,
>(
  builder: RelatedBuilder,
) => void;

export interface Sort<Model extends LucidModel> {
  invoke(query: ModelQueryBuilderContract<Model>, descending: boolean, property: string): void;
}

export interface Include<Model extends LucidModel> {
  invoke(
    query: ModelQueryBuilderContract<Model>,
    include: ExtractModelRelations<InstanceType<Model>>,
  ): void;
}

export interface Filter<Model extends LucidModel> {
  invoke(query: ModelQueryBuilderContract<Model>, value: StrictValues, property: string): void;
}
