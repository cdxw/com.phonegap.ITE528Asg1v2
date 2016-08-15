
var taskObject = new Array();

// default image


	//cameraImage.src = "images/imagePlaceholder.png";
	
function onLoad(){

	document.addEventListener("deviceready", onDeviceReady, false);
		
	}
	function onDeviceReady()
	{
	
	}
	
	
// Get the photo
	function capturePhotoWithCamera() {
      TakePhoto(Camera.PictureSourceType.CAMERA);
    }
	
	function onSuccess(imageData){
		var smallImage =  document.getElementById('smallImage');
		smallImage.style.display = 'block';
		smallImage.src = "data:image/jpeg;base64," + imageData;
		getGPS();
			
	}
	function TakePhoto(sourceType)
	{
		var camOptions = {
			quality:50,
			destinationType: Camera.DestinationType.DATA_URL,
			sourceType: sourceType,
			correctOrientation: true
	};
	navigator.camera.getPicture(onSuccess, onFail, camOptions);
	
	}
	
	function onFail(message) {
      alert('Failed because: ' + message);
    }

	function getGPS()
	{
		navigator.geolocation.getCurrentPosition(onGeoSuccess , onError);
		
	}
	
	// add the successful aquisition of GPS coords to the page
	var onGeoSuccess = function( position ) {
		
		var gpsDIV = document.getElementById("gpsDIV");
		
		gpsDIV.style.display = 'block';		
		
		var imageGPSLabel = document.getElementById("imageGPSLabel").innerHTML = "Latitude:" + position.coords.latitude + '\n' +
																				'Longitude: ' + position.coords.longitude;		      
    };
	
	function onError(error) {
        alert('code: '    + error.code    + '\n' +
              'message: ' + error.message + '\n');
    }
	
	// contacts
	
	function emailList( listType )
{
	
	var emailBody = document.getElementById('emailBody');
		
	var emailBodyArray = new Array();
	
	// add complete items to mail body
	if(listType == "complete"){		
		for (var i = 0; i < taskObject.length; i++) {
        		if (taskObject[i].taskComplete == true) {
					emailBodyArray.push("Title: "+ taskObject[i].title + ". Description: "+ taskObject[i].description + ". Due Date: "+ taskObject[i].dueDate + "\n");
        		}
		}		
		
	}else{ // add incomplete items to mail body
		for (var i = 0; i < taskObject.length; i++) {
        		if (taskObject[i].taskComplete == false) {
					emailBodyArray.push("Title: "+ taskObject[i].title + ". Description: "+ taskObject[i].description + ". Due Date: "+ taskObject[i].dueDate + "\n");
        		}
		}
		var str = emailBodyArray.concat();
				emailBody.innerHTML = str;
	}
	
	$.mobile.changePage("#emailList",{reverse:false, transition:"slide"});
	
}   

function sendEmail()
{
	// get the values of the text fields
	var emailTo = document.getElementById( "emailTo" ).value;
	if (validateInput( emailTo, "Please enter email destination")) return;
	
	
	var emailSubject = document.getElementById( "emailSubject" ).value;
	if (validateInput( emailSubject, "Please enter email subject" )) return;
	console.log(emailSubject);
	
	var emailBody = document.getElementById( "emailBody" ).innerHTML;
	if (validateInput( emailBody, "Please enter body content")) return;
	console.log(emailBody);
	
	// add values to the mail body
	var link = "mailto:" + escape(emailTo)
             + "?cc="
             + "&subject=" + escape(emailSubject)
             + "&body=" + escape(emailBody)
    ;


    window.location.href = link;
}
function contactList()
{
	var options = new ContactFindOptions();
    	options.multiple = false;
    options.filter = "";
    	var fields = ["emails"];
	
		navigator.contacts.pickContact( onContactSuccess, onContactError, options );
}
	
//navigator.contacts.find(filter, onContactSuccess, onContactError, options);

function onContactSuccess( contacts ) {
	
   //alert('The following contact has been selected:');
   document.getElementById("emailTo").value = JSON.stringify( contacts.emails );
};

function onContactError( contactError ) {
    alert('onError!' + contactError);
};


	//list storage
	
	function task(id, title, description, dueDate, taskComplete, cameraImage)
	{
	
		this.id = id;
		this.title = title;
		this.description = description;
		this.dueDate = dueDate;
		this.taskComplete = taskComplete;
		this.cameraImage = cameraImage;
		
	}
	function getTaskData()
	{
		console.log("entering getTaskData");
		
		var cameraImage = new Image();
		var smallImage =  document.getElementById('smallImage');	
		cameraImage.src = smallImage.src
		 
		var taskTitle = document.getElementById("taskTitle").value;
		// Validate entry
	  	if (validateInput(taskTitle, "Please enter a task title")) return;
        
		var taskDescription = document.getElementById("taskDescription").value;
		// Validate entry
		if (validateInput(taskDescription, "Please enter a task description")) return;
        
		var taskDueDate = document.getElementById("taskDueDate").value;
		// Validate entry
		if (validateInput(taskDueDate, "Please enter a task due date")) return;
		
		var taskComplete = document.getElementById("checkbox-1").checked;
		
		var currentID = document.getElementById("taskID").value;
		
		var doesExist = taskExists( currentID );
		
		if(!doesExist){ // current doesnt exists
			
			currentID  = new Date().getTime();
			
		}
		
		if(cameraImage == "")
		{
			console.log("no image");
			//cameraImage.src = "images/home.png";
		}
		
		var taskItem = new task( currentID, taskTitle, taskDescription, taskDueDate, taskComplete, cameraImage);
		
		taskObject.push( taskItem );		
		
		saveTaskItem( taskItem );
		
		addTaskToPage( taskItem );
		
		
	}
	
	function saveTaskItem( taskItem )
	{

		if( localStorage ){
			var key = taskItem.id;
			var value = JSON.stringify( taskItem );
			localStorage.setItem(key, value);
			
			
		}else
		{
			console.log("error saving to local storage");
		}
		resetForm();
	}
	
	function getTaskItems()
	{
		console.log("entering get task Items");
		if(localStorage){
			
			for (var i = 0; i < localStorage.length; i++ ){
				// todo 
				// add complete or incomplet if statement
				var key = localStorage.key(i);
				var value = localStorage.getItem( key );
				var taskItem = JSON.parse( value );
				taskObject.push( taskItem );	
			}
			addTasksToPage();
		}
	}
	
	
	function addTaskToPage( taskItem )
	{
		
		var completedOutput = document.getElementById("completedOutput");
		var incompletedOutput = document.getElementById("incompletedOutput");

    	var span = createNewTodo( taskItem );
		span.id = taskItem.id;
		
		if( taskItem.taskComplete == false)
		{
			console.log("ADD TASK TO PAGE incomplete = " );
			incompletedOutput.appendChild( span);
		}else
		{
			console.log("ADD TASK TO PAGE completedTask = ");
			completedOutput.appendChild( span );
		}
		
		
		$.mobile.changePage("#list",{reverse:false, transition:"slide"});
	
	}
	
	
	
	function createNewTodo( taskItem ) 
	{
		var button = document.createElement("input");
		button.type = "button";
		//var li = document.createElement("li");
    	var spanTodo = document.createElement("span");
    	//spanTodo.className = "ui-btn ui-input-btn ui-corner-all ui-shadow";
		spanTodo.value = taskItem.id;
		
		button.name = taskItem.id;
			button.value = taskItem.title;
			//button.id = taskItem.id;
			button.onclick = function()
				{
					editTask( taskItem.id );
				};
		spanTodo.appendChild( button );
		 
		return spanTodo ;
	}
	
	function deleteItem( id ) {
		
		console.log("delete ID:" + id);
    	localStorage.removeItem(id);

    // find and remove the item in the array
    for (var i = 0; i < taskObject.length; i++) {
        if (taskObject[i].id == id) {
            taskObject.splice(i, 1);
            break;
        }
    }
	
	
	var btn = document.getElementById( id ).remove();
   
	resetForm();
	$.mobile.changePage("#list",{reverse:false, transition:"slide"});
	
}    
	
 
	function taskExists( currentID )
{

	var doesExist = false;
	
	for (var i = 0; i < taskObject.length; i++) {
        
		if (taskObject[i].id == currentID) {
			deleteItem( currentID )
			doesExist = true;
        }
    }

	return doesExist;
	
}

function resetForm(){
			document.getElementById("todo-form").reset();
			document.getElementById("taskID").value = "";
			document.getElementById("taskTitle").value = "";
			document.getElementById("taskDescription").value = "";
			document.getElementById("taskDueDate").value = "";
			
			//document.getElementById("completeChk").checked = 'false';
			var isChecked = document.getElementById("checkbox-1").checked;
			
			if (isChecked)
			{
				$('#checkbox-1').attr('checked', false).checkboxradio('refresh');
			}
			// reset image
			smallImage =  document.getElementById('smallImage');
			smallImage.src = "images/imagePlaceholder.png";
			
			document.getElementById("imageGPSLabel").innerHTML = "";
			var gpsDIV = document.getElementById("gpsDIV");
			gpsDIV.style.display = 'none';
		
			console.log("RESETTED THE FORM");
}




function editTask( id )
{
	
	
	
	// create a delete btn
	var delBtnDiv =  document.getElementById("delBtnDiv");
	delBtnDiv.className = "ui-btn ui-input-btn ui-btn-a ui-corner-all ui-shadow";
	delBtnDiv.innerHTML = "Delete";
	
	var button = document.createElement("input");
		button.type = "button";
		button.value = "Delete Task";
		button.id = "delBtn";
		button.onclick = function()
				{
									
					deleteItem( id );
				};
	
	delBtnDiv.appendChild(button);
	
	for (i = 0; i < taskObject.length; i++) {
		
		if( id == taskObject[i].id)
		{

			document.getElementById("taskID").value = taskObject[i].id;
			document.getElementById("taskTitle").value = taskObject[i].title;
			document.getElementById("taskDescription").value = taskObject[i].description;
			document.getElementById("taskDueDate").value = taskObject[i].dueDate;
			
			// check the completed checkbox if complete
			var isComplete = taskObject[i].taskComplete;
			$('#checkbox-1').attr('checked', isComplete).checkboxradio('refresh');
			
			var cameraPicImage = new Image();
			cameraPicImage = taskObject[i].cameraImage;
			
			var smallImage =  document.getElementById('smallImage');

			if( cameraPicImage != "" )
			{
				smallImage.src = cameraPicImage.src;
				
			}
		}
	}
	
	$.mobile.changePage("#new",{reverse:false, transition:"slide"});
	
}
function showCompleted()
	{
		var incompletedOutput = document.getElementById("incompletedOutput");
		var completedOutput = document.getElementById("completedOutput");
		completedOutput.style.display = 'block';
		incompletedOutput.style.display = 'none';
	}
	// Output Div showing the incomplete
	function showIncomplete()
	{
		// show incomplete tasks
		// hide completed tasks
		var incompletedOutput = document.getElementById("incompletedOutput");
		var completedOutput = document.getElementById("completedOutput");
		incompletedOutput.style.display = 'block';
		completedOutput.style.display = 'none';
		
	}
	
	// validate the string input 
	function validateInput( value, msg ) {
    if (value == null || value == "") {
        return true;
    	}
    return false;
	}
	
	// validate the datefield
	function validateDate(value, msg ){
	var date_regex = /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/ ;
		
			if (value != null || value != "") {
        			if(!(date_regex.test( value )))
					{
						console.log("doesnt pass");
						return true;
					}
					console.log("null");
					return true;				
    			}
				console.log("pass");
				return false;
			
	}


function exitApp() { navigator.app.exitApp(); }
