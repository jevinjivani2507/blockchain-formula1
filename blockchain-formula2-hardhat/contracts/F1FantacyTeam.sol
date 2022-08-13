// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./PlayersLibrary.sol";
import "hardhat/console.sol";

error F1FantacyTeam__InSufficientFund();
error F1FantacyTeam__InvalidTeam();
error F1FantacyTeam__TimelimitExceeded();
error F1FantacyTeam__PrizeDistributionFailed();

/**
 * @title The APIConsumer contract
 * @notice An API Consumer contract that makes GET requests to obtain 24h trading volume of ETH in USD
 */
contract F1FantacyTeam is ChainlinkClient {
    using Chainlink for Chainlink.Request;

    uint256 public constant JOININGFEES = 0.05 ether;
    uint32 public constant TOTALPOINTS = 1000;

    struct Winners {
        FantacyTeam winner1;
        FantacyTeam winner2;
        FantacyTeam winner3;
    }

    struct FantacyTeam {
        string name;
        address player;
        uint8 d1;
        uint8 d2;
        uint8 d3;
        uint8 d4;
        uint8 d5;
        string team;
        uint8 captain;
    }

    mapping(uint8 => uint32) public player2cost;
    mapping(string => uint32) public constructor2cost;

    address public immutable oracle;
    bytes32 public immutable jobId;
    uint256 public immutable fee;

    address public first;
    address public second;
    address public third;

    uint32 public immutable raceStartTime;

    address[] public players;
    FantacyTeam[] public teams;
    mapping(address => FantacyTeam) public player2Team;

    event DataFullfilled(uint256 volume);
    event PlayerParticipated(address player, FantacyTeam fantacyTeam);
    event winnerAnnouncement(FantacyTeam winner1, FantacyTeam winner2, FantacyTeam winner3);
    event PrizeDistributed(
        FantacyTeam winner1,
        FantacyTeam winner2,
        FantacyTeam winner3,
        uint256 amount1,
        uint256 amount2,
        uint256 amount3
    );

    Winners public winners;

    /**
     * @notice Executes once when a contract is created to initialize state variables
     *
     * @param _oracle - address of the specific Chainlink node that a contract makes an API call from
     * @param _jobId - specific job for :_oracle: to run; each job is unique and returns different types of data
     * @param _fee - node operator price per API call / data request
     * @param _link - LINK token address on the corresponding network
     *
     * Network: Rinkeby
     * Oracle: 0xc57b33452b4f7bb189bb5afae9cc4aba1f7a4fd8
     * Job ID: 6b88e0402e5d415eb946e528b8e0c7ba
     * Fee: 0.1 LINK
     */
    constructor(
        address _oracle,
        bytes32 _jobId,
        uint256 _fee,
        address _link
    ) {
        if (_link == address(0)) {
            setPublicChainlinkToken();
        } else {
            setChainlinkToken(_link);
        }
        oracle = _oracle;
        jobId = _jobId;
        fee = _fee;

        raceStartTime = 1661608800; // 14th August 2021 @ 02:00pm (UTC) , Qualifying Round StartTime

        // Initialize players and constructor cost
        _initializePlayersCost();
    }

    function participate(FantacyTeam memory _fantacyTeam) public payable {
        if (msg.value < JOININGFEES) {
            revert F1FantacyTeam__InSufficientFund();
        }
        if (
            (player2cost[_fantacyTeam.d1] +
                player2cost[_fantacyTeam.d2] +
                player2cost[_fantacyTeam.d3] +
                player2cost[_fantacyTeam.d4] +
                player2cost[_fantacyTeam.d5] +
                constructor2cost[_fantacyTeam.team]) > TOTALPOINTS
        ) {
            revert F1FantacyTeam__InvalidTeam();
        }
        if (block.timestamp > raceStartTime) {
            revert F1FantacyTeam__TimelimitExceeded();
        }

        players.push(_fantacyTeam.player);
        player2Team[_fantacyTeam.player] = _fantacyTeam;
        teams.push(_fantacyTeam);

        emit PlayerParticipated(_fantacyTeam.player, _fantacyTeam);
    }

    function requestData() public returns (bytes32 requestId) {}

    /**
     * @notice Creates a Chainlink request to retrieve API response, find the target
     * data, then multiply by 1000000000000000000 (to remove decimal places from data).
     *
     * @return requestId - id of the request
     */
    function requestWinners() public returns (bytes32 requestId) {
        Chainlink.Request memory request = buildChainlinkRequest(
            jobId,
            address(this),
            this.fulfill.selector
        );

        request.add("address", Strings.toHexString(uint256(uint160(address(this))), 20));

        // Sends the request
        return sendChainlinkRequestTo(oracle, request, fee);
    }

    /**
     * @notice Receives the response in the form of uint256
     *
     * @param _requestId - id of the request
     * @param _first - address of the first place winner
     * @param _second - address of the second place winner
     * @param _third - address of the third place winner
     */
    function fulfill(
        bytes32 _requestId,
        address _first,
        address _second,
        address _third,
        bool status
    ) public recordChainlinkFulfillment(_requestId) {
        if (status) {
            winners.winner1 = player2Team[_first];
            winners.winner2 = player2Team[_second];
            winners.winner3 = player2Team[_third];

            first = _first;
            second = _second;
            third = _third;

            emit winnerAnnouncement(player2Team[_first], player2Team[_second], player2Team[_third]);

            _distributePrizes();
        }
    }

    function _distributePrizes() public {
        uint256 amt1 = address(this).balance / 2;
        (bool status1, ) = payable(winners.winner1.player).call{value: amt1}("");

        uint256 amt2 = (address(this).balance / 10) * 6;
        (bool status2, ) = payable(winners.winner2.player).call{value: amt2}("");

        uint256 amt3 = address(this).balance;
        (bool status3, ) = payable(winners.winner3.player).call{value: amt3}("");

        if (status1 && status2 && status3) {
            emit PrizeDistributed(
                winners.winner1,
                winners.winner2,
                winners.winner3,
                amt1,
                amt2,
                amt3
            );
        } else {
            revert F1FantacyTeam__PrizeDistributionFailed();
        }
    }

    //Utils
    function getParticipants() public view returns (FantacyTeam[] memory) {
        return teams;
    }

    function getTeams() public view returns (FantacyTeam[] memory) {
        return teams;
    }

    function getTeam(address player) public view returns (FantacyTeam memory) {
        return player2Team[player];
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function _initializePlayersCost() internal {
        player2cost[PlayersLibrary.ALB] = 75;
        player2cost[PlayersLibrary.ALO] = 126;
        player2cost[PlayersLibrary.BOT] = 97;
        player2cost[PlayersLibrary.GAS] = 129;
        player2cost[PlayersLibrary.HAM] = 188;
        player2cost[PlayersLibrary.LAT] = 67;
        player2cost[PlayersLibrary.LEC] = 301;
        player2cost[PlayersLibrary.MAG] = 61;
        player2cost[PlayersLibrary.NOR] = 159;
        player2cost[PlayersLibrary.OCO] = 123;
        player2cost[PlayersLibrary.PER] = 183;
        player2cost[PlayersLibrary.RIC] = 135;
        player2cost[PlayersLibrary.RUS] = 244;
        player2cost[PlayersLibrary.SAI] = 173;
        player2cost[PlayersLibrary.MSC] = 62;
        player2cost[PlayersLibrary.STR] = 92;
        player2cost[PlayersLibrary.TSU] = 83;
        player2cost[PlayersLibrary.VER] = 305;
        player2cost[PlayersLibrary.VET] = 114;
        player2cost[PlayersLibrary.ZHO] = 82;

        constructor2cost[PlayersLibrary.ALF] = 101;
        constructor2cost[PlayersLibrary.ALT] = 63;
        constructor2cost[PlayersLibrary.ALP] = 140;
        constructor2cost[PlayersLibrary.AST] = 110;
        constructor2cost[PlayersLibrary.FER] = 258;
        constructor2cost[PlayersLibrary.HAA] = 85;
        constructor2cost[PlayersLibrary.MCL] = 175;
        constructor2cost[PlayersLibrary.MER] = 337;
        constructor2cost[PlayersLibrary.RED] = 337;
        constructor2cost[PlayersLibrary.WIL] = 71;
    }

    /**
     * @notice Witdraws LINK from the contract
     * @dev Implement a withdraw function to avoid locking your LINK in the contract
     */
    function withdrawLink() external {
        LinkTokenInterface link = LinkTokenInterface(0x01BE23585060835E02B77ef475b0Cc51aA1e0709);
        require(link.transfer(msg.sender, link.balanceOf(address(this))), "Unable to transfer");
    }
}
