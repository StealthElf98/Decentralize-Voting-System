import { ethers } from 'ethers'

const contractAddress = "YOUR_CONTRACT_ADDRESS"
const contractABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_lastname",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_party",
        "type": "string"
      }
    ],
    "name": "addCandidate",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "admin",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "endElection",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAllCandidates",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "lastname",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "party",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "votes",
            "type": "uint256"
          }
        ],
        "internalType": "struct Voting.Candidate[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getDates",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "listOfCandidates",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "lastname",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "party",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "votes",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "listOfVoters",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "resetAllVoters",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_startDate",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_endDate",
        "type": "uint256"
      }
    ],
    "name": "startElection",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_id",
        "type": "uint256"
      }
    ],
    "name": "vote",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_voter_address",
        "type": "address"
      }
    ],
    "name": "voterStatus",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "voters",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]

async function getProviderAndSigner() {
    // Request access to the user's MetaMask account
    await window.ethereum.request({ method: 'eth_requestAccounts' })

    // Create a provider and signer
    const provider = new ethers.BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()

    return { provider, signer }
}

export async function startElection(startTime, endTime) {
    try {
        const { signer } = await getProviderAndSigner()
        const contract = new ethers.Contract(contractAddress, contractABI, signer)

        const tx = await contract.startElection(startTime, endTime)
        await tx.wait()
        console.log('Election started successfully!')
    } catch (error) {
        console.error('Error starting the election:', error)
        alert("INTERNAL ERROR: Pleas try again.")
    }
}

export async function endElection() {
  try {
      const { signer } = await getProviderAndSigner()
      const contract = new ethers.Contract(contractAddress, contractABI, signer)

      const tx = await contract.endElection()
      await tx.wait()
      console.log('Election ended successfully!')
  } catch (error) {
      console.error('Error ending the election:', error)
  }
}

export async function addCandidate(name, lastname, party) {
    try {
        const { signer } = await getProviderAndSigner()
        const contract = new ethers.Contract(contractAddress, contractABI, signer)

        const tx = await contract.addCandidate(name, lastname, party)
        await tx.wait()
        console.log('Candidate added successfully!')
    } catch (error) {
        console.error('Error adding candidate:', error)
        alert("INTERNAL ERROR: Pleas try again.")
    }
}

export const getAllCandidates = async () => {
  try {
    const { signer } = await getProviderAndSigner()
    const contract = new ethers.Contract(contractAddress, contractABI, signer)

    const candidates = await contract.getAllCandidates()
    console.log(candidates)
    // Each candidate is returned as an array of struct data
    const formattedCandidates = candidates.map((candidate) => ({
      id: candidate[0],
      name: candidate[1],
      lastName: candidate[2],
      party: candidate[3],
      votes: candidate[4]
    }))

    return formattedCandidates
  } catch (error) {
    console.error('Error fetching candidates:', error)
    return []
  }
}

export const getElectionDates = async () => {
  try {
      const { signer } = await getProviderAndSigner()
      const contract = new ethers.Contract(contractAddress, contractABI, signer)

      const dates = await contract.getDates()
      const startTime = parseInt(dates[0].toString(), 10)
      const endTime = parseInt(dates[1].toString(), 10)
      return { startTime, endTime }
  } catch (error) {
      console.error("Error fetching election dates:", error)
      return null
  }
}

export const vote = async (candidateId) => {
  try {
    // Check if the browser has MetaMask
    if (window.ethereum) {
      const { signer } = await getProviderAndSigner()
      const contract = new ethers.Contract(contractAddress, contractABI, signer)
      
      const tx = await contract.vote(candidateId);

      await tx.wait();
      console.log(`Successfully voted for candidate with ID: ${candidateId}`);
    } else {
      console.error("MetaMask is not installed!");
      alert("INTERNAL ERRRO: Please try again!")
    }
  } catch (error) {
    console.error("Error while voting:", error);
    alert("ERROR: You already voted!")
  }
};