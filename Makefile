-include .env

all : install build

build :; @forge build

install:
	@forge install selfxyz/self --no-commit && forge install hyperlane-xyz/hyperlane-monorepo@bdccf29ee387dc671c3b42383cb5cdf1bd6689f3 --no-commit

deploy-registry:
	@forge script script/DeployRegistry.s.sol:DeployRegistry --rpc-url $(POLYGON_RPC_URL) --account burner --sender 0xFB6a372F2F51a002b390D18693075157A459641F --broadcast --verify --verifier blockscout --verifier-url https://polygon.blockscout.com/api/ -vvvv