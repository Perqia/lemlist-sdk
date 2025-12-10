import * as v from 'valibot';

// ===========================
// Campaign Schemas
// ===========================

/**
 * Query parameters for listing campaigns
 */
export type GetCampaignsParams = {
    offset?: number;
    limit?: number;
    version?: "v2";
    page?: number;
    sortby?: "createdAt"
    sortOrder?: "asc" | "desc";
    status?: "running" | "draft" | "archived" | "paused" | "ended" | "errors";
}

/**
 * Schema for campaign creator information
 */
export const campaignCreatorSchema = v.object({
    userId: v.string(),
    userEmail: v.string(),
});

export type CampaignCreator = v.InferOutput<typeof campaignCreatorSchema>;

/**
 * Schema for detailed campaign information
 */
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
    creator: campaignCreatorSchema,
});

export type Campaign = v.InferOutput<typeof campaignSchema>;

/**
 * Schema for minimal campaign information used in list responses
 */
export const minimalCampaignSchema = v.object({
    _id: v.string(),
    name: v.string(),
    createdAt: v.string(),
    createdBy: v.string(),
    status: v.string(),
});

/**
 * Schema for array of minimal campaigns
 */
export const minimalCampaignsSchema = v.array(minimalCampaignSchema);

export type MinimalCampaign = v.InferOutput<typeof minimalCampaignSchema>;

/**
 * Schema for creating a new campaign
 */
export const createCampaignRequestSchema = v.object({
    name: v.string(),
});

export type CreateCampaignRequest = v.InferOutput<typeof createCampaignRequestSchema>;

/**
 * Schema for campaign creation response
 */
export const createCampaignResponseSchema = v.object({
    _id: v.string(),
    sequenceId: v.string(),
    scheduleIds: v.array(v.string()),
    teamId: v.string(),
    createdBy: v.string(),
    createdAt: v.string(),
    state: v.string(),
    scannedCount: v.number(),
    reviewedCount: v.number(),
    inSequenceLeadCount: v.number(),
    variableKeys: v.array(v.any()),
    senders: v.array(v.any()),
    sendUsers: v.array(v.any()),
    displayedVariableKeys: v.array(v.string()),
    emoji: v.string(),
    stopOnEmailReplied: v.boolean(),
    crmOpportunitiesOnTask: v.optional(v.boolean()),
    unsubscribe: v.string(),
    name: v.string(),
    crm: v.optional(v.string()),
    crmUserId: v.optional(v.string()),
});

export type CreateCampaignResponse = v.InferOutput<typeof createCampaignResponseSchema>;

/**
 * Schema for updating campaign settings
 */
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

export type UpdateCampaignData = v.InferOutput<typeof updateCampaignDataSchema>;

/**
 * Schema for pause campaign response
 */
export const pauseCampaignDataSchema = v.object({
    _id: v.string(),
    state: v.string(),
});

export type PauseCampaignData = v.InferOutput<typeof pauseCampaignDataSchema>;

/**
 * Query parameters for getting campaign statistics
 */
export type GetCampaignStatsParams = {
    startDate: Date;
    endDate: Date;
    sendUser?: string;
    ABSelected?: "A" | "B";
    channels?: string;
};

/**
 * Schema for campaign statistics step details
 */
export const campaignStatsStepSchema = v.object({
    index: v.number(),
    sequenceId: v.string(),
    sequenceStep: v.number(),
    taskType: v.string(),
    invited: v.number(),
    sent: v.number(),
    delivered: v.number(),
    opened: v.number(),
    clicked: v.number(),
    replied: v.number(),
    notDelivered: v.number(),
    bounced: v.number(),
    unsubscribed: v.number(),
});

export type CampaignStatsStep = v.InferOutput<typeof campaignStatsStepSchema>;

/**
 * Schema for campaign statistics response
 */
export const campaignStatsSchema = v.object({
    nbLeads: v.number(),
    nbLeadsLaunched: v.number(),
    nbLeadsReached: v.number(),
    nbLeadsOpened: v.number(),
    nbLeadsInteracted: v.number(),
    nbLeadsAnswered: v.number(),
    nbLeadsInterested: v.number(),
    nbLeadsNotInterested: v.number(),
    nbLeadsUnsubscribed: v.number(),
    nbLeadsInterrupted: v.number(),
    messagesSent: v.number(),
    messagesNotSent: v.number(),
    messagesBounced: v.number(),
    delivered: v.number(),
    opened: v.number(),
    clicked: v.number(),
    replied: v.number(),
    invitationAccepted: v.number(),
    meetingBooked: v.number(),
    steps: v.array(campaignStatsStepSchema),
});

export type CampaignStats = v.InferOutput<typeof campaignStatsSchema>;

/**
 * Query parameters for exporting campaign leads
 */
export type ExportCampaignLeadsParams = {
    state?: "all" | "imported" | "scanned" | "skipped" | "reviewed" | "contacted" | "hooked" | "attracted" | "warmed" | "interested" | "notInterested" | "emailsBounced" | "emailsUnsubscribed" | "failed" | "meetingBooked" | "paused" | "emailsSent" | "emailsOpened" | "emailsClicked" | "emailsReplied" | "emailsInterested" | "emailsNotInterested" | "emailsFailed" | "linkedinVisitDone" | "linkedinInviteDone" | "linkedinInviteAccepted" | "linkedinSent" | "linkedinOpened" | "linkedinReplied" | "linkedinInterested" | "linkedinNotInterested";
    format?: "csv" | "json";
};

/**
 * Schema for exported lead data
 */
export const exportedLeadSchema = v.object({
    _id: v.string(),
    emailStatus: v.optional(v.string()),
    email: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    picture: v.optional(v.string()),
    phone: v.optional(v.string()),
    linkedinUrl: v.optional(v.string()),
    timezone: v.optional(v.string()),
    companyName: v.optional(v.string()),
    companyDomain: v.optional(v.string()),
    icebreaker: v.optional(v.string()),
    lastState: v.optional(v.string()),
    status: v.optional(v.string()),
});

export type ExportedLead = v.InferOutput<typeof exportedLeadSchema>;

/**
 * Schema for array of exported leads
 */
export const exportedLeadsSchema = v.array(exportedLeadSchema);

/**
 * Schema for campaign export initiation response
 */
export const startCampaignExportResponseSchema = v.object({
    _id: v.string(),
    id: v.string(),
    teamId: v.string(),
    campaignId: v.string(),
    campaignName: v.string(),
    status: v.picklist(["pending", "done", "error"]),
    startedAt: v.string(),
    progressIndex: v.number(),
    progressTime: v.number(),
    progressLastStepDuration: v.number(),
    progressType: v.string(),
    progress: v.number(),
    total: v.number(),
});

export type StartCampaignExportResponse = v.InferOutput<typeof startCampaignExportResponseSchema>;

/**
 * Schema for campaign export status response
 */
export const campaignExportStatusSchema = v.object({
    ok: v.boolean(),
    status: v.object({
        _id: v.string(),
        id: v.string(),
        teamId: v.string(),
        campaignId: v.string(),
        campaignName: v.string(),
        status: v.picklist(["pending", "done", "error"]),
        startedAt: v.string(),
        progressIndex: v.number(),
        progressTime: v.number(),
        progressLastStepDuration: v.number(),
        progressType: v.string(),
        fileSize: v.number(),
        progress: v.number(),
        total: v.number(),
        endedAt: v.optional(v.pipe(v.string(), v.toDate())),
        url: v.optional(v.string()),
        email: v.optional(v.string())
})});

export type CampaignExportStatus = v.InferOutput<typeof campaignExportStatusSchema>;

/**
 * Schema for setting export notification email response
 */
export const setExportEmailResponseSchema = v.object({
    ok: v.boolean(),
    status: v.object({
        _id: v.string(),
        id: v.string(),
        teamId: v.string(),
        campaignId: v.string(),
        campaignName: v.string(),
        status: v.picklist(["pending", "done", "error"]),
        startedAt: v.string(),
        progressIndex: v.number(),
        progressTime: v.number(),
        progressLastStepDuration: v.number(),
        progressType: v.string(),
        fileSize: v.number(),
        progress: v.number(),
        total: v.number(),
        endedAt: v.optional(v.pipe(v.string(), v.toDate())),
        url: v.optional(v.string()),
        email: v.optional(v.string())
})});

export type SetExportEmailResponse = v.InferOutput<typeof setExportEmailResponseSchema>;

/**
 * Query parameters for getting campaign reports
 */
export type GetCampaignReportsParams = {
    campaignIds: Array<string>;
};

/**
 * Schema for individual campaign report
 */
export const campaignReportSchema = v.object({
    _id: v.string(),
    name: v.string(),
    creator: v.string(),
    createdAt: v.pipe(v.string(), v.toDate()),
    createdBy: v.string(),
    labels: v.string(),
    totalCount: v.number(),
    reviewedCount: v.number(),
    inSequenceLeadCount: v.number(),
    state: v.string(),
    status: v.string(),
    senderNames: v.string(),
    sendersUsers: v.string(),
    reviewed: v.number(),
    emailsSent: v.number(),
    emailsSentNotBounced: v.number(),
    emailsOpened: v.number(),
    emailsClicked: v.number(),
    emailsReplied: v.number(),
    emailsDone: v.number(),
    emailsIgnored: v.number(),
    emailsBounced: v.number(),
    emailsFailed: v.number(),
    emailsSendFailed: v.number(),
    emailsUnsubscribed: v.number(),
    emailsInterested: v.number(),
    emailsNotInterested: v.number(),
    opportunitiesDone: v.number(),
    opportunitiesSnoozed: v.number(),
    snoozed: v.number(),
    opportunitiesNote: v.number(),
    annotated: v.number(),
    aircallDone: v.number(),
    aircallIgnored: v.number(),
    aircallCreated: v.number(),
    aircallEnded: v.number(),
    aircallInterested: v.number(),
    aircallNotInterested: v.number(),
    apiDone: v.number(),
    apiIgnored: v.number(),
    apiCalledNotBounced: v.number(),
    apiInterested: v.number(),
    apiNotInterested: v.number(),
    apiFailed: v.number(),
    apiUnsubscribed: v.number(),
    linkedinVisitDone: v.number(),
    linkedinVisitFailed: v.number(),
    linkedinInviteDone: v.number(),
    linkedinSent: v.number(),
    linkedinSentAndInvited: v.number(),
    linkedinAllAction: v.number(),
    linkedinOpened: v.number(),
    linkedinCompound: v.number(),
    linkedinInviteAccepted: v.number(),
    linkedinInviteFailed: v.number(),
    linkedinSendFailed: v.number(),
    linkedinVoiceNoteDone: v.number(),
    linkedinVoiceNoteFailed: v.number(),
    linkedinVoiceNoteReplied: v.number(),
    whatsappMessageSent: v.number(),
    whatsappMessageDelivered: v.number(),
    whatsappMessageOpened: v.number(),
    whatsappReplied: v.number(),
    whatsappMessageFailed: v.number(),
    whatsappDone: v.number(),
    whatsappIgnored: v.number(),
    smsSent: v.number(),
    smsDelivered: v.number(),
    smsReplied: v.number(),
    smsIgnored: v.number(),
    smsFailed: v.number(),
    aiVariableDone: v.number(),
    aiVariableFailed: v.number(),
    linkedinReplied: v.number(),
    linkedinInterested: v.number(),
    linkedinNotInterested: v.number(),
    linkedinDone: v.number(),
    linkedinIgnored: v.number(),
    manualDone: v.number(),
    manualIgnored: v.number(),
    manualInterested: v.number(),
    manualNotInterested: v.number(),
    manualUnsubscribed: v.number(),
    leadPaused: v.number(),
    paused: v.number(),
    leadResumed: v.number(),
    resumed: v.number(),
    interested: v.number(),
    opportunityInterested: v.number(),
    notInterested: v.number(),
    opportunityNotInterested: v.number(),
    campaignsStarted: v.number(),
    campaignsPaused: v.number(),
    skipped: v.number(),
    campaignImported: v.number(),
    meetingBooked: v.number(),
    conditionChosen: v.number(),
    sendToAnotherCampaign: v.number(),
    manualEmailQueued: v.number(),
    manualLinkedinSendQueued: v.number(),
    manualLinkedinVoiceNoteQueued: v.number(),
    manualLinkedinInviteQueued: v.number(),
    manualWhatsappMessageQueued: v.number(),
    outOfOffice: v.number(),
    entityUnsubscribed: v.number(),
    variableUnsubscribed: v.number(),
    entitySubscribed: v.number(),
    variableSubscribed: v.number(),
    linkedinSendAndBounced: v.number(),
});

export type CampaignReport = v.InferOutput<typeof campaignReportSchema>;

/**
 * Schema for array of campaign reports
 */
export const campaignReportsSchema = v.array(campaignReportSchema);

export type CampaignReports = v.InferOutput<typeof campaignReportsSchema>;
