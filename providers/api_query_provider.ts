import { type ApplicationService } from '@adonisjs/core/types';

export default class ApiQueryProvider {
  public constructor(protected app: ApplicationService) {}

  public register(): void {
    // Empty
  }

  public async boot(): Promise<void> {
    await import('../src/bindings/request_query.js');
    await import('../src/bindings/sorts_query.js');
    await import('../src/bindings/filters_query.js');
    await import('../src/bindings/includes_query.js');
  }
}
