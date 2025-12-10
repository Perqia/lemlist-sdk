import * as v from 'valibot';

// ===========================
// Team Schemas
// ===========================

/**
 * Schema for webhook configuration in team settings
 */
export const teamHookSchema = v.object({
    _id: v.string(),
    targetUrl: v.string(),
    type: v.string(),
    campaignId: v.optional(v.string()),
    createdAt: v.string(),
    zapId: v.optional(v.string()),
});

export type TeamHook = v.InferOutput<typeof teamHookSchema>;

/**
 * Schema for Slack webhook configuration
 */
export const slackWebhookSchema = v.object({
    url: v.string(),
    failCounter: v.number(),
});

export type SlackWebhook = v.InferOutput<typeof slackWebhookSchema>;

/**
 * Schema for invited users
 */
export const invitedUserSchema = v.object({
    email: v.string(),
    role: v.string(),
    invitedBy: v.string(),
    invitedAt: v.string(),
});

export type InvitedUser = v.InferOutput<typeof invitedUserSchema>;

/**
 * Schema for team information response
 */
export const teamSchema = v.object({
    _id: v.string(),
    name: v.string(),
    userIds: v.array(v.string()),
    createdBy: v.string(),
    createdAt: v.string(),
    hooks: v.optional(v.array(teamHookSchema)),
    slackWebhook: v.optional(slackWebhookSchema),
    beta: v.array(v.string()),
    pictureId: v.optional(v.string()),
    invitedUsers: v.optional(v.array(invitedUserSchema)),
    agency: v.optional(v.string()),
    customDomain: v.optional(v.string()),
});

export type Team = v.InferOutput<typeof teamSchema>;

/**
 * Schema for campaign details in sender response
 */
export const senderCampaignSchema = v.object({
    _id: v.string(),
    name: v.string(),
    status: v.string(),
    sendingChannels: v.array(v.string()),
});

export type SenderCampaign = v.InferOutput<typeof senderCampaignSchema>;

/**
 * Schema for team sender information
 */
export const teamSenderSchema = v.object({
    userId: v.string(),
    campaigns: v.array(senderCampaignSchema),
});

export type TeamSender = v.InferOutput<typeof teamSenderSchema>;

/**
 * Schema for array of team senders
 */
export const teamSendersSchema = v.array(teamSenderSchema);

/**
 * Schema for credits breakdown details
 */
export const creditsDetailsSchema = v.object({
    remaining: v.object({
        total: v.number(),
        freemium: v.number(),
        subscription: v.number(),
        gifted: v.number(),
        paid: v.number(),
    }),
});

export type CreditsDetails = v.InferOutput<typeof creditsDetailsSchema>;

/**
 * Schema for team credits response
 */
export const teamCreditsSchema = v.object({
    credits: v.number(),
    details: creditsDetailsSchema,
});

export type TeamCredits = v.InferOutput<typeof teamCreditsSchema>;
