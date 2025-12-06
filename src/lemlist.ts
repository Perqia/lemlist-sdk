import { minimalCampaignsSchema, campaignSchema, Result, GetCampaignsParams, UpdateCampaignData, updateCampaignDataSchema, pauseCampaignDataSchema } from "./types";
import * as v from 'valibot';
 
interface LemListAPIOptions {
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

    public getCampaigns(params?: GetCampaignsParams) {
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

    public getCampaign(campaignId: string) {
        return this.request("GET", `/campaigns/${campaignId}`, { schema: campaignSchema });
    }

    public updateCampaign(campaignId: string, data: UpdateCampaignData) {
        return this.request("PATCH", `/campaigns/${campaignId}`, { schema: updateCampaignDataSchema, body: data });
    }

    public pauseCampaign(campaignId: string) {
        return this.request("POST", `/campaigns/${campaignId}/pause`, { schema: pauseCampaignDataSchema });
    }

    // public resumeCampaign(campaignId: string) {
    //     return this.request("POST", `/campaigns/${campaignId}/resume`, { schema: campaignSchema });
    // }

    // public deleteCampaign(campaignId: string) {
    //     return this.request("DELETE", `/campaigns/${campaignId}`, { schema: campaignSchema });
    // }
}