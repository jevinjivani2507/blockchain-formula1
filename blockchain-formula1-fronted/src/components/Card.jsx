import React from 'react';

const Card = (props) => {
  return (
    <div className="h-[15vh] w-[13vh] bg-white mx-3 rounded-lg mb-5">
      <div className="flex flex-col justify-center items-center p-2">
        <img className="h-[7vh]" src={props.image} alt="" />
        <h1 className="text-xs font-bold px-2 text-center my-2">{props.name}</h1>
      </div>
    </div>
  )
}

export default Card;