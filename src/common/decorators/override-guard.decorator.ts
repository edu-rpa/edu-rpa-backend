import { SetMetadata, UseGuards } from '@nestjs/common';

export const OVERRIDE_GUARD_KEY = 'overrideGuard';

export const OverrideGuard = (guard: Function) => {
  return (target, key?, descriptor?) => {
    SetMetadata(OVERRIDE_GUARD_KEY, true)(target, key, descriptor);
    UseGuards(guard)(target, key, descriptor);
  };
};
