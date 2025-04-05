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

const CustomLogicSetup: React.FC = () => {
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
              name: "logicContract",
              type: "address",
              internalType: "address",
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
              internalType: "struct CustomLogicPayroll.Employee",
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
                  name: "logicContract",
                  type: "address",
                  internalType: "address",
                },
              ],
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
              name: "logicContract",
              type: "address",
              indexed: false,
              internalType: "address",
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
        "0x60a0604052733c499c542cef5e3811e1192ce70d8cc03d5c3359608052348015610027575f5ffd5b506040516112c83803806112c8833981016040819052610046916101af565b826001600160a01b03811661007457604051631e4fbdf760e01b81525f600482015260240160405180910390fd5b61007d816100ba565b508151610091906001906020850190610109565b50600580546001600160a01b0319166001600160a01b03929092169190911790555061029b9050565b5f80546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b828054828255905f5260205f2090810192821561015c579160200282015b8281111561015c57825182546001600160a01b0319166001600160a01b03909116178255602090920191600190910190610127565b5061016892915061016c565b5090565b5b80821115610168575f815560010161016d565b80516001600160a01b0381168114610196575f5ffd5b919050565b634e487b7160e01b5f52604160045260245ffd5b5f5f5f606084860312156101c1575f5ffd5b6101ca84610180565b60208501519093506001600160401b038111156101e5575f5ffd5b8401601f810186136101f5575f5ffd5b80516001600160401b0381111561020e5761020e61019b565b604051600582901b90603f8201601f191681016001600160401b038111828210171561023c5761023c61019b565b604052918252602081840181019290810189841115610259575f5ffd5b6020850194505b8385101561027f5761027185610180565b815260209485019401610260565b5094506102929250505060408501610180565b90509250925092565b608051610ff96102cf5f395f818161024101528181610337015281816103e50152818161075301526108500152610ff95ff3fe608060405260043610610084575f3560e01c80638da5cb5b116100575780638da5cb5b146100ef578063bca9a5c51461011a578063cbdcb9ac146101be578063f2fde38b146101dd578063fa7159e5146101fc575f5ffd5b80630cee1725146100885780633b76594d146100a9578063715018a6146100bc5780637e3562d3146100d0575b5f5ffd5b348015610093575f5ffd5b506100a76100a2366004610d8e565b61021b565b005b6100a76100b7366004610d8e565b61030b565b3480156100c7575f5ffd5b506100a7610488565b3480156100db575f5ffd5b506100a76100ea366004610ded565b61049b565b3480156100fa575f5ffd5b505f546040516001600160a01b0390911681526020015b60405180910390f35b348015610125575f5ffd5b5061018b610134366004610d8e565b60408051606080820183525f8083526020808401829052928401819052938452600280835293839020835191820184528054825260018101546001600160a01b039081169383019390935290930154169082015290565b60408051825181526020808401516001600160a01b03908116918301919091529282015190921690820152606001610111565b3480156101c9575f5ffd5b506100a76101d8366004610d8e565b610604565b3480156101e8575f5ffd5b506100a76101f7366004610e81565b610921565b348015610207575f5ffd5b506100a7610216366004610ea1565b610963565b610223610b1e565b60405163a9059cbb60e01b8152336004820152602481018290525f907f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03169063a9059cbb906044016020604051808303815f875af115801561028f573d5f5f3e3d5ffd5b505050506040513d601f19601f820116820180604052508101906102b39190610eda565b9050806102d357604051633cc0d69d60e01b815260040160405180910390fd5b6040518281527f5b6b431d4476a211bb7d41c20d1aab9ae2321deee0d20be3d9fc9b1093fa6e3d906020015b60405180910390a15050565b610313610b1e565b6040516323b872dd60e01b8152336004820152306024820152604481018290525f907f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316906323b872dd906064016020604051808303815f875af1158015610385573d5f5f3e3d5ffd5b505050506040513d601f19601f820116820180604052508101906103a99190610eda565b9050806103c957604051633cc0d69d60e01b815260040160405180910390fd5b60405163095ea7b360e01b8152306004820152602481018390527f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03169063095ea7b3906044016020604051808303815f875af1158015610433573d5f5f3e3d5ffd5b505050506040513d601f19601f820116820180604052508101906104579190610eda565b506040518281527fea9d44aea9d9b19064c11e8d92087621b04bda9bc740e82436a7cd583ffa7a90906020016102ff565b610490610b1e565b6104995f610b4a565b565b5f858152600260205260409020600101546001600160a01b031633146104d457604051633db0664f60e11b815260040160405180910390fd5b8281146104f4576040516364b5d82f60e11b815260040160405180910390fd5b6104fe8484610b99565b6105088282610c4f565b60405180604001604052808585808060200260200160405190810160405280939291908181526020018383602002808284375f9201919091525050509082525060408051602085810282810182019093528582529283019290918691869182918501908490808284375f920182905250939094525050878152600360209081526040909120835180519193506105a2928492910190610cde565b5060208281015180516105bb9260018501920190610d41565b50905050847f9084d589fe9b0f71dcf4558d1b3f1acfb807081d011098b2f12fc5c4ae44abdf858585856040516105f59493929190610ef9565b60405180910390a25050505050565b5f81815260026020526040902060018101546001600160a01b0316331461063e57604051633db0664f60e11b815260040160405180910390fd5b60028101546040516312facea960e21b81523360048201526001600160a01b03909116908190634beb3aa490602401602060405180830381865afa158015610688573d5f5f3e3d5ffd5b505050506040513d601f19601f820116820180604052508101906106ac9190610eda565b6106c957604051631ca3e93360e01b815260040160405180910390fd5b604051634167194f60e01b81523360048201525f906001600160a01b03831690634167194f90602401602060405180830381865afa15801561070d573d5f5f3e3d5ffd5b505050506040513d601f19601f820116820180604052508101906107319190610f73565b6040516370a0823160e01b815230600482015290915081906001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016906370a0823190602401602060405180830381865afa158015610798573d5f5f3e3d5ffd5b505050506040513d601f19601f820116820180604052508101906107bc9190610f73565b10156107db576040516316e1bf4960e21b815260040160405180910390fd5b600554604051630c985f2960e01b81523360048201526001600160a01b0390911690630c985f29906024015f604051808303815f87803b15801561081d575f5ffd5b505af115801561082f573d5f5f3e3d5ffd5b505060405163a9059cbb60e01b8152336004820152602481018490525f92507f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316915063a9059cbb906044016020604051808303815f875af115801561089f573d5f5f3e3d5ffd5b505050506040513d601f19601f820116820180604052508101906108c39190610eda565b9050806108e357604051633cc0d69d60e01b815260040160405180910390fd5b604051828152339086907ff047ae97d6e77b909438ee0321b4cfd287bf5633f353d878e3ae78ebff0b8bc39060200160405180910390a35050505050565b610929610b1e565b6001600160a01b03811661095757604051631e4fbdf760e01b81525f60048201526024015b60405180910390fd5b61096081610b4a565b50565b61096b610b1e565b60055460405163171ee9f360e01b81526001600160a01b0384811660048301529091169063171ee9f390602401602060405180830381865afa1580156109b3573d5f5f3e3d5ffd5b505050506040513d601f19601f820116820180604052508101906109d79190610eda565b15155f036109f85760405163be2e735f60e01b815260040160405180910390fd5b610a0183610cb2565b60408051606080820183528582526001600160a01b0385811660208085019182528683168587019081525f8a815260028084528882209751885593516001880180549187166001600160a01b03199283161790559151969093018054969094169516949094179091558351808501828152928101855291825283518181528084018552828401528681526003835292909220825180519192610aa892849290910190610cde565b506020828101518051610ac19260018501920190610d41565b5050506001600160a01b038281165f8181526004602090815260409182902087905590519284168352909185917fb7284edb2f77ce4d26f5713bdb2754d0a51d9f3d9d8a24555ea38d3abcc36d6c910160405180910390a3505050565b5f546001600160a01b031633146104995760405163118cdaa760e01b815233600482015260240161094e565b5f80546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b60015481905f5b82811015610c48575f805b83811015610c205760018181548110610bc657610bc6610f8a565b5f918252602090912001546001600160a01b0316878785818110610bec57610bec610f8a565b9050602002016020810190610c019190610e81565b6001600160a01b031603610c185760019150610c20565b600101610bab565b5080610c3f5760405163fadf90a960e01b815260040160405180910390fd5b50600101610ba0565b5050505050565b805f805b82811015610c8957848482818110610c6d57610c6d610f8a565b9050602002013582610c7f9190610f9e565b9150600101610c53565b506064811115610cac57604051631bf5238560e21b815260040160405180910390fd5b50505050565b5f818152600260205260409020541561096057604051632053fdc360e21b815260040160405180910390fd5b828054828255905f5260205f20908101928215610d31579160200282015b82811115610d3157825182546001600160a01b0319166001600160a01b03909116178255602090920191600190910190610cfc565b50610d3d929150610d7a565b5090565b828054828255905f5260205f20908101928215610d31579160200282015b82811115610d31578251825591602001919060010190610d5f565b5b80821115610d3d575f8155600101610d7b565b5f60208284031215610d9e575f5ffd5b5035919050565b5f5f83601f840112610db5575f5ffd5b50813567ffffffffffffffff811115610dcc575f5ffd5b6020830191508360208260051b8501011115610de6575f5ffd5b9250929050565b5f5f5f5f5f60608688031215610e01575f5ffd5b85359450602086013567ffffffffffffffff811115610e1e575f5ffd5b610e2a88828901610da5565b909550935050604086013567ffffffffffffffff811115610e49575f5ffd5b610e5588828901610da5565b969995985093965092949392505050565b80356001600160a01b0381168114610e7c575f5ffd5b919050565b5f60208284031215610e91575f5ffd5b610e9a82610e66565b9392505050565b5f5f5f60608486031215610eb3575f5ffd5b83359250610ec360208501610e66565b9150610ed160408501610e66565b90509250925092565b5f60208284031215610eea575f5ffd5b81518015158114610e9a575f5ffd5b604080825281018490525f8560608301825b87811015610f39576001600160a01b03610f2484610e66565b16825260209283019290910190600101610f0b565b5083810360208501528481526001600160fb1b03851115610f58575f5ffd5b8460051b915081866020830137016020019695505050505050565b5f60208284031215610f83575f5ffd5b5051919050565b634e487b7160e01b5f52603260045260245ffd5b80820180821115610fbd57634e487b7160e01b5f52601160045260245ffd5b9291505056fea264697066735822122039475157c32033f34fce9dfc1b0619f01f77c314553b9b9e8e3b970b69d609b064736f6c634300081c0033";

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
      router.push("custom-dashboard");
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
          🚀 Create Custom Logic Payroll
        </h1>
        <p className="text-center text-gray-600 mb-10">
          Select the allowed tokens for your payroll swap and deploy the custom
          payroll logic contract.
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

export default CustomLogicSetup;
