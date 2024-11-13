--liquibase formatted sql

--changeset khanhv@suga.com.vn:create-table-transaction-smc
CREATE TABLE "transactions" (
    "id" uuid PRIMARY KEY,
    "transaction_hash" varchar(255) UNIQUE,
    "sender" varchar(255) NOT NULL,
    "receiver" varchar(255) NOT NULL,
    "amount" bigint NOT NULL,
    "created_at" timestamp(6),
    "updated_at" timestamp(6)
);

--changeset khanhv@suga.com.vn:add-unique-constraint-transaction-smc
ALTER TABLE "transactions"
    ADD CONSTRAINT "transaction_hash_unique"
    UNIQUE ("transaction_hash");

--changeset khanhv@suga.com.vn:add-user_id-payment_token-columns-transaction-table-smc
ALTER TABLE "transactions"
    ADD COLUMN "user_id" varchar(255) NOT NULL,
    ADD COLUMN "payment_token" varchar(255) NOT NULL;

--changeset khanhv@suga.com.vn:rename-transaction_hash-to-transaction_id
ALTER TABLE "transactions"
    RENAME COLUMN "transaction_hash" TO "transaction_id";

--changeset khanhv@suga.com.vn:update-unique-constraint-transaction_id
ALTER TABLE "transactions"
    DROP CONSTRAINT "transaction_hash_unique",
    ADD CONSTRAINT "transaction_id_unique" UNIQUE ("transaction_id");

--changeset khanhv@suga.com.vn:add-items_id-transaction-table-smc
ALTER TABLE "transactions"
    ADD COLUMN "items_id" varchar(255) NOT NULL;

--changeset khanhv@suga.com.vn:drop-items_id-user_id-payment_token-column-transaction-table-smc
ALTER TABLE "transactions"
    DROP COLUMN "items_id",
    DROP COLUMN "user_id",
    DROP COLUMN "payment_token";
