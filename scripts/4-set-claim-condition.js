import sdk from "./1-initialize-sdk.js"


const bundleDrop = sdk.getBundleDropModule(
	'0xE25c540d4F9647C29E6881EfF5aB4Bb205A31725',
);


(async () => {
    try {
        const claimConditionFactory = bundleDrop.getClaimConditionFactory();
        // specify conditions
        claimConditionFactory.newClaimPhase({
            startTime: new Date(),
            maxQuantity: 50_000,
            maxQuantityPerTransaction: 1
        })

        await bundleDrop.setClaimCondition(0, claimConditionFactory)
        console.log("✅ Successfully set claim condition on bundle drop:", bundleDrop.address);
    } catch (error) {
        console.log("Failed to claim:", error)
        
    }

})()