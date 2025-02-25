import { useState, useRef, useEffect } from "react";

const tracks = [
  {
    title: "Forest Lullaby",
    artist: "Unknown Artist",
    src: "./resources/forest-lullaby-110624.mp3",
    cover: "./resources/cover-1.jpg"
  }
];

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef(new Audio(tracks[currentTrack].src));
  const progressBarRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    audio.addEventListener("loadedmetadata", () => setDuration(audio.duration));
    audio.addEventListener("timeupdate", () => setCurrentTime(audio.currentTime));
    return () => {
      audio.removeEventListener("loadedmetadata", () => setDuration(audio.duration));
      audio.removeEventListener("timeupdate", () => setCurrentTime(audio.currentTime));
    };
  }, [currentTrack]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-cover bg-center" style={{ backgroundImage: "url('./resources/gradient-bg.jpg')" }}>
      <div className="w-96 bg-gray-900 rounded-2xl p-4 flex flex-col items-center">
        <img src={tracks[currentTrack].cover} alt="cover" className="rounded-lg w-full mb-4" />
        <span className="text-gray-300 font-medium text-lg mb-2">{tracks[currentTrack].title}</span>
        <p className="text-gray-500 mb-4">{tracks[currentTrack].artist}</p>

        <div className="w-full mb-4">
          <div className="flex justify-between text-gray-500 text-sm">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
          <progress ref={progressBarRef} value={currentTime} max={duration} className="w-full h-2 rounded bg-gray-500" />
        </div>

        <div className="flex items-center justify-between w-1/2">
          <button onClick={togglePlayPause} className="w-16 h-16 bg-pink-600 rounded-full flex items-center justify-center">
            {isPlaying ? (
              <img src="./resources/Pause_fill.svg" alt="pause" className="w-10 h-10" />
            ) : (
              <img src="./resources/Play_fill.svg" alt="play" className="w-10 h-10" />
            )}
          </button>
        </div>
      </div>
      <div className="text-gray-400 text-sm mt-4">
        Coded by <a href="#" className="text-teal-400">Leonardo G. Timkang Jr.</a> | Challenge by
        <a href="https://www.devchallenges.io?ref=challenge" target="_blank" rel="noopener noreferrer" className="text-teal-400"> devChallenges.io</a>.
      </div>
    </div>
  );
}
