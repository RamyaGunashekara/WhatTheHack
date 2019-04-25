function getDetails(){ 
          var pstmt="",objList=[];
          var conn = $.db.getConnection("WhatTheHack.services::cred"); 
          var query ='SELECT TEAM_NUM,SUM(Q1),SUM(Q2),SUM(Q3),SUM(Q4) FROM "WTH"."JUDGE" GROUP BY "TEAM_NUM"';
          pstmt = conn.prepareStatement(query);  
          var rs = pstmt.executeQuery();
				while(rs.next()){
				    var num=rs.getString(1);
				    var q1=rs.getString(2);
				    var q2 = rs.getString(3);
				    var q3 = rs.getString(4); 
				    var q4 = rs.getString(5);
				    objList.push({
				        Team_Number:num,
				        Total:parseInt(q1)+parseInt(q2)+parseInt(q3)+parseInt(q4)
				    });
				}
				conn.commit();
				pstmt.close();
				conn.close();
				return objList;
				
				
}
try{  
        	$.response.contentType = 'application/json';  
            var response =  JSON.stringify( 
                 getDetails() 
                );
            $.response.setBody(response);
        }  
        catch(err){  
                  $.response.contentType = "text/plain";  
                  $.response.setBody("Error while executing query: [" + err.message + "]");  
                  $.response.returnCode = 200;  
        }  
 

          