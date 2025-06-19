/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import * as roles from '../config/roles';

import type { ALL_PERMISSIONS } from '../config/permissions';
import type { SafeUser } from '../models/user';

const PERMISSION_SETS = {
  owner:  new Set<ALL_PERMISSIONS>(roles.Owner),
  admin:  new Set<ALL_PERMISSIONS>(roles.Admin),
  member: new Set<ALL_PERMISSIONS>(roles.Member),
  guest:  new Set<ALL_PERMISSIONS>(roles.Guest)
};

export function hasPermission(user: SafeUser, householdId: string, permission: ALL_PERMISSIONS): boolean {
  const role = user.householdRoles[householdId];

  if(!role) {
    return false;
  }

  const permissionSet = PERMISSION_SETS[role];

  return permissionSet.has(permission);
}

export function hasAnyPermission(user: SafeUser, householdId: string, permissions: ALL_PERMISSIONS[]): boolean {
  const role = user.householdRoles[householdId];
  if(!role) {
    return false;
  }
  const permissionSet = PERMISSION_SETS[role];
  return permissions.some(val => permissionSet.has(val));
}


export function hasAllPermissions(user: SafeUser, householdId: string, permissions: ALL_PERMISSIONS[]): boolean {
  const role = user.householdRoles[householdId];
  if(!role) {
    return false;
  }

  const permissionSet = PERMISSION_SETS[role];

  return permissions.every(val => permissionSet.has(val));
}

export function getUserPermissions(user: SafeUser, householdId: string): ALL_PERMISSIONS[] {
  const role = user.householdRoles[householdId];
  if(!role) {
    throw new ReferenceError('User is not assigned a role for household');
  }

  const permissions = Array.from(PERMISSION_SETS[role]);
  return permissions;
}