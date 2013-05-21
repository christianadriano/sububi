// Manipulates data to generate the daily report or missing classes and ranking of substitutes

//List of Schools
var schoolList = new Array();
schoolList[0] = "District 43";
schoolList[1] = "Adobe";
schoolList[2] = "Oak Tree";
schoolList[3] = "Sequoia";
schoolList[4] = "Pine Tree";
schoolList[5] = "Ficus";
schoolList[6] = "Cedar";
schoolList[7] = "Mahogany";

//List of Subjects
var subjectList = new Array();
subjectList[0] = "History";
subjectList[1] = "Literature";
subjectList[2] = "Biology";
subjectList[3] = "Physics";
subjectList[4] = "Math";
subjectList[5] = "English";

//Subjects without teacher
var subjectsMissingTeacher = new Array(); 

//List of all substitute teachers, it is an Array of Arrays
var substituteTeachers = new Array();

var subTeacherSample = new Array();
subTeacher[0] = "Chris";
subTeacher[1] = "Adriano";
subTeacher[2] = schoolList;
subTeacher[3] = subjectList;


//Sort functions
function selectTeachersForSubjectSchoolList(subject, schoolList){
	console.log("Selecting subs for subject "+ subject+ "in schools: "+schoolList);
	return new Array();
}

function sortSubsPerName(){}

function sortSubsPerLastName(){}

