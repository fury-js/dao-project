import {ethers} from "ethers"
import sdk from "./1-initialize-sdk.js"

const voteModule = sdk.getVoteModule(
	'0x6f518E33C73030d55B7F246C76f6A6ab29B591B1',
);

const tokenModule = sdk.getTokenModule(
	'0xdccD320a87f3056a6415a6c483F90C097E0b02d9',
);

(async () => {
    try {
		// Give our treasury the power to mint additional token if needed.
		await tokenModule.grantRole('minter', voteModule.address);
        
        console.log(
        "Successfully gave vote module permissions to act on token module"
    );
	} catch (error) {
        console.log("Failed to grant role to vote contract", error)
        process.exit(1)
        
    }

    try {
		const ownedTokenBalance = await tokenModule.balanceOf(
			process.env.WALLET_ADDRESS,
		);

		// Grab 90% of the supply that we hold.
        const ownedAmount = ethers.BigNumber.from(ownedTokenBalance.value)
        const percentage90 = ownedAmount.div(100).mul(90)

        // Transfer 90% of the supply to our voting contract.
        await tokenModule.transfer(voteModule.address, percentage90)
        console.log('✅ Successfully transferred tokens to vote module');



		} catch (error) {
            console.log('Failed to transfer tokens to voting contract', error)
        
    }

})()


