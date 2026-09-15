import * as migration_20260914_231117_init from './20260914_231117_init';
import * as migration_20260915_010945_make_color_family_optional from './20260915_010945_make_color_family_optional';

export const migrations = [
  {
    up: migration_20260914_231117_init.up,
    down: migration_20260914_231117_init.down,
    name: '20260914_231117_init',
  },
  {
    up: migration_20260915_010945_make_color_family_optional.up,
    down: migration_20260915_010945_make_color_family_optional.down,
    name: '20260915_010945_make_color_family_optional'
  },
];
