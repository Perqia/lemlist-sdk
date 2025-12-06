import * as v from 'valibot';

export interface Result<T> {
    success: boolean;
    data?: T;
    error?: unknown;
}
export type GetCampaignsParams = {
    offset?: number;
    limit?: number;
    version?: "v2";
    page?: number;
    sortby?: "createdAt"
    sortOrder?: "asc" | "desc";
    status?: "running" | "draft" | "archived" | "paused" | "ended" | "errors";
}

export const campaignSchema = v.object({
    _id: v.string(),
    name: v.string(),
    labels: v.array(v.string()),
    createdAt: v.string(),
    createdBy: v.string(),
    status: v.string(),
    sequenceId: v.number(),
    scheduleIds: v.array(v.string()),
    teamId: v.string(),
    hasError: v.boolean(),
    errors: v.array(v.string()),
    creator: v.object({
        userId: v.string(),
        userEmail: v.string(),
    }),
});

export type Campaign = v.InferOutput<typeof campaignSchema>;

export const minimalCampaignSchema = v.object({
    _id: v.string(),
    name: v.string(),
    createdAt: v.string(),
    createdBy: v.string(),
    status: v.string(),
});

export const minimalCampaignsSchema = v.array(minimalCampaignSchema);

export type MinimalCampaign = v.InferOutput<typeof minimalCampaignSchema>;

export const updateCampaignDataSchema = v.object({
    name: v.optional(v.string()),
    stopOnEmailReplied: v.optional(v.boolean()),
    stopOnMeetingBooked: v.optional(v.boolean()),
    stopOnLinkClicked: v.optional(v.boolean()),
    leadsPausedByInterest: v.optional(v.boolean()),
    opportunityReplied: v.optional(v.boolean()),
    opportunityClicked: v.optional(v.boolean()),
    autoLeadInterest: v.optional(v.boolean()),
    disableTrackOpen: v.optional(v.boolean()),
    disableTrackClick: v.optional(v.boolean()),
    disableTrackReply: v.optional(v.boolean()),
    stopOnLinkClickedFilter: v.optional(v.string()),
});

export const pauseCampaignDataSchema = v.object({
    _id: v.string(),
    state: v.string(),
});

export type UpdateCampaignData = v.InferOutput<typeof updateCampaignDataSchema>;
