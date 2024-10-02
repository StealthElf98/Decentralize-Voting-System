const hre = require("hardhat")

async function main() {
    const votingContract = await hre.ethers.getContractFactory("Voting")
    const deployedVotingContract = await votingContract.deploy()

    console.log(deployedVotingContract.target)
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
<<<<<<< HEAD
})
=======
})
>>>>>>> 6357a20f3502d54b85c753a03c3db4dd71937904
