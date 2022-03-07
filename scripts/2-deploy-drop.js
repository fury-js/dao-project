import ethers from "ethers"
import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs"

const app = sdk.getAppModule('0xB2F215E44E38e32B0E00C237e8deE424e963C73f');

(async () => {
    try {
        const bundleDropModule = await app.deployBundleDropModule({
            name: "Beima Membership",
            description: "A Dao for the beima community",
            image: readFileSync("scripts/assets/saitama.png"),
            primarySaleRecipientAddress: ethers.constants.AddressZero
            // We need to pass in the address of the person who will be receiving the proceeds from sales of nfts in the module.
            // We're planning on not charging people for the drop, so we'll pass in the 0x0 address
            // you can set this to your own wallet address if you want to charge for the drop.
        })

        console.log("Successfuly Deployed bundleDropModule, address:", bundleDropModule.address)
        console.log('✅ bundleDrop metadata:', await bundleDropModule.getMetadata());
    } catch (error) {
        console.log("Failed to deploy bundlemodule:", error)
        
    }

})()