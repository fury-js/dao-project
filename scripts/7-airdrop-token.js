/** @format */

import ethers from 'ethers';
import sdk from './1-initialize-sdk.js';

// This is the address to our ERC-1155 membership NFT contract.
const bundleDrop = sdk.getBundleDropModule(
	'0xE25c540d4F9647C29E6881EfF5aB4Bb205A31725',
);

// This is the address to our ERC-20 token contract.
const tokenModule = sdk.getTokenModule(
	'0xdccD320a87f3056a6415a6c483F90C097E0b02d9',
);

(async () => {
	try {
		// get all wallet address with our beima dao membership nft with tokenID of 0
		const walletAddresses = await bundleDrop.getAllClaimerAddresses('0');

		if (walletAddresses === 0) {
			console.log('No Nft has been claimed yet');
			process.exit(0);
		}
		// Loop through the array of addresses.
		const airDropTargets = walletAddresses.map((address) => {
			// Pick a random # between 1000 and 10000.
			const randomAmount = Math.floor(
				Math.random() * (10000 - 1000 + 1) + 1000,
			);
			console.log('✅ Going to airdrop', randomAmount, 'tokens to', address);

			// Set up the target.
			const airDropTarget = {
				address,
				amount: ethers.utils.parseUnits(randomAmount.toString(), 18),
			};

			return airDropTarget;
		});
		// Call transferBatch on all our airdrop targets.
		console.log('🌈 Starting airdrop...');
		await tokenModule.transferBatch(airDropTargets);
		console.log(
			'✅ Successfully airdropped tokens to all the holders of the Beima Dao NFT!',
		);
	} catch (error) {
		console.log('Failed to airdrop tokens', error);
	}
})();
