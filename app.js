let nusdContract;

document.addEventListener("DOMContentLoaded", async function () {
  // Check if Web3 is injected by the browser
  if (typeof web3 !== "undefined") {
    // Use the browser's web3 provider
    web3 = new Web3(window.ethereum);
    try {
      // Request account access if needed
      await window.ethereum.enable();
    } catch (error) {
      // User denied account access...
      console.error("User denied account access");
    }
  } else {
    // Set up a Web3 provider for the Goerli test network
    const providerUrl =
      "https://goerli.infura.io/v3/0b883ed5d65a425e9d94d6541e795edd";
    web3 = new Web3(new Web3.providers.HttpProvider(providerUrl));
  }

  // Contract address and ABI
  const contractAddress = "0x326C977E6efc84E512bB9C30f76E30c160eD06FB";
  const contractABI = [
    {
      inputs: [
        {
          internalType: "uint256",
          name: "ethAmount",
          type: "uint256",
        },
      ],
      name: "deposit",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_priceFeed",
          type: "address",
        },
      ],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "user",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      name: "Deposit",
      type: "event",
    },
    // ... Rest of the ABI ...
  ];

  // Initialize the contract instance
  nusdContract = new web3.eth.Contract(contractABI, contractAddress);

  // Get the total supply of nUSD
  try {
    const result = await nusdContract.methods.totalSupply().call();
    document.getElementById("totalSupply").textContent = result;
  } catch (error) {
    console.error(error);
  }
});

function deposit() {
  const ethAmount = document.getElementById("ethAmount").value;
  const weiAmount = web3.utils.toWei(ethAmount.toString(), "ether");

  // Deposit ETH and receive nUSD
  web3.eth.getAccounts(function (error, accounts) {
    if (error) {
      console.error(error);
    } else {
      const account = accounts[0];
      nusdContract.methods
        .deposit(weiAmount)
        .send({ from: account })
        .on("transactionHash", function (hash) {
          console.log("Transaction Hash:", hash);
        })
        .on("error", function (error) {
          console.error(error);
        });
    }
  });
}

function redeem() {
  const nusdAmount = document.getElementById("nusdAmount").value;
  const weiAmount = web3.utils.toWei(nusdAmount.toString(), "ether");

  // Redeem nUSD and receive ETH
  web3.eth.getAccounts(function (error, accounts) {
    if (error) {
      console.error(error);
    } else {
      const account = accounts[0];
      nusdContract.methods
        .redeem(weiAmount)
        .send({ from: account })
        .on("transactionHash", function (hash) {
          console.log("Transaction Hash:", hash);
        })
        .on("error", function (error) {
          console.error(error);
        });
    }
  });
}
