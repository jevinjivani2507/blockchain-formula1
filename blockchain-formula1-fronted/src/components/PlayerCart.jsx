import React, { useState, useEffect } from "react";
import PlayerInfo from "./PlayerInfo";
import ConstructorInfo from "./ConstructorInfo";
import { useDispatch, useSelector } from "react-redux";
import fetchProducts from "../utilities/api";
import Card from "./Card";
import { ethers } from "ethers";
import { Progress, Button, Modal, Input } from "@nextui-org/react";
import F1FantacyTeam from "../contracts/F1FantacyTeam.json";
import config from "../config";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";

const PlayerCart = () => {
  //metamask config
  const [isConnected, setIsConnected] = useState(false);
  const [hasMetamask, setHasMetamask] = useState(false);
  const [signer, setSigner] = useState(undefined);

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      setHasMetamask(true);
    }
  });

  async function connect() {
    if (typeof window.ethereum !== "undefined") {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        setIsConnected(true);
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setSigner(provider.getSigner());
      } catch (e) {
        console.log(e);
      }
    } else {
      setIsConnected(false);
    }
  }

  const dispatch = useDispatch();
  const playersList = useSelector((state) => state.cart.playersList);
  const selectdPlayers = useSelector((state) => state.cart.selectdPlayers);
  const selectdConstructor = useSelector(
    (state) => state.cart.selectdConstructor
  );
  const totalPoints = useSelector((state) => state.cart.totalPoints);
  const constructorList = useSelector((state) => state.cart.constructorList);

  const [displayList, setDisplayList] = useState("players");

  const changeToPlayers = () => {
    setDisplayList("players");
  };

  const changeToConstructors = () => {
    setDisplayList("constructors");
  };

  const submitTeam = async () => {
    let team = {};

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();

    const f1FantacyTeam = new ethers.Contract(
      config.CONTRACT_ADDRESS,
      F1FantacyTeam.abi,
      signer
    );

    const joiningFees = await f1FantacyTeam.JOININGFEES();

    team.d1 = selectdPlayers[0].id;
    team.d2 = selectdPlayers[1].id;
    team.d3 = selectdPlayers[2].id;
    team.d4 = selectdPlayers[3].id;
    team.d5 = selectdPlayers[4].id;
    team.captain = selectdPlayers[0].id;
    team.team = selectdConstructor[0].id;
    team.name = "F1FantacyTeam1";
    team.player = (await provider.listAccounts())[0];

    const transaction = await f1FantacyTeam.participate(team, {
      value: joiningFees,
    });
    console.log(transaction.wait(1));
    const transactionReceipt = await transaction.wait(1);
    const player = transactionReceipt.events[0].args.player;
    const fantacyTeam = transactionReceipt.events[0].args.fantacyTeam;

    console.log("Player : ", player);
    // console.log(fantacyTeam);
  };

  const [teamName, setTeamName] = useState("Team Name");
  const [editName, setEditName] = useState(false);

  const changeName = () => {
    setEditName(!editName);
  };

  useEffect(() => {
    fetchProducts(dispatch);
  }, []);

  return (
    <div className="flex p-10 gap-10 h-[92vh]">
      <div className="w-8/12 bg-white overflow-scroll scrollbar-hide rounded-3xl">
        <div className="top-0 sticky h-40 mb-2">
          <header className="h-[70%] bg-gray-300 rounded-t-[28px] p-5 flex flex-col items-center justify-center">
            <div className="">
              <h6 className="text-2xl font-bold">{1000 - totalPoints}/1000</h6>
            </div>
            <Progress value={totalPoints / 10} color="primary" />
            
          </header>
          <div className="flex justify-center h-[30%] bg-gray-200 items-center">
            <Button.Group size="sm">
              <Button onClick={changeToPlayers}>Players</Button>
              <Button onClick={changeToConstructors}>Constructors</Button>
            </Button.Group>
          </div>
        </div>
        <div className="">
          {displayList === "players"
            ? playersList.map((player) => (
                <PlayerInfo
                  key={player.permanentNumber}
                  id={player.permanentNumber}
                  name={player.givenName + " " + player.familyName}
                  image={player.image}
                  code={player.code}
                  price={player.price}
                  color={player.color}
                />
              ))
            : constructorList.map((constructor) => (
                <ConstructorInfo
                  key={constructor.constructorId}
                  id={constructor.constructorId}
                  image={constructor.image}
                  price={constructor.price}
                  name={constructor.name}
                />
              ))}
        </div>
      </div>

      <div className="w-4/12 bg-primary rounded-3xl p-10">
        <div className="flex justify-center">
          <h1 className="text-white text-2xl">
            {editName ? (
              <Input animated={false} initialValue={teamName} color="error" />
            ) : (
              teamName
            )}
            <FontAwesomeIcon
              icon={faPenToSquare}
              className="ml-2"
              onClick={changeName}
            />
          </h1>
        </div>
        <div>
          <div className="flex justify-center flex-wrap">
            {selectdPlayers.map((player) => (
              <Card
                key={player.permanentNumber}
                id={player.permanentNumber}
                name={player.name}
                image={player.image}
                code={player.code}
                price={player.price}
                color={player.color}
              />
            ))}
          </div>
          <div className="flex justify-center flex-wrap">
            {selectdConstructor.map((constructor) => (
              <Card
                key={constructor.permanentNumber}
                id={constructor.permanentNumber}
                name={constructor.name}
                image={constructor.image}
                code={constructor.code}
                price={constructor.price}
                color={constructor.color}
              />
            ))}
          </div>
          <div className="flex justify-center mt-8">
            {selectdPlayers.length + selectdConstructor.length === 6 && (
              <Button light color="secondary" onPress={submitTeam}>
                Submit
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerCart;
