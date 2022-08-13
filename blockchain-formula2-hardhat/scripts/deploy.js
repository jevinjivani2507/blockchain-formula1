const { ethers } = require("hardhat")

async function main() {
    let tx, txReceipt

    const [owner, player1, player2, player3, player4, player5] = await ethers.getSigners()
    const address = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9"
    const f1FantacyTeam = await (await ethers.getContractFactory("F1FantacyTeam")).attach(address)

    const [team1, team2, team3, team4, team5] = await getTeams()

    const f1FantacyTeam1 = f1FantacyTeam.connect(player1)
    tx = await f1FantacyTeam1.participate(team1, { value: ethers.utils.parseEther("0.01") })
    txReceipt = await tx.wait()

    const f1FantacyTeam2 = f1FantacyTeam.connect(player2)
    tx = await f1FantacyTeam2.participate(team2, { value: ethers.utils.parseEther("0.01") })
    txReceipt = await tx.wait()

    const f1FantacyTeam3 = f1FantacyTeam.connect(player3)
    tx = await f1FantacyTeam3.participate(team3, { value: ethers.utils.parseEther("0.01") })
    txReceipt = await tx.wait()

    const f1FantacyTeam5 = f1FantacyTeam.connect(player5)
    tx = await f1FantacyTeam5.participate(team5, { value: ethers.utils.parseEther("0.01") })
    txReceipt = await tx.wait()

    // const teams = await f1FantacyTeam.getParticipants()

    // console.log(teams)
}

const getTeams = async () => {
    const [owner, player1, player2, player3, player4, player5] = await ethers.getSigners()

    const mapping = {
        ALB: 14,
        ALO: 14,
        BOT: 77,
        GAS: 10,
        HAM: 44,
        HUL: 27,
        LAT: 6,
        LEC: 16,
        MAG: 20,
        NOR: 4,
        OCO: 31,
        PER: 11,
        RIC: 3,
        RUS: 63,
        SAI: 55,
        MSC: 47,
        STR: 18,
        TSU: 22,
        VER: 33,
        VET: 5,
        ZHO: 24,
    }

    const team1 = {
        name: "F1FantacyTeam1",
        player: player1.address,
        d1: mapping.ALB,
        d2: mapping.BOT,
        d3: mapping.MAG,
        d4: mapping.NOR,
        d5: mapping.OCO,
        team: "mclaren",
        captain: mapping.BOT,
    }

    const team2 = {
        name: "F1FantacyTeam2",
        player: player2.address,
        d1: mapping.ALB,
        d2: mapping.BOT,
        d3: mapping.MAG,
        d4: mapping.VET,
        d5: mapping.RIC,
        team: "ferrari",
        captain: mapping.BOT,
    }

    const team3 = {
        name: "F1FantacyTeam3",
        player: player3.address,
        d1: mapping.ZHO,
        d2: mapping.SAI,
        d3: mapping.MAG,
        d4: mapping.VET,
        d5: mapping.RIC,
        team: "mercedes",
        captain: mapping.SAI,
    }

    const team4 = {
        name: "F1FantacyTeam4",
        player: player4.address,
        d1: mapping.RUS,
        d2: mapping.STR,
        d3: mapping.OCO,
        d4: mapping.ZHO,
        d5: mapping.ALB,
        team: "red_bull",
        captain: mapping.RUS,
    }

    const team5 = {
        name: "F1FantacyTeam5",
        player: player5.address,
        d1: mapping.HAM,
        d2: mapping.PER,
        d3: mapping.LAT,
        d4: mapping.TSU,
        d5: mapping.VET,
        team: "aston_martin",
        captain: mapping.PER,
    }

    return [team1, team2, team3, team4, team5]
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
