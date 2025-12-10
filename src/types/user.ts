import * as v from 'valibot';

// ===========================
// User Schemas
// ===========================

/**
 * Schema for LinkedIn integration settings
 */
export const linkedInSchema = v.object({
    status: v.boolean(),
    inviteLimit: v.number(),
    sendLimit: v.number(),
    visitLimit: v.number(),
});

export type LinkedIn = v.InferOutput<typeof linkedInSchema>;

/**
 * Schema for lemlist email settings
 */
export const lemlistEmailSettingsSchema = v.object({
    emailLimit: v.number(),
});

export type LemlistEmailSettings = v.InferOutput<typeof lemlistEmailSettingsSchema>;

/**
 * Schema for lemwarm settings
 */
export const lemwarmSettingsSchema = v.object({
    active: v.boolean(),
});

export type LemwarmSettings = v.InferOutput<typeof lemwarmSettingsSchema>;

/**
 * Schema for email mailbox configuration
 */
export const mailboxSchema = v.object({
    _id: v.string(),
    email: v.string(),
    provider: v.string(),
    status: v.picklist(['CONNECTED', 'ERROR', 'DISCONNECTED']),
    lemlist: lemlistEmailSettingsSchema,
    lemwarm: lemwarmSettingsSchema,
});

export type Mailbox = v.InferOutput<typeof mailboxSchema>;

/**
 * Schema for user information response
 */
export const userSchema = v.object({
    _id: v.string(),
    email: v.string(),
    role: v.string(),
    linkedIn: v.optional(linkedInSchema),
    mailboxes: v.optional(v.array(mailboxSchema)),
});

export type User = v.InferOutput<typeof userSchema>;
