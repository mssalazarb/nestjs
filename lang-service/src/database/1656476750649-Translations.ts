import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class Translations1656476750649 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'translations',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            isPrimary: true,
          },
          {
            name: 'group',
            type: 'varchar',
          },
          {
            name: 'lang',
            type: 'varchar',
          },
          {
            name: 'key_word',
            type: 'varchar',
          },
          {
            name: 'value',
            type: 'varchar',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      'translations',
      new TableIndex({
        name: 'IDX_QUESTION_GROUP',
        columnNames: ['group', 'key_word'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('translations');
  }
}
