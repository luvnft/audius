/*
 * This file is autogenerated by ./scripts/generateServicesConfig.ts.
 * DO NOT EDIT MANUALLY!
 */
/* eslint-disable prettier/prettier */
import type { SdkServicesConfig } from './types'
export const stagingConfig: SdkServicesConfig = {
  "network": {
    "minVersion": "0.6.0",
    "discoveryNodes": [
      {
        "endpoint": "https://discoveryprovider.staging.audius.co",
        "ownerWallet": "0x8fcFA10Bd3808570987dbb5B1EF4AB74400FbfDA",
        "delegateOwnerWallet": "0x8fcFA10Bd3808570987dbb5B1EF4AB74400FbfDA"
      },
      {
        "endpoint": "https://discoveryprovider2.staging.audius.co",
        "ownerWallet": "0x5E98cBEEAA2aCEDEc0833AC3D1634E2A7aE0f3c2",
        "delegateOwnerWallet": "0x5E98cBEEAA2aCEDEc0833AC3D1634E2A7aE0f3c2"
      },
      {
        "endpoint": "https://discoveryprovider3.staging.audius.co",
        "ownerWallet": "0xf7C96916bd37Ad76D4EEDd6536B81c29706C8056",
        "delegateOwnerWallet": "0xf7C96916bd37Ad76D4EEDd6536B81c29706C8056"
      },
      {
        "endpoint": "https://discoveryprovider5.staging.audius.co",
        "ownerWallet": "0x8311f59B72522e728231dC60226359A51878F9A1",
        "delegateOwnerWallet": "0x8311f59B72522e728231dC60226359A51878F9A1"
      }
    ],
    "storageNodes": [
      {
        "endpoint": "https://creatornode10.staging.audius.co",
        "delegateOwnerWallet": "0xf7C96916bd37Ad76D4EEDd6536B81c29706C8056"
      },
      {
        "endpoint": "https://creatornode8.staging.audius.co",
        "delegateOwnerWallet": "0x8fcFA10Bd3808570987dbb5B1EF4AB74400FbfDA"
      },
      {
        "endpoint": "https://creatornode12.staging.audius.co",
        "delegateOwnerWallet": "0x6b52969934076318863243fb92E9C4b3A08267b5"
      },
      {
        "endpoint": "https://creatornode5.staging.audius.co",
        "delegateOwnerWallet": "0xDC2BDF1F23381CA2eC9e9c70D4FD96CD8645D090"
      },
      {
        "endpoint": "https://creatornode6.staging.audius.co",
        "delegateOwnerWallet": "0x68039d001D87E7A5E6B06fe0825EA7871C1Cd6C2"
      },
      {
        "endpoint": "https://creatornode7.staging.audius.co",
        "delegateOwnerWallet": "0x1F8e7aF58086992Ef4c4fc0371446974BBbC0D9F"
      },
      {
        "endpoint": "https://creatornode9.staging.audius.co",
        "delegateOwnerWallet": "0x140eD283b33be2145ed7d9d15f1fE7bF1E0B2Ac3"
      },
      {
        "endpoint": "https://creatornode11.staging.audius.co",
        "delegateOwnerWallet": "0x4c88d2c0f4c4586b41621aD6e98882ae904B98f6"
      }
    ],
    "antiAbuseOracleNodes": {
      "endpoints": [
        "https://antiabuseoracle.staging.audius.co"
      ],
      "registeredAddresses": [
        "0x00b6462e955dA5841b6D9e1E2529B830F00f31Bf",
        "0x57B57efFA54ba37DBF8A06B9c42E7611e84BDe6F",
        "0xF617bbc0913bAE0a13f6D4A19eCDE5Aa07B0fF0A"
      ]
    },
    "identityService": "https://identityservice.staging.audius.co"
  },
  "acdc": {
    "entityManagerContractAddress": "0x1Cd8a543596D499B9b6E7a6eC15ECd2B7857Fd64",
    "web3ProviderUrl": "https://poa-gateway.staging.audius.co"
  },
  "solana": {
    "claimableTokensProgramAddress": "2sjQNmUfkV6yKKi4dPR8gWRgtyma5aiymE3aXL2RAZww",
    "rewardManagerProgramAddress": "CDpzvz7DfgbF95jSSCHLX3ERkugyfgn9Fw8ypNZ1hfXp",
    "rewardManagerStateAddress": "GaiG9LDYHfZGqeNaoGRzFEnLiwUT7WiC6sA6FDJX9ZPq",
    "paymentRouterProgramAddress": "sp28KA2bTnTA4oSZ3r9tTSKfmiXZtZQHnYYQqWfUyVa",
    "stakingBridgeProgramAddress": "stkuyR7dTzxV1YnoDo5tfuBmkuKn7zDatimYRDTmQvj",
    "rpcEndpoint": "https://audius-fe.rpcpool.com",
    "usdcTokenMint": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    "wAudioTokenMint": "BELGiMZQ34SDE6x2FUaML2UHDAgBLS64xvhXjX5tBBZo",
    "rewardManagerLookupTableAddress": "ChFCWjeFxM6SRySTfT46zXn2K7m89TJsft4HWzEtkB4J"
  }
}
