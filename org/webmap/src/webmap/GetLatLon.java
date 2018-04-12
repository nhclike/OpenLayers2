package webmap;

public class GetLatLon {

	/**
	 * @param args
	 */
	public static void main(String[] args) {

		double[] retArr = GetLatLon.getLatLon(53951, 29547, 0, 460);
		
		System.out.println("lat:"+retArr[0]);
		System.out.println("lon:"+retArr[1]);
		
	}
	
	/**
	 * 把int转为十六进制，并且格式为8位，前补足0
	 */
	public static String int2hex(int value){
		
		String str = Integer.toHexString(value);
		
		String strfmt ="00000000";
		
		return strfmt.substring(0,strfmt.length()-str.length())+str;

	}
	
	/**
	 * 把16进制字符串转换成字节数组
	 */
	public static byte[] hexStringToByte(String hex){
		
		int len = (hex.length()/2);
		
		byte[] result = new byte[len];
		char[] achar = hex.toCharArray();
		for(int i=0;i<len;i++){
			int pos =i*2;
			result[i] = (byte)(  toByte(achar[pos])<<4 | toByte(achar[pos+1]));

		}
		return result;
	}
	
	private static byte toByte(char c){
		
		byte b = (byte)"0123456789ABCDEF".indexOf(c);
		return b;

	}
	
	/**
	 * 把字节数组转换成16进制字符串
	 */
	public static final String bytesToHexString(byte[] bArray){
		StringBuffer sb = new StringBuffer(bArray.length);
		String sTemp;
		for(int i=0;i<bArray.length;i++){
			sTemp = Integer.toHexString(0XFF & bArray[i] );
			if(sTemp.length()<2) sb.append(0);
			sb.append(sTemp.toUpperCase());			
		}
		return sb.toString();
	} 

	/**
	 * 发送数据格式化：cid+lac+mnc+mcc转化为byte[]
	 * @ param int cid,int lac,
	 * int mnc(china mobile:00,china unicom:01,China Telecom:03,...China Tietong:20 GSM-R),
	 * int mcc(china:460)
	 * 
	 * @return
	 */
	public static byte[] sendDataFormat(int cid,int lac,int mnc,int mcc){
		
		String string1="000E00000000000000000000000000001B0000000000000000000000030000";
		
		String string2 = "FFFFFFFF00000000";
		
		String retStr = string1 + int2hex(cid)+int2hex(lac)+int2hex(mnc)
				+int2hex(mcc)+string2;
		
		return hexStringToByte(retStr.toUpperCase());
	}
	
	/**
	 * 接收数据格式化，截取出lat，lon
	 */
	public static double[] getDataFormat(byte[] byteArr){
		double[] retArr = new double[2];
		
		String resHexStr = bytesToHexString(byteArr);
		
		System.out.println(resHexStr);
		
		String latHexStr = resHexStr.substring(14,22);
		String lonHexStr = resHexStr.substring(22, 30);
		
		retArr[0]= Integer.parseInt(latHexStr,16)/1000000.0;
		retArr[1]= Integer.parseInt(lonHexStr, 16)/1000000.0;
		
		return retArr;
	}

	/**
	 * 获取lat，lon的总入口
	 * 
	 */
	public static double[] getLatLon(int cid,int lac,int mnc,int mcc){
		
		double[] retArr = new double[2];
		
		String urlAddr = "http://www.google.com/glm/mmap";
		
		byte[] postByteArr = sendDataFormat(cid,lac,mnc,mcc);
		
		SendPostMessage sendObj = new SendPostMessage();
		
		try{
			
			byte[] res = sendObj.send(urlAddr, postByteArr);
			
			retArr = getDataFormat(res);
			
		}catch(Exception e){
			e.printStackTrace();
			
		}
		
		return retArr;
		
	}
	
	
}
