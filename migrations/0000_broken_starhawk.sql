CREATE TABLE `basic_vocabulary` (
	`id` text PRIMARY KEY NOT NULL,
	`sentence` text NOT NULL,
	`explanation` integer NOT NULL,
	`version` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `chat` (
	`id` text PRIMARY KEY NOT NULL,
	`pattern` text NOT NULL,
	`sentence` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `check_vocabulary` (
	`id` text PRIMARY KEY NOT NULL,
	`sentence` text NOT NULL,
	`explanation` integer NOT NULL,
	`version` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `compare_vocabulary` (
	`id` text PRIMARY KEY NOT NULL,
	`target_sentence` text NOT NULL,
	`sentence` text NOT NULL,
	`explanation` integer NOT NULL,
	`version` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `message` (
	`id` text PRIMARY KEY NOT NULL,
	`role` text NOT NULL,
	`content` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `pattern_vocabulary` (
	`id` text PRIMARY KEY NOT NULL,
	`pattern` text NOT NULL,
	`sentence` text NOT NULL,
	`explanation` integer NOT NULL,
	`version` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `replicache_client` (
	`id` text PRIMARY KEY NOT NULL,
	`client_group_id` text NOT NULL,
	`last_mutation_id` integer NOT NULL,
	`version` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `replicache_server` (
	`id` integer PRIMARY KEY NOT NULL,
	`version` integer
);
--> statement-breakpoint
CREATE TABLE `vocabulary` (
	`id` text PRIMARY KEY NOT NULL,
	`vocabulary` text NOT NULL,
	`explanation` integer NOT NULL,
	`version` integer NOT NULL
);
