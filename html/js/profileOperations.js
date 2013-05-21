
//File handles the events sent by html pages from Sububi


//------------------------- TEACHER ABSENCE PAGE -----------------------------------------------
	//Update teacher absence information
	function saveTeacherAbsence(name, lastname){
		console.log("Saving Teacher Absence, name: "+name+", last name:"+lastName);		
	}
	
	function removeTeacherAbsence(name, lastname){
		console.log("Removing Teacher Absence, name: "+name+", last name:"+lastName);		
	}
	
//------------------------- SUBSTITUTE PREFERENCES PAGE -----------------------------------------------

	//Update Substitute Preferences
	function saveSubstitutePreferences (name, lastname, schoolList, subjectlist){
		console.log("Saving Substitute Preferences, name: "+name+", last name:"+lastName);
		console.log("School list:");
		int i=0;
		var schoolListStr;
		if(schoolList.length()>0){
			while(i<schoolList.lenght()){
				schoolListStr = schoolListStr+schoolList[i]+";";
			}
			console.log(schoolListStr);
		}
		else{
			console.log("School list empty;");
		}
		
		
		i=0;
		var subjecListStr;
		if(subjecListStr.length()>0){
			while(i<subjecListStr.lenght()){
				subjecListStr = subjecListStr+subjectlist[i]+";";
			}
			console.log(subjecListStr);
		}
		else{
			console.log("Subject list empty;");
		}
	}
	
	//Remove Substitute Preferences
	function removeSubstitutePreferences (name, lastname){
		console.log("Removing Preferences for Substitute, name: "+name+", last name:"+lastName);
	}

	//---------------------------------------------------------------------------------------------------
	
	