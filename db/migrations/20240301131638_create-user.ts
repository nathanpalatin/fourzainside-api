import type { Knex } from 'knex'


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (table) => {
    table.uuid('id').primary()
    table.text('name').notNullable()
    table.text('nickname').notNullable()
    table.text('email').notNullable()
    table.text('password').notNullable()
    table.text('cpf').notNullable()
    table.text('avatar').nullable()
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
    table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable()
  })
}


export async function down(knex: Knex): Promise<void> {
  knex.schema.dropTable('users')
}

