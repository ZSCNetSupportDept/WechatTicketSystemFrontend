doge();
function doge(){
	window.egg_dogei=0;
	for(var i=1;i<=7;i++)
		setTimeout(dogee,i*200);
}
function dogee(){
	var sI = document.createElement("img");
	var bd = document.getElementsByTagName('body')[0];
	sI.src = '../egg/doge.jpg';
	sI.setAttribute('style','left:'+(10+egg_dogei*60)+'px;');
	sI.className='doge';
	egg_dogei++;
	bd.appendChild(sI);
}