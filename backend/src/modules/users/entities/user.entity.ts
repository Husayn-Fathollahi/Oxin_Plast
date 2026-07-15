/**
 * user.entity.ts
 * TypeScript interface representing the User domain object.
 * The actual database schema is defined in prisma/schema.prisma.
 */
export interface UserEntity {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'admin' | 'editor';
  createdAt: Date;
  updatedAt: Date;
}
