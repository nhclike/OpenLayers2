
var map=null;
var markers=null; //markers图层
var popup=null; //图标层
var haspopup=false;
var polygonLayer=null;//划线的层
var geojson;//创建GeoJSON类解析JSON串

/*
 * Initializes the map and listeners
 */

function init(){
	//初始化构造一个Openlayers的map
		map = new OpenLayers.Map("map",{controls : [
			new OpenLayers.Control.PanZoomBar(),
			new OpenLayers.Control.Navigation(),
			//实现键盘操作地图
			new OpenLayers.Control.KeyboardDefaults(),
			//跳转到当前页面的一个超链接
			new OpenLayers.Control.Permalink(),
			// ScaleLine（比例尺）：以线段指标的样式显示当前地图的比例
			new OpenLayers.Control.ScaleLine(),
			new OpenLayers.Control.MousePosition({"displayProjection":"EPSG:4326"})
		],
       
		//坐标投影方式
		projection: "EPSG:900913", 
        displayProjection: new OpenLayers.Projection("EPSG:4326"),
		//单位，米，另外还有度
		units : 'm',
		//缩放级别
 		numZoomLevels:20});
		
		layer = new OpenLayers.Layer.TMS("mapLayer",
				mapurl,{
					'type':'png',
					'getURL':get_my_url
				})
		map.addLayer(layer);
		
		map.addControl(new OpenLayers.Control.Scale());//放大比例尺
		map.addControl(new OpenLayers.Control.MousePosition());//提示鼠标的位置
		
		map.setCenter(transformLonLat("120.156185000","30.280461000"), 12);
		//添加标注图层
		markers=new OpenLayers.Layer.Markers('Markers');
		map.addLayer(markers);
		//增加划线的图层
		polygonLayer = new OpenLayers.Layer.Vector("Polygon Layer");
		map.addLayer(polygonLayer);
		//创建GeoJSON类解析JSON串
		geojson=new OpenLayers.Format.GeoJSON();
	}


function lbsdata(mobile,lat,lng,pdatetime,sno,cno){
	this.mobile = mobile;
	this.lat = lat;//纬度
	this.lng = lng;//经度
	this.pdatetime = pdatetime;
	this.sno = sno;//车辆号
	this.cno = cno;//车次号
}
function dealSearch(){
	//清空历史的显示
	markers.clearMarkers();
	//清空所有的划线层
	polygonLayer.removeAllFeatures();
	if(popup!=null&&haspopup){
		popup.destroy();
		haspopup=false;
	}
	var lbsdatas = [];
	var fileUrl = "../t.jsp";
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
		
		document.getElementById('resulttxt').innerHTML=fileUrl;

		//结果显示
		if($(":input[name='mobileNo']").val()==''){
			//显示所有设备的最后位置状态
			displaymobileslast(lbsdatas);
		}else{
			//但显示某设备的最后位置状态
			if($(":input[name='starttime']").val()=='' && $(":input[name='endtime']").val()==''){
				displaymobilelast(lbsdatas);
			}else{
				//显示某设备的轨迹
				displaymobileline(lbsdatas);
			}	
		}
	});
}

//显示某设备的轨迹	
function displaymobileline(lbsdatas){
	
var myfilterlbs = lbsdatas;
	
	var Lat,Lng;

	var points = [];
	var bounds = new OpenLayers.Bounds();
	var i=0;
	
	while( i<myfilterlbs.length ){
		
		Lat = myfilterlbs[i].lat;
		
		Lng = myfilterlbs[i].lng;
		
		
		var marktitle = "手机号："+myfilterlbs[i].mobile.toString()		
		+"\r\n时间："	+myfilterlbs[i].pdatetime.toString()+"\r\n纬度："+Lat.toString()+
		"\r\n经度："+Lng.toString();
		
		var location = new OpenLayers.LonLat(Lng,Lat);		
		location.transform(map.displayProjection,map.getProjectionObject());

		var oPoint = new OpenLayers.Geometry.Point(location.lon,location.lat); 
		
		points.push(oPoint);
		bounds.extend(location);
		//map.setCenter(location,12);
		i=i+1;

		if(i<100){
			
			var size = new OpenLayers.Size(17,19);
			var offset = new OpenLayers.Pixel(0,-size.h);
			var icon = new OpenLayers.Icon('../Icons/lightblue'+i.toString()
					+'.gif',size,offset);
			var marker = new OpenLayers.Marker(location,icon);
			marker.icon.imageDiv.title = marktitle;
			markers.addMarker(marker);
			
		}else{
	
			var marker = new OpenLayers.Marker(location);
			marker.icon.imageDiv.title = marktitle;
			markers.addMarker(marker);
			
		}
		
	}
	
	if(bounds.toArray.length>0){
		map.zoomToExtent(bounds,false);
		
	}
	
    var oLine = new OpenLayers.Geometry.LineString(points);
	
	var fea = new OpenLayers.Feature.Vector(oLine);
	
	fea.style={
			strokeColor:"#e4393c",
			strokeWidth:7
	};
	polygonLayer.addFeatures([fea]);
	
}	
	
//显示某设备的最后位置状态
function displaymobilelast(lbsdatas){
	var myfilterlbs = lbsdatas;

	var lastid = myfilterlbs.length-1; 
	Lat = myfilterlbs[lastid].lat;
	Lng = myfilterlbs[lastid].lng;
	var marktitle="手机号："+myfilterlbs[lastid].mobile.toString()+"\r\n时间："+
	myfilterlbs[lastid].pdatetime.toString()+"\r\n纬度："+Lat.toString()+"\r\n经度："+Lng.toString();
	
	var location = new OpenLayers.LonLat(Lng,Lat);
	location.transform(map.displayProjection,map.getProjectionObject());
	
	map.setCenter(location,12);
	
	var marker = new OpenLayers.Marker(location);
	marker.icon.imageDiv.title = marktitle; 
	markers.addMarker(marker);


	var infocontent = "<div style='TEXT-ALIGN:left;'>手机号："+myfilterlbs[lastid].mobile.toString()
	+"<br>时间："+myfilterlbs[lastid].pdatetime.toString()+"<br>纬度："+Lat.toString()
	+"<br>经度："+Lng.toString()+"</div>";
	
	popup = new OpenLayers.Popup.FramedCloud("popupbox",
			location,
			null,
			infocontent,
			null,true,null);
	marker.popup=popup;
	map.addPopup(popup);
	haspopup=true;
	
} 

//显示所有设备的最后位置状态
function displaymobileslast(lbsdatas){	
	var filterlbs=lbsdatas;
	var Lat,Lng;
	var bounds = new OpenLayers.Bounds(); //视图边界

	/*var lonlat = new OpenLayers.LonLat(116.397743,39.908419);//获取中心点
	lonlat.transform(map.displayProjection,map.getProjectionObject()); //中心点坐标转换
	map.setCenter(lonlat,12); //地图设置中心点
*/	console.log(filterlbs);
	document.getElementById('resulttxt').innerHTML="查询结果："+filterlbs.length+"项<br>";
	var i=0
	while(i<filterlbs.length){
		Lat=filterlbs[i].lat;
		Lng=filterlbs[i].lng;
		var marktitle = "手机号："+filterlbs[i].mobile.toString()		
		+"\r\n时间："	+filterlbs[i].pdatetime.toString()+"\r\n纬度："+Lat.toString()+
		"\r\n经度："+Lng.toString();
		var location =new OpenLayers.LonLat(Lng,Lat);
		//坐标转换map.displayProjection目标坐标系，map.getProjectionObject()原坐标系谷歌的
		location.transform(map.displayProjection,map.getProjectionObject());
		bounds.extend(location);
		i=i+1;
		if(i<100){
			var size=new OpenLayers.Size(17,19);
			var offset=new OpenLayers.Pixel(0,-size.h);
			var icon = new OpenLayers.Icon('../Icons/lightblue'+i.toString()
					+'.gif',size,offset);
			var marker = new OpenLayers.Marker(location,icon);
			//加上markertitle
			marker.icon.imageDiv.title = marktitle;
			markers.addMarker(marker);	
			}
		else{
			var marker = new OpenLayers.Marker(location);
			marker.icon.imageDiv.title = marktitle;
			markers.addMarker(marker);
		}
		if(i<11){
			document.getElementById('resulttxt').innerHTML+=""+i.toString()+
			":"+filterlbs[i-1].mobile.toString()+"<br>";
		}
			
	}
if(bounds.toArray.length>0){
		
		map.zoomToExtent(bounds,true);
		
	}
}
//对LonLat进行投影转换
function transformLonLat(lon, lat)
{
	var lonLat = new OpenLayers.LonLat(lon, lat);
	console.log(map.displayProjection);
	console.log(map.getProjectionObject());
	lonLat.transform(map.displayProjection, map.getProjectionObject());
	return lonLat;
}	
	