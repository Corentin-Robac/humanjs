import React, { useEffect, useRef, useState } from "react";
import ReactWebcam from "react-webcam";
import { io } from "socket.io-client";

const FPS = 1;

const socket = io("http://localhost:3000", {
  transports: ["websocket"],
});

const emotionToEmoji = {
  happy: "😊",
  sad: "😢",
  angry: "😠",
  neutral: "😐",
  hand: "🖐",
};

export function Webcam() {
  const webCamRef = useRef();
  const canvasRef = useRef(null);
  const [emotion, setEmotion] = useState();
  const [age, setAge] = useState([]);
  const [genre, setGenre] = useState([]);

  useEffect(() => {
    const snap = () => {
      const imageSrc = webCamRef?.current.getScreenshot();
      return imageSrc;
    };

    setInterval(async () => {
      const img = snap();
      const data = await fetch(img);
      const blob = await data.blob();
      const arraybuffer = await blob.arrayBuffer();

      socket.emit("image", arraybuffer);
    }, 1000 / FPS);

    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on("data", (data) => {
      //console.log("Emotion data", data);
      setAge([]);
      setGenre([]);

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      // Effacer le canvas avant de redessiner
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      console.log(data);

      console.log(data.hand);
      data.hand.forEach((hand) => {
        drawEmoji(emotionToEmoji["hand"], hand.box);
      });

      data.persons.forEach((person) => {
        const emotionDetected = person.face.emotion[0].emotion;
        setEmotion(emotionDetected);
        // setAge(person.face.age);
        setAge((prevAge) => [...prevAge, person.face.age]);
        // setGenre(person.face.gender);
        setGenre((prevGenre) => [...prevGenre, person.face.gender]);

        // Dessiner un emoji pour chaque visage
        if (emotionDetected && emotionToEmoji[emotionDetected]) {
          const emoji = emotionToEmoji[emotionDetected];
          drawEmoji(emoji, person.face.box);
        }
      });
    });
  }, []);

  const drawEmoji = (emoji, faceBox) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Dessiner l'emoji sur le visage détecté
    const [x, y, width, height] = faceBox;
    const size = height * 0.8;
    ctx.font = `${size}px Arial`;

    // Calculer les positions pour centrer l'emoji
    const emojiWidth = ctx.measureText(emoji).width;
    const centerX = x + width / 2 - emojiWidth / 2;
    const centerY = y + height / 2 + size / 4;

    // Dessiner l'emoji centré sur le visage
    ctx.fillText(emoji, centerX, centerY);
  };

  return (
    <>
      <div style={{ position: "relative", width: "640px", height: "480px" }}>
        <ReactWebcam
          ref={webCamRef}
          screenshotFormat="image/jpeg"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        />
        <canvas
          ref={canvasRef}
          width="640"
          height="480"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            pointerEvents: "none", // Eviter que le canvas bloque les interactions avec la webcam
          }}
        ></canvas>
      </div>
      <p>{emotion}</p>
      {/* <p>{age}</p> */}
      {age.map((age, index) => (
        <p key={index}>{age}</p>
      ))}
      {/* <p>{genre}</p> */}
      {genre.map((genre, index) => (
        <p key={index}>{genre}</p>
      ))}
    </>
  );
}
