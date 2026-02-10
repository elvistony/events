window.addEventListener('DOMContentLoaded', _ => {
	const text = document.querySelector('.js-text'); 
	const fab = document.querySelector('.js-fab');
	const button = document.querySelector('.js-toggle');
	
	// if (sniffer.isDevice) {
	// 	text.innerHTML = 'Tap the Floating Action Button';
	// };

	button.addEventListener('click', _ => {
		fab.classList.toggle('is-expanded');
	});
});

// watson/dg sniffer utility
const sniffer = new Sniffer();
function Sniffer(){var i=navigator.userAgent.toLowerCase(),e=navigator.appVersion.toLowerCase(),o=/android.*mobile/.test(i),s=!o&&/android/i.test(i),t=o||s,n=/ip(hone|od|ad)/i.test(i)&&!window.MSStream,r=/ipad/i.test(i)&&n,d=s||r,a=o||n&&!r,f=a||d,c=i.indexOf("firefox")>-1,h=!!i.match(/version\/[\d\.]+.*safari/),w=i.indexOf("opr")>-1,O=!window.ActiveXObject&&"ActiveXObject"in window,g=e.indexOf("msie")>-1||O||e.indexOf("edge")>-1,v=i.indexOf("edge")>-1,p=null!==window.chrome&&void 0!==window.chrome&&"google inc."==navigator.vendor.toLowerCase()&&!w&&!v;this.infos={isDroid:t,isDroidPhone:o,isDroidTablet:s,isIos:n,isIpad:r,isDevice:f,isEdge:v,isIE:g,isIE11:O,isPhone:a,isTablet:d,isFirefox:c,isSafari:h,isOpera:w,isChrome:p,isDesktop:!a&&!d},Object.keys(this.infos).forEach(function(i){Object.defineProperty(this,i,{get:function(){return this.infos[i]}})},this),Object.freeze(this)};