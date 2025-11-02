# Solana Compressed NFT Minting Guide
**For: Sean's Art History Collections**  
**Architecture: GitHub CDN + Behance Embeds + Solana Provenance**

---

## Overview

This guide walks through minting your AI-generated art history collections as Solana compressed NFTs (cNFTs). The NFTs serve as blockchain provenance for your work without requiring marketplace dependency. Your images remain hosted on GitHub CDN, with Behance embeds handling portfolio display.

### Why Compressed NFTs?
- **Cost**: ~$0.000005 SOL per NFT (under $0.01 each)
- **Scale**: 10,000 NFTs costs ~$70 total
- **Tech credibility**: Shows understanding of Merkle trees, state compression
- **No marketplace lock-in**: NFTs exist on-chain, viewable via explorers

---

## Phase 1: Environment Setup

### Prerequisites
- Node.js (v18+)
- A Solana wallet (Phantom recommended)
- Small amount of SOL (~$20-50 for testing + production)
- Your art collections organized in directories

### 1.1 Install Dependencies

```bash
# Create project directory
mkdir solana-nft-minter
cd solana-nft-minter
npm init -y

# Install Metaplex & Solana packages
npm install @metaplex-foundation/umi-bundle-defaults \
            @metaplex-foundation/umi \
            @metaplex-foundation/mpl-token-metadata \
            @metaplex-foundation/mpl-bubblegum \
            @solana/spl-account-compression \
            @solana/web3.js \
            @metaplex-foundation/digital-asset-standard-api

# Additional utilities
npm install dotenv fs-extra
```

### 1.2 Get RPC Provider (Required for cNFTs)

Compressed NFTs require an RPC provider with DAS (Digital Asset Standard) API support.

**Option 1: Helius (Recommended)**
1. Go to https://www.helius.dev/
2. Sign up for free account
3. Create new project
4. Get API key
5. Free tier: 100 requests/second

**Option 2: QuickNode**
1. Go to https://www.quicknode.com/
2. Create Solana endpoint
3. Add "Digital Asset Standard" add-on (free)
4. Get endpoint URL

### 1.3 Setup Wallet

```bash
# Generate new keypair (or use existing)
solana-keygen new --outfile ./wallet.json

# Get your public address
solana-keygen pubkey ./wallet.json

# Fund wallet (devnet for testing)
solana airdrop 2 <YOUR_PUBLIC_KEY> --url devnet

# For mainnet, transfer SOL from exchange/Phantom
```

### 1.4 Environment Configuration

Create `.env` file:

```env
# Network
SOLANA_NETWORK=devnet  # Use 'mainnet-beta' for production
SOLANA_RPC_URL=https://devnet.helius-rpc.com/?api-key=YOUR_API_KEY

# Wallet
WALLET_PATH=./wallet.json

# Storage (we'll set this up in Phase 2)
NFT_STORAGE_KEY=your_key_here
```

**IMPORTANT**: Add `.env` and `wallet.json` to `.gitignore`!

---

## Phase 2: Metadata & Storage Setup

### 2.1 Metadata Structure

Each NFT needs metadata following Metaplex standard:

```json
{
  "name": "Renaissance Portrait #42",
  "symbol": "SEANART",
  "description": "AI-generated interpretation of Renaissance portraiture techniques, exploring the intersection of classical composition and modern generative art.",
  "image": "https://raw.githubusercontent.com/seanivore/design-360-media-web/main/assets/media/art-history/renaissance/portrait-42.avif",
  "attributes": [
    {
      "trait_type": "Collection",
      "value": "Renaissance"
    },
    {
      "trait_type": "Style",
      "value": "Portrait"
    },
    {
      "trait_type": "Year Created",
      "value": "2024"
    },
    {
      "trait_type": "Medium",
      "value": "AI-Generated"
    }
  ],
  "properties": {
    "files": [
      {
        "uri": "https://raw.githubusercontent.com/seanivore/design-360-media-web/main/assets/media/art-history/renaissance/portrait-42.avif",
        "type": "image/avif"
      }
    ],
    "category": "image",
    "creators": [
      {
        "address": "YOUR_WALLET_ADDRESS",
        "share": 100
      }
    ]
  },
  "external_url": "https://sean.august.style/projects/renaissance-portraits",
  "provenance": {
    "github_cdn": "https://raw.githubusercontent.com/seanivore/design-360-media-web/main/assets/media/art-history/renaissance/portrait-42.avif",
    "github_commit": "abc123...",
    "behance_project": "https://www.behance.net/gallery/..."
  }
}
```

### 2.2 Storage Options for Metadata

**Option A: NFT.Storage (IPFS) - Recommended**
- Free for up to 100GB
- Decentralized (IPFS + Filecoin)
- Simple API

```bash
# Get API key from https://nft.storage/
npm install nft.storage
```

**Option B: Arweave**
- Permanent storage (one-time fee)
- More expensive but truly permanent
- Good for high-value collections

**Option C: Shadow Drive (Solana-native)**
- Solana ecosystem storage
- Pay in SHDW tokens
- Fast for Solana dApps

**For your use case**: Use NFT.Storage - free, reliable, and images already on GitHub CDN means you're not storing large files, just metadata JSON.

### 2.3 Create Metadata Generator Script

Create `scripts/generate-metadata.js`:

```javascript
const fs = require('fs-extra');
const path = require('path');

// Configuration
const COLLECTIONS = {
  'renaissance': {
    name: 'Renaissance Portraits',
    symbol: 'RENART',
    description: 'AI-generated interpretations of Renaissance portraiture',
    external_url: 'https://sean.august.style/projects/renaissance-portraits',
    behance_project: 'YOUR_BEHANCE_URL'
  },
  // Add more collections...
};

const GITHUB_CDN_BASE = 'https://raw.githubusercontent.com/seanivore/design-360-media-web/main/assets/media/art-history';
const CREATOR_ADDRESS = 'YOUR_WALLET_ADDRESS';

async function generateMetadata(collection, imageFiles) {
  const metadataDir = `./metadata/${collection}`;
  await fs.ensureDir(metadataDir);
  
  const collectionConfig = COLLECTIONS[collection];
  
  for (let i = 0; i < imageFiles.length; i++) {
    const imageFile = imageFiles[i];
    const metadata = {
      name: `${collectionConfig.name} #${i + 1}`,
      symbol: collectionConfig.symbol,
      description: collectionConfig.description,
      image: `${GITHUB_CDN_BASE}/${collection}/${imageFile}`,
      attributes: [
        {
          trait_type: "Collection",
          value: collectionConfig.name
        },
        {
          trait_type: "Edition",
          value: `${i + 1} of ${imageFiles.length}`
        },
        {
          trait_type: "Year Created",
          value: "2024"
        }
      ],
      properties: {
        files: [
          {
            uri: `${GITHUB_CDN_BASE}/${collection}/${imageFile}`,
            type: "image/avif"
          }
        ],
        category: "image",
        creators: [
          {
            address: CREATOR_ADDRESS,
            share: 100
          }
        ]
      },
      external_url: collectionConfig.external_url,
      provenance: {
        github_cdn: `${GITHUB_CDN_BASE}/${collection}/${imageFile}`,
        behance_project: collectionConfig.behance_project
      }
    };
    
    const metadataPath = path.join(metadataDir, `${i}.json`);
    await fs.writeJSON(metadataPath, metadata, { spaces: 2 });
    console.log(`Generated: ${metadataPath}`);
  }
}

// Usage
const collection = 'renaissance';
const imageFiles = [
  'portrait-01.avif',
  'portrait-02.avif',
  // ... list all your images
];

generateMetadata(collection, imageFiles).then(() => {
  console.log('Metadata generation complete!');
});
```

Run: `node scripts/generate-metadata.js`

### 2.4 Upload Metadata to IPFS

Create `scripts/upload-metadata.js`:

```javascript
require('dotenv').config();
const { NFTStorage, File } = require('nft.storage');
const fs = require('fs-extra');
const path = require('path');

const client = new NFTStorage({ token: process.env.NFT_STORAGE_KEY });

async function uploadMetadata(collection) {
  const metadataDir = `./metadata/${collection}`;
  const files = await fs.readdir(metadataDir);
  
  const metadataUris = [];
  
  for (const file of files) {
    const metadataPath = path.join(metadataDir, file);
    const metadata = await fs.readJSON(metadataPath);
    
    // Upload to IPFS
    const cid = await client.storeBlob(
      new Blob([JSON.stringify(metadata)], { type: 'application/json' })
    );
    
    const uri = `https://nftstorage.link/ipfs/${cid}`;
    metadataUris.push({
      file,
      uri,
      cid
    });
    
    console.log(`Uploaded ${file}: ${uri}`);
  }
  
  // Save URI mapping
  await fs.writeJSON(
    `./metadata/${collection}/uris.json`,
    metadataUris,
    { spaces: 2 }
  );
  
  return metadataUris;
}

// Usage
uploadMetadata('renaissance').then((uris) => {
  console.log(`Uploaded ${uris.length} metadata files`);
});
```

---

## Phase 3: Compressed NFT Minting

### 3.1 Understanding the Architecture

Compressed NFTs use:
1. **Merkle Tree**: Stores NFT data off-chain in compressed form
2. **Tree Config Account**: On-chain configuration for the tree
3. **Bubblegum Program**: Metaplex program for cNFT operations

**Key Concepts**:
- **Max Depth**: How many NFTs the tree can hold (2^depth)
- **Max Buffer Size**: Concurrent operations supported
- **Canopy Depth**: On-chain cache for faster verification

**Common Tree Configurations**:
- Small collection (100): depth=7, buffer=8
- Medium collection (1,000): depth=10, buffer=64
- Large collection (10,000): depth=14, buffer=64
- Huge collection (100,000): depth=17, buffer=64

### 3.2 Create Collection First

Create `scripts/create-collection.js`:

```javascript
require('dotenv').config();
const { createUmi } = require('@metaplex-foundation/umi-bundle-defaults');
const { createSignerFromKeypair, signerIdentity } = require('@metaplex-foundation/umi');
const { createNft } = require('@metaplex-foundation/mpl-token-metadata');
const fs = require('fs-extra');

async function createCollection() {
  // Initialize Umi
  const umi = createUmi(process.env.SOLANA_RPC_URL);
  
  // Load wallet
  const walletKeypair = await fs.readJSON(process.env.WALLET_PATH);
  const signer = createSignerFromKeypair(umi, {
    publicKey: walletKeypair.publicKey,
    secretKey: walletKeypair.secretKey
  });
  umi.use(signerIdentity(signer));
  
  // Create collection NFT
  const collectionMint = generateSigner(umi);
  
  await createNft(umi, {
    mint: collectionMint,
    name: 'Renaissance Portraits',
    symbol: 'RENART',
    uri: 'https://nftstorage.link/ipfs/YOUR_COLLECTION_METADATA_CID',
    sellerFeeBasisPoints: 500, // 5% royalty
    isCollection: true,
    creators: [
      {
        address: umi.identity.publicKey,
        verified: true,
        share: 100
      }
    ]
  }).sendAndConfirm(umi);
  
  console.log('Collection created:', collectionMint.publicKey);
  
  // Save collection mint address
  await fs.writeJSON('./collection-config.json', {
    collectionMint: collectionMint.publicKey,
    name: 'Renaissance Portraits',
    symbol: 'RENART'
  });
  
  return collectionMint.publicKey;
}

createCollection();
```

### 3.3 Create Merkle Tree

Create `scripts/create-tree.js`:

```javascript
require('dotenv').config();
const { createUmi } = require('@metaplex-foundation/umi-bundle-defaults');
const { createTree } = require('@metaplex-foundation/mpl-bubblegum');
const { generateSigner } = require('@metaplex-foundation/umi');
const fs = require('fs-extra');

async function createMerkleTree(collectionSize) {
  const umi = createUmi(process.env.SOLANA_RPC_URL);
  
  // ... load wallet (same as above)
  
  // Determine tree size
  let maxDepth, maxBufferSize;
  if (collectionSize <= 100) {
    maxDepth = 7;
    maxBufferSize = 8;
  } else if (collectionSize <= 1000) {
    maxDepth = 10;
    maxBufferSize = 64;
  } else if (collectionSize <= 10000) {
    maxDepth = 14;
    maxBufferSize = 64;
  } else {
    maxDepth = 17;
    maxBufferSize = 64;
  }
  
  const merkleTree = generateSigner(umi);
  const builder = await createTree(umi, {
    merkleTree,
    maxDepth,
    maxBufferSize,
    canopyDepth: 10 // Optimize for composability
  });
  
  await builder.sendAndConfirm(umi);
  
  console.log('Merkle Tree created:', merkleTree.publicKey);
  
  // Save tree config
  await fs.writeJSON('./tree-config.json', {
    merkleTree: merkleTree.publicKey,
    maxDepth,
    maxBufferSize,
    canopyDepth: 10,
    capacity: 2 ** maxDepth
  });
  
  return merkleTree.publicKey;
}

// Usage: For 100 NFTs
createMerkleTree(100);
```

**Cost Estimate for Tree Creation**:
- Small tree (depth 7, 128 NFTs): ~0.01 SOL
- Medium tree (depth 10, 1,024 NFTs): ~0.05 SOL
- Large tree (depth 14, 16,384 NFTs): ~0.5 SOL

### 3.4 Mint Compressed NFTs

Create `scripts/mint-cnfts.js`:

```javascript
require('dotenv').config();
const { createUmi } = require('@metaplex-foundation/umi-bundle-defaults');
const { mintV1 } = require('@metaplex-foundation/mpl-bubblegum');
const fs = require('fs-extra');

async function mintCompressedNFTs(collection) {
  const umi = createUmi(process.env.SOLANA_RPC_URL);
  
  // ... load wallet
  
  // Load configs
  const collectionConfig = await fs.readJSON('./collection-config.json');
  const treeConfig = await fs.readJSON('./tree-config.json');
  const metadataUris = await fs.readJSON(`./metadata/${collection}/uris.json`);
  
  const results = [];
  
  // Mint each NFT
  for (let i = 0; i < metadataUris.length; i++) {
    const { uri } = metadataUris[i];
    
    try {
      const result = await mintV1(umi, {
        leafOwner: umi.identity.publicKey,
        merkleTree: treeConfig.merkleTree,
        metadata: {
          name: `Renaissance Portrait #${i + 1}`,
          symbol: 'RENART',
          uri,
          sellerFeeBasisPoints: 500,
          collection: { key: collectionConfig.collectionMint, verified: false },
          creators: [
            {
              address: umi.identity.publicKey,
              verified: true,
              share: 100
            }
          ]
        }
      }).sendAndConfirm(umi);
      
      console.log(`Minted NFT #${i + 1}: ${result.signature}`);
      
      results.push({
        index: i,
        signature: result.signature,
        uri
      });
      
      // Rate limiting (optional, adjust as needed)
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      console.error(`Failed to mint NFT #${i + 1}:`, error);
      results.push({
        index: i,
        error: error.message,
        uri
      });
    }
  }
  
  // Save minting results
  await fs.writeJSON(
    `./mint-results-${collection}.json`,
    results,
    { spaces: 2 }
  );
  
  console.log(`Minted ${results.filter(r => !r.error).length} NFTs successfully`);
  
  return results;
}

mintCompressedNFTs('renaissance');
```

### 3.5 Batch Minting with Parallelization

For large collections, parallelize minting:

Create `scripts/batch-mint.js`:

```javascript
require('dotenv').config();
const pLimit = require('p-limit');

async function batchMint(collection, concurrency = 10) {
  const limit = pLimit(concurrency);
  
  // ... load configs as above
  
  const mintTasks = metadataUris.map((metadata, i) => 
    limit(() => mintSingleNFT(metadata, i))
  );
  
  const results = await Promise.all(mintTasks);
  
  console.log(`Batch complete: ${results.filter(r => r.success).length} succeeded`);
  
  return results;
}

async function mintSingleNFT(metadata, index) {
  // ... individual mint logic from above
}

batchMint('renaissance', 10); // 10 concurrent mints
```

---

## Phase 4: Verification & Portfolio Integration

### 4.1 Verify Minted NFTs

Create `scripts/verify-nfts.js`:

```javascript
require('dotenv').config();
const { createUmi } = require('@metaplex-foundation/umi-bundle-defaults');
const { dasApi } = require('@metaplex-foundation/digital-asset-standard-api');

async function verifyNFTs(collection) {
  const umi = createUmi(process.env.SOLANA_RPC_URL);
  umi.use(dasApi());
  
  const treeConfig = await fs.readJSON('./tree-config.json');
  
  // Get all assets from tree
  const assets = await umi.rpc.getAssetsByGroup({
    groupKey: 'collection',
    groupValue: collectionConfig.collectionMint
  });
  
  console.log(`Found ${assets.items.length} NFTs in collection`);
  
  // Detailed check
  for (const asset of assets.items) {
    console.log({
      id: asset.id,
      name: asset.content.metadata.name,
      uri: asset.content.json_uri,
      compressed: asset.compression.compressed
    });
  }
  
  return assets;
}

verifyNFTs('renaissance');
```

### 4.2 Generate Provenance Data for Portfolio

Create `scripts/export-provenance.js`:

```javascript
async function exportProvenance(collection) {
  const mintResults = await fs.readJSON(`./mint-results-${collection}.json`);
  const treeConfig = await fs.readJSON('./tree-config.json');
  
  const provenance = mintResults.map((result, i) => ({
    image_index: i,
    image_uri: result.uri,
    nft_mint_signature: result.signature,
    merkle_tree: treeConfig.merkleTree,
    explorer_url: `https://explorer.solana.com/tx/${result.signature}${
      process.env.SOLANA_NETWORK === 'devnet' ? '?cluster=devnet' : ''
    }`,
    collection: collection
  }));
  
  // Export for your portfolio JSON manifest
  await fs.writeJSON(
    `./portfolio-provenance-${collection}.json`,
    provenance,
    { spaces: 2 }
  );
  
  console.log('Provenance data exported for portfolio integration');
  
  return provenance;
}
```

### 4.3 Add Provenance Badge to Portfolio

In your portfolio JSON, add provenance field:

```json
{
  "id": "renaissance-portraits",
  "title": "Renaissance Portraits",
  "behance_embed": "https://www.behance.net/embed/...",
  "provenance": {
    "blockchain": "Solana",
    "type": "Compressed NFT",
    "collection": "YOUR_COLLECTION_MINT_ADDRESS",
    "merkle_tree": "YOUR_TREE_ADDRESS",
    "explorer_base": "https://explorer.solana.com/address/"
  }
}
```

Add small badge in your portfolio UI:
```html
<a href="https://explorer.solana.com/address/YOUR_COLLECTION_MINT" 
   class="provenance-badge"
   target="_blank">
  🔗 On-chain Provenance
</a>
```

---

## Phase 5: Production Deployment

### 5.1 Pre-Production Checklist

- [ ] Test entire flow on devnet with 5-10 sample images
- [ ] Verify metadata renders correctly
- [ ] Check NFT explorer display
- [ ] Calculate total costs for production
- [ ] Fund mainnet wallet with sufficient SOL
- [ ] Update `.env` to use mainnet RPC

### 5.2 Mainnet Deployment

```bash
# Switch to mainnet
# In .env:
SOLANA_NETWORK=mainnet-beta
SOLANA_RPC_URL=https://mainnet.helius-rpc.com/?api-key=YOUR_API_KEY

# Run full pipeline
node scripts/create-collection.js
node scripts/create-tree.js 100  # adjust size
node scripts/mint-cnfts.js renaissance
node scripts/verify-nfts.js renaissance
node scripts/export-provenance.js renaissance
```

### 5.3 Cost Estimation Calculator

Create `scripts/estimate-costs.js`:

```javascript
function estimateCosts(collectionSize) {
  const SOL_PRICE = 10; // Update with current price
  
  let treeDepth, treeCost;
  if (collectionSize <= 128) {
    treeDepth = 7;
    treeCost = 0.01;
  } else if (collectionSize <= 1024) {
    treeDepth = 10;
    treeCost = 0.05;
  } else if (collectionSize <= 16384) {
    treeDepth = 14;
    treeCost = 0.5;
  }
  
  const mintCost = collectionSize * 0.000005;
  const totalSOL = treeCost + mintCost;
  const totalUSD = totalSOL * SOL_PRICE;
  
  console.log(`
    Collection Size: ${collectionSize}
    Tree Depth: ${treeDepth} (capacity: ${2**treeDepth})
    
    Tree Creation: ${treeCost} SOL ($${(treeCost * SOL_PRICE).toFixed(2)})
    Minting Cost: ${mintCost.toFixed(6)} SOL ($${(mintCost * SOL_PRICE).toFixed(2)})
    
    Total Cost: ${totalSOL.toFixed(6)} SOL ($${totalUSD.toFixed(2)})
  `);
}

// Examples
estimateCosts(50);   // Small collection
estimateCosts(500);  // Medium collection
estimateCosts(5000); // Large collection
```

---

## Phase 6: Monitoring & Maintenance

### 6.1 Monitor Minting Progress

```javascript
// Add to mint script
const startTime = Date.now();
let successCount = 0;
let errorCount = 0;

// After each mint
successCount++;
const elapsed = (Date.now() - startTime) / 1000;
const rate = successCount / elapsed;
const remaining = metadataUris.length - successCount;
const eta = remaining / rate;

console.log(`
  Progress: ${successCount}/${metadataUris.length}
  Rate: ${rate.toFixed(2)} NFTs/sec
  ETA: ${(eta / 60).toFixed(1)} minutes
`);
```

### 6.2 Error Recovery

If minting fails partway through:

```javascript
async function resumeMinting(collection, startIndex) {
  const metadataUris = await fs.readJSON(`./metadata/${collection}/uris.json`);
  const remainingUris = metadataUris.slice(startIndex);
  
  // Continue minting from startIndex
  console.log(`Resuming from NFT #${startIndex}`);
  
  // ... mint remaining
}

// Usage
resumeMinting('renaissance', 47); // Resume from NFT #47
```

### 6.3 Update Portfolio with Live Data

```javascript
async function syncPortfolioData() {
  // Fetch latest collection stats from RPC
  const assets = await fetchCollectionAssets();
  
  const stats = {
    total_minted: assets.length,
    last_updated: new Date().toISOString(),
    collection_address: collectionConfig.collectionMint
  };
  
  // Update portfolio JSON
  // This can be automated in CI/CD
}
```

---

## Troubleshooting

### Common Issues

**Issue**: "Transaction simulation failed"
- **Cause**: Insufficient SOL, wrong RPC, or tree full
- **Fix**: Check wallet balance, verify tree capacity

**Issue**: "Invalid tree authority"
- **Cause**: Wallet mismatch
- **Fix**: Ensure same wallet created tree and is minting

**Issue**: "Metadata upload failed"
- **Cause**: NFT.Storage API issues
- **Fix**: Retry with exponential backoff, check API limits

**Issue**: "NFTs not showing in explorer"
- **Cause**: Indexer delay
- **Fix**: Wait 1-2 minutes, use DAS API directly

### Getting Help

- Metaplex Discord: https://discord.gg/metaplex
- Solana Stack Exchange: https://solana.stackexchange.com/
- Helius Docs: https://docs.helius.dev/

---

## Security Best Practices

1. **Never commit wallet private keys**
   - Add to .gitignore immediately
   - Use environment variables

2. **Use separate wallets for dev/prod**
   - Devnet wallet for testing
   - Mainnet wallet for production only

3. **Backup wallet securely**
   - Store seed phrase offline
   - Keep encrypted backup of keypair

4. **Rate limit minting**
   - Don't overwhelm RPC
   - Use delays between mints

5. **Verify transactions**
   - Check each mint in explorer
   - Keep records of all signatures

---

## Progressive Enhancement Roadmap

### MVP (Week 1)
- [ ] Mint first test collection on devnet (10 images)
- [ ] Verify in Solana explorer
- [ ] Add Behance embed to portfolio
- [ ] Add simple provenance badge

### V1 (Week 2-3)
- [ ] Mint main collections on mainnet
- [ ] Complete portfolio integration
- [ ] Export provenance data
- [ ] Write case study about process

### V2 (Future)
- [ ] Custom gallery UI (replacing Behance embeds)
- [ ] Advanced provenance display
- [ ] Collection statistics
- [ ] Transfer/sale functionality (if desired)

---

## Resources

**Documentation**:
- Metaplex Bubblegum: https://developers.metaplex.com/bubblegum
- Solana Compressed NFTs: https://solana.com/developers/guides/compressed-nfts
- DAS API: https://docs.helius.dev/compression-and-das-api/digital-asset-standard-das-api

**Code Examples**:
- TypeScript cNFT minting: https://github.com/metaplex-foundation/compression-examples
- QuickNode guide: https://www.quicknode.com/guides/solana-development/nfts/mint-compressed-nft

**Tools**:
- Solana Explorer: https://explorer.solana.com/
- NFT.Storage: https://nft.storage/
- Helius RPC: https://helius.dev/

---

## Quick Reference Commands

```bash
# Setup
npm install
cp .env.example .env
# Edit .env with your keys

# Generate metadata
node scripts/generate-metadata.js

# Upload to IPFS
node scripts/upload-metadata.js

# Create collection & tree (one-time)
node scripts/create-collection.js
node scripts/create-tree.js 100

# Mint NFTs
node scripts/mint-cnfts.js renaissance

# Verify
node scripts/verify-nfts.js renaissance

# Export for portfolio
node scripts/export-provenance.js renaissance

# Estimate costs
node scripts/estimate-costs.js
```

---

## Success Criteria

✅ **Technical Success**:
- All NFTs minted successfully on Solana
- Metadata accessible via IPFS
- Images hosted on GitHub CDN
- Verifiable in Solana explorer

✅ **Portfolio Success**:
- Behance embeds displaying work
- Provenance badges linking to explorer
- Case study written about process
- Demonstrates Web3 + AI expertise

✅ **Job Application Success**:
- Can discuss compressed NFT architecture
- Shows understanding of Merkle trees
- Demonstrates scripting/automation skills
- Proves ability to work at AI/Web3 intersection

---

**Next Steps**: Start with Phase 1 on devnet using 5 test images. Once you see your first NFT in the explorer, you'll have the confidence to scale to full production!
