
//---- Report Function ---------------------------------------

function generateReport(){
	initializeReport();
	var missingTupleList = discoverMissingClasses();
	var tableContentList = obtainSubstitutes(missingTupleList);
	var success = drawTable(tableContentList);
	return success;
}

function initializeReport(){
	
	//clean report table
	var body = document.getElementsByTagName("body")[0];
	cleanReport(body);	

	window.localStorage.setItem("Report:index",0);//Initialize to zero.
}


function discoverMissingClasses(){
	var missingTupleList = new Array(); //Subject, School, Teacher, Grade

	var k=0;
	for (var i = 0; i < window.localStorage.length; i++) {
		key = window.localStorage.key(i);
		if (/Contacts:\d+/.test(key)) {
			var jsonStr = JSON.parse(window.localStorage.getItem(key));
			if(jsonStr.hired_missingClass=="yes"){
				var tuple={
						subject: jsonStr.hired_subject,
						school:jsonStr.hired_school,
						teacher:jsonStr.hired_name,
						grade:jsonStr.hired_grade
				};
				console.log(tuple);
				missingTupleList[k]=tuple;
				k++;
				//console.log("Missing: "+tuple.subject+", "+tuple.school+", "+tuple.teacher+", "+ tuple.grade);
			}
		}
	}
	return missingTupleList;
}

	function obtainSubstitutes(missingTupleList){
		var tableContentList=new Array();
		//Traverses each list of candidates and draws the report table 
		for(var i=0;i<missingTupleList.length;i++){
			var tuple = missingTupleList[i];
			var sortedCandidateList = computeSubsMatchList(tuple,version);
			var tableTuple={tuple:tuple,
							candidateList:sortedCandidateList
			};
			tableContentList[i]= tableTuple;
		}
		return tableContentList;
	}
	
	function drawTable(tableList){
		
		for(var i=0;i<tableList.length;i++){
			var table = createTable();
			var tableTuple = tableList[i];
			var missingClassTuple = tableTuple.tuple;
			var sortedCandidateList = tableTuple.candidateList;
			if((sortedCandidateList==null) || (sortedCandidateList.length==0)){
				addTableRow(table,null,missingClassTuple);
			}
			else{
				for(var j=0; j<sortedCandidateList.length;j++){
					var jstor = sortedCandidateList[j];
					addTableRow(table,jstor,missingClassTuple);
				}
			}
		}
		return true;
	}


function generateKey(tuple){
	var result="";
	
	if(tuple.school!=null)
		result = result + tuple.school.toLowerCase();
	if(tuple.subject!=null)
		result = result + tuple.subject.toLowerCase();
	if(tuple.grade!=null)
		result = result + tuple.grade.toLowerCase();
	 if(tuple.teacher!=null)
			result = result + tuple.teacher.toLowerCase();
	console.log(result);
	
	return result;
}


function computeSubsMatchList(tuple, version){
	candidateList = new Array();

	if (window.localStorage.length - 1) {
		var j, key;
		var k=0;
		var subject = tuple.subject;
		var school = tuple.school;
		var teacher = tuple.teacher;
		var grade = tuple.grade;
		//now search the list of substitutes for a match
		for (j = 0; j < window.localStorage.length; j++) {
			key = window.localStorage.key(j);
			if (/Substitutes:\d+/.test(key)) {
				var jsonStr = JSON.parse(window.localStorage.getItem(key));
				//console.log("jsonStr: "+JSON.stringify(jsonStr));
				if( ((subHasListItem(subject,jsonStr.sub_acceptSubject)) || (subHasListItem(subject,jsonStr.sub_prefSubject)) ) &&
						( (subHasListItem(school,jsonStr.sub_acceptSchool)) || (subHasListItem(school,jsonStr.sub_prefSchool)) ) &&
						( (subHasListItem(grade,jsonStr.sub_acceptGradeLevel)) || (subHasListItem(grade,jsonStr.sub_prefGradeLevel)) )

				){
					jsonStr.CandidateSchool = school; //Keep track of school and subject which made this sub a candidate  
					jsonStr.CandidateSubject = subject;
					jsonStr.CandidateGrade = grade;
					
					//Handles the list of teachers with dates Name1,dd/MM/yyyy,Name2,dd/MM/yyyy
					jsonStr.sub_teacherDatesArray = obtainDates(jsonStr.sub_teachersSubstituted);
					jsonStr.sub_teachersField = obtainTeachersOnly(jsonStr.sub_teachersSubstituted);
					
					if(subHasListItem(teacher,jsonStr.sub_teachersSubstituted))//verify if a teacher missing class was already substituted by the current sub.
						jsonStr.CandidateTeacherSubstituted = teacher;
					else
						jsonStr.CandidateTeacherSubstituted = null;
					candidateList[k]=jsonStr; //Stores the whole JSON string for that.
					k++;
				}
			}
		}
		console.log("Substitute Candidates: "+JSON.stringify(candidateList));
		var sortedCandidates = computeRanking(candidateList);
		return sortedCandidates;
	}
} 

function obtainDates (sub_teachers){
	var datesList = new Array();
	if((sub_teachers!=null) && (sub_teachers.length>=10)){
		var list = sub_teachers.split(",");
		for(var i=0;i<list.length;i=i+2){
			var name = list[i];
			var date = list[i+1];
			datesList[name]=date;
		}
	}
	return datesList;
}

function obtainTeachersOnly(sub_teachers){
	var teachers = new Array();
	if((sub_teachers!=null) && (sub_teachers.length>=10)){
		var list = sub_teachers.split(",");
		for(var i=0;i<list.length;i=i+2){
			teachers[i]=list[i];
		}
	}
	return teachers;
}

function subHasListItem(item, subItemList){
	if((subItemList==null) || (subItemList.length==0)){
		return false;
	}
	else{
		var strList = subItemList.split(",");
		if(strList==undefined) //There are no commas to remove.
			strList = subItemList;
		var i=0;
		var found = false;
		while((i < strList.length) && (!found)) {
			if(item.toLowerCase()==strList[i].toLowerCase()){
				found=true;
			}
			i++;
		}
		return found;
	}
}

///------------------ Computes the Ranking -----------------------------------------------

function computeRanking(candidateList){
	
//   Add 100 points if STSO rating is 1.
//   Add 50 points if STSO rating is 2.
//   Add 10 points for each match between vacancy school, grade level, and subject, with a preferred choice of the substitute's.
//   Add 5 points for each match between vacancy school, grade level, and subject, with an acceptable choice of the substitute's.
//   Add 1 point for each year of seniority.

	if((candidateList!=null)&&(candidateList.length>0)){
		for(var i=0;i<candidateList.length;i++){
			var jstor = candidateList[i]; 
			jstor.points= calculateTotalPoints(jstor);
			console.log("Points: "+JSON.stringify(jstor)+ " i="+i);
			candidateList[i] = jstor; //store the json back to the list of candidates
		}
	}	
	//Sort teachers, Candidate.School, Candidate.Subject, ranking
	var sortedCandidateList = sortCandidate(candidateList);
	
	return sortedCandidateList;
}


function calculateTotalPoints(jstor){
	var points=0;
	jstor.points=0;
	points = points + rating(jstor.sub_rating);
	points = points + matchAcceptableSubjectsAndGrade(jstor.CandidateSubject, jstor.sub_acceptSubject,jstor.CandidateGrade, jstor.sub_acceptGradeLevel);
	points = points + matchPreferredSubjectAndGrade(jstor.CandidateSubject, jstor.sub_prefSubject,jstor.CandidateGrade, jstor.sub_prefGradeLevel);
	points = points + matchPreviouslySubstitutedTeacher(jstor.CandidateTeacherSubstituted,jstor.sub_teacherDatesArray);// adds 1000 points so the sub stays at the top.
	points = points + parseInt(jstor.sub_seniority);
	
	return points;
}



function rating(subrating){
	var pts=0;
	if(subrating==1)
		pts=100;
	else
		if(subrating==2)
			pts=50;
	return pts;
}

function matchPreferredSubjectAndGrade(candidateSubject, subPrefSubject,candidateGrade, subPrefGradeLevel){
	if(( subHasListItem(candidateSubject, subPrefSubject)) &&
			 (subHasListItem(candidateGrade, subPrefGradeLevel)))
		return 10;
	else return 0;
}

function matchAcceptableSubjectsAndGrade(candidateSubject, subAcceptSubject,candidateGrade, subAcceptGradeLevel){
	if(( subHasListItem(candidateSubject, subAcceptSubject)) &&
			 (subHasListItem(candidateGrade, subAcceptGradeLevel)))
		return 0;
	else return 5;
}

/** If teacher substituted the absent teacher, then add points based on the how long the substitution happened
 * Ex. Date of substitution = February 9 2012. Today is November 04 2013.
 * points difference of months between today and the Date of Substitution = nov/2013 - feb/2012 = 21
 * @param candidateTeacherSubstituted
 * @param subTeacherDatesArray
 * @returns {Number}
 */ 
function matchPreviouslySubstitutedTeacher(candidateTeacherSubstituted,subTeacherDatesArray){
	if(candidateTeacherSubstituted!=null)
		return 50;
	else
		return 0;
}

function sortCandidate(list){
	var arrayOfPoints=[];
	for(var i=0;i<list.length;i++){
		var jstor = list[i];
		arrayOfPoints[i]=jstor.points;
	}
	arrayOfPoints.sort(function(a,b) {return b - a;});
	console.log(JSON.stringify(arrayOfPoints));
	
	var sortedList=[];
	var k=0;
	for(i=0;i<arrayOfPoints.length;i++){
		var points = arrayOfPoints[i];
		for(var j=0;j<list.length;j++){
			var jstor = list[j];
			//Search for a register with the same points.
			if(jstor.points == points){
				if(jstor.CandidateTeacherSubstituted!=null){//Means that sub substituted the teacher at some specific date
					jstor.points =0; //Won´t display points, but name/date.
				}
				sortedList[k]= jstor;
				k++;
			}
		}
	}
	return sortedList;
}

//------------------------------------------------- MANAGE REPORT TABLE -----------------------------------------------------------
function createTable() {
		 
	 // create elements <table> and a <tbody>
	 var tbl = document.createElement("report-table");
	 tbl.setAttribute("id", "report-table");
	 var tblBody = document.createElement("tbody");
	// tbl.setAttribute('border','1');
	 var $tr = document.createElement("tr"), $th;
	 
	 $th = document.createElement("th");
	 $th.appendChild(document.createTextNode("Points"));
	 $tr.appendChild($th);
	 
	 $th = document.createElement("th");
	 $th.appendChild(document.createTextNode("Name"));
	 $tr.appendChild($th);
	 
	 $th = document.createElement("th");
	 $th.appendChild(document.createTextNode("PIN"));
	 $tr.appendChild($th);
	 
	 $th = document.createElement("th");
	 $th.appendChild(document.createTextNode("Telephone"));
	 $tr.appendChild($th);
	 
	 $th = document.createElement("th");
	 $th.appendChild(document.createTextNode("School"));
	 $tr.appendChild($th);
	 
	 $th = document.createElement("th");
	 $th.appendChild(document.createTextNode("Subject"));
	 $tr.appendChild($th);
	 
	 $th = document.createElement("th");
	 $th.appendChild(document.createTextNode("Grade"));
	 $tr.appendChild($th);
	 
	 $th = document.createElement("th");
	 $th.appendChild(document.createTextNode("Teacher to Substitute"));
	 $tr.appendChild($th);
	 
	 tbl.appendChild($tr);
	 
	 tbl.setAttribute("id","report-table");
	 tbl.appendChild(tblBody);
//	 document.getElementsByTagName('body')[1].appendChild(tbl);
	 document.body.appendChild(tbl);
	 
	 return tbl;
}


function addTableRow(table, jstor,tuple) {
	var ReportTable = table; //document.getElementById("report-table");
	var index = window.localStorage.getItem("Report:index");
	var $tr = document.createElement("tr"), $td;
	$td = document.createElement("td");
	var value,name,pin,phone;
	school=tuple.school;
	subject = tuple.subject;
	grade=tuple.grade;
	teacher = tuple.teacher;
	if(jstor==null){
		value = "No options";
		name = "-";
		pin="-";
		phone="-";
	}
	else{
		if(jstor.points!=0){
			value = jstor.points;
		}
		else{
			var teacherName = jstor.CandidateTeacherSubstituted;
			var date = jstor.sub_teacherDatesArray[teacherName];
			value = teacherName+","+date;
		}
		name = jstor.sub_name;
		pin=jstor.sub_PIN;
		phone=jstor.sub_phone;
	}
	
	$td.innerHTML = '<a onclick="alert(' +'\''+value+'\''+ ');" >'+ value+ '</a>';
	//$td.appendChild(document.createTextNode(value));
	//$td.setAttribute("value",value);
	$tr.appendChild($td);

	$td = document.createElement("td");
	$td.innerHTML = '<a onclick="alert(' +'\''+name+'\''+ ');" >'+ name+ '</a>';
	//$td.appendChild(document.createTextNode(name));
	$tr.appendChild($td);

	$td = document.createElement("td");
	$td.innerHTML = '<a onclick="alert(' +'\''+pin+'\''+ ');" >'+ pin+ '</a>';
	//$td.appendChild(document.createTextNode(pin));
	$tr.appendChild($td);

	$td = document.createElement("td");
	$td.innerHTML = '<a onclick="alert(' +'\''+phone+'\''+ ');" >'+ phone+ '</a>';
	//$td.appendChild(document.createTextNode(phone));
	$tr.appendChild($td);

	$td = document.createElement("td");
	$td.innerHTML = '<a onclick="alert(' +'\''+school+'\''+ ');" >'+ school+ '</a>';
	//$td.appendChild(document.createTextNode(school));
	$tr.appendChild($td);

	$td = document.createElement("td");
	$td.innerHTML = '<a onclick="alert(' +'\''+subject+'\''+ ');" >'+ subject+ '</a>';
	//$td.appendChild(document.createTextNode(subject));
	$tr.appendChild($td);

	$td = document.createElement("td");
	$td.innerHTML = '<a onclick="alert(' +'\''+grade+'\''+ ');" >'+ grade+ '</a>';
	//$td.appendChild(document.createTextNode(grade));
	$tr.appendChild($td);

	$td = document.createElement("td");
	$td.innerHTML = '<a onclick="alert(' +'\''+teacher+'\''+ ');" >'+ teacher+ '</a>';
	//$td.appendChild(document.createTextNode(teacher));
	$tr.appendChild($td);


	$tr.setAttribute("id", "report-"+index);

	index++;

	//Store it for later use
	window.localStorage.setItem("Report:index",index);

	ReportTable.appendChild($tr);
}

function cleanReport(body){
	
	var h2 = document.getElementById("report-title");
	if(h2!=null)
		body.removeChild(h2);
	
	h2= document.createElement("h2");
	h2.setAttribute("id", "report-title");
	h2.appendChild(document.createTextNode("Report - Ranking of Substitutes per School, Subject and Grade"));
	body.appendChild(h2);
	
	var list = body.getElementsByTagName("report-table");
	if(list!=null){
		var counter = list.length;
		for(var i=0;i<counter;i++){ //it works as stack
			body.removeChild(list[0]);
		}
	}
}