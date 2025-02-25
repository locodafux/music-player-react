import React, { useState, useRef, useEffect } from "react";

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [selectedMusic, setSelectedMusic] = useState(0);
  const audioRef = useRef(null);

  const musics = [
    {
      title: 'Forest Lullaby',
      artist: 'Lesfm',
      image: '/resources/cover-2.jpg',
      audio: '/resources/forest-lullaby-110624.mp3' // Ensure correct path
    },
    {
      title: 'Lost in the City Lights',
      artist: 'Cosmo Sheldrake',
      image: '/resources/cover-1.jpg',
      audio: '/resources/lost-in-city-lights-145038.mp3' // Ensure correct path
    }
  ];

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.addEventListener("error", (e) => {
        console.error("Audio error:", e);
        console.error("Error details:", audio.error); // Log the MediaError object
      });
      audio.addEventListener("timeupdate", () => setCurrentTime(audio.currentTime));
      audio.addEventListener("loadedmetadata", () => setDuration(audio.duration));
    }

    return () => {
      if (audio) {
        audio.removeEventListener("error", () => {});
        audio.removeEventListener("timeupdate", () => {});
        audio.removeEventListener("loadedmetadata", () => {});
      }
    };
  }, []);

  const togglePlay = () => {
    console.log('play')
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((error) => {
        console.error("Error playing audio:", error);
      });
    }
    setIsPlaying(!isPlaying);
  };

  const setMusic = (index, play = false) => {
    const music = musics[index];
    if (audioRef.current) {
      console.log("Setting audio source:", music.audio); // Debugging
      audioRef.current.src = music.audio;
      audioRef.current.load(); // Load the new source
      if (play) {
        audioRef.current.play().catch((error) => {
          console.error("Error playing audio:", error);
        });
        setIsPlaying(true);
      }
      setSelectedMusic(index);
    }
  };

  const handlePrevious = () => {
    const newIndex = (selectedMusic - 1 + musics.length) % musics.length;
    setMusic(newIndex, true);
  };

  const handleNext = () => {
    const newIndex = (selectedMusic + 1) % musics.length;
    setMusic(newIndex, true);
  };

  const handleProgressBarClick = (e) => {
    const progressBarWidth = e.target.clientWidth;
    const clickPosition = e.nativeEvent.offsetX;
    const seekTime = (clickPosition / progressBarWidth) * duration;
    audioRef.current.currentTime = seekTime;
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-cover bg-no-repeat" style={{ backgroundImage: "url('/resources/gradient-bg.jpg')" }}>
      <div className="w-96 bg-gray-900 rounded-2xl flex flex-col items-center p-4">
        <img className="rounded-xl w-full mb-4" src={musics[selectedMusic].image} alt="Cover" />
        <span className="text-gray-300 font-medium text-lg mb-2">{musics[selectedMusic].title}</span>
        <p className="text-gray-500 text-sm mb-2">{musics[selectedMusic].artist}</p>
        <div className="w-full mb-6">
          <div className="flex justify-between text-gray-500 text-sm">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
          <input
            type="range"
            className="w-full"
            value={currentTime}
            max={duration}
            onChange={(e) => (audioRef.current.currentTime = e.target.value)}
            onClick={handleProgressBarClick}
          />
          <audio ref={audioRef} src={musics[selectedMusic].audio} />
        </div>
        <div className="w-1/2 flex items-center justify-between">
          <img src="/resources/Stop_and_play_fill-1.svg" alt="Previous" onClick={handlePrevious} />
          <div className="h-16 w-16 rounded-full bg-pink-500 flex justify-center items-center cursor-pointer" onClick={togglePlay}>
            <img className="h-12 w-12" src={isPlaying ? "./resources/Pause_fill.svg" : "./resources/Play_fill.svg"} alt="Play/Pause" />
          </div>
          <img src="/resources/Stop_and_play_fill.svg" alt="Next" onClick={handleNext} />
        </div>
      </div>
      <div className="text-gray-400 text-sm mt-4">
        Coded by <a className="text-green-400" href="#">Leonardo G. Timkang Jr.</a> | Challenge by <a className="text-green-400" href="https://www.devchallenges.io?ref=challenge" target="_blank">devChallenges.io</a>.
      </div>
    </div>
  );
};

export default MusicPlayer;