function closeLoader(){
    document.querySelector('.overlay').style.opacity=0;
    setTimeout(()=>{
        document.querySelector('.overlay').style.display='none';
    },600)
    console.log("Overlay");
}

setTimeout(()=>{
    closeLoader();
},2000)