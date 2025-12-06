import { LemListAPI } from "./lemlist";

const api = new LemListAPI("");

async function main() {
    const campaigns = await api.getCampaigns({
    });
    console.log(campaigns);
    // const campaigns = await api.getCampaign("cam_YzhnS99DNQh5GnQTL");
    const result = await api.updateCampaign("cam_YzhnS99DNQh5GnQTL", {
        name: "Test Campaign Update",
    });
    const pauseResult = await api.pauseCampaign("cam_R7ZPufm6kKongRskj");
    console.log(pauseResult);
    console.log(result);
}

main();