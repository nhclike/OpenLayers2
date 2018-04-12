<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@page import="com.mysql.jdbc.Driver" %>
<%@page import="java.sql.*" %>
<%
String mobile = request.getParameter("mobile");
String starttime = request.getParameter("starttime");
String endtime = request.getParameter("endtime");

String timeWhereStr="";
if( (starttime!=null && starttime.length()>0) || (endtime!=null && endtime.length()>0 ) ){
	
	if((starttime!=null && starttime.length()>0)
		&& (endtime!=null && endtime.length()>0)){
		//同时有开始时间和结束时间
		timeWhereStr= " AND y.pdatetime>='"+starttime+"' AND y.pdatetime<='"+endtime+" 24:00:00' ";
	}else if((starttime!=null && starttime.length()>0)){
		//只有开始时间
		timeWhereStr = " AND y.pdatetime>='"+starttime+"' ";
	}else if((endtime!=null && starttime.length()>0)){
		//只有结束时间
		timeWhereStr = " AND y.pdatetime>='"+endtime+" 24:00:00' ";
	}
}

String sql="";

if( mobile!=null && mobile.length()>0 ){
	if(timeWhereStr.length()>0){
		//C.有手机号，有时间，取该手机号该时间内所有轨迹数据
		sql = "SELECT * FROM location y WHERE y.mobile='"+mobile+"' "
		+ timeWhereStr + "ORDER BY y.pdatetime ASC";
	}else{
		//B.只有手机号，没有时间，去该号最近1条数据
		sql="SELECT * FROM location y WHERE y.mobile='"+mobile+"'"
		+ " ORDER BY y.pdatetime ASC LIMIT 1";
	}
}else{
	//A.什么参数都不带，取所有车辆最新数据
	sql= "SELECT * FROM location x WHERE x.pdatetime = "
	+"(SELECT max(y.pdatetime) FROM location y WHERE x.mobile = y.mobile "
	+ timeWhereStr +" ) "+" ORDER BY x.pdatetime ASC";
}
//写访问db的代码
//JDBC驱动程序名
String driverName = "com.mysql.jdbc.Driver";
//数据库用户名
String userName="root";
//密码
String userPasswd = "123456";
//数据库名
String dbName= "webmap";
//表名
String tableName = "location";
//连接字串
String url = "jdbc:mysql://127.0.0.1/"+dbName+"?user="+userName
+"&password="+userPasswd;
Class.forName(driverName).newInstance();
Connection connection = DriverManager.getConnection(url);
Statement statement = connection.createStatement();

ResultSet rs = statement.executeQuery(sql);
out.print("[");
boolean isFirst = true;
while(rs.next()){
	if(isFirst){
		out.print("{");
		isFirst = false;
	}else{
		out.print(",{");
	}
	
	out.print("\"mobile\":\""+rs.getString("mobile")+"\",");
	
	String lat = rs.getString("lat");
	String lng = rs.getString("lng");
	
	//若lat，lng为空，需要根据cellid转换经纬度
	if(lat==null ||lng ==null ||lat.length()<1||lng.length()<1){
		
		double[] retArr = webmap.GetLatLon.getLatLon(
				rs.getInt("cellid"), rs.getInt("lac"), 0, 460);
		lat = retArr[0]+"";
		lng = retArr[1]+"";	
	}
	
	if(lat==null || lng==null || lat.length()<2||lng.length()<2 ||lat.startsWith("0")|| lng.startsWith("0") ) continue;

	out.print("\"lat\":\""+lat+"\",");
	out.print("\"lng\":\""+lng+"\",");
	
	out.print("\"pdatetime\":\""+rs.getString("pdatetime")+"\",");
	out.print("\"sno\":\""+rs.getString("sno")+"\",");
	out.print("\"cno\":\""+rs.getString("cno")+"\"");
	out.print("}");
}
out.print("]");
rs.close();
statement.close();
connection.close();
%>