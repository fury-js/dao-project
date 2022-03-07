import { ethers } from "ethers"
import sdk from "./1-initialize-sdk.js"


const voteModule = sdk.getVoteModule(
	'0x6f518E33C73030d55B7F246C76f6A6ab29B591B1',
);

const tokenModule = sdk.getTokenModule(
	'0xdccD320a87f3056a6415a6c483F90C097E0b02d9',
);

(async ()=> {
    try {
        const amount = 1000000

        // create a proposal
        await voteModule.propose(`Should the Dao Mint ${amount} tokens to the treasury `,
            [
                {
                    nativeTokenValue: 0,
                    // minting to the vote contract cos its acting as the dao's treasury
                    transactionData: tokenModule.contract.interface.encodeFunctionData(
                        "mint", [voteModule.address, ethers.utils.parseUnits(amount.toString(), 18)
                    ]),

                    // Our token module that actually executes the mint.
                    toAddress: tokenModule.address,

                }
            ])
        console.log('✅ Successfully created proposal to mint tokens');

    } catch (error) {
        console.error("failed to create first proposal", error);
        process.exit(1);
        
    }

    try {
        const amount = 5780
        await voteModule.propose(
			`Should the DAO transfer ${amount} tokens to ${process.env.WALLET_ADDRESS} for charity distribution`,
			[
				{
					nativeTokenValue: 0,
					transactionData:tokenModule.contract.interface.encodeFunctionData('transfer', [
                        process.env.WALLET_ADDRESS,
                        ethers.utils.parseUnits(amount.toString(), 18)
					]),

                    toAddress: tokenModule.address
                },
			],
		);

        console.log("✅ Successfully created proposal to reward ourselves from the treasury, let's hope people vote for it!");
    } catch (error) {
        console.log("Failed to create proposal", error)
        
    }

})()