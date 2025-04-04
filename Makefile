-include .env

all : install build

build :; @forge build && forge inspect src/CVLayer.sol:CVLayer abi > content/CVLayer.json 

install:
	@forge install selfxyz/self --no-commit && forge install hyperlane-xyz/hyperlane-monorepo@bdccf29ee387dc671c3b42383cb5cdf1bd6689f3 --no-commit && forge install OpenZeppelin/openzeppelin-contracts --no-commit && forge install OpenZeppelin/uniswap-hooks --no-commit && forge install Uniswap/v4-periphery --no-commit

deploy-registry:
	@forge script script/DeployRegistry.s.sol:DeployRegistry --rpc-url $(POLYGON_RPC_URL) --account burner --sender 0xFB6a372F2F51a002b390D18693075157A459641F --broadcast --verify --verifier blockscout --verifier-url https://polygon.blockscout.com/api/ -vvvv

deploy-cv-layer:
	@forge script script/DeployCVLayer.s.sol:DeployCVLayer --rpc-url $(CELO_RPC_URL) --account burner --sender 0xFB6a372F2F51a002b390D18693075157A459641F --broadcast --verify --etherscan-api-key ${CELO_API_KEY} -vvvv

deploy-chainlink-relayer:
	@forge script script/DeployChainlinkRelayer.s.sol:DeployChainlinkRelayer --rpc-url $(CELO_RPC_URL) --account burner --sender 0xFB6a372F2F51a002b390D18693075157A459641F --broadcast --verify --etherscan-api-key ${CELO_API_KEY} -vvvv

################################

deploy-demo-registry:
	@forge script script/DeployRegistry.s.sol:DeployRegistry --rpc-url $(POLYGON_RPC_URL) --account burner --sender 0xFB6a372F2F51a002b390D18693075157A459641F --broadcast --verify --verifier blockscout --verifier-url https://polygon.blockscout.com/api/ -vvvv