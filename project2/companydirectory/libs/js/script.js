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
  
  // $("#addBtn").click(function () {
    
  //   // Replicate the logic of the refresh button click to open the add modal for the table that is currently on display
    
  // });


 

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
  $('#editPersonnelModal').modal('show');
  
  // Logic to fetch and populate departments only if the Personnel tab is active
  if ($("#personnelBtn").hasClass("active")) {
      $.ajax({
          url: 'libs/php/getAllDepartments.php',
          type: 'GET',
          dataType: 'json',
          success: function (result) {
              if (result.status.code === '200') {
                $("#editPersonnelEmployeeID").val('');
                $("#editPersonnelFirstName").val('');
                $("#editPersonnelLastName").val('');
                $("#editPersonnelJobTitle").val('');
                $("#editPersonnelEmailAddress").val('');
                  populateDepartmentSelection(result.data);
              } else {
                  console.error('Error fetching department data');
              }
          },
          error: function (jqXHR, textStatus, errorThrown) {
              console.error('AJAX error:', textStatus, errorThrown);
          }
      });
  }
}

function openAddDepartmentModal() {
  $('#editDepartmentModal').modal('show');

  if ($("#departmentsBtn").hasClass("active")) {
    $.ajax({
        url: 'libs/php/getAllLocation.php',
        type: 'GET',
        dataType: 'json',
        success: function (result) {
            if (result.status.code === '200') {
              $("#editDepartmentID").val('');
              $("#editDepartmentName").val('');
              populateLocationSelection(result.data);
            } else {
                console.error('Error fetching department data');
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error('AJAX error:', textStatus, errorThrown);
        }
    });
  }
}

function openAddLocationModal() {
  $('#editLocationModal').modal('show');
  $("#editLocationID").val('');
  $("#editLocationName").val('');
}

function populateDepartmentSelection(departments) {
    var departmentSelect = $('#editPersonnelDepartment');
    departmentSelect.empty(); // Clear the department selection first

    departments.forEach(function (department) {
        departmentSelect.append($('<option></option>').attr('value', department.id).text(department.name));
    });
}

function populateDepartmentfilterSelection(departments) {
  var departmentSelect = $('#Personnelfilter');
  departmentSelect.empty(); // Clear the department selection first

  departments.forEach(function (department) {
      departmentSelect.append($('<option></option>').attr('value', department.id).text(department.name));
  });
}

function populateLocationSelection(locations) {
  var LocationSelect = $('#editLocation');
  LocationSelect.empty(); // Clear the department selection first

  locations.forEach(function (location) {
    LocationSelect.append($('<option></option>').attr('value', location.id).text(location.name));
  });
}

  
$("#personnelBtn").click(function () {
  $("#filterBtn").show();
  // Call function to refresh personnel table
  refreshPersonnelTable();
});

function refreshPersonnelTable() {
  $("#personnel-tab-pane").load("index.html #personnel-tab-pane");
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
        // Add other updated data fields if needed
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
  
$("#departmentsBtn").click(function () {
  $("#filterBtn").hide();
  // Call function to refresh department table
  refreshDepartmentTable();
});

function refreshDepartmentTable() {
  $("#departments-tab-pane").load("index.html #departments-tab-pane");
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

$("#locationsBtn").click(function () {
  
  // Call function to refresh location table
  $("#filterBtn").hide();
  refreshLocationTable();
});

function refreshLocationTable() {
  $("#locations-tab-pane").load("index.html #locations-tab-pane");
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
      url: "libs/php/updatePersonnel.php",
      type: "POST",
      dataType: "json",
      data: {
          id: updatedID, // Personnel ID to be updated
          firstName: updatedFirstName,
          lastName: updatedLastName,
          jobTitle: updatedJobTitle,
          email: updatedEmailAddress,
          departmentID: updatedDepartment // Assuming this should correspond to the selected department
          // Add other updated data fields if needed
      },
      success: function (result) {
          // Handle the success response if needed
          // console.log("Personnel updated successfully", result);
         
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
          departmentID: updatedDepartment // Assuming this should correspond to the selected department
          // Add other updated data fields if needed
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
          // Handle the success response if needed
          // console.log("Department updated successfully", result);
          // If needed, you can update the UI or perform other actions here
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
        $("#editLocationModal .modal-title").replaceWith("Error retrieving data");
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




// $.ajax({
//   url: "libs/php/getAll.php", 
//   type: "GET",
//   dataType: "json",
//   success: function (result) {
//       if (result.status.code === "200") {
//           populatePersonnelTable(result.data);
//       } else {
//           console.error("Error fetching personnel data");
//       }
//   },
//   error: function (jqXHR, textStatus, errorThrown) {
//       console.error("AJAX error:", textStatus, errorThrown);
//   }
// });



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
      '<th class="align-middle text-nowrap">Full Name</th>' +
      '<th class="align-middle text-nowrap d-none d-md-table-cell">Job Title</th>' +
      '<th class="align-middle text-nowrap d-none d-md-table-cell">Location</th>' +
      '<th class="align-middle text-nowrap d-none d-md-table-cell">Email</th>' +
      '<th class="align-middle text-nowrap d-none d-md-table-cell">Department</th>' +
      '<th class="text-end text-nowrap">Edit / Delete</th>'+
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
      '<button type="button" class="btn btn-primary btn-sm deletePersonnelBtn" data-id="' + person.id + '">' +
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

function populateDepartmentsTable(data) {
  var tableBody = $('#departments-tab-pane table tbody');
 
  $('#departmentsTable').html('');
  var header = '<tr>' +
    '<th class="align-middle text-nowrap">Department</th>' +
    '<th class="align-middle text-end text-nowrap">Edit / Delete</th>' +
    '</tr>'
  $('#departmentsTable').append(header);
  data.forEach(function (department) {
    var row = '<tr>' +
      '<td class="align-middle text-nowrap">' + (department.name ? department.name : 'N/A') + '</td>' +
      '<td class="align-middle text-end text-nowrap">' +
      '<button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#editDepartmentModal" data-id="' + department.id + '">' +
      '<i class="fa-solid fa-pencil fa-fw"></i>' +
      '</button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
      '<button type="button" class="btn btn-primary btn-sm deleteDepartmentBtn" data-id="' + department.id + '">' +
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
    '<th class="align-middle text-nowrap">Location</th>' +
    '<th class="align-middle text-end text-nowrap">Edit / Delete</th>' +
    '</tr>';
  $('#locationsTable').append(header);
  locations.forEach(function (location) {
    var row = '<tr>' +
      '<td class="align-middle text-nowrap">' + (location.name ? location.name : 'N/A') + '</td>' +
      '<td class="align-middle text-end text-nowrap">' +
      '<button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#editLocationModal" data-id="' + location.id + '">' +
      '<i class="fa-solid fa-pencil fa-fw"></i>' +
      '</button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
      '<button type="button" class="btn btn-primary btn-sm deleteLocationBtn" data-id="' + location.id + '">' +
      '<i class="fa-solid fa-trash fa-fw"></i>' +
      '</button>' +
      '</td>' +
      '</tr>';

      $('#locationsTable').append(row);
  });
}



// Delete Personnel

// Event listener for the delete personnel button
$(document).on('click', '.deletePersonnelBtn', function () {
  if (confirm('Are you sure to delete?')) {
    var $button = $(this); // Reference to the button clicked

    var personnelID = $button.data('id');
  
    // AJAX request to delete the personnel
    $.ajax({
        url: 'libs/php/deletePersonnel.php',
        type: 'POST',
        data: { id: personnelID },
        dataType: 'json',
        success: function (result) {
            if (result.status.code === '200') {
                // Success in deletion
                $button.closest('tr').remove(); // Remove the row from the table
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
  }
});

$(document).on('click', '.deleteDepartmentBtn', function () {
  if (confirm('Are you sure to delete?')) {
    var $button = $(this); // Reference to the button clicked

    var departmentID = $button.data('id');
  
    // AJAX request to delete the personnel
    $.ajax({
        url: 'libs/php/deleteDepartment.php',
        type: 'POST',
        data: { id: departmentID },
        dataType: 'json',
        success: function (result) {
            if (result.status.code === '200') {
                // Success in deletion
                $button.closest('tr').remove(); // Remove the row from the table
            } else {
                // Handle other status codes or errors
                alert('Error: ' + result.status.description);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // Handle AJAX errors
            console.error('AJAX error:', textStatus, errorThrown);
        }
    });
  }
});

$(document).on('click', '.deleteLocationBtn', function () {
  if (confirm('Are you sure to delete?')) {
    var $button = $(this); // Reference to the button clicked

    var locationID = $button.data('id');

    // AJAX request to delete the personnel
    $.ajax({
        url: 'libs/php/deleteLocation.php',
        type: 'POST',
        data: { id: locationID },
        dataType: 'json',
        success: function (result) {
            if (result.status.code === '200') {
                // Success in deletion
                $button.closest('tr').remove(); // Remove the row from the table
            } else {
                // Handle other status codes or errors
                alert('Error: ' + result.status.description);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // Handle AJAX errors
            console.error('AJAX error:', textStatus, errorThrown);
        }
    });
  }
});