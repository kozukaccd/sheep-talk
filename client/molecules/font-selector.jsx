import React, { Fragment, useState, useEffect } from "react";
import { useSockets } from "../context/socket.context";
import MessagedBalloon from "../molecules/messaged-balloon";

const FontSelector = () => {
  const [localFonts, setLocalFonts] = useState([]);
  const [selectedFont, setSelectedFont] = useState("");
  const { socket, messages, setMessages, tmpText, setTmpText } = useSockets();
  useEffect(() => {
    socket.emit("getFontList");
    socket.on("getFontlist", (fonts) => {
      setLocalFonts(fonts);
      console.log("set default font");
      socket.emit("select-font", fonts[0]);
    });
  }, []);

  useEffect(() => {
    console.log(selectedFont);
    socket.emit("select-font", selectedFont);
  }, [selectedFont]);

  const handleSelectedFontChange = (e) => setSelectedFont(e.target.value);

  return (
    <div>
      <select name="font-selector" onChange={(e) => handleSelectedFontChange(e)}>
        {localFonts.map((item, i) => {
          return (
            <option key={`key-${item}`} value={item}>
              {item}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default FontSelector;
