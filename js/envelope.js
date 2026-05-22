
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
        document.body.dataset.envelope='open';
        AOS.init();
        
        console.log(document.getElementById('waxstart').dataset.clicked)
        if(document.getElementById('waxstart').dataset.clicked=="true"){
            return;
        }
        requestWakeLock();
        const fadeEls = document.querySelectorAll('.fade-object');
        document.getElementById('waxstart').dataset.clicked = true;
        setTimeout(()=>{
        
            document.querySelector('.envelope-wrapper').classList.toggle('open')
            
            document.getElementById('bgm').play();

            setTimeout(()=>{
                document.querySelector('.envelope-container').style.opacity=0;
            },1000)

            setTimeout(()=>{
                document.querySelector('.envelope-container').style.display = 'none';
                document.querySelector('body').style.overflow='auto';

                document.getElementById('intro-animation').classList.add('revealio')
                
                fadeEls.forEach((el, i) => {
            setTimeout(() => {
                el.classList.add('visible');
            }, 400 + i * 200);
        });
        
        togglePlay();
            },2500);
        },100);
    })
}else{
    // document.querySelector('body').style.overflow='hidden';
    document.querySelector('.envelope-container').style.display = 'none';
    document.body.innerHTML=`
<div class="full-height text-center" >
<img style="border-radius:10px; height:400px;" src="https://images.pexels.com/photos/36516061/pexels-photo-36516061.jpeg?cs=srgb&dl=pexels-alex-ohan-2150877096-36516061.jpg&fm=jpg&w=640&h=427&_gl=1*z5r6vf*_ga*MTM1OTA1NjMyNy4xNzU3MTAwMjY1*_ga_8JE65Q40S6*czE3Nzk0NzgwMzgkbzYkZzEkdDE3Nzk0NzgwNTkkajM5JGwwJGgw" style="max-height:400px;" class="m-3" />
<h3>Sorry, Failed to Load invite!</h3>
<h5>Please open the link again.</h5>
</div>
    `;
    document.body.style.alignContent='center';
}
}
