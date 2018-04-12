package webmap;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;

import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;

public class MyJob implements Job {

	public MyJob(){
		
	}
	
	@Override
	public void execute(JobExecutionContext arg0) throws JobExecutionException {
		refreshdb();
	}

public void refreshdb(){
	
	String sql = "SELECT * FROM location WHERE (lat IS NULL OR lng IS NULL)"
	+" OR (lat='' OR lng='') ORDER BY pdatetime DESC";
	
	//驱动程序名
	String drvName = "com.mysql.jdbc.Driver";
	//db用户名
	String usrName = "root";
	//密码
	String usrPasswd = "123456";
	//db名
	String dbName = "webmap";
	//表名
	String tableName = "location";
	//连接字串
	String url ="jdbc:mysql://127.0.0.1/"+dbName+"?user="+usrName
			+"&password="+usrPasswd;
	
	try {
		Class.forName(drvName).newInstance();
	
	Connection connection = DriverManager.getConnection(url);
	Statement statement = connection.createStatement();
	ResultSet rs = statement.executeQuery(sql);
	//获取需转换的坐标的数据
	ArrayList ids = new ArrayList();
	ArrayList cellids = new ArrayList();
	ArrayList lacs = new ArrayList();
	while(rs.next()){
		ids.add(rs.getString("id"));
		cellids.add(rs.getString("cellid"));
		lacs.add(rs.getString("lac"));		
	}
	rs.close();
	//开始转换坐标并存入db
	int i;
	for(i=0;i<ids.size();i++){
		int cid = Integer.parseInt(cellids.get(i).toString());
		int lac = Integer.parseInt(lacs.get(i).toString());
		double[] retArr = GetLatLon.getLatLon(cid, lac, 0, 460);
		
		String updateSql = "UPDATE location SET lat='"+retArr[0]
				+"',lng='"+retArr[1]+"' WHERE id='"+ids.get(i)+"'";
		
		statement.execute(updateSql);
		
	}
	statement.close();
	connection.close();
	
	} catch (Exception e) {
		
		e.printStackTrace();
	}

}

}
