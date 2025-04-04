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

const TimeBasedSetup: React.FC = () => {
  const router = useRouter();
  const [selectedToken, setSelectedToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const deployPayroll = async () => {
    if (!selectedToken || !window.ethereum) return;
    setLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const owner = await signer.getAddress();

      // Replace with your contract's ABI and bytecode
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
            {
              name: "lastPaymentDate",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "interval",
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
          name: "getAllowTokens",
          inputs: [],
          outputs: [
            {
              name: "",
              type: "address[]",
              internalType: "address[]",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "getEmployee",
          inputs: [
            {
              name: "employeeId",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          outputs: [
            {
              name: "",
              type: "tuple",
              internalType: "struct TimeBasedPayroll.Employee",
              components: [
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
                {
                  name: "lastPaymentDate",
                  type: "uint256",
                  internalType: "uint256",
                },
                {
                  name: "interval",
                  type: "uint256",
                  internalType: "uint256",
                },
              ],
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "getEmployeeId",
          inputs: [
            {
              name: "connectedWallet",
              type: "address",
              internalType: "address",
            },
          ],
          outputs: [
            {
              name: "",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "getOwner",
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
          name: "getPreference",
          inputs: [
            {
              name: "employeeId",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          outputs: [
            {
              name: "",
              type: "tuple",
              internalType: "struct TimeBasedPayroll.Preference",
              components: [
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
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "getUsdcBalance",
          inputs: [],
          outputs: [
            {
              name: "",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "getUsdcContract",
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
            {
              name: "lastPaymentDate",
              type: "uint256",
              indexed: false,
              internalType: "uint256",
            },
            {
              name: "interval",
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
          name: "Payroll__MismatchedLength",
          inputs: [],
        },
        {
          type: "error",
          name: "Payroll__NotAllowedChain",
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
          name: "Payroll__NotDueYet",
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
        "0x60a060405273effd7ac3073f3e4122e31ff18f9ae69a4a595dfe608052348015610027575f5ffd5b5060405161175f38038061175f833981016040819052610046916101af565b826001600160a01b03811661007457604051631e4fbdf760e01b81525f600482015260240160405180910390fd5b61007d816100ba565b508151610091906001906020850190610109565b50600580546001600160a01b0319166001600160a01b03929092169190911790555061029b9050565b5f80546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b828054828255905f5260205f2090810192821561015c579160200282015b8281111561015c57825182546001600160a01b0319166001600160a01b03909116178255602090920191600190910190610127565b5061016892915061016c565b5090565b5b80821115610168575f815560010161016d565b80516001600160a01b0381168114610196575f5ffd5b919050565b634e487b7160e01b5f52604160045260245ffd5b5f5f5f606084860312156101c1575f5ffd5b6101ca84610180565b60208501519093506001600160401b038111156101e5575f5ffd5b8401601f810186136101f5575f5ffd5b80516001600160401b0381111561020e5761020e61019b565b604051600582901b90603f8201601f191681016001600160401b038111828210171561023c5761023c61019b565b604052918252602081840181019290810189841115610259575f5ffd5b6020850194505b8385101561027f5761027185610180565b815260209485019401610260565b5094506102929250505060408501610180565b90509250925092565b6080516114826102dd5f395f8181610220015281816103610152818161045701528181610505015281816108a40152818161099f0152610ac301526114825ff3fe6080604052600436106100e4575f3560e01c80638da5cb5b11610087578063cbdcb9ac11610057578063cbdcb9ac146102bd578063ce59dd97146102dc578063e8c8488e146102fd578063f2fde38b1461031c575f5ffd5b80638da5cb5b146101f6578063b97110ab14610212578063bca9a5c514610244578063c31ee12e146102a9575f5ffd5b806365aade1a116100c257806365aade1a14610151578063715018a6146101935780637e3562d3146101a7578063893d20e8146101c6575f5ffd5b80630cee1725146100e85780633b76594d146101095780635406de721461011c575b5f5ffd5b3480156100f3575f5ffd5b50610107610102366004611097565b61033b565b005b610107610117366004611097565b61042b565b348015610127575f5ffd5b5061013b610136366004611097565b6105a8565b60405161014891906110ae565b60405180910390f35b34801561015c575f5ffd5b5061018561016b36600461116b565b6001600160a01b03165f9081526004602052604090205490565b604051908152602001610148565b34801561019e575f5ffd5b50610107610682565b3480156101b2575f5ffd5b506101076101c13660046111d3565b610695565b3480156101d1575f5ffd5b505f546001600160a01b03165b6040516001600160a01b039091168152602001610148565b348015610201575f5ffd5b505f546001600160a01b03166101de565b34801561021d575f5ffd5b507f00000000000000000000000000000000000000000000000000000000000000006101de565b34801561024f575f5ffd5b5061026361025e366004611097565b610803565b6040516101489190815181526020808301516001600160a01b03169082015260408083015190820152606080830151908201526080918201519181019190915260a00190565b3480156102b4575f5ffd5b5061018561088d565b3480156102c8575f5ffd5b506101076102d7366004611097565b610915565b3480156102e7575f5ffd5b506102f0610bac565b604051610148919061124c565b348015610308575f5ffd5b5061010761031736600461128c565b610c0c565b348015610327575f5ffd5b5061010761033636600461116b565b610de5565b610343610e27565b60405163a9059cbb60e01b8152336004820152602481018290525f907f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03169063a9059cbb906044016020604051808303815f875af11580156103af573d5f5f3e3d5ffd5b505050506040513d601f19601f820116820180604052508101906103d391906112ce565b9050806103f357604051633cc0d69d60e01b815260040160405180910390fd5b6040518281527f5b6b431d4476a211bb7d41c20d1aab9ae2321deee0d20be3d9fc9b1093fa6e3d906020015b60405180910390a15050565b610433610e27565b6040516323b872dd60e01b8152336004820152306024820152604481018290525f907f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316906323b872dd906064016020604051808303815f875af11580156104a5573d5f5f3e3d5ffd5b505050506040513d601f19601f820116820180604052508101906104c991906112ce565b9050806104e957604051633cc0d69d60e01b815260040160405180910390fd5b60405163095ea7b360e01b8152306004820152602481018390527f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03169063095ea7b3906044016020604051808303815f875af1158015610553573d5f5f3e3d5ffd5b505050506040513d601f19601f8201168201806040525081019061057791906112ce565b506040518281527fea9d44aea9d9b19064c11e8d92087621b04bda9bc740e82436a7cd583ffa7a909060200161041f565b604080518082018252606080825260208083018290525f858152600382528490208451815492830281018401865294850182815293949390928492849184018282801561061c57602002820191905f5260205f20905b81546001600160a01b031681526001909101906020018083116105fe575b505050505081526020016001820180548060200260200160405190810160405280929190818152602001828054801561067257602002820191905f5260205f20905b81548152602001906001019080831161065e575b5050505050815250509050919050565b61068a610e27565b6106935f610e53565b565b5f858152600260205260409020600101546001600160a01b031633146106ce57604051633db0664f60e11b815260040160405180910390fd5b8281146106ee576040516364b5d82f60e11b815260040160405180910390fd5b6106f88484610ea2565b6107028282610f58565b60405180604001604052808585808060200260200160405190810160405280939291908181526020018383602002808284375f9201919091525050509082525060408051602085810282810182019093528582529283019290918691869182918501908490808284375f9201829052509390945250508781526003602090815260409091208351805191935061079c928492910190610fe7565b5060208281015180516107b5926001850192019061104a565b50905050847f9084d589fe9b0f71dcf4558d1b3f1acfb807081d011098b2f12fc5c4ae44abdf858585856040516107ef94939291906112ed565b60405180910390a25050505050565b905090565b6108396040518060a001604052805f81526020015f6001600160a01b031681526020015f81526020015f81526020015f81525090565b505f90815260026020818152604092839020835160a0810185528154815260018201546001600160a01b03169281019290925291820154928101929092526003810154606083015260040154608082015290565b6040516370a0823160e01b81523060048201525f907f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316906370a0823190602401602060405180830381865afa1580156108f1573d5f5f3e3d5ffd5b505050506040513d601f19601f820116820180604052508101906107fe9190611367565b5f81815260026020526040902060018101546001600160a01b0316331461094f57604051633db0664f60e11b815260040160405180910390fd5b80600401548160030154610963919061137e565b42101561098357604051631ca3e93360e01b815260040160405180910390fd5b60028101546040516370a0823160e01b815230600482015281907f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316906370a0823190602401602060405180830381865afa1580156109ec573d5f5f3e3d5ffd5b505050506040513d601f19601f82011682018060405250810190610a109190611367565b1015610a2f576040516316e1bf4960e21b815260040160405180910390fd5b81600401548260030154610a43919061137e565b60038301556005546001830154604051630c985f2960e01b81526001600160a01b039182166004820152911690630c985f29906024015f604051808303815f87803b158015610a90575f5ffd5b505af1158015610aa2573d5f5f3e3d5ffd5b505060405163a9059cbb60e01b8152336004820152602481018490525f92507f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316915063a9059cbb906044016020604051808303815f875af1158015610b12573d5f5f3e3d5ffd5b505050506040513d601f19601f82011682018060405250810190610b3691906112ce565b905080610b5657604051633cc0d69d60e01b815260040160405180910390fd5b5f84815260036020526040908190209051339186917f9775bc462472ce0bcb115e35049f23c8b50bda7be5be5ab5335c0245086928e891610b9e9187919060018201906113a3565b60405180910390a350505050565b60606001805480602002602001604051908101604052809291908181526020018280548015610c0257602002820191905f5260205f20905b81546001600160a01b03168152600190910190602001808311610be4575b5050505050905090565b610c14610e27565b60055460405163171ee9f360e01b81526001600160a01b0386811660048301529091169063171ee9f390602401602060405180830381865afa158015610c5c573d5f5f3e3d5ffd5b505050506040513d601f19601f82011682018060405250810190610c8091906112ce565b15155f03610ca15760405163be2e735f60e01b815260040160405180910390fd5b610caa85610fbb565b6040805160a0810182528681526001600160a01b0386811660208084019182528385018881526060808601898152608087018981525f8e815260028087528a822099518a55965160018a0180546001600160a01b031916919099161790975592519487019490945592516003808701919091559051600490950194909455845180860184815292810186529182528451838152808201865282820152898352928352929020825180519192610d6492849290910190610fe7565b506020828101518051610d7d926001850192019061104a565b5050506001600160a01b0384165f81815260046020908152604091829020889055815186815290810185905290810183905286907f8b08a74e527ebd1ea42bde4b6dd733763719c38955a6416bcac806c93eab46869060600160405180910390a35050505050565b610ded610e27565b6001600160a01b038116610e1b57604051631e4fbdf760e01b81525f60048201526024015b60405180910390fd5b610e2481610e53565b50565b5f546001600160a01b031633146106935760405163118cdaa760e01b8152336004820152602401610e12565b5f80546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b60015481905f5b82811015610f51575f805b83811015610f295760018181548110610ecf57610ecf611438565b5f918252602090912001546001600160a01b0316878785818110610ef557610ef5611438565b9050602002016020810190610f0a919061116b565b6001600160a01b031603610f215760019150610f29565b600101610eb4565b5080610f485760405163fadf90a960e01b815260040160405180910390fd5b50600101610ea9565b5050505050565b805f805b82811015610f9257848482818110610f7657610f76611438565b9050602002013582610f88919061137e565b9150600101610f5c565b506064811115610fb557604051631bf5238560e21b815260040160405180910390fd5b50505050565b5f8181526002602052604090205415610e2457604051632053fdc360e21b815260040160405180910390fd5b828054828255905f5260205f2090810192821561103a579160200282015b8281111561103a57825182546001600160a01b0319166001600160a01b03909116178255602090920191600190910190611005565b50611046929150611083565b5090565b828054828255905f5260205f2090810192821561103a579160200282015b8281111561103a578251825591602001919060010190611068565b5b80821115611046575f8155600101611084565b5f602082840312156110a7575f5ffd5b5035919050565b602080825282516040838301528051606084018190525f929190910190829060808501905b808310156110fe5783516001600160a01b0316825260209384019360019390930192909101906110d3565b50602086810151868303601f1901604088015280518084529082019450910191505f905b808210156111455783518352602083019250602084019350600182019150611122565b509095945050505050565b80356001600160a01b0381168114611166575f5ffd5b919050565b5f6020828403121561117b575f5ffd5b61118482611150565b9392505050565b5f5f83601f84011261119b575f5ffd5b50813567ffffffffffffffff8111156111b2575f5ffd5b6020830191508360208260051b85010111156111cc575f5ffd5b9250929050565b5f5f5f5f5f606086880312156111e7575f5ffd5b85359450602086013567ffffffffffffffff811115611204575f5ffd5b6112108882890161118b565b909550935050604086013567ffffffffffffffff81111561122f575f5ffd5b61123b8882890161118b565b969995985093965092949392505050565b602080825282518282018190525f918401906040840190835b818110156111455783516001600160a01b0316835260209384019390920191600101611265565b5f5f5f5f5f60a086880312156112a0575f5ffd5b853594506112b060208701611150565b94979496505050506040830135926060810135926080909101359150565b5f602082840312156112de575f5ffd5b81518015158114611184575f5ffd5b604080825281018490525f8560608301825b8781101561132d576001600160a01b0361131884611150565b168252602092830192909101906001016112ff565b5083810360208501528481526001600160fb1b0385111561134c575f5ffd5b8460051b915081866020830137016020019695505050505050565b5f60208284031215611377575f5ffd5b5051919050565b8082018082111561139d57634e487b7160e01b5f52601160045260245ffd5b92915050565b5f6060820185835260606020840152808554808352608085019150865f5260205f2092505f5b818110156113f05783546001600160a01b03168352600193840193602090930192016113c9565b5050838103604085015284548082525f8681526020808220930193505b8181101561142b57825484526020909301926001928301920161140d565b5091979650505050505050565b634e487b7160e01b5f52603260045260245ffdfea2646970667358221220f847cd85ea2a3364d64ff3e62388f71173ec6758099201b24d2bd3d86202a19a64736f6c634300081c0033";

      const factory = new ethers.ContractFactory(
        contractABI,
        contractBytecode,
        signer
      );
      const contract = await factory.deploy(
        owner,
        [selectedToken],
        registryAddress
      );
      await contract.waitForDeployment();

      console.log("Contract deployed at:", await contract.getAddress());
      router.push("/boss/dashboard");
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
          🚀 Create Time-Based Payroll
        </h1>
        <p className="text-center text-gray-600 mb-10">
          Select the allowed tokens for your payroll swap.
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

        <div className="text-center">
          <button
            onClick={deployPayroll}
            disabled={!selectedToken || loading}
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

export default TimeBasedSetup;
