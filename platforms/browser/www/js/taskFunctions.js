
var taskObject = new Array();

// default image
var cameraImage = "";

	//cameraImage.src = "images/imagePlaceholder.png";
	
function onLoad(){

	document.addEventListener("deviceready", onDeviceReady, false);
		
	}
	function onDeviceReady()
	{
	
		//alert(navigator.contacts);
		//pictureSource=navigator.camera.PictureSourceType
		//var submitTask = document.getElementById("submit");
		//submitTask.onclick = getTaskData();
		//email();
	
		
	}
	
	
// Get the photo
	function capturePhotoWithCamera() {
      TakePhoto(Camera.PictureSourceType.CAMERA);
    }
	
	function onSuccess(imageData){
		var smallImage =  document.getElementById('smallImage');
		smallImage.style.display = 'block';
		smallImage.src = "data:image/jpeg;base64," + imageData;
		//cameraImage = "data:image/jpeg;base64," + imageData;
		//cameraImage = "data:image/jpeg;base64," + imageData;
		
		//var imgAsDataURL = smallImage.toDataURL("data:image/jpg;base64,");
		
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
	
	var onGeoSuccess = function( position ) {
		var gpsDIV = document.getElementById("gpsDIV");
		gpsDIV.style.display = 'block';
		
		//var lat = position.coords.latitude;
		
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
	$.mobile.changePage("#emailList",{reverse:false, transition:"slide"});
	console.log(listType);
}
function contactList()
{
		navigator.contacts.pickContact(function( contact ){
        //console.log('The following contact has been selected:' + JSON.stringify(contact));
		document.getElementById("emailTo").innerHTML = JSON.stringify( contact );
    },function(err){
        console.log('Error: ' + err);
    });
}
	
//navigator.contacts.find(filter, onContactSuccess, onContactError, options);

function onContactSuccess( contacts ) {
   
   
};

function onContactError(contactError) {
    alert('onError!');
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
    	//var id = e.target.id;
    	//var key = id;
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
	
	//console.log("does exist currentID = " + currentID);
	
	for (var i = 0; i < taskObject.length; i++) {
        
		if (taskObject[i].id == currentID) {
			deleteItem( currentID )
			doesExist = true;
        }
    }
	
	//console.log("returns = " + doesExist);
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
		//button.className = "ui-btn ui-input-btn ui-btn-a ui-corner-all ui-shadow";
		//button.onclick = deleteItem;
		button.onclick = function()
				{
									
					deleteItem( id );
				};
	
	//taskObject = window.localStorage.getArray("taskObjectStoredD");	
	//var taskObject = JSON.parse(window.localStorage.getItem('currentID'));

	delBtnDiv.appendChild(button);
	
	//var isComplete = taskObject.complete;
	
	
	for (i = 0; i < taskObject.length; i++) {
		
		//console.log("taskObject[i].id:  " + taskObject[i].id);
		
		if( id == taskObject[i].id)
		{

			document.getElementById("taskID").value = taskObject[i].id;
			document.getElementById("taskTitle").value = taskObject[i].title;
			document.getElementById("taskDescription").value = taskObject[i].description;
			document.getElementById("taskDueDate").value = taskObject[i].dueDate;
			
			// check the completed checkbox if complete
			var isComplete = taskObject[i].taskComplete;
			$('#checkbox-1').attr('checked', isComplete).checkboxradio('refresh');
	
			var cameraPicImage = taskObject[i].cameraImage;
			
			console.log("cameraimage = " + cameraPicImage);
			
			
			
			if( cameraPicImage != "" )
			{
				alert("camera pic is not blank:");
				
				//smallImage.src = cameraPicImage.toURL();
			}else
			{
				var smallImage =  document.getElementById('smallImage');
				alert("camera pic is blank:");
			}
			//alert("camera pic"+ cameraPicImage);
			//
			
			//console.log("cameraimage = " + cameraPicImage);
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
	
	function validateInput(value, msg) {
    if (value == null || value == "") {
        alert(msg);
        return true;
    	}
    return false;
	}


function exitApp() { navigator.app.exitApp(); }
