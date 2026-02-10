
function loadEnvelope(){
    setTimeout(()=>{
        window.scrollTo(0, 0);
        // document.getElementById('waxstart').click()
    },1000)
    console.log(SHOW_INVITE)
    if(SHOW_INVITE){
    document.querySelector('body').style.overflow='hidden';
    // document.querySelector('.envelope-container').style.display = 'none';
    
    document.getElementById('waxstart').addEventListener('click',()=>{
        console.log("Trigger")
        document.querySelector('.masthead-video').play();
        
        console.log(document.getElementById('waxstart').dataset.clicked)
        if(document.getElementById('waxstart').dataset.clicked=="true"){
            return;
        }
        const fadeEls = document.querySelectorAll('.fade-object');
        document.getElementById('waxstart').dataset.clicked = true;
        setTimeout(()=>{
        
            document.querySelector('.envelope-wrapper').classList.toggle('open')
            
            document.getElementById('bgm').play();
            setTimeout(()=>{
                document.querySelector('.envelope-container').style.display = 'none';
                document.querySelector('body').style.overflow='auto';
                
                fadeEls.forEach((el, i) => {
            setTimeout(() => {
                el.classList.add('visible');
            }, 400 + i * 200);
        });
        togglePlay()
            },2500);
        },100);
    })
}else{
    // document.querySelector('body').style.overflow='hidden';
    document.querySelector('.envelope-container').style.display = 'none';
    document.body.innerHTML=`
<div class="full-height text-center" >
<img src="https://images.pexels.com/photos/5704331/pexels-photo-5704331.jpeg?cs=srgb&dl=pexels-eliab-mendez-3845400-5704331.jpg&fm=jpg&w=640&h=424&_gl=1*no0ips*_ga*MTE5Mzk2MDYxNS4xNzcwNzYyMzkz*_ga_8JE65Q40S6*czE3NzA3NjIzOTMkbzEkZzEkdDE3NzA3NjI0MjYkajI3JGwwJGgw" style="max-height:400px;" class="m-3" />
<h3>Oops, Failed to Load invite!</h3>
<h4>Please use the link again.</h4>
</div>
    `;
    document.body.style.alignContent='center';
}
}
