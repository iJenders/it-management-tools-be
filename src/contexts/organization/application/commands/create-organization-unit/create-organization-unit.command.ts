import { OrganizationType } from '../../../domain/enums/organization-type.enum';

export class CreateOrganizationUnitCommand {
  constructor(
    public readonly type: OrganizationType,
    public readonly nameVal: string,
    public readonly country: string,
    public readonly city: string,
    public readonly address: string,
    public readonly timeZoneVal?: string,
    public readonly parentOrganizationId: string | null = null,
  ) {}
}
