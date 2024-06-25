exports.up = function(knex) {
    return knex.schema.createTable('accounts', function(table) {
      table.increments('id').primary();
      table.integer('userId').unsigned().notNullable();
      table.string('type').notNullable();
      table.decimal('amount', 14, 2).defaultTo(0);
      table.foreign('userId').references('users.id').onDelete('CASCADE');
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('accounts');
  };
  