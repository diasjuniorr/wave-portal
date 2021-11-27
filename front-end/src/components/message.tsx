import React, { FC } from "react";

interface MessageProps {
    wave: {
        from: string;
        timestamp: Date | number;
        message: string;
    }
}

const Message: FC<MessageProps> = ({ wave }) => {
  return (
    <>
      <div>Address: {wave.from}</div>
      <div>Time: {wave.timestamp.toString()}</div>
      <div>Message: {wave.message}</div>
    </>
  );
};

export default Message;
