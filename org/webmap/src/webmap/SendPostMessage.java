package webmap;

import java.io.InputStream;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.ByteArrayEntity;
import org.apache.http.impl.client.DefaultHttpClient;

public class SendPostMessage {

public byte[] send(String urlAddr, byte[] postByteArr){

	byte[] tmp = null;
	HttpClient httpclient = new DefaultHttpClient();
	try{
		HttpPost httppost = new HttpPost(urlAddr);
		ByteArrayEntity reqEntity = new ByteArrayEntity(postByteArr);
		
		reqEntity.setContentType("application/binary");
		httppost.setEntity(reqEntity);
		
		System.out.println("request:"+httppost.getRequestLine());
		
		HttpResponse response = httpclient.execute(httppost);
		
		HttpEntity entity = response.getEntity();
		
		if(entity!=null){
			
			InputStream in = entity.getContent();
			tmp = new byte[(int)entity.getContentLength()];
			while(in.read(tmp)!=-1){}
		}
	}catch (Exception e){
		e.printStackTrace();
		
	}finally{
		httpclient.getConnectionManager().shutdown();
	}

	return tmp;
}

}
