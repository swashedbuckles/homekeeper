import { ValuesOfObject } from '../utils/extractTypes';

export const HouseholdPermissions = {
  HOUSEHOLD_VIEW:   'household:view',
  HOUSEHOLD_UPDATE: 'household:update', 
  HOUSEHOLD_DELETE: 'household:delete',
  
  HOUSEHOLD_INVITE_MEMBERS:      'household:invite_members',
  HOUSEHOLD_REMOVE_MEMBERS:      'household:remove_members',
  HOUSEHOLD_UPDATE_MEMBER_ROLES: 'household:update_member_roles',
  HOUSEHOLD_TRANSFER_OWNERSHIP:  'household:transfer_ownership',
} as const;

export const UserPermissions = {
  USER_VIEW_PROFILE:       'user:view_profile',
  USER_UPDATE_OWN_PROFILE: 'user:update_own_profile',
  USER_UPDATE_ANY_PROFILE: 'user:update_any_profile',
  USER_DELETE_OWN_ACCOUNT: 'user:delete_own_account',
  USER_DELETE_ANY_ACCOUNT: 'user:delete_any_account',
} as const;

export const AssetPermissions = {
  ASSET_CREATE: 'asset:create',
  ASSET_VIEW:   'asset:view',
  ASSET_UPDATE: 'asset:update',
  ASSET_DELETE: 'asset:delete',
  
  ASSET_TRANSFER: 'asset:transfer',  // Move to different household
  ASSET_ARCHIVE:  'asset:archive',   // Soft delete for historical purposes
} as const;

export const ManualPermissions = {
  // File operations
  MANUAL_UPLOAD:   'manual:upload',
  MANUAL_VIEW:     'manual:view',
  MANUAL_DOWNLOAD: 'manual:download',
  MANUAL_UPDATE:   'manual:update',     // Metadata only
  MANUAL_DELETE:   'manual:delete',
  
  // Content operations
  MANUAL_VIEW_CONTENT:        'manual:view_content', // OCR text
  MANUAL_EDIT_EXTRACTED_TEXT: 'manual:edit_extracted_text',
  
  // Advanced operations
  MANUAL_BULK_UPLOAD: 'manual:bulk_upload',
  MANUAL_EXPORT:      'manual:export',   // Export multiple manuals
} as const;

export const TaskPermissions = {
  // Basic CRUD
  TASK_CREATE: 'task:create',
  TASK_VIEW:   'task:view',
  TASK_UPDATE: 'task:update',
  TASK_DELETE: 'task:delete',
  
  // Task operations
  TASK_COMPLETE: 'task:complete',
  TASK_ASSIGN:   'task:assign',       // Assign to other users
  TASK_UNASSIGN: 'task:unassign',
  
  // Scheduling
  TASK_UPDATE_SCHEDULE: 'task:update_schedule',
  TASK_SKIP_OCCURRENCE: 'task:skip_occurrence',
  
  // History and reporting
  TASK_VIEW_HISTORY:   'task:view_history',
  TASK_VIEW_ANALYTICS: 'task:view_analytics',
} as const;

export const DocumentPermissions = {
  // Basic CRUD
  DOCUMENT_CREATE: 'document:create',
  DOCUMENT_VIEW:   'document:view',
  DOCUMENT_UPDATE: 'document:update',
  DOCUMENT_DELETE: 'document:delete',
  
  // Content operations
  DOCUMENT_EDIT_CONTENT: 'document:edit_content',
  
  // Ownership-specific
  DOCUMENT_UPDATE_OWN: 'document:update_own',
  DOCUMENT_DELETE_OWN: 'document:delete_own',
} as const;

export const SearchPermissions = {
  SEARCH_MANUALS:        'search:manuals',
  SEARCH_ASSETS:         'search:assets',
  SEARCH_TASKS:          'search:tasks',
  SEARCH_DOCUMENTS:      'search:documents',
  SEARCH_GLOBAL:         'search:global',           // Cross-category search
  SEARCH_EXPORT_RESULTS: 'search:export_results',
} as const;

export type ALL_PERMISSIONS = ValuesOfObject<typeof HouseholdPermissions>
  | ValuesOfObject<typeof UserPermissions>
  | ValuesOfObject<typeof AssetPermissions>
  | ValuesOfObject<typeof ManualPermissions>
  | ValuesOfObject<typeof TaskPermissions>
  | ValuesOfObject<typeof DocumentPermissions>
  | ValuesOfObject<typeof SearchPermissions>

