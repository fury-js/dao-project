import { useEffect, useMemo, useState } from "react";

import { useWeb3 } from "@3rdweb/hooks"
import {  ThirdwebSDK } from "@3rdweb/sdk"
import { ethers } from "ethers"

const sdk = new ThirdwebSDK("rinkeby");

// get the erc-1155 contract bundle
const bundleDropModule = sdk.getBundleDropModule(
	'0xE25c540d4F9647C29E6881EfF5aB4Bb205A31725',
);

const tokenModule = sdk.getTokenModule(
	'0xdccd320a87f3056a6415a6c483f90c097e0b02d9',
);

const voteModule = sdk.getVoteModule(
	'0x6f518E33C73030d55B7F246C76f6A6ab29B591B1',
);





const App = () => {
	// Use the connectWallet hook thirdweb gives us.
	const { connectWallet, address, error, provider } = useWeb3();
	console.log('Address:', address);

	const signer = provider ? provider.getSigner() : undefined;

	const [hasClaimedNft, setHasClaimedNft] = useState(false);
	// isClaiming lets us easily keep a loading state while the NFT is minting.

	const [isClaiming, setIsClaiming] = useState(false);
	const [membersTokenAmount, setMembersTokenAmount] = useState({});
	const [memberAddresses, setMemberAddresses] = useState([]);

	// variables for proposals
	const [proposals, setProposals] = useState([])
	const [isVoting, setIsVoting] = useState(false)
	const [hasVoted, setHasVoted] = useState(false)

	// A fancy function to shorten someones wallet address, no need to show the whole thing.
	const shortenAddress = (str) => {
		return str.substring(0, 6) + '...' + str.substring(str.length - 4);
	};

	// Now, we combine the memberAddresses and memberTokenAmounts into a single array
	const memberList = useMemo(() => {
		return memberAddresses.map((address) => {
			return {
				address,
				tokenAmount: ethers.utils.formatUnits(membersTokenAmount[address] || 0, 18),
			};
		});
	}, [memberAddresses, membersTokenAmount]);



	const mintNft = () => {
		setIsClaiming(true);
		// Call bundleDropModule.claim("0", 1) to mint nft to user's wallet.
		bundleDropModule
			.claim('0', 1)
			.then(() => {
				// Set claim state.
				setHasClaimedNft(true);
				// Show user their fancy new NFT!
				console.log(
					`🌊 Successfully Minted! Check it out on OpenSea: https://testnets.opensea.io/assets/${bundleDropModule.address}/0`,
				);
			})
			.catch((err) => {
				console.error('failed to claim', err);
			})
			.finally(() => {
				// Stop loading state.
				setIsClaiming(false);
			});
	};

	useEffect(() => {
		if (!hasClaimedNft) return;

		bundleDropModule
			.getAllClaimerAddresses('0')
			.then((addresses) => {
				setMemberAddresses(addresses);
				console.log('🚀 Members addresses', addresses);
			})
			.catch((err) => {
				console.error('Failed to get Beima Dao members', err);
			});
	}, [hasClaimedNft]);

	// This useEffect grabs the # of token each member holds.
	useEffect(() => {
		if (!hasClaimedNft) return;

		tokenModule
			.getAllHolderBalances()
			.then((amounts) => {
				setMembersTokenAmount(amounts);
				console.log('👜 Amounts', amounts);
			})
			.catch((err) => {
				console.error('Failed to fetch Token amounts of members', err);
			});
	}, [hasClaimedNft]);

	useEffect(() => {
		// We pass the signer to the sdk, which enables us to interact with
		// our deployed contract!
		sdk.setProviderOrSigner(signer);
	}, [signer]);

	useEffect(() => {
		if (!address) {
			return;
		}

		return bundleDropModule
			.balanceOf(address, 0)
			.then((balance) => {
				// if balance is greater than 0 then they have our dao nft
				if (balance.gt(0)) {
					setHasClaimedNft(true);
					console.log('🌟 this user has a membership NFT!');
				} else {
					setHasClaimedNft(false);
					console.log("😭 this user doesn't have a membership NFT.");
				}
			})
			.catch((error) => {
				setHasClaimedNft(false);
			});
	}, [address]);

	// useEffect for proposals
	useEffect(() => {
		if(!hasClaimedNft) return;

		voteModule.getAll().then((proposals) => {
			setProposals(proposals)
			console.log('🌈 Proposals:', proposals);

		}).catch((err) => console.log('Failed to fetch proposals', err))
	}, [hasClaimedNft])


	useEffect(() => {
		if (!hasClaimedNft) return;

		if (!proposals.length) return;

		// Check if the user has already voted on the first proposal.
		voteModule.hasVoted(proposals[0].proposalId, address).then((hasVoted) => {
			setHasVoted(hasVoted)
			if(hasVoted) console.log('🥵 User has already voted');
		}).catch((err) => console.log("failed to check if wallet has voted", err))
	},[hasClaimedNft, proposals, address])

	// App render
	if (!address) {
		return (
			<div className='landing'>
				<h1>Welcome to My DAO</h1>
				<button onClick={() => connectWallet('injected')} className='btn-hero'>
					Connect Wallet
				</button>
			</div>
		);
	}

	if (hasClaimedNft) {
		return (
			<div className='member-page'>
				<h1>🍪Beima DAO Member Page</h1>
				<p>Congratulations on being a Beima member</p>
				<div>
					<div>
						<h2>Member List</h2>
						<table className="card">
							<thead>
								<tr>
									<th>Address</th>
									<th>Token Amount</th>
								</tr>
							</thead>
							<tbody>
								{memberList.map((member) => {
									return (
										<tr key={member.address}>
											<td>{shortenAddress(member.address)}</td>
											<td>{member.tokenAmount}</td>
										</tr>
									)
								})}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		);
	}

	// This is the case where we have the user's address
	// which means they've connected their wallet to our site!

	return (
		<div className='mint-nft'>
			<h1>Mint your free 🍪DAO Membership NFT</h1>

			<button disabled={isClaiming} onClick={() => mintNft()}>
				{isClaiming ? 'Minting...' : 'Mint Your Free NFT'}
			</button>
		</div>
	);
};

export default App;
