
$("#searchInp").on("keyup", function () {
  var input, filter, table, tr, td, i, txtValue;
  input = $(this).val().toLowerCase();
  table = $(".tab-pane.active table"); // Get the active table in the current tab
  tr = table.find("tr");

  tr.each(function () {
    td = $(this).find("td:first-child");

    if (td) {
      txtValue = td.text().toLowerCase();
      if (txtValue.indexOf(input) > -1) {
        $(this).show();
      } else {
        $(this).hide();
      }
    }
  });
});




$("#refreshBtn").click(function () {
  if ($("#personnelBtn").hasClass("active")) {
    refreshPersonnelTable();
  } else if ($("#departmentsBtn").hasClass("active")) {
    refreshDepartmentTable();
  } else if ($("#locationsBtn").hasClass("active")) {
    refreshLocationTable();
  }
});



$("#filterBtn").click(function () {
  if ($("#personnelBtn").hasClass("active")) {
    $('#PersonnelfilterModal').show();
    $('#PersonnelfilterModal').modal('show');
    if ($("#personnelBtn").hasClass("active")) {
      $.ajax({
        url: 'libs/php/getAllDepartments.php',
        type: 'GET',
        dataType: 'json',
        success: function (result) {
          if (result.status.code === '200') {
            populateDepartmentfilterSelection(result.data);
          } else {
            console.error('Error fetching department data');
          }
        },
        error: function (jqXHR, textStatus, errorThrown) {
          console.error('AJAX error:', textStatus, errorThrown);
        }
      });
    }
  } else if ($("#departmentsBtn").hasClass("active")) {
  }


});





$("#addBtn").click(function () {
  if ($("#personnelBtn").hasClass("active")) {
    openAddPersonnelModal();
  } else if ($("#departmentsBtn").hasClass("active")) {
    openAddDepartmentModal();
  } else if ($("#locationsBtn").hasClass("active")) {
    openAddLocationModal();
  }
});
   

   
 
function openAddPersonnelModal() {
  $('#addPersonnelModal').modal('show');
   
   
}
$("#addPersonnelModal").on("show.bs.modal", function (e) {
  //Logic to fetch and populate departments only if the Personnel tab is active
  
    // console.log("getting departments");
    $.ajax({
      url: 'libs/php/getAllDepartments.php',
      type: 'GET',
      dataType: 'json',
      success: function (result) {
        // console.log(result);
        if (result.status.code === '200') {
          $("#addPersonnelEmployeeID").val('');
          $("#addPersonnelFirstName").val('');
          $("#addPersonnelLastName").val('');
          $("#addPersonnelJobTitle").val('');
          $("#addPersonnelEmailAddress").val('');
      
          
            populateDepartmentSelection(result.data);
            // Code to be executed after the 3-second delay
           

        
          
        } else {
          console.error('Error fetching department data');
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.error('AJAX error:', textStatus, errorThrown);
      }
    });
  
});

  


// Function to open the "add department" modal
function openAddDepartmentModal() {
  // Assuming you have a modal with the ID 'addDepartmentModal'
  $('#addDepartmentModal').modal('show');

 

}

// Event listener for the "show.bs.modal" event of the "addDepartmentModal"
$("#addDepartmentModal").on("show.bs.modal", function (e) {
  // Fetch location data when the modal is shown
  fetchLocationsForAddDepartment();
});

// Function to fetch locations for the "add department" modal
function fetchLocationsForAddDepartment() {
  $.ajax({
    url: 'libs/php/getAllLocation.php',
    type: 'GET',
    dataType: 'json',
    success: function (result) {
      if (result.status.code === '200') {
        
        $("#addDepartmentName").val('');
        $("#addLocation").empty(); // Assuming it's a dropdown/select element
        populateLocationSelection(result.data, "#addLocation");
         
        // Set the modal title to "Add Department"
        $("#addDepartmentModal .modal-title").text("Add Department");
      } else {
        console.error('Error fetching location data');
        // Set the modal title to "Error retrieving data"
        $("#addDepartmentModal .modal-title").text("Error retrieving data");
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.error('AJAX error:', textStatus, errorThrown);
      // Set the modal title to "Error retrieving data"
      $("#addDepartmentModal .modal-title").text("Error retrieving data");
    }
  });
}

// Function to populate a dropdown/select with location data
function populateLocationSelection(locations, selectElement) {

  // console.log(locations);

  // console.log(selectElement);
  
  var $select = $(selectElement);
  $.each(locations, function(index, location) {
    $select.append($('<option>', {
      value: location.id,
      text: location.name
    }));
  });
}




function openAddLocationModal() {
  $('#addLocationModal').modal('show');
  $("#editLocationID").val('');
  $("#editLocationName").val('');
}


var departmentSelect = $('#addPersonnelDepartment');
function populateDepartmentSelection(departments) {
  var departmentSelect = $('#addPersonnelDepartment');
  departmentSelect.empty(); 

  departments.forEach(function (department) {
    departmentSelect.append($('<option></option>').attr('value', department.id).text(department.name));
  });
}

function populateDepartmentfilterSelection(departments) {
  var departmentSelect = $('#Personnelfilter');
  departmentSelect.empty(); 

  departments.forEach(function (department) {
    departmentSelect.append($('<option></option>').attr('value', department.id).text(department.name));
  });
}



// $("#personnelBtn").click(function () {
//   $("#filterBtn").show();
//   // Call function to refresh personnel table
//   refreshPersonnelTable();
// });

function refreshPersonnelTable() {
  
  $.ajax({
    url: 'libs/php/refreshPersonnel.php',
    dataType: 'json',
    success: function (result) {
      if (result && result.status && result.status.code === '200') {
        populatePersonnelTable(result.data);
      } else {
        console.error('Error refreshing personnel data. Server returned:', result); // Log full server response for analysis
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.error('AJAX error:', textStatus, errorThrown);
    }
  });
}
function filterPersonnelTable() {
  var filterDepartmentName = $("#Personnelfilter").val().toString();
  $.ajax({
    url: 'libs/php/filterPersonnel.php',
    type: "GET",
    dataType: 'json',
    data: {
      departmentname: filterDepartmentName
      
    },
    success: function (result) {
      // console.log(result);
      if (result && result.status && result.status.code === '200') {
        populatePersonnelTable(result.data);
      } else {
        console.error('Error filtering personnel data. Server returned:', result); // Log full server response for analysis
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.error('AJAX error:', textStatus, errorThrown);
    }
  });
}

// $("#departmentsBtn").click(function () {
//   $("#filterBtn").show();
  
//   refreshDepartmentTable();
// });


 // logic for disabling filter btn in department 
$("#departmentsBtn").click(function () {
  // Show the filter button
  $("#filterBtn").show();

  // Disable the filter button
  $("#filterBtn").attr("disabled", true);

  // Call function to refresh department table
  refreshDepartmentTable();
});

$("#locationBtn").click(function () {
  // Show the filter button
  $("#filterBtn").show();

  // Disable the filter button
  $("#filterBtn").attr("disabled", true);

  // Call function to refresh department table
  refreshLocationTable();
});


$("#personnelBtn").click(function () {
  // Show the filter button
  $("#filterBtn").show();

  // Disable the filter button
  $("#filterBtn").attr("disabled", false);

  // Call function to refresh department table
  refreshPersonnelTable();
});










 




function refreshDepartmentTable() {
 
  $.ajax({
    url: 'libs/php/refreshDepartment.php',
    dataType: 'json',
    success: function (result) {
      if (result && result.status && result.status.code === '200') {
        populateDepartmentsTable(result.data);
      } else {
        console.error('Error refreshing department data. Server returned:', result); // Log full server response for analysis
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.error('AJAX error:', textStatus, errorThrown);
    }
  });
}

// $("#locationsBtn").click(function () {

//   // Call function to refresh location table
//   $("#filterBtn").show();
//   refreshLocationTable();
// });

function refreshLocationTable() {
  
  $.ajax({
    url: 'libs/php/refreshLocation.php',
    dataType: 'json',
    success: function (result) {
      if (result && result.status && result.status.code === '200') {
        populateLocationsTable(result.data);
      } else {
        console.error('Error refreshing location data. Server returned:', result); // Log full server response for analysis
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.error('AJAX error:', textStatus, errorThrown);
    }
  });
}

// edit Personnel Modal
$("#editPersonnelModal").on("show.bs.modal", function (e) {
  $.ajax({
    url: "libs/php/getPersonnelByID.php",
    type: "POST",
    dataType: "json",
    data: {
      id: $(e.relatedTarget).attr("data-id")
    },
    success: function (result) {
      var resultCode = result.status.code;

      if (resultCode == 200) {
        // Update the hidden input with the employee id
        $("#editPersonnelEmployeeID").val(result.data.personnel[0].id);

        // Populate other input fields with personnel details
        $("#editPersonnelFirstName").val(result.data.personnel[0].firstName);
        $("#editPersonnelLastName").val(result.data.personnel[0].lastName);
        $("#editPersonnelJobTitle").val(result.data.personnel[0].jobTitle);
        $("#editPersonnelEmailAddress").val(result.data.personnel[0].email);

        // Clear the department select dropdown
        $("#editPersonnelDepartment").empty();

        // Populate the department select dropdown with retrieved data
        result.data.department.forEach(function (dept) {
          $("#editPersonnelDepartment").append(
            $("<option>", {
              value: dept.id,
              text: dept.name
            })
          );
        });

        // Set the department in the dropdown based on the retrieved data
        $("#editPersonnelDepartment").val(result.data.personnel[0].departmentID);
      } else {
        // Handle errors if the result code is not 200
        $("#editPersonnelModal .modal-title").replaceWith("Error retrieving data");
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      // Handle AJAX errors
      // console.error("AJAX error:", textStatus, errorThrown);
      $("#editPersonnelModal .modal-title").replaceWith("Error retrieving data");
    }
  });
});




// Executes when the form button with type="submit" is clicked
function handleAddPersonnelFormSubmission() {
  var FirstName = $("#addPersonnelFirstName").val().toString();
  var LastName = $("#addPersonnelLastName").val().toString();
  var JobTitle = $("#addPersonnelJobTitle").val().toString();
  var EmailAddress = $("#addPersonnelEmailAddress").val().toString();
  var Department = parseInt($("#addPersonnelDepartment").val()); // You'll need the department ID or a corresponding identifier
  
  
    $.ajax({
      url: "libs/php/insertPersonnel.php",
      type: "POST",
      dataType: "json",
      data: {
        firstName:FirstName,
        lastName: LastName,
        jobTitle: JobTitle,
        email: EmailAddress,
        departmentID:Department 
      },
      success: function (result) {
        // Handle the success response if needed
        // console.log("Personnel create successfully", result);
        
      },
      error: function (jqXHR, textStatus, errorThrown) {
        // Handle AJAX errors
        console.error("Error create personnel:", textStatus, errorThrown);
      }
    });
  }







 
// Define the function to handle the form submission
function handleEditPersonnelFormSubmission() {
 


  var updatedFirstName = $("#editPersonnelFirstName").val().toString();
  var updatedLastName = $("#editPersonnelLastName").val().toString();
  var updatedJobTitle = $("#editPersonnelJobTitle").val().toString();
  var updatedEmailAddress = $("#editPersonnelEmailAddress").val().toString();
  var updatedDepartment = parseInt($("#editPersonnelDepartment").val()); // You'll need the department ID or a corresponding identifier
  var updatedID = parseInt($("#editPersonnelEmployeeID").val());
  if (updatedID) {
    $.ajax({
      // add department 
      url: "libs/php/updatePersonnel.php",
      type: "POST",
      dataType: "json",
      data: {
        id: updatedID, // Personnel ID to be updated
        firstName: updatedFirstName,
        lastName: updatedLastName,
        jobTitle: updatedJobTitle,
        email: updatedEmailAddress,
        departmentID: updatedDepartment 
      },
      success: function (result) {
        
      },
      error: function (jqXHR, textStatus, errorThrown) {
        // Handle AJAX errors
        console.error("Error updating personnel:", textStatus, errorThrown);
      }
    });
  } else {
    $.ajax({
       
      url: "libs/php/insertPersonnel.php",
      type: "POST",
      dataType: "json",
      data: {
        firstName: updatedFirstName,
        lastName: updatedLastName,
        jobTitle: updatedJobTitle,
        email: updatedEmailAddress,
        departmentID: updatedDepartment 
      },
      success: function (result) {
        // Handle the success response if needed
        console.log("Personnel create successfully", result);
        // If needed, you can update the UI or perform other actions here
      },
      error: function (jqXHR, textStatus, errorThrown) {
        // Handle AJAX errors
        console.error("Error create personnel:", textStatus, errorThrown);
      }
    });
  }
}

// Attach the event handler after the modal is shown
$("#editPersonnelForm").on("submit", function (e) {
  e.preventDefault();
  handleEditPersonnelFormSubmission();
  $('#editPersonnelModal').modal('hide');
  refreshPersonnelTable();
});
$("#addPersonnelForm").on("submit", function (e) {
  e.preventDefault();
  handleAddPersonnelFormSubmission();
  $('#addPersonnelModal').modal('hide');
  refreshPersonnelTable();
});

$("#editDepartmentModal").on("show.bs.modal", function (e) {
  $.ajax({
    url: "libs/php/getDepartmentByID.php",
    type: "POST",
    dataType: "json",
    data: {
      id: $(e.relatedTarget).attr("data-id")
    },
    success: function (result) {
      var resultCode = result.status.code;

      if (resultCode == 200) {
        // Update the hidden input with the employee id
        $("#editDepartmentID").val(result.data.department[0].id);

        // Populate other input fields with personnel details
        $("#editDepartmentName").val(result.data.department[0].name);

        $("#editLocation").empty();

        // Populate the department select dropdown with retrieved data
        result.data.location.forEach(function (loc) {
          $("#editLocation").append(
            $("<option>", {
              value: loc.id,
              text: loc.name
            })
          );
        });

        $("#editLocation").val(result.data.department[0].locationID);
      } else {
        // Handle errors if the result code is not 200
        $("#editDepartmentModal .modal-title").replaceWith("Error retrieving data");
      }

    },
    error: function (jqXHR, textStatus, errorThrown) {
      // Handle AJAX errors
      // console.error("AJAX error:", textStatus, errorThrown);
      $("#editDepartmentModal .modal-title").replaceWith("Error retrieving data");
    }
  });
});

function handleEditDepartmentFormSubmission() {
  var updatedDepartmentName = $("#editDepartmentName").val().toString();
  var updatedID = parseInt($("#editDepartmentID").val());
  var updatedlocation = parseInt($("#editLocation").val());
  // console.log(updatedID);
  if (updatedID) {
    $.ajax({
      url: "libs/php/updateDepartment.php",
      type: "POST",
      dataType: "json",
      data: {
        id: updatedID, // Personnel ID to be updated
        name: updatedDepartmentName,
        locationID: updatedlocation
      },
      success: function (result) {
        
      },
      error: function (jqXHR, textStatus, errorThrown) {
        // Handle AJAX errors
        console.error("Error updating Department:", textStatus, errorThrown);
      }
    });
  } else {
    $.ajax({
      url: "libs/php/insertDepartment.php",
      type: "POST",
      dataType: "json",
      data: {
        name: updatedDepartmentName,
      },
      success: function (result) {
        // Handle the success response if needed
        console.log("Department create successfully", result);
        // If needed, you can update the UI or perform other actions here
      },
      error: function (jqXHR, textStatus, errorThrown) {
        // Handle AJAX errors
        console.error("Error create Department:", textStatus, errorThrown);
      }
    });
  }
}

$("#editDepartmentForm").on("submit", function (e) {
  e.preventDefault();
  handleEditDepartmentFormSubmission();
  $('#editDepartmentModal').modal('hide');
  refreshDepartmentTable();
});



// add department

$("#addDepartmentForm").on("submit", function (e) {
  e.preventDefault();
  handleAddDepartmentFormSubmission();
  $('#addDepartmentModal').modal('hide');
  refreshDepartmentTable();
});



function handleAddDepartmentFormSubmission() {
  var DepartmentName = $("#addDepartmentName").val().toString();
   
  var location = parseInt($("#addLocation").val());
  // console.log(updatedID);
  
    $.ajax({
      url: "libs/php/insertDepartment.php",
      type: "POST",
      dataType: "json",
      data: {
        departmentName: DepartmentName, 
        location: location,
      },
      success: function (result) {
        // Handle the success response if needed
        // console.log("Department create successfully", result);
        

      },
      error: function (jqXHR, textStatus, errorThrown) {
        // Handle AJAX errors
        console.error("Error create Department:", textStatus, errorThrown);
      }
    });
  
}



// Edit Location

$("#editLocationModal").on("show.bs.modal", function (e) {
  $.ajax({
    url: "libs/php/getLocationByID.php",
    type: "POST",
    dataType: "json",
    data: {
      id: $(e.relatedTarget).attr("data-id")
    },
    success: function (result) {
      var resultCode = result.status.code;

      if (resultCode == 200) {
        // Update the hidden input with the employee id
        $("#editLocationID").val(result.data.location[0].id);

        // Populate other input fields with personnel details
        $("#editLocationName").val(result.data.location[0].name);

      } else {
        // Handle errors if the result code is not 200
        $("#editLocationModal .modal-title").replaceWith("Add Location");
      }

    },
    error: function (jqXHR, textStatus, errorThrown) {
      // Handle AJAX errors
      // console.error("AJAX error:", textStatus, errorThrown);
      $("#editLocationModal .modal-title").replaceWith("Error retrieving data");
    }
  });
});



function handleEditLocationFormSubmission() {
  var updatedLocationName = $("#editLocationName").val().toString();
  var updatedID = parseInt($("#editLocationID").val());
  if (updatedID) {
    $.ajax({
      url: "libs/php/updateLocation.php",
      type: "POST",
      dataType: "json",
      data: {
        id: updatedID, // Personnel ID to be updated
        name: updatedLocationName,
      },
      success: function (result) {
        // Handle the success response if needed
        // console.log("Location updated successfully", result);

      },
      error: function (jqXHR, textStatus, errorThrown) {
        // Handle AJAX errors
        console.error("Error updating Location:", textStatus, errorThrown);
      }
    });
  } else {
    $.ajax({
      url: "libs/php/insertLocation.php",
      type: "POST",
      dataType: "json",
      data: {
        name: updatedLocationName,
      },
      success: function (result) {
        // Handle the success response if needed
        console.log("Department create successfully", result);
        // If needed, you can update the UI or perform other actions here
      },
      error: function (jqXHR, textStatus, errorThrown) {
        // Handle AJAX errors
        console.error("Error create Department:", textStatus, errorThrown);
      }
    });
  }
}


$("#editLocationForm").on("submit", function (e) {
  e.preventDefault();
  handleEditLocationFormSubmission();
  $('#editLocationModal').modal('hide');
  refreshLocationTable();
});







function handleAddLocationFormSubmission() {
  var updatedLocationName = $("#addLocationName").val().toString();
  var updatedID = parseInt($("#addLocationID").val());
  if (updatedID) {
    $.ajax({
      url: "libs/php/updateLocation.php",
      type: "POST",
      dataType: "json",
      data: {
        id: updatedID, // Personnel ID to be updated
        name: updatedLocationName,
      },
      success: function (result) {
        // Handle the success response if needed
        console.log("Location updated successfully", result);

      },
      error: function (jqXHR, textStatus, errorThrown) {
        // Handle AJAX errors
        console.error("Error updating Location:", textStatus, errorThrown);
      }
    });
  } else {
    $.ajax({
      url: "libs/php/insertLocation.php",
      type: "POST",
      dataType: "json",
      data: {
        name: updatedLocationName,
      },
      success: function (result) {
        // Handle the success response if needed
        // console.log("Department create successfully", result);
        
      },
      error: function (jqXHR, textStatus, errorThrown) {
        // Handle AJAX errors
        console.error("Error create Department:", textStatus, errorThrown);
      }
    });
  }
}


$("#addLocationForm").on("submit", function (e) {
  e.preventDefault();
  handleAddLocationFormSubmission();
  $('#addLocationModal').modal('hide');
  refreshLocationTable();
});




// filter result

$('#PersonnelfilterModal').on('shown.bs.modal', function (e) {
  $("#PersonnelfilterForm").on("submit", function (e) {
    e.preventDefault();
    filterPersonnelTable();
    $('#PersonnelfilterModal').modal('hide');
  });
});


// Get All Personnel 
$.ajax({
  url: "libs/php/getAll.php",
  type: "GET",
  dataType: "json",
  success: function (result) {
    if (result.status.code === "200") {
      populatePersonnelTable(result.data);
    } else {
      console.error("Error fetching personnel data");
    }
  },
  error: function (jqXHR, textStatus, errorThrown) {
    console.error("AJAX error:", textStatus, errorThrown);
  }
});

function populatePersonnelTable(data) {
  var table = $('#personnel-tab-pane table');


  $('#personnelTable').html('');

  // Iterate through the data and populate the table dynamically
  var header = '<tr>' +
    // '<th class="align-middle text-nowrap">Full Name</th>' +
    // '<th class="align-middle text-nowrap d-none d-md-table-cell">Job Title</th>' +
    // '<th class="align-middle text-nowrap d-none d-md-table-cell">Location</th>' +
    // '<th class="align-middle text-nowrap d-none d-md-table-cell">Email</th>' +
    // '<th class="align-middle text-nowrap d-none d-md-table-cell">Department</th>' +
    // '<th class="text-end text-nowrap">Edit / Delete</th>'+
    '</tr>';
  $('#personnelTable').append(header);
  data.forEach(function (person) {
    var row = '<tr>' +
      '<td class="align-middle text-nowrap">' + person.lastName + ', ' + person.firstName + '</td>' +
      '<td class="align-middle text-nowrap d-none d-md-table-cell">' + person.jobTitle + '</td>' +
      '<td class="align-middle text-nowrap d-none d-md-table-cell">' + person.location + '</td>' +
      '<td class="align-middle text-nowrap d-none d-md-table-cell">' + person.email + '</td>' +
      '<td class="align-middle text-nowrap d-none d-md-table-cell">' + person.department + '</td>' +
      '<td class="text-end text-nowrap">' +
      '<button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#editPersonnelModal" data-id="' + person.id + '">' +
      '<i class="fa-solid fa-pencil fa-fw"></i>' +
      '</button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
      '<button type="button" class="btn btn-primary btn-sm deletePersonnelBtn" data-fullname="'+ person.firstName + " " + person.lastName+'" data-id="' + person.id + '">' +
      '<i class="fa-solid fa-trash fa-fw"></i>' +
      '</button>' +
      '</td>' +
      '</tr>';

    // Append the new row to the table
    //table.append(row);
    $('#personnelTable').append(row);
  });
}



// Get All Departments

$.ajax({
  url: "libs/php/getAllDepartments.php",
  type: "GET",
  dataType: "json",
  success: function (result) {
    if (result.status.code === "200") {
      populateDepartmentsTable(result.data);
    } else {
      console.error("Error fetching department data");
    }
  },
  error: function (jqXHR, textStatus, errorThrown) {
    console.error("AJAX error:", textStatus, errorThrown);
  }
});

// Populate Departments
function populateDepartmentsTable(data) {
  var tableBody = $('#departments-tab-pane table tbody');

  $('#departmentsTable').html('');
  var header = '<tr>' +
    // '<th class="align-middle text-nowrap">Department</th>' +
    // '<th class="align-middle text-end text-nowrap">Edit / Delete</th>' +
    '</tr>'
  $('#departmentsTable').append(header);
  data.forEach(function (department) {
    var row = '<tr>' +
      '<td class="align-middle text-nowrap">' + (department.name ? department.name : 'N/A') + '</td>' +
      '<td class="align-middle text-end text-nowrap">' +
      '<button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#editDepartmentModal" data-id="' + department.id + '">' +
      '<i class="fa-solid fa-pencil fa-fw"></i>' +
      '</button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
      '<button type="button" class="btn btn-primary btn-sm deleteDepartmentBtn" data-id="' + department.id + '" data-department-name="' + department.name + '" data-employee-count="' + department.employeeCount + '">' +
      '<i class="fa-solid fa-trash fa-fw"></i>' +
      '</button>' +
      '</td>' +
      '</tr>';

    $('#departmentsTable').append(row);
  });
}




/// Get ALL Locations
$.ajax({
  url: "libs/php/getAllLocation.php",
  type: "GET",
  dataType: "json",
  success: function (result) {
    if (result.status.code === "200") {
      populateLocationsTable(result.data);
    } else {
      console.error("Error fetching location data");
    }
  },
  error: function (jqXHR, textStatus, errorThrown) {
    console.error("AJAX error:", textStatus, errorThrown);
  }
});

function populateLocationsTable(locations) {
  var table = $('#locations-tab-pane table');
  $('#locationsTable').html('');

  var header = '<tr>' +
    // '<th class="align-middle text-nowrap">Location</th>' +
    // '<th class="align-middle text-end text-nowrap">Edit / Delete</th>' +
    '</tr>';
  $('#locationsTable').append(header);
  locations.forEach(function (location) {
    var row = '<tr>' +
      '<td class="align-middle text-nowrap">' + (location.name ? location.name : 'N/A') + '</td>' +
      '<td class="align-middle text-end text-nowrap">' +
      '<button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#editLocationModal" data-id="' + location.id + '">' +
      '<i class="fa-solid fa-pencil fa-fw"></i>' +
      '</button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
  
      '<button type="button" class="btn btn-primary btn-sm deleteLocationBtn" data-id="' + location.id + '" data-location-name="' + location.name + '" data-employee-count="' + location.employeeCount + '">' +
    

      '<i class="fa-solid fa-trash fa-fw"></i>' +
      '</button>' +
      '</td>' +
      '</tr>';

    $('#locationsTable').append(row);
  });
}






   //delete personnel btn 

  
$(document).on('click', '.deletePersonnelBtn', function () {

  
  var $button = $(this); // Reference to the button clicked
  var personnelID = $button.data('id');
    // console.log(personnelID);
    
  // Set the personnel ID in the modal
  $('#deletePersonnelID').val(personnelID);
    
  // Set the personnel name in the modal
  
  var personnelName = $button.data('fullname');
  
  // console.log(personnelName);

  $('#deletePersonnelName').text(personnelName);
   // make ajax to find number of personnel  in that department
   
     // Set the modal title with the personnel name
  $('#deletePersonnelTitle').text('Remove Personnel: ' + personnelName);
 
  $('#deletePersonnel').modal('show');
});

// Event listener for the "YES" button in the modal
$(document).on('click', '#confirmDeleteBtn', function (e) {
  e.preventDefault(); // Prevent the form submission

  var personnelID = $('#deletePersonnelID').val();
  var personnelName = $('#deletePersonnelName').text(); // Get the full name
  // AJAX request to delete the personnel
  $.ajax({
    url: 'libs/php/deletePersonnel.php',
    type: 'POST',
    data: { id: personnelID, name: personnelName },
    dataType: 'json',
    success: function (result) {
      if (result.status.code === '200') {
        // Success in deletion
        $('#deletePersonnel').modal('hide'); // Hide the modal
        $('.deletePersonnelBtn[data-id="' + personnelID + '"]').closest('tr').remove(); // Remove the row from the table
      } else {
        // Handle other status codes or errors
        console.error('Error: ' + result.status.description);
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      // Handle AJAX errors
      console.error('AJAX error:', textStatus, errorThrown);
    }
  });
});

// Event listener for the "NO" button in the modal
$(document).on('click', '#deletePersonnel .btn-outline-secondary[data-bs-dismiss="modal"]', function () {
  // Reset the form when the modal is closed
  $('#deletePersonnelForm')[0].reset();
});




var employeeCount;
// cant delete departments 
$(document).on("click", ".deleteDepartmentBtn", function () {
  var departmentId = $(this).data("id");
  employeeCount = 0;
  $.ajax({
    type: "POST",
    url: 'libs/php/getDepartmentByID.php',
    data: { id: departmentId },
    dataType: "json",
    success: function (data) {
      if (data.status.code === "200") {
        if (data.data.department.length > 0) {
          // If there are dependencies, show the modal with dependency details
          var departmentName = data.data.department[0].name;

          // Calculate unique employeeCount based on locationID
          getUniqueEmployeeCount(departmentId, departmentName);
        
            // console.log(employeeCount);
          

        } else {
          // If no dependencies, proceed with department deletion logic
          deleteDepartment(departmentId);

        }
      } else {
        // Handle error or show a generic error modal
        console.error("Error fetching department details:", data.status.description);
        $("#cantDeleteDeptName").text("Error");
        $("#personnelCount").text("Error");

        // Set additional modal content as needed
        // $("#additionalModalContent").text("Additional information...");

        $("#cantDeleteDepartmentModal").modal("show");
      }
    }
  });
});

  
// Function to show confirmation modal and initiate department deletion
function showDeleteConfirmationModal(departmentName, departmentId) {
  $("#confirmationModalDeptName").text(departmentName);
  // console.log(departmentId);
  $("#deleteDepartmentID").val(departmentId);
  
  // Show the confirmation modal
  $("#canDeleteDepartmentModal").modal("show");

  
}





// Function to calculate unique employee count based on locationID
function getUniqueEmployeeCount(departmentData, departmentName) {
  // var uniqueEmployeeIds = new Set();
    // console.log(departmentData);
  $.ajax({
    url: 'libs/php/filterPersonnel.php', 
    type: 'GET', // Use POST method to send data
    data: { departmentname:departmentData}, 
    dataType: 'json',
    success: function (result) {
      if (result.status.code === '200') {
        // Assuming the count is present in result.data.count
         employeeCount = result.data.length;
        // console.log(result.data.length);
        if (employeeCount <1){
          // If no employees, show the confirmation modal and proceed with deletion
        // call a function to delete the department
        
        // console.log(departmentData);
          showDeleteConfirmationModal(departmentName, departmentData);
              
        }
        else {
          // If there are employees, show the modal indicating dependencies
          
          $("#cantDeleteDeptName").text(departmentName);
          $("#personnelCount").text(employeeCount);

          $("#cantDeleteDepartmentModal").modal("show");
            
        }

        
        
        
      } else {
        console.error('Error counting personnel in department:', result.status.description);
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.error('AJAX error:', textStatus, errorThrown);
    }
  });

}


$(document).on('click', '#confirmDeleteDepartmentBtn', function (e) {
  e.preventDefault(); // Prevent the form submission

  var departmentID = document.getElementById('deleteDepartmentID').value;
    // console.log(departmentID);



    
  // AJAX request to delete the personnel
  $.ajax({
    url: 'libs/php/deleteDepartment.php',
    type: 'POST',
    data: { id: departmentID},
    dataType: 'json',
    success: function (result) {
      if (result.status.code === '200') {
        // Success in deletion
        $('#canDeleteDepartmentModal').modal('hide'); // Hide the modal
        $('.deleteDepartmentBtn[data-id="' + departmentID + '"]').closest('tr').remove(); // Remove the row from the table
      } else {
        // Handle other status codes or errors
        console.error('Error: ' + result.status.description);
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      // Handle AJAX errors
      console.error('AJAX error:', textStatus, errorThrown);
    }
  });
});


// cant delete location



var departmentCount;
// cant delete departments 
$(document).on("click", ".deleteLocationBtn", function () {
  var locationId = $(this).data("id");
  departmentCount = 0;
  $.ajax({
    type: "POST",
    url: 'libs/php/getlocationByID.php',
    data: { id: locationId },
    dataType: "json",
    success: function (data) {
      // console.log("Success callback reached");
      if (data.status.code === "200") {
        if (data.data.location.length > 0) {
          // If there are dependencies, show the modal with dependency details
          var locationName = data.data.location[0].name;

          // Calculate unique employeeCount based on locationID
          getDepartmentCount(locationId, locationName);
        
            // console.log(employeeCount);
          

        } 
      } else {
        // Handle error or show a generic error modal
        console.error("Error fetching location details:", data.status.description);
        $("#cantDeleteLocationName").text("Error");
        $("#personnelCount").text("Error");

        // Set additional modal content as needed
        // $("#additionalModalContent").text("Additional information...");

        $("#cantDeleteLocationModal").modal("show");
      }
    }
  });
});

  
// Function to show confirmation modal and initiate department deletion
function showLocationDeleteConfirmationModal(locationName, locationId) {
 
  $("#LocationName").text(locationName);
  // console.log(locationId);
  $("#deleteLocationID").val(locationId);
  
  // Show the confirmation modal
  $("#canDeleteLocationModal").modal("show");

  
}



// Function to calculate unique employee count based on locationID
function getDepartmentCount(locationData, locationName) {
  // var uniqueEmployeeIds = new Set();
    // console.log(departmentData);
  $.ajax({
    url: 'libs/php/filterDepartment.php', 
    type: 'GET', 
    data: { locationname:locationName}, 
    dataType: 'json',
    success: function (result) {
      if (result.status.code === '200') {
        // Assuming the count is present in result.data.count
         departmentCount = result.data.length;
        // console.log(result.data.length);
        if (departmentCount <1){
          // If no employees, show the confirmation modal and proceed with deletion
        // call a function to delete the department
        
        // console.log(departmentData);
        showLocationDeleteConfirmationModal(locationName, locationData);
  
              
        }
        else {
          // If there are employees, show the modal indicating dependencies
          
          $("#cantDeleteLocationName").text(locationName);
          $("#departmentCount").text(departmentCount);

          $("#cantDeleteLocationModal").modal("show");
            
        }

        
        
        
      } else {
        console.error('Error counting personnel in department:', result.status.description);
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.error('AJAX error:', textStatus, errorThrown);
    }
  });

}






$(document).on('click', '#confirmDeleteLocationBtn', function (e) {
  e.preventDefault(); // Prevent the form submission

  var locationID = document.getElementById('deleteLocationID').value;
    // console.log(locationID);

  // AJAX request to delete the personnel
  $.ajax({
    url: 'libs/php/deleteLocation.php',
    type: 'POST',
    data: { id: locationID},
    dataType: 'json',
    success: function (result) {
      // console.log('Location ID to delete: ' + locationID);

      if (result.status.code === '200') {
        // Success in deletion
        $('#canDeleteLocationModal').modal('hide'); // Hide the modal
        $('.deleteLocationBtn[data-id="' + locationID + '"]').closest('tr').remove(); // Remove the row from the table
      } else {
        // Handle other status codes or errors
        console.error('Error: ' + result.status.description);
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      // Handle AJAX errors
      console.error('AJAX error:', textStatus, errorThrown);
    }
  });
});


