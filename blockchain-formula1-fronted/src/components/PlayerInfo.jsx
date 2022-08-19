import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { ADD_TO_CART, REMOVE_FROM_CART } from "../Redux/ActionTypes";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PlayerInfo = (props) => {
  const dispatch = useDispatch();
  const selectdPlayers = useSelector((state) => state.cart.selectdPlayers);
  const totalPoints = useSelector((state) => state.cart.totalPoints);

  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    selectdPlayers.forEach((player) => {
      if (player.id === props.id) {
        setIsAdded(true);
      }
    });
  }, [selectdPlayers]);

  // props.id === selectdPlayers.id ? (setIsAdded(true)) : (setIsAdded(false));

  const fivePlayers = () => toast.error("You can't add more then 5 Players!");
  const maximumLimit = () => toast.error("Maximum Limit Exceeded!");

  const addPlayer = (e) => {
    e.preventDefault();
    if (!isAdded) {
      // console.log(props);
      if (selectdPlayers.length + 1 <= 5) {
        if (totalPoints + props.price < 1000) {
          dispatch({ type: ADD_TO_CART, payload: props });
          setIsAdded(!isAdded);
        } else {
          maximumLimit();
        }
      } else {
        fivePlayers();
      }
    } else {
      // console.log("Yay, I got clicked");
      dispatch({ type: REMOVE_FROM_CART, payload: props });
      setIsAdded(!isAdded);
    }
  };

  useEffect(() => {
    // console.log(selectdPlayers);
    // console.log(totalPoints);
  }, [selectdPlayers]);

  return (
    <div className="flex items-center">
      <div className="flex px-6 py-5 w-full rounded-md my-1 mx-2 justify-between">
        <div className="flex items-center">
          <img className="h-10 w-[5vh]" src={props.image} alt="" />

          <div className="mx-2">
            <div className="flex justify-center font-bold text-xs px-1 bg-gray-100 rounded-md">
              DR
            </div>
            <div
              className={`font-bold text-xs px-1 mt-1 ${props.color} rounded-md`}
            >
              {props.code}
            </div>
          </div>
          <div className="text-xl font-bold">{props.name}</div>
        </div>
        <div className="flex items-center">
          <div className="text-md font-bold mx-2">{props.price} PT.</div>
          <button
            className={
              isAdded
                ? "bg-primary py-2 px-3 rounded-2xl text-white"
                : "bg-gray-100 py-2 px-3 rounded-2xl text-gray-600"
            }
            onClick={addPlayer}
          >
            <FontAwesomeIcon
              className={isAdded ? "h-4 px-[2px]" : ""}
              icon={isAdded ? faXmark : faPlus}
            />
          </button>
        </div>
      </div>
      <ToastContainer
        position="bottom-right"
        theme="dark"
        type="error"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default PlayerInfo;
