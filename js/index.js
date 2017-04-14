var myAudio = document.getElementById('audio1');
function playPause(){
    if(myAudio.paused){
        myAudio.play();
    }else{
        myAudio.pause();
    }
}