import * as migration_20260914_231117_init from './20260914_231117_init';

export const migrations = [
  {
    up: migration_20260914_231117_init.up,
    down: migration_20260914_231117_init.down,
    name: '20260914_231117_init'
  },
];
