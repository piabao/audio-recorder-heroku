import React, {useState, useEffect} from "react";
import { withStyles } from "@material-ui/core/styles";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import QueueMusicIcon from '@material-ui/icons/QueueMusic';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import StopIcon from '@material-ui/icons/Stop';
import ReactPlayer from 'react-player'
import {WhatsappShareButton} from "react-share";
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import {  Grid, Card, CardHeader, CardContent, Avatar, IconButton, Button, Box } from "@material-ui/core";

const styles = () => ({
  root: {
    padding: "50px 100px",
    zIndex: 999,
    position: "absolute"
  },
  card: {
    display: "flex",
    height: "calc(100vh - 100px)"
  },
  rightBorder: {
    borderRight: "solid #d0D0D0 1px"
  },
  content: {
    marginTop: 0
  },
  background: {
    position: "absolute",
    height: 200,
    width: "100%",
    top: 0,
    background: "#7159C1"
  },
  rightContainer: {
    background:
      "url(https://media.istockphoto.com/vectors/music-notes-group-musical-notes-background-vector-vector-id1154801056) center center",
    flex: 1
  }
});

function App({ classes }){ 
  const video_link = "https://download-a.akamaihd.net/files/media_publication/e1/sjjm_CR_022_r720P.mp4";

  const [videoUrl, setVideoUrl] = useState(null);
  const [recorder, setRecorder] = useState(null);
  const [playerState, setPlayerState] = useState({
    playing: false,
  }); 
  
  const togglePlay = ()=>{
    if(playerState.playing){
      recorder.stop();
    }else{
      recorder.start();
    }
    setPlayerState({
      ...setPlayerState,
      playing: !playerState.playing,
      
    })
  }

  const handleAudioStop =(e)=>{
    console.log(e.data);
    let recordedChunks = [];
    recordedChunks.push(e.data);
    const blob = new Blob(recordedChunks, {
      type: "video/webm"
    });
    setVideoUrl(URL.createObjectURL(blob));
    //var a = document.createElement("a");
    //document.body.appendChild(a);
    //a.style = "display: none";
    //a.href = url;
    //a.download = "test.webm";
    //a.click();
    //window.URL.revokeObjectURL(url);
  }

  const download = ()=>{
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    a.href = videoUrl;
    a.download = "gravacao.webm";
    a.click();
    window.URL.revokeObjectURL(videoUrl);
  }

  const share = () =>{
    navigator.share({
      title: 'Share', 
      text:  'whatevs',                     
      url:   videoUrl
     })
  }

   //useEffect(()=>{
   //    playerState.playing ? videoPlayer.current.play() : videoPlayer.current.pause();
   //}, [playerState.playing]);

  useEffect(()=>{
    if (recorder === null) {
      requestRecorder().then(setRecorder, console.error);
    }
  }, []);

  useEffect(()=>{
    if (recorder != null) {
      recorder.addEventListener("dataavailable", handleAudioStop); 
    }
  }, [recorder]);

  async function requestRecorder() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    return new MediaRecorder(stream);
  }

  const RightContainer = ({ classes }) => (
    <Grid>
      <CardHeader
        avatar={
          <Avatar aria-label="Recipe" className={classes.avatar}>
            <QueueMusicIcon />
          </Avatar>
        }
        action={
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        }
        title="‘Ann chante ak kè kontan’ pou Jewova - 22. Wayòm nan deja tabli — Fò l vini!"
      />
      <CardContent className={classes.rightContainer} >
      <Grid>
      <ReactPlayer url={video_link}
      playing={playerState.playing}
        width='100%'
        height='100%'
      />
        <div>
          <Box component="div" display="inline" p={1} m={1} bgcolor="background.paper">

            <Button 
            color="primary" 
            variant="contained"        
            size="large"
            startIcon={playerState.playing ? <StopIcon/> : <PlayArrowIcon />}
            onClick={togglePlay}
            >
              {playerState.playing ? "Parar" : "Iniciar"}
            </Button>
          </Box>
          <Box component="div" display="inline" p={1} m={1} bgcolor="background.paper">
            {videoUrl != null &&
              <Button 
              color="primary" 
              variant="contained"        
              size="large"
              startIcon={<CloudDownloadIcon/>}
              onClick={download}
              >
                Baixar áudio
              </Button>
            //  <WhatsappShareButton
            //   url={videoUrl}
            //   disabled={!videoUrl}
            //   >
            //     Compartilhar gravação
            // </WhatsappShareButton>
}
          </Box>
        </div>
        </Grid>
      </CardContent>
    </Grid>
  );

  return(
    <div>
      <div className={classes.background} />
      <Grid container className={classes.root}>
        <Grid item xs={12}>
          <Card className={classes.card}>
            <Grid container>
              <RightContainer classes={classes} />
            </Grid>
          </Card>
        </Grid>
      </Grid>
    </div>
);

}
export default withStyles(styles)(App);
