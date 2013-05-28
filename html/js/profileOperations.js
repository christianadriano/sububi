

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





//---- Report Function ---------------------------------------

var missingSubjectList = new Array();
var missingSchoolList = new Array();
var candidateList = new Array();

function computeMissingList(){
	
	//Clean up the lists
	missingSubjectList = new Array();
	missingSchoolList = new Array();
	
	
	if (window.localStorage.length - 1) {
		var i, key;
		for (i = 0; i < window.localStorage.length; i++) {
			key = window.localStorage.key(i);
			if (/Contacts:\d+/.test(key)) {
				var jsonStr = JSON.parse(window.localStorage.getItem(key));
				if(jsonStr.hired_missingClass=="yes"){
				missingSubjectList[i]=jsonStr.hired_subject;
					missingSchoolList[i]=jsonStr.hired_school;
				}
			}
		}
		alert("Missing Subjects: "+missingSubjectList+"\nMissing Schools: "+missingSchoolList);
		computeSubsMatchList();
	}
} 


function computeSubsMatchList(){
	candidateList = new Array();candidateList = new Array();
	
	if (window.localStorage.length - 1) {
		var i,j, key;
		var k=0;
		for(i=0; i<missingSubjectList.length;i++){
			var subject =missingSubjectList[i];
			var school = missingSchoolList[i];
			//now search the list of substitutes for a match
			for (j = 0; j < window.localStorage.length; j++) {
				key = window.localStorage.key(j);
				if (/Substitutes:\d+/.test(key)) {
					var jsonStr = JSON.parse(window.localStorage.getItem(key));
					if((subHasSubject(subject,jsonStr.sub_prefSubject)) && 
						(subHasSchool(school,jsonStr.sub_school))){
						candidateList[k]=jsonStr; //Stores the whole JSON string for that.
						k++;
					}
				}
			}
		}
		alert("Substitute Candidates: "+JSON.stringify(candidateList));
	}
} 


function subHasSubject(missingSubject, subSubjectList){
	if((subSubjectList==null) || (subSubjectList.length==0)){
		return false;
	}
	else{
		var strList = subSubjectList.split(",");
		for(var i=0;i<strList.length;i++){
			strList[i] = strList[i].replace(/^\s+|\s+$/g, " ");
		}
		var i=0;
		var found = false;
		while((i < strList.length) && (!found)) {
			if(missingSubject.toLowerCase()==strList[i].toLowerCase()){
				found=true;
			}
			i++;
		}
		return found;
	}
}

function subHasSchool(missingSchool, subSchoolList){
	if((subSchoolList==null) || (subSchoolList.length==0)){
		return false;
	}
	else{
		var strList = subSchoolList.split(",");
		for(var i=0;i<strList.length;i++){
			strList[i] = strList[i].replace(/^\s+|\s+$/g, " ");
		}
		var i=0;
		var found = false;
		while((i < strList.length) && (!found)) {
			if(missingSchool.toLowerCase()==strList[i].toLowerCase()){
				found=true;
			}
			i++;
		}
		return found;
	}
}


	