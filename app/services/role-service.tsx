"use server";

type Role = 'anonymous' | 'customer' | 'maintainer' | 'admin';

class RoleService {
  static anonymousPaths = [
    /^\/login$/,
    /^\/login\/local-auth$/,
    /\/checkout\/[A-Za-z0-9]+/,
  ];

  static adminOnlyPaths = [
    /^\/admin(\/|$)/,
  ];

  static maintainerOnlyPaths = [
    /^\/maintainer(\/|$)/,
    ...RoleService.adminOnlyPaths,
  ];

  static prohibitedPathSpecs: Record<Role, RegExp[]> = {
    anonymous: [],
    customer: RoleService.maintainerOnlyPaths,
    maintainer: RoleService.adminOnlyPaths,
    admin: [],
  };

  static isPathBlockedForRole(path: string, blockedPaths: RegExp[]): boolean {
    return blockedPaths.some(regex => regex.test(path));
  }

  static async canViewPath(path: string, roleId: Role = 'anonymous') {
    if (roleId === 'anonymous') {
      return RoleService.anonymousPaths.some(regex => regex.test(path));
    } else {
      const blockedPaths = RoleService.prohibitedPathSpecs[roleId] || [];
      return !RoleService.isPathBlockedForRole(path, blockedPaths);
    }
  }
}

export default RoleService;
