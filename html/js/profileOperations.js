

// Data to be used

//Subjects and Schools without teacher
var missingList = new Array(); 
missingList[0] = ["Science","Pine"];
missingList[1] = ["Geography","Oak"];

//List of all substitute teachers, it is an Array of Arrays
var hiredTeacherList = new Array();
hiredTeacherList[0] = [["Mary Anning"], ["Science"], ["K","J"], ["Mahogany","Pine"]];
hiredTeacherList[1] = [["Mary Sommervile"], ["History","Geography"], ["H","A"], ["Oak","Adobe"]];
hiredTeacherList[2] = [["Lise Meitner"], ["Math","Science"], ["H"], ["Sequoia","Cedar"]];



var subTeacherList = new Array();
subTeacherList[0] = [["Marcus Antonius"], ["Science"], ["K","J"], ["Mahogany","Pine"]];
subTeacherList[1] = [["Joana D'Arc"], ["History","Geography"], ["H","A"], ["Oak","Adobe"]];
subTeacherList[2] = [["Marie Curie"], ["Math","Science"], ["H"], ["Sequoia","Cedar"]];
subTeacherList[3] = [["Caroline Herschel"], ["Science"], ["A"], ["Pine","Cedar"]];





//File handles the events sent by html pages from Sububi




//-------------------------- Search function --------------------------------------------------
function selectTeachersForSubjectSchoolList(subject, schoolList){
	console.log("Selecting subs for subject "+ subject+ "in schools: "+schoolList);
	return new Array();
}

function searchTeacherByName() {
    var input = document.getElementById('teacherName');
    var name = input.value;
    var registry=new Array();
    if (name) {
       registry = searchName(name);
       display(registry);
    } else {
        alert('Please enter a teacher name');
        input.focus();
    }
}


function searchName(name){
	var registryResult = new Array();
	
	return registry;
}

function display(registry){}




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
		var i=0;
		var schoolListStr;
		if(schoolList.length()>0){
			while(i<schoolList.lenght()){
				schoolListStr = schoolListStr+schoolList[i]+";";
				i++;
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
	
	