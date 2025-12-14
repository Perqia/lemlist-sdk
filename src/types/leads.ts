import * as v from 'valibot';

// ===========================
// Lead Schemas
// ===========================

/**
 * Query parameters for fetching a lead by email
 */
type GetLeadByEmail = {
    email: string;
};

/**
 * Query parameters for fetching a lead by ID
 */
type GetLeadById = {
    id: string;
};

/**
 * Query parameters for fetching a lead - requires either email OR id, not both
 */
export type GetLeadParams = GetLeadByEmail | GetLeadById;

/**
 * Schema for lead information response
 */
export const leadSchema = v.object({
    email: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    companyName: v.string(),
    jobTitle: v.string(),
    companyDomain: v.string(),
    _id: v.string(),
    isPaused: v.boolean(),
    campaignId: v.string(),
    contactId: v.string(),
    emailStatus: v.string(),
});

export type Lead = v.InferOutput<typeof leadSchema>;

/**
 * Schema for paused lead response (array of leads)
 */
export const pausedLeadsSchema = v.array(v.object({
    firstName: v.string(),
    lastName: v.string(),
    companyName: v.string(),
    jobTitle: v.string(),
    companyDomain: v.string(),
    email: v.string(),
    preferredContactMethod: v.optional(v.string()),
    industry: v.optional(v.string()),
    _id: v.string(),
    isPaused: v.boolean(),
    campaignId: v.string(),
    contactId: v.string(),
    emailStatus: v.string(),
}));

export type PausedLeads = v.InferOutput<typeof pausedLeadsSchema>;
