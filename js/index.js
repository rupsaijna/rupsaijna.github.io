var w=500;
var h =500;
var d=16;
var color="red";
var show=1;
var eraser=0;
var fill=0;


var bg=document.getElementById('bg');
var ctxbg=bg.getContext('2d');
bg.width = w;
bg.height = h;
ctxbg.translate(bg.width/2, bg.width/2);

var canvas = document.getElementById('paint');
var ctx = canvas.getContext('2d');



// Prevent scrolling when touching the canvas
document.body.addEventListener("touchstart", function (e) {
  if (e.target == canvas) {
    e.preventDefault();
  }
}, false);
document.body.addEventListener("touchend", function (e) {
  if (e.target == canvas) {
    e.preventDefault();
  }
}, false);
document.body.addEventListener("touchmove", function (e) {
  if (e.target == canvas) {
    e.preventDefault();
  }
}, false);


var sketch = document.getElementById('sketch');
var sketch_style = getComputedStyle(sketch);
canvas.width = w;
canvas.height = h;
ctx.translate(canvas.width/2, canvas.width/2);
var mouse = {x: 0, y: 0,xp:0,yp:0};
var touch = {x: 0, y: 0,xp:0,yp:0};
var refl={xb:0,yb:0,xe:0,ye:0};

var refl_x=[];
var refl_y=[];
var slope=[];


function toRadians (angle) {
  return angle * (Math.PI / 180);
}

function divide_canvas(num_parts){
  part_angle=360/num_parts;
  ctxbg.strokeStyle="red";
  ctxbg.beginPath();
  for (i=1;i<=num_parts;i++){
    angle=part_angle*i;
    ctxbg.moveTo(0,0);    
 ctxbg.lineTo(0+canvas.width*2*Math.cos(toRadians(angle)), 0+canvas.height*2*Math.sin(toRadians(angle)));
    slope.push(canvas.width*2*Math.cos(toRadians(angle))/canvas.height*2*Math.sin(toRadians(angle)));
  }
  ctxbg.stroke(); 
};

//divide_canvas(d);

function get_reflection_slope(cox,coy,m){
  xr=((1-m*m)*cox+2*m*coy)/(1+m*m);
  xy=(2*m*cox-(1-m*m)*coy)/(1+m*m);
  return [xr,xy];
}

function get_reflection(cox,coy,angle){
  angle=toRadians(angle);
  x_ref=Math.cos(angle)*cox-Math.sin(angle)*coy;
  y_ref=Math.sin(angle)*cox+Math.cos(angle)*coy;
  return [x_ref,y_ref];  
}

/* Mouse Capturing Work */
canvas.addEventListener('mousemove', function(e) {
  mouse.x = e.pageX - this.offsetLeft-w/2;
  mouse.y = e.pageY - this.offsetTop-h/2;
}, false);


ctx.strokeStyle = "red";

function getColor(){color= document.getElementById("myColor").value; ctx.strokeStyle = color;}

function getFillColor(){fillcolor= document.getElementById("myColorFill").value; ctx.fillStyle = fillcolor;}

function getEraser(){
	window.alert(eraser);
	if (eraser==0){ctx.strokeStyle = 'rgba(250,250,250,0.5)';document.getElementById("eraser").style.background='#EEFFFF';eraser=1;}
	else {document.getElementById("eraser").style.background=''; ctx.strokeStyle =color; }
}

function getSize(size){
	ctx.lineWidth = size; 
	var children=document.getElementById('brush').children;
	var bid='b'+size;
	for (var i = 0; i < children.length; i++) {
		children[i].style.background="";	
	}
	document.getElementById(bid).style.background='#EEFFFF';
}

function save(){
	var dataURL = canvas.toDataURL();
}

function divcan(parts){
	ctxbg.save();
	ctxbg.setTransform(1,0,0,1,0,0);
	ctxbg.clearRect(0, 0, 500,500);
	ctxbg.restore();
	//window.alert(w,h);
	divide_canvas(parts); 
	d=parts; 
	//document.getElementById('divi').style.visibility='hidden'; 
	var id="b"+parts;
	var children=document.getElementById('divi').children;
	for (var i = 0; i < children.length; i++) {
		children[i].style.background="";	
	}
	document.getElementById(id).style.background='#EEFFFF';
	}

function toggleGuides(){if (show==1){bg.style.display="None";show=0;} else {bg.style.display="";show=1;}}

function toggleFill(){if (fill==0){document.getElementById("colourpicker2").style.display="";fill=1;} else{fill=0;document.getElementById("colourpicker2").style.display="none";}}

/* Drawing on Paint App */
ctx.lineJoin = 'round';
ctx.lineCap = 'round';


canvas.addEventListener('mousedown', function(e) {
    ctx.beginPath();
    ctx.moveTo(mouse.x, mouse.y);
 
    canvas.addEventListener('mousemove', onPaint, false);
}, false);

 
canvas.addEventListener('mouseup', function() {
    canvas.removeEventListener('mousemove', onPaint, false);
    paint_reflection();
}, false);


// Set up touch events for mobile, etc
canvas.addEventListener("touchstart", function (e) {
        mousePos = getTouchPos(canvas, e);
  var touch = e.touches[0];
  var mouseEvent = new MouseEvent("mousedown", {
    clientX: touch.clientX,
    clientY: touch.clientY
  });
  canvas.dispatchEvent(mouseEvent);
}, false);
canvas.addEventListener("touchend", function (e) {
  var mouseEvent = new MouseEvent("mouseup", {});
  canvas.dispatchEvent(mouseEvent);
}, false);
canvas.addEventListener("touchmove", function (e) {
  var touch = e.touches[0];
  var mouseEvent = new MouseEvent("mousemove", {
    clientX: touch.clientX,
    clientY: touch.clientY
  });
  canvas.dispatchEvent(mouseEvent);
}, false);

// Get the position of a touch relative to the canvas
function getTouchPos(canvasDom, touchEvent) {
  var rect = canvasDom.getBoundingClientRect();
  return {
    x: touchEvent.touches[0].clientX - rect.left,
    y: touchEvent.touches[0].clientY - rect.top
  };
}
 
var onPaint = function() {
    ctx.lineTo(mouse.x, mouse.y);
    ctx.stroke();   
  refl_x.push(mouse.x);
  refl_y.push(mouse.y);
 if (fill==1)	
	{//ctx.fillStyle = "blue";
	ctx.fill();}
	  ctx.stroke();
		
};

var onPaint_t = function() {
    ctx.lineTo(touch.x, touch.y);
    ctx.stroke();   
  refl_x.push(touch.x);
  refl_y.push(touch.y);
 if (fill==1)	
	{//ctx.fillStyle = "blue";
	ctx.fill();}
	  ctx.stroke();
		
};


function paint_reflection(){
  

  for(j=1;j<d;j++){
	ctx.beginPath();
	  rr=get_reflection(refl_x[0], refl_y[0], j*360/d);
	  ctx.moveTo(rr[0],rr[1]);
	  for (i=1;i<refl_x.length;i++){
		rr=get_reflection(refl_x[i], refl_y[i], j*360/d);
	    	ctx.lineTo(rr[0],rr[1]);
	  }
	if (fill==1)	
	{//ctx.fillStyle = "blue";
	ctx.fill();}
	  ctx.stroke();
	  
	}
refl_x=[];
	  refl_y=[];
//ctx.strokeStyle="red";
}
