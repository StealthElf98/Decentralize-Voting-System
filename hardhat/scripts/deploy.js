const hre = require("hardhat")

async function main() {
    const votingContract = await hre.ethers.getContractFactory("Voting")
    const deployedVotingContract = await votingContract.deploy()

    console.log(deployedVotingContract.target)
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})

// Contract address: 0xA1057e079Db3e9afA5c1CDe2dFCa3e783627E3D7
// https://amoy.polygonscan.com/address/0xA1057e079Db3e9afA5c1CDe2dFCa3e783627E3D7#code