
/**
 * The Map object
 * @Type {google.maps.Map}
 */
var map = null;

/*
 * Initializes the map and listeners
 */
function initialize(){
	console.log("initialize");
	map = new google.maps.Map(
			document.getElementById('map'),{
				center:new google.maps.LatLng(39.9,116.397),
				zoom:13,
				mapTypeId:"roadmap",
				mapTypeControl:false				
			});
}

google.maps.event.addDomListener(window,'load',initialize);


function lbsdata(mobile,lat,lng,pdatetime,sno,cno){
	this.mobile = mobile;
	this.lat = lat;//纬度
	this.lng = lng;//经度
	this.pdatetime = pdatetime;
	this.sno = sno;//车辆号
	this.cno = cno;//车次号
}

function dealSearch(){
	
	var lbsdatas = [];
	var fileUrl = "t.jsp";
	//预处理
	if ( $(":input[name='mobileNo']").val()!=null &&  $(":input[name='mobileNo']").val()!=''){
		//输入了手机号,单查该手机号
		fileUrl = fileUrl + "?mobile="+$(":input[name='mobileNo']").val();
	}else{
		//未输入手机号，查所有的设备
	}
	
	if( $(":input[name='starttime']").val()!=null && $(":input[name='starttime']").val()!='' ){
		//输入了查询的起始时间
		fileUrl = fileUrl+"&starttime="+$(":input[name='starttime']").val();
	}
	
	if( $(":input[name='endtime']").val()!=null && $(":input[name='endtime']").val()!='' ){
		//输入了查询的结束时间
		fileUrl = fileUrl+"&endtime="+$(":input[name=''endtime]").val();
	}

	//调url获取结果
	$.getJSON(fileUrl,{},function(response){
		
		$.each(response,function(infoIndex,info){			
			var tmplbs = new lbsdata(info["mobile"],info["lat"],info["lng"],info["pdatetime"],info["sno"],info["cno"]);
			lbsdatas.push(tmplbs);	
		});
		
		//document.getElementById('resulttxt').innerHTML=fileUrl;

		//结果显示
		if($(":input[name='mobileNo']").val()==''){
			//显示所有设备的最后位置状态
			displaymobileslast(lbsdatas);
		}else{
			//单显示某设备的最后位置状态
			if($(":input[name='starttime']").val()=='' && $(":input[name='endtime']").val()==''){
				displaymobilelast(lbsdatas);
			}else{
				//显示某设备的轨迹
				displaymobileline(lbsdatas);
			}	
		}
	});
	
	
	
//显示某设备的轨迹	
function displaymobileline(lbsdatas){
	
	var myfilterlbs = lbsdatas;
	
	var Lat,Lng;
	map = null;
	map = new google.maps.Map(document.getElementById('map'),{
		zoom:15,
		mapTypeId:'roadmap',
		mapTypeControl:false
	});
	
	var points = [];
	var bounds = new google.maps.LatLngBounds();
	var i=0;
	
	while( i<myfilterlbs.length ){
		
		Lat = myfilterlbs[i].lat;
		
		Lng = myfilterlbs[i].lng;
		
		
		var marktitle = "手机号："+myfilterlbs[i].mobile.toString()		
		+"\r\n时间："	+myfilterlbs[i].pdatetime.toString()+"\r\n纬度："+Lat.toString()+
		"\r\n经度："+Lng.toString();
		//alert(marktitle);
		var location = new google.maps.LatLng(Lat,Lng);
		
		points.push(location);
		bounds.extend(location);
		map.setCenter(location,19);
		i=i+1;
		
		if(i<100){
			
			var image = new google.maps.MarkerImage('Icons/lightblue'+i+'.gif',
					new google.maps.Size(17,19),null,new google.maps.Point(0,19));
			var marker = new google.maps.Marker({
				position:location,
				map:map,
				title:marktitle,
				icon:image
			});
			
		}else{
			
			var marker = new google.maps.Marker({
				position:location,
				map:map,
				title:marktitle
			});
			
		}
		
	}
	
	var polyline = new google.maps.Polyline({
		path:points,
		map:map,
		strokeColor:'#ff0000',
		strokeWeight:1
	});
	map.fitBounds(bounds);
	
}	
	
//显示某设备的最后位置状态
function displaymobilelast(lbsdatas){

	var myfilterlbs = lbsdatas;
	
	map = null;
	map = new google.maps.Map(document.getElementById('map'),{
		zoom:15,
		mapTypeId:'roadmap',
		mapTypeControl:false
	});

	var lastid = myfilterlbs.length-1; 
	Lat = myfilterlbs[lastid].lat;
	Lng = myfilterlbs[lastid].lng;
	var marktitle="手机号："+myfilterlbs[lastid].mobile.toString()+"\r\n时间："+
	myfilterlbs[lastid].pdatetime.toString()+"\r\n纬度："+Lat.toString()+"\r\n经度："+Lng.toString();
	
	var location = new google.maps.LatLng(Lat,Lng);
	map.setCenter(location,19);
	var marker = new google.maps.Marker({
		position:location,
		map:map,
		title:marktitle		
	});

	var infocontent = "<div style='TEXT-ALIGN:left;'>手机号："+myfilterlbs[lastid].mobile.toString()
	+"<br>时间："+myfilterlbs[lastid].pdatetime.toString()+"<br>纬度："+Lat.toString()
	+"<br>经度："+Lng.toString()+"</div>";
	
	var infowindow = new google.maps.InfoWindow({content:infocontent});
	infowindow.open(map,marker);	
} 

//显示所有设备的最后位置状态
function displaymobileslast(lbsdatas){
	
	var filterlbs = lbsdatas;

	var Lat,Lng;
	map=null;
	map = new google.maps.Map(document.getElementById('map'),{
		zoom:15,
		mapTypeId:'roadmap',
		mapTypeControl:false
	});
	var points=[];
	var bounds = new google.maps.LatLngBounds();
	document.getElementById('resulttxt').innerHTML="查询结果："+filterlbs.length+"项<br>";
	var i=0;
	while(i<filterlbs.length){
		Lat = filterlbs[i].lat;
		Lng = filterlbs[i].lng;
		var marktitle = "手机号："+filterlbs[i].mobile.toString()+"\r\n时间："
		+filterlbs[i].pdatetime.toString()+"\r\n纬度："+Lat.toString()+"\r\n经度："+Lng.toString();
		
		var location = new google.maps.LatLng(Lat,Lng);
		points.push(location);
		bounds.extend(location);
		map.setCenter(location,19);
		i=i+1;
		if ( i<100 ){
			var image = new google.maps.MarkerImage('Icons/lightblue'+i.toString()+'.gif',new google.maps.Size(17,19),null,new google.maps.Point(0,19));
			var marker = new google.maps.Marker({
				position:location,
				map:map,
				title:marktitle,
				icon:image
			});
		}else{
			var marker = new google.maps.Marker({
				position:location,
				map:map,
				title:marktitle
				
			});
		}
		if(i<11){
			document.getElementById('resulttxt').innerHTML+=""+i.toString()+
			":"+filterlbs[i-1].mobile.toString()+"<br>";			
		}
	}
	
	if(bounds.length>0){
		map.fitBounds(bounds);		
	}

	
}


	
}
