"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ethers } from "ethers";

const allowedTokens = [
  {
    name: "Polygon",
    symbol: "POL",
    address: "0x81F55140e2D2f277510d5913CEF357bc88dC185a",
    enabled: true,
  },
  {
    name: "Dai Stablecoin",
    symbol: "DAI",
    address: "0x0000000000000000000000000000000000000000",
    enabled: false,
  },
  {
    name: "Chainlink",
    symbol: "LINK",
    address: "0x0000000000000000000000000000000000000000",
    enabled: false,
  },
];

const registryAddress = "0x74aCE009385B13197AC36939CfF24CB3Dbd2521C"; // Replace with actual address
const gasMasterAddress = "0xFB6a372F2F51a002b390D18693075157A459641F"; // Replace with actual Gas Master address

const MilestoneBasedSetup: React.FC = () => {
  const router = useRouter();
  const [selectedToken, setSelectedToken] = useState<string | null>(null);
  const [milestoneContract, setMilestoneContract] = useState<string>(""); // Milestone contract address
  const [eventSignature, setEventSignature] = useState<string>(""); // Event signature
  const [loading, setLoading] = useState(false);

  const deployPayroll = async () => {
    if (
      !selectedToken ||
      !milestoneContract ||
      !eventSignature ||
      !window.ethereum
    )
      return;
    setLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const owner = await signer.getAddress();

      const contractABI = [
        {
          type: "constructor",
          inputs: [
            {
              name: "owner",
              type: "address",
              internalType: "address",
            },
            {
              name: "allowedTokens",
              type: "address[]",
              internalType: "address[]",
            },
            {
              name: "_registry",
              type: "address",
              internalType: "address",
            },
            {
              name: "_gasMaster",
              type: "address",
              internalType: "address",
            },
            {
              name: "_milestoneContract",
              type: "address",
              internalType: "address",
            },
            {
              name: "_eventSignature",
              type: "bytes",
              internalType: "bytes",
            },
          ],
          stateMutability: "nonpayable",
        },
        {
          type: "function",
          name: "addEmployee",
          inputs: [
            {
              name: "employeeId",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "connectedWallet",
              type: "address",
              internalType: "address",
            },
            {
              name: "salaryAmount",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          outputs: [],
          stateMutability: "nonpayable",
        },
        {
          type: "function",
          name: "claimPayroll",
          inputs: [
            {
              name: "employeeId",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          outputs: [],
          stateMutability: "nonpayable",
        },
        {
          type: "function",
          name: "depositFunds",
          inputs: [
            {
              name: "amountOfUsdc",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          outputs: [],
          stateMutability: "payable",
        },
        {
          type: "function",
          name: "eventSignature",
          inputs: [],
          outputs: [
            {
              name: "",
              type: "bytes",
              internalType: "bytes",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "milestoneContract",
          inputs: [],
          outputs: [
            {
              name: "",
              type: "address",
              internalType: "address",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "owner",
          inputs: [],
          outputs: [
            {
              name: "",
              type: "address",
              internalType: "address",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "reachMilestone",
          inputs: [],
          outputs: [],
          stateMutability: "nonpayable",
        },
        {
          type: "function",
          name: "renounceOwnership",
          inputs: [],
          outputs: [],
          stateMutability: "nonpayable",
        },
        {
          type: "function",
          name: "setPreferences",
          inputs: [
            {
              name: "employeeId",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "tokens",
              type: "address[]",
              internalType: "address[]",
            },
            {
              name: "percentages",
              type: "uint256[]",
              internalType: "uint256[]",
            },
          ],
          outputs: [],
          stateMutability: "nonpayable",
        },
        {
          type: "function",
          name: "transferOwnership",
          inputs: [
            {
              name: "newOwner",
              type: "address",
              internalType: "address",
            },
          ],
          outputs: [],
          stateMutability: "nonpayable",
        },
        {
          type: "function",
          name: "withdrawFund",
          inputs: [
            {
              name: "amountOfUsdc",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          outputs: [],
          stateMutability: "nonpayable",
        },
        {
          type: "event",
          name: "DepositFunds",
          inputs: [
            {
              name: "amountOfUsdc",
              type: "uint256",
              indexed: false,
              internalType: "uint256",
            },
          ],
          anonymous: false,
        },
        {
          type: "event",
          name: "EmployeeAdded",
          inputs: [
            {
              name: "employeeId",
              type: "uint256",
              indexed: true,
              internalType: "uint256",
            },
            {
              name: "connectedWallet",
              type: "address",
              indexed: true,
              internalType: "address",
            },
            {
              name: "salaryAmount",
              type: "uint256",
              indexed: false,
              internalType: "uint256",
            },
          ],
          anonymous: false,
        },
        {
          type: "event",
          name: "OwnershipTransferred",
          inputs: [
            {
              name: "previousOwner",
              type: "address",
              indexed: true,
              internalType: "address",
            },
            {
              name: "newOwner",
              type: "address",
              indexed: true,
              internalType: "address",
            },
          ],
          anonymous: false,
        },
        {
          type: "event",
          name: "PayrollClaimed",
          inputs: [
            {
              name: "employeeId",
              type: "uint256",
              indexed: true,
              internalType: "uint256",
            },
            {
              name: "connectedWallet",
              type: "address",
              indexed: true,
              internalType: "address",
            },
            {
              name: "amount",
              type: "uint256",
              indexed: false,
              internalType: "uint256",
            },
            {
              name: "tokens",
              type: "address[]",
              indexed: false,
              internalType: "address[]",
            },
            {
              name: "percentages",
              type: "uint256[]",
              indexed: false,
              internalType: "uint256[]",
            },
          ],
          anonymous: false,
        },
        {
          type: "event",
          name: "PreferencesSet",
          inputs: [
            {
              name: "employeeId",
              type: "uint256",
              indexed: true,
              internalType: "uint256",
            },
            {
              name: "tokens",
              type: "address[]",
              indexed: false,
              internalType: "address[]",
            },
            {
              name: "percentages",
              type: "uint256[]",
              indexed: false,
              internalType: "uint256[]",
            },
          ],
          anonymous: false,
        },
        {
          type: "event",
          name: "Withdraw",
          inputs: [
            {
              name: "amountOfUsdc",
              type: "uint256",
              indexed: false,
              internalType: "uint256",
            },
          ],
          anonymous: false,
        },
        {
          type: "error",
          name: "MilestoneBasedPayroll__NotGasMaster",
          inputs: [],
        },
        {
          type: "error",
          name: "OwnableInvalidOwner",
          inputs: [
            {
              name: "owner",
              type: "address",
              internalType: "address",
            },
          ],
        },
        {
          type: "error",
          name: "OwnableUnauthorizedAccount",
          inputs: [
            {
              name: "account",
              type: "address",
              internalType: "address",
            },
          ],
        },
        {
          type: "error",
          name: "Payroll__InsufficientFunds",
          inputs: [],
        },
        {
          type: "error",
          name: "Payroll__InvalidEmployeeId",
          inputs: [],
        },
        {
          type: "error",
          name: "Payroll__InvalidSumOfPercentages",
          inputs: [],
        },
        {
          type: "error",
          name: "Payroll__MilestoneNotReached",
          inputs: [],
        },
        {
          type: "error",
          name: "Payroll__MismatchedLength",
          inputs: [],
        },
        {
          type: "error",
          name: "Payroll__NotAllowedToken",
          inputs: [],
        },
        {
          type: "error",
          name: "Payroll__NotAuthorized",
          inputs: [],
        },
        {
          type: "error",
          name: "Payroll__NotVerifiedEmployee",
          inputs: [],
        },
        {
          type: "error",
          name: "Payroll__TransferFailed",
          inputs: [],
        },
      ];

      const contractBytecode =
        "0x60a06040526001805460ff60a01b1916905573effd7ac3073f3e4122e31ff18f9ae69a4a595dfe608052348015610034575f5ffd5b506040516115ed3803806115ed83398101604081905261005391610284565b856001600160a01b03811661008157604051631e4fbdf760e01b81525f600482015260240160405180910390fd5b61008a816100f4565b50845161009e906002906020880190610143565b50600680546001600160a01b038087166001600160a01b03199283161790925560018054868416908316179055600780549285169290911691909117905560086100e88282610422565b505050505050506104dc565b5f80546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b828054828255905f5260205f20908101928215610196579160200282015b8281111561019657825182546001600160a01b0319166001600160a01b03909116178255602090920191600190910190610161565b506101a29291506101a6565b5090565b5b808211156101a2575f81556001016101a7565b80516001600160a01b03811681146101d0575f5ffd5b919050565b634e487b7160e01b5f52604160045260245ffd5b604051601f8201601f191681016001600160401b0381118282101715610211576102116101d5565b604052919050565b5f82601f830112610228575f5ffd5b81516001600160401b03811115610241576102416101d5565b610254601f8201601f19166020016101e9565b818152846020838601011115610268575f5ffd5b8160208501602083015e5f918101602001919091529392505050565b5f5f5f5f5f5f60c08789031215610299575f5ffd5b6102a2876101ba565b60208801519096506001600160401b038111156102bd575f5ffd5b8701601f810189136102cd575f5ffd5b80516001600160401b038111156102e6576102e66101d5565b8060051b6102f6602082016101e9565b9182526020818401810192908101908c841115610311575f5ffd5b6020850194505b8385101561033a57610329856101ba565b825260209485019490910190610318565b809950505050505061034e604088016101ba565b935061035c606088016101ba565b925061036a608088016101ba565b60a08801519092506001600160401b03811115610385575f5ffd5b61039189828a01610219565b9150509295509295509295565b600181811c908216806103b257607f821691505b6020821081036103d057634e487b7160e01b5f52602260045260245ffd5b50919050565b601f82111561041d57805f5260205f20601f840160051c810160208510156103fb5750805b601f840160051c820191505b8181101561041a575f8155600101610407565b50505b505050565b81516001600160401b0381111561043b5761043b6101d5565b61044f81610449845461039e565b846103d6565b6020601f821160018114610481575f831561046a5750848201515b5f19600385901b1c1916600184901b17845561041a565b5f84815260208120601f198516915b828110156104b05787850151825560209485019460019092019101610490565b50848210156104cd57868401515f19600387901b60f8161c191681555b50505050600190811b01905550565b6080516110dd6105105f395f8181610259015281816103db01528181610489015281816108d601526109db01526110dd5ff3fe60806040526004361061009a575f3560e01c8063493961aa11610062578063493961aa14610147578063715018a6146101665780637e3562d31461017a5780638da5cb5b14610199578063cbdcb9ac146101b5578063f2fde38b146101d4575f5ffd5b806303706c6d1461009e5780630cee1725146100b457806324d4abb7146100d35780633b76594d146100fd5780633fdcdf4314610110575b5f5ffd5b3480156100a9575f5ffd5b506100b26101f3565b005b3480156100bf575f5ffd5b506100b26100ce366004610d76565b610233565b3480156100de575f5ffd5b506100e7610323565b6040516100f49190610d8d565b60405180910390f35b6100b261010b366004610d76565b6103af565b34801561011b575f5ffd5b5060075461012f906001600160a01b031681565b6040516001600160a01b0390911681526020016100f4565b348015610152575f5ffd5b506100b2610161366004610ddd565b61052c565b348015610171575f5ffd5b506100b26106da565b348015610185575f5ffd5b506100b2610194366004610e58565b6106ed565b3480156101a4575f5ffd5b505f546001600160a01b031661012f565b3480156101c0575f5ffd5b506100b26101cf366004610d76565b610856565b3480156101df575f5ffd5b506100b26101ee366004610ed1565b610ac4565b6001546001600160a01b0316331461021e57604051630d788f9f60e11b815260040160405180910390fd5b6001805460ff60a01b1916600160a01b179055565b61023b610b06565b60405163a9059cbb60e01b8152336004820152602481018290525f907f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03169063a9059cbb906044016020604051808303815f875af11580156102a7573d5f5f3e3d5ffd5b505050506040513d601f19601f820116820180604052508101906102cb9190610ef1565b9050806102eb57604051633cc0d69d60e01b815260040160405180910390fd5b6040518281527f5b6b431d4476a211bb7d41c20d1aab9ae2321deee0d20be3d9fc9b1093fa6e3d906020015b60405180910390a15050565b6008805461033090610f10565b80601f016020809104026020016040519081016040528092919081815260200182805461035c90610f10565b80156103a75780601f1061037e576101008083540402835291602001916103a7565b820191905f5260205f20905b81548152906001019060200180831161038a57829003601f168201915b505050505081565b6103b7610b06565b6040516323b872dd60e01b8152336004820152306024820152604481018290525f907f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316906323b872dd906064016020604051808303815f875af1158015610429573d5f5f3e3d5ffd5b505050506040513d601f19601f8201168201806040525081019061044d9190610ef1565b90508061046d57604051633cc0d69d60e01b815260040160405180910390fd5b60405163095ea7b360e01b8152306004820152602481018390527f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03169063095ea7b3906044016020604051808303815f875af11580156104d7573d5f5f3e3d5ffd5b505050506040513d601f19601f820116820180604052508101906104fb9190610ef1565b506040518281527fea9d44aea9d9b19064c11e8d92087621b04bda9bc740e82436a7cd583ffa7a9090602001610317565b610534610b06565b60065460405163171ee9f360e01b81526001600160a01b0384811660048301529091169063171ee9f390602401602060405180830381865afa15801561057c573d5f5f3e3d5ffd5b505050506040513d601f19601f820116820180604052508101906105a09190610ef1565b15155f036105c15760405163be2e735f60e01b815260040160405180910390fd5b6105ca83610b32565b60408051606080820183528582526001600160a01b0385811660208085019182528486018781525f8a8152600383528781209651875592516001870180546001600160a01b03191691909516179093559151600290940193909355835180850184815292810185529182528351838152808201855282820152868352600481529290912081518051929391926106639284920190610cc6565b50602082810151805161067c9260018501920190610d29565b5050506001600160a01b0382165f81815260056020526040908190208590555184907fbf8360766872acaeb00f0e4ac11f4a3b1f82c31bc71c469b66402847f7189c12906106cd9085815260200190565b60405180910390a3505050565b6106e2610b06565b6106eb5f610b5e565b565b5f858152600360205260409020600101546001600160a01b0316331461072657604051633db0664f60e11b815260040160405180910390fd5b828114610746576040516364b5d82f60e11b815260040160405180910390fd5b6107508484610bad565b61075a8282610c63565b60405180604001604052808585808060200260200160405190810160405280939291908181526020018383602002808284375f9201919091525050509082525060408051602085810282810182019093528582529283019290918691869182918501908490808284375f920182905250939094525050878152600460209081526040909120835180519193506107f4928492910190610cc6565b50602082810151805161080d9260018501920190610d29565b50905050847f9084d589fe9b0f71dcf4558d1b3f1acfb807081d011098b2f12fc5c4ae44abdf858585856040516108479493929190610f48565b60405180910390a25050505050565b600154600160a01b900460ff1661088057604051632a90f57160e11b815260040160405180910390fd5b5f81815260036020526040902060018101546001600160a01b031633146108ba57604051633db0664f60e11b815260040160405180910390fd5b60028101546040516370a0823160e01b815230600482015281907f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316906370a0823190602401602060405180830381865afa158015610923573d5f5f3e3d5ffd5b505050506040513d601f19601f820116820180604052508101906109479190610fc2565b1015610966576040516316e1bf4960e21b815260040160405180910390fd5b600654604051630c985f2960e01b81523360048201526001600160a01b0390911690630c985f29906024015f604051808303815f87803b1580156109a8575f5ffd5b505af11580156109ba573d5f5f3e3d5ffd5b505060405163a9059cbb60e01b8152336004820152602481018490525f92507f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316915063a9059cbb906044016020604051808303815f875af1158015610a2a573d5f5f3e3d5ffd5b505050506040513d601f19601f82011682018060405250810190610a4e9190610ef1565b905080610a6e57604051633cc0d69d60e01b815260040160405180910390fd5b5f84815260046020526040908190209051339186917f9775bc462472ce0bcb115e35049f23c8b50bda7be5be5ab5335c0245086928e891610ab6918791906001820190610fd9565b60405180910390a350505050565b610acc610b06565b6001600160a01b038116610afa57604051631e4fbdf760e01b81525f60048201526024015b60405180910390fd5b610b0381610b5e565b50565b5f546001600160a01b031633146106eb5760405163118cdaa760e01b8152336004820152602401610af1565b5f8181526003602052604090205415610b0357604051632053fdc360e21b815260040160405180910390fd5b5f80546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b60025481905f5b82811015610c5c575f805b83811015610c345760028181548110610bda57610bda61106e565b5f918252602090912001546001600160a01b0316878785818110610c0057610c0061106e565b9050602002016020810190610c159190610ed1565b6001600160a01b031603610c2c5760019150610c34565b600101610bbf565b5080610c535760405163fadf90a960e01b815260040160405180910390fd5b50600101610bb4565b5050505050565b805f805b82811015610c9d57848482818110610c8157610c8161106e565b9050602002013582610c939190611082565b9150600101610c67565b506064811115610cc057604051631bf5238560e21b815260040160405180910390fd5b50505050565b828054828255905f5260205f20908101928215610d19579160200282015b82811115610d1957825182546001600160a01b0319166001600160a01b03909116178255602090920191600190910190610ce4565b50610d25929150610d62565b5090565b828054828255905f5260205f20908101928215610d19579160200282015b82811115610d19578251825591602001919060010190610d47565b5b80821115610d25575f8155600101610d63565b5f60208284031215610d86575f5ffd5b5035919050565b602081525f82518060208401528060208501604085015e5f604082850101526040601f19601f83011684010191505092915050565b80356001600160a01b0381168114610dd8575f5ffd5b919050565b5f5f5f60608486031215610def575f5ffd5b83359250610dff60208501610dc2565b929592945050506040919091013590565b5f5f83601f840112610e20575f5ffd5b50813567ffffffffffffffff811115610e37575f5ffd5b6020830191508360208260051b8501011115610e51575f5ffd5b9250929050565b5f5f5f5f5f60608688031215610e6c575f5ffd5b85359450602086013567ffffffffffffffff811115610e89575f5ffd5b610e9588828901610e10565b909550935050604086013567ffffffffffffffff811115610eb4575f5ffd5b610ec088828901610e10565b969995985093965092949392505050565b5f60208284031215610ee1575f5ffd5b610eea82610dc2565b9392505050565b5f60208284031215610f01575f5ffd5b81518015158114610eea575f5ffd5b600181811c90821680610f2457607f821691505b602082108103610f4257634e487b7160e01b5f52602260045260245ffd5b50919050565b604080825281018490525f8560608301825b87811015610f88576001600160a01b03610f7384610dc2565b16825260209283019290910190600101610f5a565b5083810360208501528481526001600160fb1b03851115610fa7575f5ffd5b8460051b915081866020830137016020019695505050505050565b5f60208284031215610fd2575f5ffd5b5051919050565b5f6060820185835260606020840152808554808352608085019150865f5260205f2092505f5b818110156110265783546001600160a01b0316835260019384019360209093019201610fff565b5050838103604085015284548082525f8681526020808220930193505b81811015611061578254845260209093019260019283019201611043565b5091979650505050505050565b634e487b7160e01b5f52603260045260245ffd5b808201808211156110a157634e487b7160e01b5f52601160045260245ffd5b9291505056fea2646970667358221220fff04009193499684521fd8b5d4d134212b5bbb38f077b40471f9e57d2955c3764736f6c634300081c0033";

      const factory = new ethers.ContractFactory(
        contractABI,
        contractBytecode,
        signer
      );
      const contract = await factory.deploy(
        owner,
        [selectedToken],
        registryAddress,
        gasMasterAddress,
        milestoneContract,
        ethers.hexlify(ethers.toUtf8Bytes(eventSignature)) // Convert event signature to bytes
      );
      await contract.waitForDeployment();

      console.log("Contract deployed at:", await contract.getAddress());
      router.push("milestone-dashboard");
    } catch (err) {
      console.error("Deployment error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-4">
          🚀 Create Milestone-Based Payroll
        </h1>
        <p className="text-center text-gray-600 mb-10">
          Select the allowed tokens and provide the milestone contract and event
          signature for your payroll setup.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          {allowedTokens.map((token) => (
            <button
              key={token.symbol}
              onClick={() => token.enabled && setSelectedToken(token.address)}
              disabled={!token.enabled}
              className={`flex flex-col items-start justify-between p-4 border-2 rounded-xl shadow transition-all duration-200 hover:shadow-md ${
                selectedToken === token.address
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-300"
              } ${
                !token.enabled
                  ? "opacity-40 cursor-not-allowed"
                  : "hover:border-blue-400"
              }`}
            >
              <div>
                <h3 className="text-lg font-semibold">{token.symbol}</h3>
                <p className="text-sm text-gray-600">{token.name}</p>
              </div>
              {token.enabled && selectedToken === token.address && (
                <span className="mt-2 text-xs text-blue-600 font-medium">
                  ✓ Selected
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="mb-6">
          <label
            htmlFor="milestoneContract"
            className="block text-lg font-semibold mb-2"
          >
            Milestone Contract Address:
          </label>
          <input
            type="text"
            id="milestoneContract"
            className="w-full p-4 border-2 rounded-xl shadow-sm"
            placeholder="Enter milestone contract address"
            value={milestoneContract}
            onChange={(e) => setMilestoneContract(e.target.value)}
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="eventSignature"
            className="block text-lg font-semibold mb-2"
          >
            Milestone Event Signature:
          </label>
          <input
            type="text"
            id="eventSignature"
            className="w-full p-4 border-2 rounded-xl shadow-sm"
            placeholder="Enter event signature (e.g. 'MilestoneAchieved(address,uint256)')"
            value={eventSignature}
            onChange={(e) => setEventSignature(e.target.value)}
          />
        </div>

        <div className="text-center">
          <button
            onClick={deployPayroll}
            disabled={
              !selectedToken || !milestoneContract || !eventSignature || loading
            }
            className={`px-6 py-2 rounded text-white font-medium ${
              selectedToken && !loading
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {loading ? "Deploying Contract..." : "Deploy Payroll Contract"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MilestoneBasedSetup;
