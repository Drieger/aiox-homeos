CREATE TABLE `books` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`author` text NOT NULL,
	`release_year` integer,
	`reading_year` integer,
	`status` text DEFAULT 'unread' NOT NULL,
	`cover_path` text,
	`synopsis` text,
	`notes` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `books_status_idx` ON `books` (`status`);--> statement-breakpoint
CREATE INDEX `books_author_idx` ON `books` (`author`);