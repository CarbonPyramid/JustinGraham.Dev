import styles from "./styles/Player.module.css";
import { createGlobalStyle } from "styled-components";
import React, { useState, useEffect, useRef } from "react";

import PageTemplate from "./components/PageTemplate";
import PlayerTemplate from "./components/PlayerTemplate";
import Title from "./components/Title";
import Time from "./components/Time";
import Progress from "./components/Progress";
import ButtonsBox from "./components/ButtonsBox";
import LoopCurrent from "./components/LoopCurrent";
import Previous from "./components/Previous";
import Play from "./components/Play";
import Pause from "./components/Pause";
import Next from "./components/Next";
import Shuffle from "./components/Shuffle";
import Volume from "./components/Volume";
import PlaylistTemplate from "./components/PlaylistTemplate";
import PlaylistItem from "./components/PlaylistItem";

const loopCurrentBtn = "/img/player/loop_current.png";
const loopNoneBtn = "/img/player/loop_none.png";
const previousBtn = "/img/player/previous.png";
const playBtn = "/img/player/play.png";
const pauseBtn = "/img/player/pause.png";
const nextBtn = "/img/player/next.png";
const shuffleAllBtn = "/img/player/shuffle_all.png";
const shuffleNoneBtn = "/img/player/shuffle_none.png";

const colors = `html{
  --playerBackground: #18191f;
  --titleColor: #ffffff;
  --timeColor: #ffffff;
  --progressSlider: #9440f3;
  --progressUsed: #ffffff;
  --progressLeft: #151616;
  --volumeSlider: #9440f3;
  --volumeUsed: #ffffff;
  --volumeLeft: #151616;
  --playlistBackground: #18191f;
  --playlistText: #ffffff;
  --playlistBackgroundHoverActive: #9440f3;
  --playlistTextHoverActive: #ffffff;
}`;

const Player = ({
  trackList,
  showPlaylist = true,
  autoPlayNextTrack = true,
  customColorScheme = colors,
}) => {
  let playlist = [];

  const [audio, setAudio] = useState(null);
  const [active, setActive] = useState(false);
  const [title, setTitle] = useState("");
  const [length, setLength] = useState(0);
  const [time, setTime] = useState(0);
  const [slider, setSlider] = useState(1);
  const [drag, setDrag] = useState(0);
  const [volume, setVolume] = useState(0.8);
  let [end, setEnd] = useState(0);
  const [shuffled, setShuffled] = useState(false);
  const [looped, setLooped] = useState(false);

  let [curTrack, setCurTrack] = useState(0);

  const GlobalStyles = createGlobalStyle`
${customColorScheme}
`;

  const fmtMSS = (s) => new Date(1000 * s).toISOString().substr(15, 4);

  useEffect(() => {
    const audio = new Audio(trackList[curTrack].url);

    const setAudioData = () => {
      setLength(audio.duration);
      setTime(audio.currentTime);
    };

    const setAudioTime = () => {
      const curTime = audio.currentTime;
      setTime(curTime);
      setSlider(curTime ? ((curTime * 100) / audio.duration).toFixed(1) : 0);
    };

    const setAudioVolume = () => setVolume(audio.volume);

    const setAudioEnd = () => setEnd((end += 1));

    // events on audio object
    audio.addEventListener("loadeddata", setAudioData);
    audio.addEventListener("timeupdate", setAudioTime);
    audio.addEventListener("volumechange", setAudioVolume);
    audio.addEventListener("ended", setAudioEnd);

    setAudio(audio);
    setTitle(trackList[curTrack].title);

    return () => {
      audio.pause();
    };
  }, []);

  const shufflePlaylist = (arr) => {
    if (arr.length === 1) return arr;
    const rand = Math.floor(Math.random() * arr.length);
    return [arr[rand], ...shufflePlaylist(arr.filter((_, i) => i != rand))];
  };

  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      if (shuffled) {
        playlist = shufflePlaylist(playlist);
      }
      !looped && autoPlayNextTrack ? next() : play();
    }
  }, [end]);

  useEffect(() => {
    if (audio != null) {
      audio.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (audio != null) {
      pause();
      const val = Math.round((drag * audio.duration) / 100);
      audio.currentTime = val;
    }
  }, [drag]);

  const play = () => {
    setActive(true);
    audio.play().catch(() => {
      // Browser blocked autoplay - user must interact first
      setActive(false);
    });
  };

  const pause = () => {
    setActive(false);
    audio.pause();
  };

  const loop = () => {
    setLooped(!looped);
  };

  useEffect(() => {
    if (audio != null) {
      const wasActive = active;
      audio.src = trackList[curTrack].url;
      setTitle(trackList[curTrack].title);
      if (wasActive) {
        play();
      }
    }
  }, [curTrack]);

  const previous = () => {
    const index = playlist.indexOf(curTrack);
    index !== 0
      ? setCurTrack((curTrack = playlist[index - 1]))
      : setCurTrack((curTrack = playlist[playlist.length - 1]));
  };

  const next = () => {
    const index = playlist.indexOf(curTrack);
    index !== playlist.length - 1
      ? setCurTrack((curTrack = playlist[index + 1]))
      : setCurTrack((curTrack = playlist[0]));
  };

  const shuffle = () => {
    setShuffled(!shuffled);
  };

  const playlistItemClickHandler = (e) => {
    const num = Number(e.currentTarget.getAttribute("data-key"));
    const index = playlist.indexOf(num);
    setCurTrack((curTrack = playlist[index]));
    play();
  };

  return (
    <PageTemplate>
      <GlobalStyles />
      <PlayerTemplate>
        <div className={styles.title_time_wrapper}>
          <Title title={title} />
          <Time
            time={`${!time ? "0:00" : fmtMSS(time)}/${
              !length ? "0:00" : fmtMSS(length)
            }`}
          />
        </div>

        <Progress
          value={slider}
          onChange={(e) => {
            setSlider(e.target.value);
            setDrag(e.target.value);
          }}
          onMouseUp={play}
          onTouchEnd={play}
        />
        <div className={styles.buttons_volume_wrapper}>
          <ButtonsBox>
            <LoopCurrent
              src={looped ? loopCurrentBtn : loopNoneBtn}
              onClick={loop}
            />
            <Previous src={previousBtn} onClick={previous} />
            {active ? (
              <Pause src={pauseBtn} onClick={pause} />
            ) : (
              <Play src={playBtn} onClick={play} />
            )}
            <Next src={nextBtn} onClick={next} />
            <Shuffle
              src={shuffled ? shuffleAllBtn : shuffleNoneBtn}
              onClick={shuffle}
            />
          </ButtonsBox>
          <Volume
            value={volume}
            onChange={(e) => {
              setVolume(e.target.value / 100);
            }}
          />
        </div>
      </PlayerTemplate>

      {showPlaylist && (
        <PlaylistTemplate>
          {trackList
            .sort((a, b) => (a.title > b.title ? 1 : -1))
            .map((el, index) => {
              playlist.push(index);
              return (
                <PlaylistItem
                  className={curTrack === index ? "active" : ""}
                  key={index}
                  data_key={index}
                  title={el.title}
                  src={el.url}
                  onClick={playlistItemClickHandler}
                />
              );
            })}
        </PlaylistTemplate>
      )}
    </PageTemplate>
  );
};

export default Player;
