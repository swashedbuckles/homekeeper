import { 
  HouseholdPermissions, 
  UserPermissions, 
  AssetPermissions, 
  ManualPermissions, 
  TaskPermissions,
  DocumentPermissions,
  SearchPermissions 
} from './permissions';

/**
 * No permission limits on owners -- they can do it all!
 */
export const Owner = [
  ...Object.values(HouseholdPermissions),
  ...Object.values(UserPermissions),
  ...Object.values(AssetPermissions),
  ...Object.values(ManualPermissions),
  ...Object.values(TaskPermissions),
  ...Object.values(DocumentPermissions),
  ...Object.values(SearchPermissions),
];

/**
 * Admins can invite people, update households and have full control over
 * resources. However they do not have the ability to modify membership once
 * someone has been added. 
 */
export const Admin = [
  HouseholdPermissions.HOUSEHOLD_VIEW,
  HouseholdPermissions.HOUSEHOLD_UPDATE,
  HouseholdPermissions.HOUSEHOLD_INVITE_MEMBERS,
  HouseholdPermissions.HOUSEHOLD_VIEW_MEMBERS,

  UserPermissions.USER_VIEW_PROFILE,
  UserPermissions.USER_UPDATE_OWN_PROFILE,
  UserPermissions.USER_DELETE_OWN_ACCOUNT,

  ...Object.values(AssetPermissions).filter(x => x !== AssetPermissions.ASSET_TRANSFER),
  ...Object.values(ManualPermissions),
  ...Object.values(TaskPermissions),
  ...Object.values(DocumentPermissions),
  ...Object.values(SearchPermissions),
];

/**
 * Members have stricter controls over household resources -- they can upload
 * modify and edit manuals/documents, but can't remove or transfer assets. They
 * can be assigned to a task, but not edit or create tasks. 
 */
export const Member = [
    HouseholdPermissions.HOUSEHOLD_VIEW,
    UserPermissions.USER_VIEW_PROFILE,
    UserPermissions.USER_UPDATE_OWN_PROFILE,
    UserPermissions.USER_DELETE_OWN_ACCOUNT,
    
    AssetPermissions.ASSET_CREATE,
    AssetPermissions.ASSET_VIEW,
    AssetPermissions.ASSET_UPDATE,
    
    TaskPermissions.TASK_VIEW,
    TaskPermissions.TASK_COMPLETE,
    TaskPermissions.TASK_VIEW_HISTORY,
    
    ...Object.values(ManualPermissions),
    DocumentPermissions.DOCUMENT_CREATE,
    DocumentPermissions.DOCUMENT_VIEW,
    DocumentPermissions.DOCUMENT_UPDATE_OWN,
    DocumentPermissions.DOCUMENT_DELETE_OWN,
    
    SearchPermissions.SEARCH_MANUALS,
    SearchPermissions.SEARCH_ASSETS,
    SearchPermissions.SEARCH_TASKS,
    SearchPermissions.SEARCH_DOCUMENTS,
];

/**
 * Guests are basically read-only -- limited access to content and search,
 * no ability edit or upload additional content. 
 */
export const Guest = [
    HouseholdPermissions.HOUSEHOLD_VIEW,
    UserPermissions.USER_VIEW_PROFILE,
    UserPermissions.USER_UPDATE_OWN_PROFILE,
    
    AssetPermissions.ASSET_VIEW,
    ManualPermissions.MANUAL_VIEW,
    ManualPermissions.MANUAL_DOWNLOAD,
    ManualPermissions.MANUAL_VIEW_CONTENT,
    TaskPermissions.TASK_VIEW,
    DocumentPermissions.DOCUMENT_VIEW,
    
    SearchPermissions.SEARCH_MANUALS,
    SearchPermissions.SEARCH_ASSETS,
    SearchPermissions.SEARCH_TASKS,
  ];