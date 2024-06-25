exports.up = function(knex) {
    return knex.schema.createTable('sessions', function(table) {
      table.increments('id').primary();
      table.integer('userId').unsigned().notNullable();
      table.string('token').notNullable();
      table.foreign('userId').references('users.id').onDelete('CASCADE');
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('sessions');
  };
  