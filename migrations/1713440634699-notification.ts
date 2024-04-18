import { MigrationInterface, QueryRunner } from "typeorm";

export class Notification1713440634699 implements MigrationInterface {
    name = 'Notification1713440634699'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`notification\` CHANGE \`type\` \`type\` enum ('ROBOT_TRIGGER', 'ROBOT_EXECUTION', 'PROCESS_SHARED', 'CONNECTION_CHECK') NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`notification\` CHANGE \`type\` \`type\` enum ('0', '1', '2', '3') NOT NULL`);
    }

}
