import { relations, type InferInsertModel, type InferSelectModel } from 'drizzle-orm'
import {
  int,
  integer,
  sqliteTable, text,
} from 'drizzle-orm/sqlite-core'

export const replicacheServer = sqliteTable('replicache_server', {
  id: int('id').primaryKey(),
  version: integer('version'),
})

export type ReplicacheServer = InferSelectModel<typeof replicacheServer>
export type InsertReplicacheServer = InferInsertModel<typeof replicacheServer>

export const replicacheClient = sqliteTable('replicache_client', {
  id: text('id').primaryKey().notNull(),
  clientGroupID: text('client_group_id').notNull(),
  lastMutationID: integer('last_mutation_id').notNull(),
  clientVersion: integer('version').notNull(),
})

export type ReplicacheClient = InferSelectModel<typeof replicacheClient>
export type InsertReplicacheClient = InferInsertModel<typeof replicacheClient>

export const vocabulary = sqliteTable('vocabulary', {
  id: text('id').primaryKey().notNull(),
  vocabulary: text('vocabulary').notNull(),
  explanation: text('explanation').notNull(),
  version: integer('version').notNull(),
  isDeleted: int("is_deleted").notNull().default(0),
  userId: text('user_id').notNull(),
})

export type Vocabulary = InferSelectModel<typeof vocabulary>
export type InsertVocabulary = InferInsertModel<typeof vocabulary>

export const basicTranslation = sqliteTable('basic_translation', {
  id: text('id').primaryKey().notNull(),
  sentence: text('sentence').notNull(),
  explanation: text('explanation').notNull(),
  version: integer('version').notNull(),
  isDeleted: int("is_deleted").notNull().default(0),
  userId: text('user_id').notNull(),
})

export type BasicTranslation = InferSelectModel<typeof basicTranslation>
export type InsertBasicTranslation = InferInsertModel<typeof basicTranslation>

export const checkTranslation = sqliteTable('check_translation', {
  id: text('id').primaryKey().notNull(),
  sentence: text('sentence').notNull(),
  explanation: text('explanation').notNull(),
  version: integer('version').notNull(),
  isDeleted: int("is_deleted").notNull().default(0),
  userId: text('user_id').notNull(),
})

export type CheckTranslation = InferSelectModel<typeof checkTranslation>
export type InsertCheckTranslation = InferInsertModel<typeof checkTranslation>

export const compareTranslation = sqliteTable('compare_translation', {
  id: text('id').primaryKey().notNull(),
  targetSentence: text('target_sentence').notNull(),
  sentence: text('sentence').notNull(),
  explanation: text('explanation').notNull(),
  version: integer('version').notNull(),
  isDeleted: int("is_deleted").notNull().default(0),
  userId: text('user_id').notNull(),
})

export type CompareTranslation = InferSelectModel<typeof compareTranslation>
export type InsertCompareTranslation = InferInsertModel<typeof compareTranslation>

export const patternTranslation = sqliteTable('pattern_translation', {
  id: text('id').primaryKey().notNull(),
  pattern: text('pattern').notNull(),
  sentence: text('sentence').notNull(),
  explanation: text('explanation').notNull(),
  version: integer('version').notNull(),
  isDeleted: int("is_deleted").notNull().default(0),
  userId: text('user_id').notNull(),
})

export type PatternTranslation = InferSelectModel<typeof patternTranslation>
export type InsertPatternTranslation = InferInsertModel<typeof patternTranslation>

export const chat = sqliteTable('chat', {
  id: text('id').primaryKey().notNull(),
  title: text('pattern').notNull(),
  description: text('sentence').notNull(),
  version: integer('version').notNull(),
  isDeleted: int("is_deleted").notNull().default(0),
  userId: text('user_id').notNull(),
})

export type Chat = InferSelectModel<typeof chat>
export type InsertChat = InferInsertModel<typeof chat>

export const message = sqliteTable('message', {
  id: text('id').primaryKey().notNull(),
  role: text('role').notNull(),
  content: text('content').notNull(),
  chatId: text('chat_id').notNull().references(() => chat.id),
})

export type Message = InferSelectModel<typeof message>
export type InsertMessage = InferInsertModel<typeof message>

export const chatRelations = relations(chat, ({ many }) => ({
  messages: many(message),
}));

export const messageRelations = relations(message, ({ one }) => ({
  chat: one(chat, { fields: [message.chatId], references: [chat.id] }),
}));
