/**
 * Application-wide string constants.
 * Using constants instead of magic strings prevents typos and eases refactoring.
 */

/** Metadata key used by the @Roles() decorator. */
export const ROLES_KEY = 'roles';

/** Metadata key used by the @Public() decorator to skip JWT auth. */
export const IS_PUBLIC_KEY = 'isPublic';

/** Supported user roles. */
export enum UserRole {
  ADMIN = 'admin',
  EDITOR = 'editor',
}

/** Supported content publication statuses. */
export enum PublishStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}
