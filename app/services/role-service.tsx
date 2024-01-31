"use server";

type Role = 'anonymous' | 'customer' | 'maintainer' | 'admin';

class RoleService {
  static anonymousPaths = [
    /^\/$/,
    /^\/login$/,
    /^\/customer-login$/,
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
      const result = RoleService.anonymousPaths.some(regex => regex.test(path));
      console.debug("==== canViewPath anonymous", path, result ? 'allowed' : 'blocked');
      return result;
    } else {
      const blockedPaths = RoleService.prohibitedPathSpecs[roleId] || [];
      const result = !RoleService.isPathBlockedForRole(path, blockedPaths);
      console.debug(`==== canViewPath ${roleId}`, path, result, result ? 'allowed' : 'blocked');
      return result;
    }
  }
}

export default RoleService;
