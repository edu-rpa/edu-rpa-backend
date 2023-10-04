import { SetMetadata } from '@nestjs/common';

export const OVERRIDE_GUARD_KEY = 'overrideGuard';
export const OverrideGuard = () => SetMetadata(OVERRIDE_GUARD_KEY, true);