-include .env

all : install build

build :; @forge build && forge inspect src/CVLayer.sol:CVLayer abi > content/CVLayer.json && forge inspect src/TimeBasedPayroll.sol:TimeBasedPayroll abi > content/time-based/TimeBasedPayroll.json && forge inspect src/TimeBasedPayroll.sol:TimeBasedPayroll bytecode > content/time-based/TimeBasedPayroll.bin && forge inspect src/CustomLogicPayroll.sol:CustomLogicPayroll abi > content/custom-logic/CustomLogicPayroll.json && forge inspect src/CustomLogicPayroll.sol:CustomLogicPayroll bytecode > content/custom-logic/CustomLogicPayroll.bin && forge inspect src/MilestoneBasedPayroll.sol:MilestoneBasedPayroll abi > content/milestone-based/MilestoneBasedPayroll.json && forge inspect src/MilestoneBasedPayroll.sol:MilestoneBasedPayroll bytecode > content/milestone-based/MilestoneBasedPayroll.bin

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
	@forge script script/DeployRegistry.s.sol:DeployRegistry --rpc-url $(SEPOLIA_RPC_URL) --account burner --sender 0xFB6a372F2F51a002b390D18693075157A459641F --broadcast --verify --etherscan-api-key ${ETHERSCAN_API_KEY} -vvvv

deploy-mock-usdc:
	@forge script script/mocks/DeployMockUSDC.s.sol:DeployMockUSDC --rpc-url $(SEPOLIA_RPC_URL) --account burner --sender 0xFB6a372F2F51a002b390D18693075157A459641F --broadcast --verify --etherscan-api-key ${ETHERSCAN_API_KEY} -vvvv

deploy-mock-pol:
	@forge script script/mocks/DeployMockPOL.s.sol:DeployMockPOL --rpc-url $(SEPOLIA_RPC_URL) --account burner --sender 0xFB6a372F2F51a002b390D18693075157A459641F --broadcast --verify --etherscan-api-key ${ETHERSCAN_API_KEY} -vvvv

deploy-calary:
	@forge script script/mocks/DeployCalary.s.sol:DeployCalary --rpc-url $(SEPOLIA_RPC_URL) --account burner --sender 0xFB6a372F2F51a002b390D18693075157A459641F --broadcast --verify --etherscan-api-key ${ETHERSCAN_API_KEY} -vvvv

deploy-easy-registry:
	@forge script script/mocks/DeployEasyRegistry.s.sol:DeployEasyRegistry --rpc-url $(SEPOLIA_RPC_URL) --account burner --sender 0xFB6a372F2F51a002b390D18693075157A459641F --broadcast --verify --etherscan-api-key ${ETHERSCAN_API_KEY} -vvvv

deploy-time-based-payroll:
	@forge script script/mocks/DeployTimeBasedPayroll.s.sol:DeployTimeBasedPayroll --rpc-url $(SEPOLIA_RPC_URL) --account burner --sender 0xFB6a372F2F51a002b390D18693075157A459641F --broadcast --verify --etherscan-api-key ${ETHERSCAN_API_KEY} -vvvv

deploy-calary-hook:
	@forge script script/mocks/DeployCalaryHook.s.sol:DeployCalaryHook --rpc-url $(SEPOLIA_RPC_URL) --account burner --sender 0xFB6a372F2F51a002b390D18693075157A459641F --broadcast --verify --etherscan-api-key ${ETHERSCAN_API_KEY} -vvvv

deploy-custom-logic-payroll:
	@forge script script/mocks/DeployCustomLogicPayroll.s.sol:DeployCustomLogicPayroll --rpc-url $(SEPOLIA_RPC_URL) --account burner --sender 0xFB6a372F2F51a002b390D18693075157A459641F --broadcast --verify --etherscan-api-key ${ETHERSCAN_API_KEY} -vvvv

deploy-milestone-based-payroll:
	@forge script script/mocks/DeployMilestoneBasedPayroll.s.sol:DeployMilestoneBasedPayroll --rpc-url $(SEPOLIA_RPC_URL) --account burner --sender 0xFB6a372F2F51a002b390D18693075157A459641F --broadcast --verify --etherscan-api-key ${ETHERSCAN_API_KEY} -vvvv  --legacy

#################################

add-address-to-easy-registry:
	@forge script script/actions/AddAddressToEasyRegistry.s.sol:AddAddressToEasyRegistry --rpc-url $(SEPOLIA_RPC_URL) --account burner --sender 0xFB6a372F2F51a002b390D18693075157A459641F --broadcast --verify --etherscan-api-key ${ETHERSCAN_API_KEY} -vvvv

create-pool-and-add-liquidity:
	@forge script script/actions/CreatePoolAndAddLiquidity.s.sol:CreatePoolAndAddLiquidity --rpc-url $(SEPOLIA_RPC_URL) --account burner --sender 0xFB6a372F2F51a002b390D18693075157A459641F --broadcast -vvvv

swap:
	@forge script script/actions/Swap.s.sol:Swap --rpc-url $(SEPOLIA_RPC_URL) --private-key ${PRIVATE_KEY} --broadcast -vvvv