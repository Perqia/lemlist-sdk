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
 * Schema for campaign information within a lead
 */
const campaignInfoSchema = v.object({
    id: v.string(),
    name: v.string(),
    status: v.string(),
});

/**
 * Schema for sending user information within a lead
 */
const sendingUserSchema = v.object({
    userId: v.optional(v.string()),
    email: v.optional(v.string()),
    fullName: v.optional(v.string()),
});

/**
 * Schema for lead variables containing all the dynamic data
 */
const leadVariablesSchema = v.object({
    linkedinUrl: v.optional(v.string()),
    companyDescription: v.optional(v.string()),
    companyEmployeesOnLinkedin: v.optional(v.string()),
    companyFoundedOn: v.optional(v.string()),
    companyIndustry: v.optional(v.string()),
    companyLinkedinUrl: v.optional(v.string()),
    companyName: v.optional(v.string()),
    companyPicture: v.optional(v.string()),
    companySize: v.optional(v.string()),
    companyTagline: v.optional(v.string()),
    companyType: v.optional(v.string()),
    firstName: v.optional(v.string()),
    industry: v.optional(v.string()),
    isPremium: v.optional(v.string()),
    jobDescription: v.optional(v.string()),
    jobTitle: v.optional(v.string()),
    joinCompanyIn: v.optional(v.string()),
    lastName: v.optional(v.string()),
    location: v.optional(v.string()),
    locationName: v.optional(v.string()),
    memberId: v.optional(v.string()),
    occupation: v.optional(v.string()),
    picture: v.optional(v.string()),
    school: v.optional(v.string()),
    skills: v.optional(v.string()),
    tagline: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
});

/**
 * Schema for individual lead information response
 */
const leadItemSchema = v.object({
    _id: v.string(),
    updatedAt: v.string(),
    isPaused: v.boolean(),
    state: v.string(),
    status: v.string(),
    personalized: v.boolean(),
    source: v.string(),
    variables: leadVariablesSchema,
    contactId: v.string(),
    enrichment: v.object({}),
    campaign: campaignInfoSchema,
    sendingUser: sendingUserSchema,
});

/**
 * Schema for lead information response (array of leads)
 */
export const leadSchema = v.array(leadItemSchema);

export type Lead = v.InferOutput<typeof leadSchema>;
export type LeadItem = v.InferOutput<typeof leadItemSchema>;

/**
 * Schema for paused lead response (array of leads)
 */
export const pausedLeadsSchema = v.array(v.object({
    linkedinUrl: v.optional(v.string()),
    companyFoundedOn: v.optional(v.string()),
    companyIndustry: v.optional(v.string()),
    companyLinkedinUrl: v.optional(v.string()),
    companyName: v.optional(v.string()),
    companyPicture: v.optional(v.string()),
    companySize: v.optional(v.string()),
    email: v.optional(v.string()),
    firstName: v.optional(v.string()),
    industry: v.optional(v.string()),
    jobDescription: v.optional(v.string()),
    jobTitle: v.optional(v.string()),
    lastName: v.optional(v.string()),
    location: v.optional(v.string()),
    picture: v.optional(v.string()),
    skills: v.optional(v.string()),
    tagline: v.optional(v.string()),
    phone: v.optional(v.string()),
    _id: v.string(),
    isPaused: v.boolean(),
    campaignId: v.string(),
    contactId: v.string(),
}));

export type PausedLeads = v.InferOutput<typeof pausedLeadsSchema>;
