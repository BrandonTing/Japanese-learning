ALTER TABLE `basic_vocabulary` ALTER COLUMN "explanation" TO "explanation" text NOT NULL;--> statement-breakpoint
ALTER TABLE `basic_vocabulary` ADD `user_id` text NOT NULL;--> statement-breakpoint
ALTER TABLE `check_vocabulary` ALTER COLUMN "explanation" TO "explanation" text NOT NULL;--> statement-breakpoint
ALTER TABLE `check_vocabulary` ADD `user_id` text NOT NULL;--> statement-breakpoint
ALTER TABLE `compare_vocabulary` ALTER COLUMN "explanation" TO "explanation" text NOT NULL;--> statement-breakpoint
ALTER TABLE `compare_vocabulary` ADD `user_id` text NOT NULL;--> statement-breakpoint
ALTER TABLE `pattern_vocabulary` ALTER COLUMN "explanation" TO "explanation" text NOT NULL;--> statement-breakpoint
ALTER TABLE `pattern_vocabulary` ADD `user_id` text NOT NULL;--> statement-breakpoint
ALTER TABLE `vocabulary` ALTER COLUMN "explanation" TO "explanation" text NOT NULL;--> statement-breakpoint
ALTER TABLE `vocabulary` ADD `user_id` text NOT NULL;--> statement-breakpoint
ALTER TABLE `chat` ADD `user_id` text NOT NULL;