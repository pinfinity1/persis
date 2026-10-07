import * as migration_20260914_231117_init from './20260914_231117_init';
import * as migration_20260915_010945_make_color_family_optional from './20260915_010945_make_color_family_optional';
import * as migration_20260915_121707_update_gallery_to_upload_has_many from './20260915_121707_update_gallery_to_upload_has_many';
import * as migration_20260915_130131_secure_transient_locks_constraints from './20260915_130131_secure_transient_locks_constraints';
import * as migration_20261006_131025_create_posts_collection from './20261006_131025_create_posts_collection';
import * as migration_20261007_091910_create_inspirations_collection from './20261007_091910_create_inspirations_collection';

export const migrations = [
  {
    up: migration_20260914_231117_init.up,
    down: migration_20260914_231117_init.down,
    name: '20260914_231117_init',
  },
  {
    up: migration_20260915_010945_make_color_family_optional.up,
    down: migration_20260915_010945_make_color_family_optional.down,
    name: '20260915_010945_make_color_family_optional',
  },
  {
    up: migration_20260915_121707_update_gallery_to_upload_has_many.up,
    down: migration_20260915_121707_update_gallery_to_upload_has_many.down,
    name: '20260915_121707_update_gallery_to_upload_has_many',
  },
  {
    up: migration_20260915_130131_secure_transient_locks_constraints.up,
    down: migration_20260915_130131_secure_transient_locks_constraints.down,
    name: '20260915_130131_secure_transient_locks_constraints',
  },
  {
    up: migration_20261006_131025_create_posts_collection.up,
    down: migration_20261006_131025_create_posts_collection.down,
    name: '20261006_131025_create_posts_collection',
  },
  {
    up: migration_20261007_091910_create_inspirations_collection.up,
    down: migration_20261007_091910_create_inspirations_collection.down,
    name: '20261007_091910_create_inspirations_collection'
  },
];
