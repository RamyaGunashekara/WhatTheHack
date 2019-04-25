try{ 
          var num = $.request.parameters.get("num");
          var s1 = $.request.parameters.get("s1");
          var s2 = $.request.parameters.get("s2");
          var s3 = $.request.parameters.get("s3");
          var s4 = $.request.parameters.get("s4");
          var pstmt="";
          var conn = $.db.getConnection("WhatTheHack.services::cred");  
          pstmt = conn.prepareStatement('UPDATE "WTH"."SCORES" SET "SCORE1" = ?,"SCORE2"=?,"SCORE3"=?,"SCORE4"=? WHERE "NUM" = ?'); 
          pstmt.setString(1,s1);
          pstmt.setString(2,s2);
          pstmt.setString(3,s3);
          pstmt.setString(4,s4);
          pstmt.setString(5,num);
          pstmt.executeQuery();
          conn.commit();
		  pstmt.close();
		  conn.close();
		  $.response.setBody("Upload Successful");  
}
catch(err){  
             $.response.contentType = "text/plain";  
             $.response.setBody("Error while executing query: [" + err.message + "]");  
             $.response.returnCode = 200;  
}  
 

          