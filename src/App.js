import React, {useState, useEffect, useReducer, useRef} from "react";
import { withStyles } from "@material-ui/core/styles";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import QueueMusicIcon from '@material-ui/icons/QueueMusic';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import StopIcon from '@material-ui/icons/Stop';
import ReactPlayer from 'react-player'
import {WhatsappShareButton} from "react-share";
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import {  Grid, Card, CardHeader, CardContent, Avatar, IconButton, Button, Box } from "@material-ui/core";
import { storage, database } from './firebase';
import FileSaver from 'file-saver';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = theme => ({
  root: {
    [theme.breakpoints.down("md")]: {
      padding: "0px",
    },
    padding: "50px 100px",
    zIndex: 999,
    position: "absolute"
  },
  card: {
    display: "flex",
    //height: "calc(100vh - 100px)"
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
    background: "#de8771"
  },
  rightContainer: {
    background:
    "url(https://images.unsplash.com/photo-1548504778-b14db6c34b04?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8) center center",
      //"url(https://png.pngtree.com/thumb_back/fw800/back_our/20190619/ourmid/pngtree-minimalist-music-master-background-image_133616.jpg) center center",
    flex: 1
  },
  box: {
    [theme.breakpoints.up("md")]: {
      display: "inline"
    }
  },
});

function App({ classes }){ 
  const video_link = "https://download-a.akamaihd.net/files/media_publication/e1/sjjm_CR_022_r720P.mp4";

  //const [audioName, setAudioName] = useState(null);
  const [originalVideoURL, setOriginalVideoURL] = useState(null);
  const [originalVideoName, setOriginalVideoName] = useState('teste');
  const [videoUrl, setVideoUrl] = useState(null);
  const [recorder, setRecorder] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [loading, setloading] = useState(false);
  const [playerState, setPlayerState] = useState({
    playing: false,
  });

  const audioName = useRef();
  
  const togglePlay = ()=>{
    if(playerState.playing){
      recorder.stop();
    }else{
      setloading(false);
      setVideoUrl(null);      
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
    audioName.current = `record-${new Date().getTime()}.webm`
    setloading(true);
    blobFromURL(URL.createObjectURL(blob));
    //upload();
    //setVideoUrl(URL.createObjectURL(blob));
    //var a = document.createElement("a");
    //document.body.appendChild(a);
    //a.style = "display: none";
    //a.href = url;
    //a.download = "test.webm";
    //a.click();
    //window.URL.revokeObjectURL(url);
  }

  const download = ()=>{
    FileSaver.saveAs(videoUrl, audioName.current);
    // var a = document.createElement("a");
    // document.body.appendChild(a);
    // a.style = "display: none";
    // a.href = videoUrl;
    // a.download = "gravacao.webm";
    // a.click();
    //window.URL.revokeObjectURL(videoUrl);
  }

  const share = () =>{
    navigator.share({
      title: 'Share', 
      text:  'whatevs',                     
      url:   videoUrl
     })
  }

  const onEnded =()=>{
    togglePlay();
  }

  const upload =(blob)=>{
    const uploadAudio = storage.ref(`audio/${audioName.current}`).put(blob);
    uploadAudio.on(
      "state_changed",
      snapshot => {console.log('uploading',snapshot)},
      error => {console.log(error)},
      () => {
        storage.ref("audio").child(audioName.current).getDownloadURL().then(url => {
          setloading(false);
          setVideoUrl(url)});
      }

    );
  }

  async function blobFromURL(url) {
    var blob = await fetch(url)
      .then(r => r.blob())
      .then(blob => {
        console.log(blob);
        //setAudioFile(blob);
        upload(blob);
      });

    return blob
   }

  useEffect(()=>{
    if (recorder === null) {
      requestRecorder().then(setRecorder, console.error);
    }

    const db = database.ref().child('originalVideoName');
    db.on('value', snap => setOriginalVideoName(snap.val()));

    const db2 = database.ref().child('originalVideoURL');
    db2.on('value', snap => {setOriginalVideoURL(snap.val()); console.log(snap.val())});
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
    <Grid xs={12} md={12} >
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
        title={`Ann chante ak kè kontan pou Jewova - ${originalVideoName}`}
      />
      <CardContent className={classes.rightContainer} >
      <Grid>
      <ReactPlayer 
        url={originalVideoURL}
        playing={playerState.playing}
        playIcon={<PlayArrowIcon />}
        width='100%'
        height='100%'
        onEnded={onEnded}
      />
        <Box component="div" p={1} m={1}> 
          <Box component="div" className={classes.box} p={1} m={1}>

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
          { loading &&
            <Box component="div" className={classes.box} p={1} m={1} >
              <CircularProgress disableShrink />
            </Box>
          }
          {videoUrl != null && [
            <Box component="div" className={classes.box} p={1} m={1} >            
                <Button 
                  color="primary" 
                  variant="contained"        
                  size="large"
                  startIcon={<CloudDownloadIcon/>}
                  onClick={download}
                >
                  Baixar áudio
                </Button>           
            </Box>,
            <Box component="div" className={classes.box} p={1} m={1} > 
            <Button 
            color="primary" 
            variant="contained"        
            size="large">
              <WhatsappShareButton
                url={videoUrl}
                >
                  Compartilhar gravação
              </WhatsappShareButton>
              </Button>
            </Box>
          ]}
        </Box>
        </Grid>
      </CardContent>
    </Grid>
  );

  return(
    <div>
      <div className={classes.background} />
      <Grid xs={12} container className={classes.root}>
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
