import sdk from "./1-initialize-sdk.js";
import ethers from "ethers"

const tokenModule = sdk.getTokenModule(
	'0xdccD320a87f3056a6415a6c483F90C097E0b02d9',
);


(async () => {
    try {
			// max token supply
			const amount = 1_000_000;
			// We use the util function from "ethers" to convert the amount
			// to have 18 decimals (which is the standard for ERC20 tokens).
            const amountTWith18Decimals = ethers.utils.parseUnits(amount.toString(), 18)
            // tell token module to mint amount
            await tokenModule.mint(amountTWith18Decimals);
            const totalSupply = await tokenModule.totalSupply();

            // print out total supply
            console.log(`Successfully minted: ${totalSupply}, there is now, ${ethers.utils.formatUnits(totalSupply, 18)}, $BMP Tokens in circulation`);

		} catch (error) {
            console.log("Failed to Mint Tokens:", error)
        
    }

})()