export class CreateManagementCommand {
  constructor(
    public readonly nameVal: string,
    public readonly managerId: string | null = null,
    public readonly organizationId: string = '',
    public readonly parentManagementId: string | null = null,
  ) {}
}
