import { MigrationInterface, QueryRunner } from "typeorm";

export class Notification1713078987317 implements MigrationInterface {
    name = 'Notification1713078987317'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`notification\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL, \`content\` varchar(255) NULL, \`type\` enum ('0', '1', '2', '3') NOT NULL, \`isRead\` tinyint NOT NULL DEFAULT 0, \`userId\` int NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`notification\` ADD CONSTRAINT \`FK_1ced25315eb974b73391fb1c81b\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`notification\` DROP FOREIGN KEY \`FK_1ced25315eb974b73391fb1c81b\``);
        await queryRunner.query(`DROP TABLE \`notification\``);
    }

}
