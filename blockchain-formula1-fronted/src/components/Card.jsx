import React from "react";
import { Card } from "@nextui-org/react";

const CardItem = (props) => {
  return (
    <div className="w-[6.5rem] m-2">
      <Card isPressable isHoverable variant="bordered">
        <div className="flex flex-col justify-center items-center min-h-[7.5rem]">
          <img className="h-[3.5rem]" src={props.image} alt="" />
          <h1 className="text-xs font-bold px-2 text-center my-2">
            {props.name}
          </h1>
        </div>
      </Card>
    </div>
  );
};

export default CardItem;
