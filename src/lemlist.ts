import {
    minimalCampaignsSchema,
    campaignSchema,
    Result,
    GetCampaignsParams,
    UpdateCampaignData,
    updateCampaignDataSchema,
    pauseCampaignDataSchema,
    teamSchema,
    teamSendersSchema,
    teamCreditsSchema,
    userSchema,
    User,
    TeamCredits,
    TeamSender,
    Team,
    CreateCampaignRequest,
    CreateCampaignResponse,
    createCampaignResponseSchema,
    GetCampaignStatsParams,
    CampaignStats,
    campaignStatsSchema,
    ExportCampaignLeadsParams,
    ExportedLead,
    exportedLeadsSchema,
    StartCampaignExportResponse,
    startCampaignExportResponseSchema,
    CampaignExportStatus,
    campaignExportStatusSchema,
    SetExportEmailResponse,
    setExportEmailResponseSchema,
    GetCampaignReportsParams,
    CampaignReports,
    campaignReportsSchema,
    PauseCampaignData,
    Campaign,
    MinimalCampaign,
    Webhook,
    webhooksSchema,
    webhookSchema,
    CreateWebhookRequest,
    CreateWebhookParams,
    CreateWebhookResponse,
    createWebhookResponseSchema,
    DeleteWebhookResponse,
    deleteWebhookResponseSchema,
} from "./types";
import * as v from 'valibot';
 
export interface LemListAPIOptions {
    baseUrl?: string;
}

const defaultOptions: LemListAPIOptions = {
    baseUrl: "https://api.lemlist.com/api"
}

export class LemListAPI {
    private readonly options: LemListAPIOptions;

    constructor(private readonly apiKey: string, options: LemListAPIOptions = defaultOptions) {
        this.apiKey = apiKey;
        this.options = { ...defaultOptions, ...options };   
    }

    private async request<T extends v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>>(
        method: string, 
        path: string, 
        options: { body?: any; schema: T }
    ): Promise<Result<v.InferOutput<T>>> {
        const fetchOptions: RequestInit = {
            method,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Basic ${btoa(`:${this.apiKey}`)}`
            }
        };
        
        if (options.body) {
            fetchOptions.body = JSON.stringify(options.body);
        }

        const result: Result<v.InferOutput<T>> = {
            success: false,
            data: undefined
        };
        
        try {
            const response = await fetch(`${this.options.baseUrl}${path}`, fetchOptions);
            const data = await response.json();
            const parsedData = v.parse(options.schema, data);
            result.success = true;
            result.data = parsedData;
        } catch (error) {
            result.error = error;
        } finally {
            return result;
        }
    }

    // ===========================
    // Campaign Methods
    // ===========================

    /**
     * Retrieves a paginated list of all campaigns in your team.
     *
     * @param params - Optional query parameters for filtering and pagination
     * @returns Array of minimal campaign information wrapped in a Result type
     * @see https://developer.lemlist.com/api-reference/endpoints/campaigns/get-campaigns
     */
    public getCampaigns(params?: GetCampaignsParams): Promise<Result<MinimalCampaign[]>> {
        let uri = "/campaigns";
        if (params) {
            const queryParams = new URLSearchParams();
            if (params.offset) queryParams.set("offset", params.offset.toString());
            if (params.limit) queryParams.set("limit", params.limit.toString());
            if (params.version) queryParams.set("version", params.version);
            if (params.page) queryParams.set("page", params.page.toString());
            if (params.sortby) queryParams.set("sortby", params.sortby);
            if (params.sortOrder) queryParams.set("sortOrder", params.sortOrder);
            if (params.status) queryParams.set("status", params.status);
            uri += `?${queryParams.toString()}`;
        }
        return this.request("GET", uri, { schema: minimalCampaignsSchema });
    }

    /**
     * Retrieves detailed information about a specific campaign by ID.
     *
     * @param campaignId - The unique identifier of the campaign
     * @returns Detailed campaign information wrapped in a Result type
     * @see https://developer.lemlist.com/api-reference/endpoints/campaigns/get-campaign
     */
    public getCampaign(campaignId: string): Promise<Result<Campaign>> {
        return this.request("GET", `/campaigns/${campaignId}`, { schema: campaignSchema });
    }

    /**
     * Updates the settings and configuration of an existing campaign.
     *
     * @param campaignId - The unique identifier of the campaign
     * @param data - The campaign data to update
     * @returns Updated campaign data wrapped in a Result type
     * @see https://developer.lemlist.com/api-reference/endpoints/campaigns/update-campaign
     */
    public updateCampaign(campaignId: string, data: UpdateCampaignData): Promise<Result<UpdateCampaignData>> {
        return this.request("PATCH", `/campaigns/${campaignId}`, { schema: updateCampaignDataSchema, body: data });
    }

    /**
     * Pauses a running campaign without affecting scheduled leads.
     *
     * @param campaignId - The unique identifier of the campaign to pause
     * @returns Pause confirmation with campaign state wrapped in a Result type
     * @see https://developer.lemlist.com/api-reference/endpoints/campaigns/pause-campaign
     */
    public pauseCampaign(campaignId: string): Promise<Result<PauseCampaignData>> {
        return this.request("POST", `/campaigns/${campaignId}/pause`, { schema: pauseCampaignDataSchema });
    }

    /**
     * Creates a new campaign with auto-generated sequence and schedule.
     *
     * @param data - The campaign creation data containing the campaign name
     * @returns Created campaign information wrapped in a Result type
     * @see https://developer.lemlist.com/api-reference/endpoints/campaigns/create-campaign
     */
    public createCampaign(data: CreateCampaignRequest): Promise<Result<CreateCampaignResponse>> {
        return this.request("POST", "/campaigns", { schema: createCampaignResponseSchema, body: data });
    }

    /**
     * Retrieves performance statistics for a specific campaign.
     *
     * @param campaignId - The unique identifier of the campaign
     * @param params - Query parameters including date range and optional filters
     * @returns Campaign statistics wrapped in a Result type
     * @see https://developer.lemlist.com/api-reference/endpoints/campaigns/get-campaign-stats
     */
    public getCampaignStats(campaignId: string, params: GetCampaignStatsParams): Promise<Result<CampaignStats>> {
        const queryParams = new URLSearchParams();
        // dates must be ISO8601
        queryParams.set("startDate", params.startDate.toISOString());
        queryParams.set("endDate", params.endDate.toISOString());
        if (params.sendUser) queryParams.set("sendUser", params.sendUser);
        if (params.ABSelected) queryParams.set("ABSelected", params.ABSelected);
        if (params.channels) queryParams.set("channels", params.channels);
        return this.request("GET", `/v2/campaigns/${campaignId}/stats?${queryParams.toString()}`, { schema: campaignStatsSchema });
    }

    /**
     * Initiates an asynchronous export of campaign statistics to CSV.
     *
     * @param campaignId - The unique identifier of the campaign
     * @returns Export initiation response with export ID wrapped in a Result type
     * @see https://developer.lemlist.com/api-reference/endpoints/campaigns/start-campaign-export
     */
    public startCampaignExport(campaignId: string): Promise<Result<StartCampaignExportResponse>> {
        return this.request("GET", `/campaigns/${campaignId}/export/start`, { schema: startCampaignExportResponseSchema });
    }

    /**
     * Checks the status of an asynchronous campaign export.
     *
     * @param campaignId - The unique identifier of the campaign
     * @param exportId - The unique identifier of the export job
     * @returns Export status information wrapped in a Result type
     * @see https://developer.lemlist.com/api-reference/endpoints/campaigns/get-campaign-export-status
     */
    public getCampaignExportStatus(campaignId: string, exportId: string): Promise<Result<CampaignExportStatus>> {
        return this.request("GET", `/campaigns/${campaignId}/export/${exportId}/status`, { schema: campaignExportStatusSchema });
    }

    /**
     * Configures email notification delivery when export completes.
     *
     * @param campaignId - The unique identifier of the campaign
     * @param exportId - The unique identifier of the export job
     * @param email - The email address to notify when export is ready
     * @returns Confirmation message wrapped in a Result type
     * @see https://developer.lemlist.com/api-reference/endpoints/campaigns/set-export-email
     */
    public setExportEmail(campaignId: string, exportId: string, email: string): Promise<Result<SetExportEmailResponse>> {
        return this.request("PUT", `/campaigns/${campaignId}/export/${exportId}/email/${email}`, { schema: setExportEmailResponseSchema });
    }

    /**
     * Exports leads from a campaign with flexible filtering options.
     *
     * @param campaignId - The unique identifier of the campaign
     * @param params - Optional query parameters for filtering and format
     * @returns Array of exported leads wrapped in a Result type
     * @see https://developer.lemlist.com/api-reference/endpoints/campaigns/export-campaign-leads
     */
    // public exportCampaignLeads(campaignId: string, params?: ExportCampaignLeadsParams): Promise<Result<ExportedLead[]>> {
    //     let uri = `/campaigns/${campaignId}/export/leads`;
    //     if (params) {
    //         const queryParams = new URLSearchParams();
    //         if (params.state) queryParams.set("state", params.state);
    //         if (params.format) queryParams.set("format", params.format);
    //         const queryString = queryParams.toString();
    //         if (queryString) uri += `?${queryString}`;
    //     }
    //     return this.request("GET", uri, { schema: exportedLeadsSchema });
    // }

    /**
     * Retrieves aggregated reports and statistics for campaigns.
     *
     * @param params - Query parameters containing comma-separated campaign IDs
     * @returns Array of campaign reports wrapped in a Result type
     * @see https://developer.lemlist.com/api-reference/endpoints/campaigns/get-campaign-reports
     */
    public getCampaignReports(params: GetCampaignReportsParams): Promise<Result<CampaignReports>> {
        const queryParams = new URLSearchParams();
        queryParams.set("campaignIds", params.campaignIds.join(','));
        return this.request("GET", `/campaigns/reports?${queryParams.toString()}`, { schema: campaignReportsSchema });
    }

    // ===========================
    // Team Methods
    // ===========================

    /**
     * Retrieves information about your team including members, webhooks, and settings.
     *
     * @returns Team information wrapped in a Result type
     * @see https://developer.lemlist.com/api-reference/endpoints/team/get-team
     */
    public getTeam(): Promise<Result<Team>> {
        return this.request("GET", "/team", { schema: teamSchema });
    }

    /**
     * Retrieves a list of all team members and their associated campaigns.
     *
     * @returns Array of team senders with their campaigns wrapped in a Result type
     * @see https://developer.lemlist.com/api-reference/endpoints/team/get-team-senders
     */
    public getTeamSenders(): Promise<Result<TeamSender[]>> {
        return this.request("GET", "/team/senders", { schema: teamSendersSchema });
    }

    /**
     * Retrieves the remaining credits balance for your team's account.
     *
     * @returns Credits information with detailed breakdown wrapped in a Result type
     * @see https://developer.lemlist.com/api-reference/endpoints/team/get-team-credits
     */
    public getTeamCredits(): Promise<Result<TeamCredits>> {
        return this.request("GET", "/team/credits", { schema: teamCreditsSchema });
    }

    // ===========================
    // User Methods
    // ===========================

    /**
     * Retrieves all information for a specific user by their ID.
     *
     * @param userId - The unique identifier of the user
     * @returns User information including email, role, LinkedIn settings, and mailboxes wrapped in a Result type
     * @see https://developer.lemlist.com/api-reference/endpoints/user
     */
    public getUser(userId: string): Promise<Result<User>> {
        return this.request("GET", `/users/${userId}`, { schema: userSchema });
    }

    // ===========================
    // Webhook Methods
    // ===========================

    /**
     * Retrieves all webhooks configured for your team.
     *
     * @returns Array of webhook configurations wrapped in a Result type
     * @see https://developer.lemlist.com/api-reference/endpoints/webhooks/get-many-webhooks
     */
    public getWebhooks(): Promise<Result<Webhook[]>> {
        return this.request("GET", "/hooks", { schema: webhooksSchema });
    }

    /**
     * Creates a webhook that receives real-time POST callbacks for selected events.
     *
     * @param data - The webhook configuration containing the target URL and optional event type
     * @param params - Optional query parameters including campaignId, isFirst, and zapId
     * @returns Created webhook information wrapped in a Result type
     * @see https://developer.lemlist.com/api-reference/endpoints/webhooks/add-webhook
     */
    public createWebhook(
        data: CreateWebhookRequest,
        params?: CreateWebhookParams
    ): Promise<Result<CreateWebhookResponse>> {
        let uri = "/hooks";
        if (params) {
            const queryParams = new URLSearchParams();
            if (params.campaignId) queryParams.set("campaignId", params.campaignId);
            if (params.isFirst !== undefined) queryParams.set("isFirst", params.isFirst.toString());
            if (params.zapId) queryParams.set("zapId", params.zapId);
            const queryString = queryParams.toString();
            if (queryString) uri += `?${queryString}`;
        }
        return this.request("POST", uri, { schema: createWebhookResponseSchema, body: data });
    }

    /**
     * Deletes a specific webhook.
     *
     * @param hookId - The unique identifier of the webhook to delete
     * @returns Deletion confirmation wrapped in a Result type
     * @see https://developer.lemlist.com/api-reference/endpoints/webhooks/delete-webhook
     */
    public deleteWebhook(hookId: string): Promise<Result<DeleteWebhookResponse>> {
        return this.request("DELETE", `/hooks/${hookId}`, { schema: deleteWebhookResponseSchema });
    }

}