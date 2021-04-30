import React from 'react';

export const Main: React.FC<{}> = () => {
  console.log('ImgProc 🖼️');

  return (
    <div id="main">
      <img
        className="image-before"
        src="https://images.unsplash.com/photo-1619665760845-d009188ef271?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=934&q=80"
      ></img>
    </div>
  );
};
