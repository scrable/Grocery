const async = require('async');

const prefix = 'v3';
let dbm;
let type;
let seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = (options, seedLink) => {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = (db, callback) => {
  async.series(
    [
      db.createTable.bind(db, `${prefix}_fridges`, {
        columns: {
          fridge_id: {
            type: 'int',
            unsigned: true,
            primaryKey: true,
            autoIncrement: true,
          },
          serial_number: {
            type: 'string',
            length: 16,
            unique: true,
            notNull: true,
          },
          pin: {
            type: 'string',
            length: 16,
            notNull: true,
          },
          registered_ts: {
            type: 'timestamp',
            notNull: true,
            defaultValue: new String('CURRENT_TIMESTAMP'),
          },
        },
        ifNotExists: true,
      }),
      db.createTable.bind(db, `${prefix}_sessions`, {
        columns: {
          session: {
            type: 'string',
            length: 36,
            primaryKey: true,
          },
          fridge_id: {
            type: 'int',
            unsigned: true,
            notNull: true,
            foreignKey: {
              name: `${prefix}_sessions_fridge_id_fk`,
              table: `${prefix}_fridges`,
              notNull: true,
              rules: {
                onDelete: 'CASCADE',
                onUpdate: 'RESTRICT',
              },
              mapping: 'fridge_id',
            },
          },
          logged_in_ts: {
            type: 'timestamp',
            notNull: true,
            defaultValue: new String('CURRENT_TIMESTAMP'),
          },
          expires_ts: {
            type: 'timestamp',
            notNull: true,
          },
        },
        ifNotExists: true,
      }),

      db.createTable.bind(db, `${prefix}_users`, {
        columns: {
          user_id: {
            type: 'int',
            unsigned: true,
            autoIncrement: true,
            primaryKey: true,
          },
          fridge_id: {
            type: 'int',
            unsigned: true,
            notNull: true,
            foreignKey: {
              name: `${prefix}_users_fridge_id_fk`,
              table: `${prefix}_fridges`,
              rules: {
                onDelete: 'CASCADE',
                onUpdate: 'RESTRICT',
              },
              mapping: 'fridge_id',
            },
          },
          name: {
            type: 'string',
            length: 64,
            notNull: true,
          },
          role: {
            type: 'string',
            length: 64,
            notNull: true,
          },
          intolerances: {
            type: 'text',
            notNull: true,
            default: '',
          },
          created_ts: {
            type: 'timestamp',
            notNull: true,
            defaultValue: new String('CURRENT_TIMESTAMP'),
          },
        },
        ifNotExists: true,
      }),

      db.addIndex.bind(db, `${prefix}_users`, `${prefix}_users_fridge_id_index`, ['fridge_id']),
      db.addIndex.bind(db, `${prefix}_users`, `${prefix}_users_fridge_id_name_index`, ['fridge_id', 'name'], true),

      db.createTable.bind(db, `${prefix}_nutrition`, {
        columns: {
          nutrition_id: {
            type: 'int',
            unsigned: true,
            primaryKey: true,
            autoIncrement: true,
          },
          calories: {
            type: 'int',
            notNull: true,
            unsigned: true,
          },
          calories_unit: {
            type: 'string',
            length: 8,
            notNull: true,
          },
          fat: {
            type: 'int',
            unsigned: true,
            notNull: true,
          },
          fat_unit: {
            type: 'string',
            length: 8,
            notNull: true,
          },
          protein: {
            type: 'int',
            unsigned: true,
            notNull: true,
          },
          protein_unit: {
            type: 'string',
            length: 8,
            notNull: true,
          },
          carbohydrates: {
            type: 'int',
            unsigned: true,
            notNull: true,
          },
          carbohydrates_unit: {
            type: 'string',
            length: 8,
            notNull: true,
          },
        },
        ifNotExists: true,
      }),

      db.createTable.bind(db, `${prefix}_ingredients`, {
        columns: {
          ingredient_id: {
            type: 'int',
            unsigned: true,
            primaryKey: true,
          },
          name: {
            type: 'string',
            length: 128,
            unique: true,
            notNull: true,
          },
          image: {
            type: 'text',
            notNull: true,
          },
        },
      }),

      db.createTable.bind(db, `${prefix}_recipes`, {
        columns: {
          recipe_id: {
            type: 'int',
            unsigned: true,
            primaryKey: true,
          },
          title: {
            type: 'string',
            length: 250,
            notNull: true,
          },
          image: {
            type: 'text',
            notNull: true,
          },
          servings: {
            type: 'smallint',
            unsigned: true,
            notNull: true,
          },
          cooking_time: {
            type: 'smallint',
            unsigned: true,
            notNull: true,
          },
          instructions: {
            type: 'text',
            notNull: true,
          },
        },
        ifNotExists: true,
      }),

      db.addIndex.bind(db, `${prefix}_recipes`, `${prefix}_recipes_title_index`, ['title']),

      db.createTable.bind(db, `${prefix}_recipe_favorites`, {
        columns: {
          user_id: {
            type: 'int',
            unsigned: true,
            primaryKey: true,
            foreignKey: {
              name: `${prefix}_recipe_favorites_user_id_fk`,
              table: `${prefix}_users`,
              rules: {
                onDelete: 'CASCADE',
                onUpdate: 'RESTRICT',
              },
              mapping: 'user_id',
            },
          },
          recipe_id: {
            type: 'int',
            unsigned: true,
            primaryKey: true,
            foreignKey: {
              name: `${prefix}_recipe_favorites_recipe_id_fk`,
              table: `${prefix}_recipes`,
              rules: {
                onDelete: 'CASCADE',
                onUpdate: 'RESTRICT',
              },
              mapping: 'recipe_id',
            },
          },
          favorited_ts: {
            type: 'timestamp',
            notNull: true,
            defaultValue: new String('CURRENT_TIMESTAMP'),
          },
        },
        ifNotExists: true,
      }),

      db.addIndex.bind(db, `${prefix}_recipe_favorites`, `${prefix}_recipe_favorites_user_id_index`, ['user_id']),

      db.createTable.bind(db, `${prefix}_recipe_ingredients`, {
        columns: {
          recipe_id: {
            type: 'int',
            unsigned: true,
            primaryKey: true,
            foreignKey: {
              name: `${prefix}_recipe_ingredients_recipe_id_fk`,
              table: `${prefix}_recipes`,
              rules: {
                onDelete: 'CASCADE',
                onUpdate: 'RESTRICT',
              },
              mapping: 'recipe_id',
            },
          },
          ingredient_id: {
            type: 'int',
            unsigned: true,
            primaryKey: true,
            foreignKey: {
              name: `${prefix}_recipe_ingredients_ingredient_id_fk`,
              table: `${prefix}_ingredients`,
              rules: {
                onDelete: 'CASCADE',
                onUpdate: 'RESTRICT',
              },
              mapping: 'ingredient_id',
            },
          },
          quantity: {
            type: 'real',
            notNull: true,
          },
          unit: {
            type: 'string',
            length: 8,
            notNull: true,
          },
        },
        ifNotExists: true,
      }),

      db.addIndex.bind(db, `${prefix}_recipe_ingredients`, `${prefix}_recipe_ingredients_recipe_id_index`, ['recipe_id']),

      db.createTable.bind(db, `${prefix}_inventory`, {
        columns: {
          inventory_id: {
            type: 'int',
            unsigned: true,
            primaryKey: true,
            autoIncrement: true,
          },
          fridge_id: {
            type: 'int',
            unsigned: true,
            notNull: true,
            foreignKey: {
              name: `${prefix}_inventory_fridge_id_fk`,
              table: `${prefix}_fridges`,
              rules: {
                onDelete: 'CASCADE',
                onUpdate: 'RESTRICT',
              },
              mapping: 'fridge_id',
            },
          },
          ingredient_id: {
            type: 'int',
            unsigned: true,
            notNull: true,
            foreignKey: {
              name: `${prefix}_inventory_ingredient_id_fk`,
              table: `${prefix}_ingredients`,
              rules: {
                onDelete: 'CASCADE',
                onUpdate: 'RESTRICT',
              },
              mapping: 'ingredient_id',
            },
          },
          expiration_date: {
            type: 'timestamp',
            default: null,
          },
          total_quantity: {
            type: 'real',
            notNull: true,
          },
          unit: {
            type: 'string',
            length: 16,
            notNull: true,
          },
          price: {
            type: 'int',
            unsigned: true,
            notNull: true,
          },
        },
        ifNotExists: true,
      }),

      db.addIndex.bind(db, `${prefix}_inventory`, `${prefix}_inventory_fridge_id_index`, ['fridge_id']),
      db.addIndex.bind(db, `${prefix}_inventory`, `${prefix}_inventory_total_quantity_index`, ['total_quantity']),

      db.createTable.bind(db, `${prefix}_inventory_log`, {
        columns: {
          inventory_log_id: {
            type: 'int',
            unsigned: true,
            primaryKey: true,
            autoIncrement: true,
          },
          inventory_id: {
            type: 'int',
            unsigned: true,
            foreignKey: {
              name: `${prefix}_inventory_log_inventory_id_fk`,
              table: `${prefix}_inventory`,
              rules: {
                onDelete: 'CASCADE',
                onUpdate: 'RESTRICT',
              },
              mapping: 'inventory_id',
            },
          },
          quantity: {
            type: 'real',
            notNull: true,
          },
          user_id: {
            type: 'int',
            unsigned: true,
            foreignKey: {
              name: `${prefix}_inventory_log_user_id_fk`,
              table: `${prefix}_users`,
              rules: {
                onDelete: 'SET NULL',
                onUpdate: 'RESTRICT',
              },
              mapping: 'user_id',
            },
          },
          action: {
            type: 'string',
            length: 24,
            notNull: true,
          },
          action_ts: {
            type: 'timestamp',
            notNull: true,
            defaultValue: new String('CURRENT_TIMESTAMP'),
          },
        },
        ifNotExists: true,
      }),

      db.addIndex.bind(db, `${prefix}_inventory_log`, `${prefix}_inventory_log_inventory_id_index`, ['inventory_id']),
      db.addIndex.bind(db, `${prefix}_inventory_log`, `${prefix}_inventory_log_action_index`, ['action']),
    ],
    callback,
  );
};

exports.down = (db, callback) => {
  async.series(
    [
      db.dropTable(`${prefix}_fridges`, callback),
      db.dropTable(`${prefix}_sessions`, callback),
      db.dropTable(`${prefix}_users`, callback),
      db.dropTable(`${prefix}_nutrition`, callback),
      db.dropTable(`${prefix}_ingredients`, callback),
      db.dropTable(`${prefix}_recipes`, callback),
      db.dropTable(`${prefix}_recipe_ingredients`, callback),
      db.dropTable(`${prefix}_inventory`, callback),
      db.dropTable(`${prefix}_inventory_log`, callback),
      db.dropTable(`${prefix}_recipe_favorites`, callback),

    ],
    callback,
  );
};

exports._meta = {
  version: 3,
};
