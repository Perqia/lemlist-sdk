import * as v from 'valibot';

// ===========================
// Webhook Schemas
// ===========================

/**
 * Webhook event types that can be subscribed to
 */
export const webhookEventTypeSchema = v.picklist([
    // Activity events
    'contacted',
    'hooked',
    'attracted',
    'warmed',
    'interested',
    'skipped',
    'notInterested',
    // Email events
    'emailsSent',
    'emailsOpened',
    'emailsClicked',
    'emailsReplied',
    'emailsBounced',
    'emailsSendFailed',
    'emailsFailed',
    'emailsUnsubscribed',
    'emailsInterested',
    'emailsNotInterested',
    // LinkedIn events
    'linkedinInterested',
    'linkedinNotInterested',
    'linkedinSent',
    'linkedinReplied',
    'linkedinInviteAccepted',
    // Operational alerts
    'customDomainErrors',
    'connectionIssue',
    'sendLimitReached',
    'lemwarmPaused',
    'campaignComplete',
]);

export type WebhookEventType = v.InferOutput<typeof webhookEventTypeSchema>;

/**
 * Schema for webhook information
 */
export const webhookSchema = v.object({
    _id: v.string(),
    targetUrl: v.string(),
    type: v.optional(webhookEventTypeSchema),
    campaignId: v.optional(v.string()),
    createdAt: v.string(),
    zapId: v.optional(v.string()),
    isFirst: v.optional(v.boolean()),
});

export type Webhook = v.InferOutput<typeof webhookSchema>;

/**
 * Schema for array of webhooks
 */
export const webhooksSchema = v.array(webhookSchema);

/**
 * Query parameters for creating a webhook
 */
export type CreateWebhookParams = {
    campaignId?: string;
    isFirst?: boolean;
    zapId?: string;
};

/**
 * Schema for creating a new webhook
 */
export const createWebhookRequestSchema = v.object({
    targetUrl: v.string(),
    type: v.optional(webhookEventTypeSchema),
});

export type CreateWebhookRequest = v.InferOutput<typeof createWebhookRequestSchema>;

/**
 * Schema for webhook creation response
 */
export const createWebhookResponseSchema = v.object({
    _id: v.string(),
    targetUrl: v.string(),
    createdAt: v.string(),
    type: v.optional(webhookEventTypeSchema),
    campaignId: v.optional(v.string()),
    zapId: v.optional(v.string()),
    isFirst: v.optional(v.boolean()),
});

export type CreateWebhookResponse = v.InferOutput<typeof createWebhookResponseSchema>;

/**
 * Schema for delete webhook response (empty object or success indicator)
 */
export const deleteWebhookResponseSchema = v.object({});

export type DeleteWebhookResponse = v.InferOutput<typeof deleteWebhookResponseSchema>;
