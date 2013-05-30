

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

var candidateList = new Array();
var missingTupleList = new Array();

function computeMissingList(){
	
	//Clean up the lists
	missingTupleList = new Array();  //Subject, School, Teacher
	
	if (window.localStorage.length - 1) {
		var i, key;
		for (i = 0; i < window.localStorage.length; i++) {
			key = window.localStorage.key(i);
			if (/Contacts:\d+/.test(key)) {
				var jsonStr = JSON.parse(window.localStorage.getItem(key));
				if(jsonStr.hired_missingClass=="yes"){
					var tuple={
						subject: jsonStr.hired_subject,
						school:jsonStr.hired_school,
						teacher:jsonStr.hired_name
					}
					missingTupleList[i]=tuple;
				}
			}
		}
		alert("Missings: "+missingTupleList);
		computeSubsMatchList();
	}
} 


function computeSubsMatchList(){
	candidateList = new Array();
	
	if (window.localStorage.length - 1) {
		var i,j, key;
		var k=0;
		for(i=0; i<missingTupleList.length;i++){
			var tuple = missingTupleList[i];
			var subject = tuple.subject;
			var school = tuple.school;
			var teacher = tuple.teacher;
			var grade = tuple.grade;
			//now search the list of substitutes for a match
			for (j = 0; j < window.localStorage.length; j++) {
				key = window.localStorage.key(j);
				if (/Substitutes:\d+/.test(key)) {
					var jsonStr = JSON.parse(window.localStorage.getItem(key));
					if((subHasListItem(subject,jsonStr.sub_acceptSubject)) && 
						(subHasListItem(school,jsonStr.sub_school))){
						jsonStr.CandidateSchool = school; //Keep track of school and subject which made this sub a candidate  
						jsonStr.CandidateSubject = subject;
						jsonStr.CandidateGrade = grade;
						if(subHasListItem(teacher,jsonStr.sub_teachersSubstituted))//verify if a teacher missing class was already substituted by the current sub.
							jsonStr.CandidateTeacherSubstituted = true;
						else
							jsonStr.CandidateTeacherSubstituted = false;
						candidateList[k]=jsonStr; //Stores the whole JSON string for that.
						k++;
					}
				}
			}
		}
		alert("Substitute Candidates: "+JSON.stringify(candidateList));
	}
} 


function subHasListItem(item, subItemList){
	if((subItemList==null) || (subItemList.length==0)){
		return false;
	}
	else{
		var strList = subItemList.split(",");
		for(var i=0;i<strList.length;i++){
			strList[i] = strList[i].replace(/^\s+|\s+$/g, " ");
		}
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

function computeRanking(){

//   Add 100 points if STSO rating is 1.
//   Add 50 points if STSO rating is 2.
//   Add 10 points for each match between vacancy school, grade level, and subject, with a preferred choice of the substitute's.
//   Add 5 points for each match between vacancy school, grade level, and subject, with an acceptable choice of the substitute's.
//   Add 1 point for each year of seniority.

	if((candidateList!=null)&&(candidateList.length>0)){
		for(var i=0;i<candidatesList.length;i++){
			var jstor = candidatesList[i]; 
			var points=0;
			points = points + candidateRating(jstor);
			points = points + candidateMatchesAcceptableSubjectsAndGrade(jstor);
			points = points + candidateMatchesPreferredSubjectAndGrade(jstor);
			points = points + candidateMatchesPreviousSubstitutedTeacherSubjectSchool(jstor);// adds 1000 points so the sub stays at the top.
			points = points + jstor.sub_seniority;
			jstor.ranking = points;
		}
	}
	//Sort teachers, Candidate.School, Candidate.Subject, ranking
	//sortCandidates();
	
	//display in a list
	
}

function candidateRating(jstor){
	var pts=0;
	if(jstor.sub_rating==1)
		pts=100;
	else
		if(jstor.sub_rating==1)
			pts=50;
	return pts;
}

function candidateMatchesAcceptableSubjectsAndGrade(jstor){
	if(( subHasListItem(jstor.CanditateSubject, jstor.sub_acceptSubject)) &&
			 (subHasListItem(jstor.CandidateGrade, jstor.sub_acceptGradeLevel)))
		return 5;
}

function candidateMatchesPreferredSubjectsAndGrade(jstor){
	if(( subHasListItem(jstor.CanditateSubject, jstor.sub_prefSubject)) &&
			 (subHasListItem(jstor.CandidateGrade, jstor.sub_prefGradeLevel)))
		return 10;
}

function candidateMatchesPreferredSubjectAndGrade(){
	function candidateMatchesPreferredSubjectsAndGrade(jstor){
		if(( subHasListItem(jstor.CanditateSubject, jstor.sub_acceptSubject)) &&
				 (subHasListItem(jstor.CandidateGrade, jstor.sub_acceptGradeLevel)))
			return 10;
	}
}

function candidateMatchesSubstitutedTeacherSubjectSchool(jstor){
	if(jstor.CandidateTeacherSubstituted)
		return 1000;
}

function openReport(){
	window.open("./report.html");
}
	