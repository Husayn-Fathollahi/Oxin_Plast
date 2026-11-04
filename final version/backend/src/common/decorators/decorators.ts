import { SetMetadata } from '@nestjs/common';
import { IS_PUBLIC_KEY, ROLES_KEY } from '../constants';

/**
 * @Public() — marks a route as publicly accessible (no JWT required).
 * Used together with JwtAuthGuard which skips routes with this metadata.
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

/**
 * @Roles(...roles) — restricts a route to users with the specified roles.
 * Requires RolesGuard to be applied.
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
