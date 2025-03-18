ALTER TABLE `basic_vocabulary` ADD `is_deleted` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `chat` ADD `version` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `chat` ADD `is_deleted` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `check_vocabulary` ADD `is_deleted` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `compare_vocabulary` ADD `is_deleted` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `pattern_vocabulary` ADD `is_deleted` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `vocabulary` ADD `is_deleted` integer DEFAULT 0 NOT NULL;