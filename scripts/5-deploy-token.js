import sdk from "./1-initialize-sdk.js"


const app = sdk.getAppModule('0xB2F215E44E38e32B0E00C237e8deE424e963C73f');

(async () => {
    try {
        
        // Deploy a standard ERCO-20 contract
        const tokenModule = await app.deployTokenModule({
            name: "Beima DAO Governance Token",
            symbol: "BMP"
        });
        console.log("Successfully Deployed token module, address at:", tokenModule.address);


    } catch (error) {
        console.log("Failed to deploy Token Module", error)
        
    }

})()