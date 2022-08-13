# Hardhat Smart Contract Lottery (Raffle)

## Quickstart

Clone the repo

```
git clone https://github.com/0xSanyam/Smart-Contract-Lottery.git
```

Typescript

If you want to get to typescript and you cloned the javascript version, just run:

```
git checkout typescript
```

## Usage

### Deploy:

```
yarn hardhat deploy
```

### Testing

```
yarn hardhat test
```

### Test Coverage

```
yarn hardhat coverage
```

## Deployment to a testnet or mainnet

1. Setup environment variables

    You'll want to set your `POLYGON_RPC_URL` and `PRIVATE_KEY` as environment variables. You can add them to a `.env` file.

    - `PRIVATE_KEY`: The private key of your account (like from [metamask](https://metamask.io/)).

    - `POLYGON_RPC_URL`: This is url of the rinkeby testnet node you're working with. You can get one for free from [Alchemy](https://alchemy.com/)

2. Get testnet ETH

    Go to [faucets.chain.link](https://faucets.chain.link/) and get some testnet ETH & LINK. You should see the ETH and LINK show up in your metamask. [You can read more on setting up your wallet with LINK.](https://docs.chain.link/docs/deploy-your-first-contract/#install-and-fund-your-metamask-wallet)

3. Setup a Chainlink VRF Subscription ID

    Head over to [vrf.chain.link](https://vrf.chain.link/) and setup a new subscription, and get a subscription Id. You can reuse an old subscription if you already have one.

You should leave this step with:

1. A subscription ID
2. Your subscription should be funded with LINK
3. Deploy

In your `hardhat-helper.js` add your `subscription Id` under the section of the chainId you're using (that is, if you're deploying to rinkeby, add your `subscription Id` in the `subscriptionId` field under the `80001` section.)

Then run:

```
yarn hardhat deploy --network matic
```

And copy / remember the contract address.

4. Add your contract address as a Chainlink VRF Consumer

    Go back to [vrf.chain.link](https://vrf.chain.link) and under your subscription, click `Add consumer` and add your contract address. You should also fund the contract with a minimum of 3 LINK.

    ![VRF](/assets/vrf.png)

5. Register a Chainlink Keepers Upkeep

    Go to [keepers.chain.link](https://keepers.chain.link/new) and register a new upkeep.

    ![Keepers](/assets/keepers.png)

6. Enter in the lottery!

    Your contract is now setup to be a tamper proof autonomous verifiably random lottery.

    Enter the lottery by running:

    ```
    yarn hardhat run scripts/enter.js --network matic
    ```

### Estimate gas cost in INR

To get the INR estimation of gas cost, you'll need a `COINMARKETCAP_API_KEY` environment variable. You can get one for free from [CoinMarketCap](https://pro.coinmarketcap.com/signup).

Just note, everytime you run your tests it will use an API call, so it might make sense to have coinmarketcap disabled until you need it. You can disable it by just commenting the line out.

### Verify on polygonscan

If you deploy to a testnet or mainnet, you can verify it if you get an [API Key](https://polygonscan.com/myapikey) from PolygonScan and set it as an environemnt variable named `POLYGONSCAN_API_KEY`. You can add it into your `.env` file.

In it's current state, if you have your api key set, it will auto verify the contracts!

However, you can manual verify with:

```
yarn hardhat verify --constructor-args arguments DEPLOYED_CONTRACT_ADDRESS
```
