/** @format */

import sdk from './1-initialize-sdk.js';
import { readFileSync } from 'fs';

const bundleDrop = sdk.getBundleDropModule(
	'0xE25c540d4F9647C29E6881EfF5aB4Bb205A31725',
);

(async () => {
	try {
		await bundleDrop.createBatch([
			{
				name: 'Beima Dao membership nft',
				description: 'This NFT will give you access to NarutoDAO!',
				image: readFileSync('scripts/assets/saitama.png'),
			},
		]);
		console.log('✅ Successfully created a new NFT in the drop!');
	} catch (error) {
		console.error('failed to create the new NFT', error);
	}
})();
