import sdk from "./1-initialize-sdk.js"

// Grab the app module address.
const app = sdk.getAppModule('0xB2F215E44E38e32B0E00C237e8deE424e963C73f');


(async () => {
    try {
        // deploy a voting contract
        const voteModule = await app.deployVoteModule({
                name: 'Beima Proposals',
                votingTokenAddress: '0xdccd320a87f3056a6415a6c483f90c097e0b02d9',
                proposalStartWaitTimeInSeconds: 0,
                proposalVotingTimeInSeconds: 24 *60 * 60,
                votingQuorumFraction:0,
                minimumNumberOfTokensNeededToPropose: "0"
        });
         
        console.log(
          "✅ Successfully deployed vote module, address:",
          voteModule.address,
        );
        
    } catch (error) {
        console.log("Failed to deploy voting module", error)
    }

})()