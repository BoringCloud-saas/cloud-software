CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"access_token" varchar(255) NOT NULL,
	"refresh_token" varchar(255) NOT NULL,
	"sub" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"given_name" varchar(255) NOT NULL,
	"family_name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"private_key" varchar(255),
	"historyID" varchar NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "users_access_token_unique" UNIQUE("access_token"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
