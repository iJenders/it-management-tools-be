export class HierarchyValidatorService {
  /**
   * Validates that adding targetId under parentAncestors does not cause a cyclic loop.
   * Runs 100% in memory without I/O dependencies.
   */
  public static validateNoCycle(
    targetId: string,
    parentManagementId: string | null,
    parentAncestors: string[],
  ): void {
    if (parentManagementId === targetId) {
      throw new Error('A unit cannot report to itself');
    }

    if (parentManagementId && parentAncestors.includes(targetId)) {
      throw new Error(
        'Circular dependency detected: The proposed parent reports to a descendant of this unit',
      );
    }

    if (parentAncestors.length > 100) {
      throw new Error(
        'Hierarchy tree is too deep, possible corruption or cyclic loop.',
      );
    }
  }
}
