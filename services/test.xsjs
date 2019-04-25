function getDetails(){ 
          var pstmt="",objList=[];
          var conn = $.db.getConnection("WhatTheHack.services::cred"); 
          var query ='SELECT * from "WTH"."AUDIENCE" WHERE "FLAG"=\'1\'';
          pstmt = conn.prepareStatement(query);  
          var rs = pstmt.executeQuery();
				while(rs.next()){
				    var name = rs.getString(1);
				    var num=rs.getString(2);
				    var like=rs.getString(3);
				    var dislike = rs.getString(4);
				    objList.push({
				        Team_Number:num,
				        Team_Name:name,
				        Like:like,
				        Dislike:dislike
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
 

          