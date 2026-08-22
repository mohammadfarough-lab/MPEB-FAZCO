import { pgTable, text, timestamp, boolean, integer, unique } from 'drizzle-orm/pg-core'

// --- Better Auth required tables -------------------------------------------
// Column names are camelCase to match Better Auth's defaults. Do not rename.

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  username: text('username'),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified').notNull().default(false),
  image: text('image'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
}, (table) => ({ usernameUnique: unique('user_username_unique').on(table.username) }))

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expiresAt').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
})

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  issuer: text('issuer'),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  accessTokenExpiresAt: timestamp('accessTokenExpiresAt'),
  refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expiresAt').notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
})

// --- App tables ------------------------------------------------------------
// Add your app tables below. Always include a plain `userId` column so queries
// can be scoped per user — the security model depends on this column existing,
// not on a foreign key. Do NOT add a foreign key constraint
// (`.references(() => user.id, ...)`) unless the user explicitly asks for
// foreign keys or referential integrity; FK constraints make iterating on the
// schema harder.
//
// Example:
//
// import { serial } from "drizzle-orm/pg-core"
//
// export const todos = pgTable("todos", {
//   id: serial("id").primaryKey(),
//   userId: text("userId").notNull(),
//   title: text("title").notNull(),
//   completed: boolean("completed").notNull().default(false),
//   createdAt: timestamp("createdAt").notNull().defaultNow(),
// })
//
// If the user asks for foreign keys, add the reference back in:
//   userId: text("userId")
//     .notNull()
//     .references(() => user.id, { onDelete: "cascade" }),

export const products = pgTable('products', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description').notNull(),
  category: text('category').notNull().default(''),
  image: text('image').notNull(),
  imageTwo: text('image_two').notNull().default(''),
  imageThree: text('image_three').notNull().default(''),
  video: text('video').notNull().default(''),
  uses: text('uses').notNull().default(''),
  features: text('features').notNull().default(''),
  dimensions: text('dimensions').notNull().default(''),
  cct: text('cct').notNull().default(''),
  sectionDetail: text('section_detail').notNull().default(''),
  finish: text('finish').notNull().default(''),
  installation: text('installation').notNull().default(''),
  dimensionImage: text('dimension_image').notNull().default(''),
  cctImage: text('cct_image').notNull().default(''),
  sectionImage: text('section_image').notNull().default(''),
  finishImage: text('finish_image').notNull().default(''),
  installationImage: text('installation_image').notNull().default(''),
  radiationImage: text('radiation_image').notNull().default(''),
  logosImage: text('logos_image').notNull().default(''),
  colorOptions: text('color_options').notNull().default(''),
  colorImages: text('color_images').notNull().default(''),
  installationLogos: text('installation_logos').notNull().default(''),
  dimensionLength: text('dimension_length').notNull().default(''),
  dimensionWidth: text('dimension_width').notNull().default(''),
  dimensionHeight: text('dimension_height').notNull().default(''),
  dimensionUnit: text('dimension_unit').notNull().default('mm'),
  dimensionNote: text('dimension_note').notNull().default(''),
  priceInCents: integer('priceInCents').notNull(),
  stock: integer('stock').notNull().default(0),
  active: boolean('active').notNull().default(true),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const orders = pgTable('orders', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  stripeSessionId: text('stripeSessionId').unique(),
  status: text('status').notNull().default('pending'),
  totalInCents: integer('totalInCents').notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const banners = pgTable('banners', {
  id: text('id').primaryKey(),
  eyebrow: text('eyebrow').notNull().default(''),
  title: text('title').notNull(),
  subtitle: text('subtitle').notNull().default(''),
  image: text('image').notNull(),
  video: text('video').notNull().default(''),
  label: text('label').notNull().default(''),
  link: text('link').notNull().default(''),
  sortOrder: integer('sortOrder').notNull().default(0),
  active: boolean('active').notNull().default(true),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const showcaseItems = pgTable('showcase_items', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull().default(''),
  meta: text('meta').notNull().default(''),
  image: text('image').notNull(),
  video: text('video').notNull().default(''),
  sortOrder: integer('sortOrder').notNull().default(0),
  active: boolean('active').notNull().default(true),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const siteSettings = pgTable('site_settings', {
  id: text('id').primaryKey(),
  key: text('key').notNull().unique(),
  value: text('value').notNull().default(''),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const orderItems = pgTable('order_items', {
  id: text('id').primaryKey(),
  orderId: text('orderId').notNull(),
  productId: text('productId').notNull(),
  name: text('name').notNull(),
  quantity: integer('quantity').notNull(),
  priceInCents: integer('priceInCents').notNull(),
})
