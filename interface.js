/*
 # File: interface.js
 # Javascript functionality provided for index.html using jQuery
*/
// Set up global variables for the Blockly and ACE workspaces
// Naughty, very naughty :)
var version = "Alpha 0.3.8.2";
var blocklyPlayground, python_aceObj, pythonDoc, pythonMarker;
var Range = ace.require("ace/range").Range;
var inputEntryID = 0;
var pythonChangeWarning = false;
var updatingFromBlockly = false;    // Used as a semaphore for the pythonDocChange function
var warningDialogTrigger = false;
var unsavedChanges = false;
// Wait until the page is fully loaded before running script
$(document).ready(function() {
    /* Buttons, bind click functions */
    $("#btnMenu").click(btnMenuClick);    // Name of the function to call when clicked
    $("#btnSave").click(btnSaveClick);    // Name of the function to call when clicked
    $("#btnOpen").click(btnOpenClick);    // Name of the function to call when clicked
    $("#btnPrint").click(btnPrintClick);    // Name of the function to call when clicked
    $("#btnAbout").click(btnAboutClick);    // Name of the function to call when clicked
    $("#executeSpeedSlider").slider({
        value: 0.2,
        step: 0.1,
        min: 0.0,
        max: 3.0,
        change: function( event, ui ) {
            $("#executeSpeedDisplay").html($("#executeSpeedSlider").slider("value"));
        },
        slide: function( event, ui ) {
            $("#executeSpeedDisplay").html($("#executeSpeedSlider").slider("value"));
        }
    });
    $("#executeSpeedDisplay").html("0.2");
    $('.icon-menu-container').click (function(){
        $(this).toggleClass('icon-menu-change');
    });
    $("#btnExecute").click(btnExecuteClick);    // Name of the function to call when clicked
    $("#btnStop").click(btnStopClick);    // Name of the function to call when clicked
    $("#btnPythonToggle").click(btnPythonClick);    // Name of the function to call when clicked
    $("#btnBlocklyToggle").click(btnBlocklyClick);    // Name of the function to call when clicked
    // Set version number in top bar and title
    $("#version").text(version);
    $("title").text("BlockO " + version);
    // Initialise the blockly playground
    initBlockly();
    // Initialise the ACE Editor
    initACE();
    // Done loading so show elements
    $(".hide-on-start").removeClass("hide-on-start"); // show all the elements hidden whilst loading was taking place
    $(".loader").hide(); // hide all loaders, document now loaded
}); // End $(document.ready()
/* btnMenuClick - Provides the onclick functionality for btnMenu */
function btnMenuClick() {
    $("<p>btnMenu Clicked!</p>").dialog(); 
}
/* savePython - Called by the saveDialog, this downloads a python file */
function savePython(filename) {
    var pythonOut = "";
    for (c=0; c < pythonDoc.getLength(); c++) {
      pythonOut += pythonDoc.getLine(c) + "\r\n";
    }
    var blob = new Blob([pythonOut], {type: "text/plain;charset=utf-8"});
    saveAs(blob, filename+".py");    // function provided by FileSaver.js
}
/* saveBlockly - Called by the saveDialog, this downloads a blockly xml file */
function saveBlockly(filename) {
    var xml = Blockly.Xml.workspaceToDom(blocklyPlayground);
    var xml_text = Blockly.Xml.domToText(xml);
    var blob = new Blob([xml_text], {type: "text/plain;charset=utf-8"});
    saveAs(blob, filename+".xml");    // function provided by FileSaver.js
}
/* saveDialog - Displays and manages a Save As dialog*/
function saveDialog() {
    var dialogContent = '<div id="saveAs">'
                      + '<table padding="2" border="0">'
                      + '<tr>'
                      + '<td>Filename:</td>'
                      + '<td><input type="text" placeholder="Enter filename" id="username"></td>'
                      + '</tr>'
                      + '</table>'
                      + '</div>';
    $(dialogContent).dialog({
        buttons: [ 
            { 
                text: "Save Blockly", click: function() {
                    // Simple presence check to validate user ID
                    var userID = $("#username").val();
                    if (userID.length < 1) {
                        $("<p>Please enter a filename</p>").dialog();
                    }
                    else {
                        saveBlockly(userID);
                        unsavedChanges = false;
                        $( this ).dialog( "destroy" );
                    }
                }
            },
            {
                text: "Save Python", click: function() {
                    // Simple presence check to validate user ID
                    var userIDPy = $("#username").val();
                    if (userIDPy.length < 1) {
                        $("<p>Please enter a filename</p>").dialog();
                    }
                    else {
                        savePython(userIDPy);
                        unsavedChanges = false;
                        $( this ).dialog( "destroy" );
                    }
                }
            },
            {
                text: "Cancel", click: function() {
                    $( this ).dialog( "destroy" );
                }
            }
        ],
        open: function(event, ui) {   // Suppress the close button
          $(".ui-dialog-titlebar-close", ui.dialog | ui).hide();
        },
        close: function( event, ui ) {
           $( this ).dialog( "destroy" );
        },
        closeOnEscape: false,
        height: 200,
        width:  500,
        modal: true,
        title: "Save As"
    }).css({
          "font-size": "0.8em",
    });
}
/* btnAboutClick - Display the about dialog box */
function btnAboutClick() {
    $("#aboutDialog").dialog({      // Create the About Dialog
        title: $( "#aboutDialog title" ).text(),
        buttons: [
            {
              text: "OK",
              click: function() {
                $( this ).dialog( "close" );
              }
            }
        ],
        minWidth: 450,
        minHeight: 300
    });
}
/* btnSaveClick - Provides the onclick functionality for btnSave */
function btnSaveClick() {
    saveDialog();   // Display the Save As dialog
    
    /*var xml = Blockly.Xml.workspaceToDom(blocklyPlayground);
    var xml_text = Blockly.Xml.domToText(xml);
    var blob = new Blob([xml_text], {type: "text/plain;charset=utf-8"});
    saveAs(blob, "test.xml");    // function provided by FileSaver.js
    $("<p>btnSave Clicked!</p>").dialog();*/
}
/* btnOpenClick - Provides the onclick functionality for btnOpen */
function btnOpenClick() {
    $("#openFile").trigger("click");    // Trigger the Open File dialog
    
    setTimeout( function() {            // Workaround for IE not submitting the onchange event for programmatically triggered click events.
        if($("#openFile").val().length > 0) {
           $("#openFile").trigger("change");
        }
    }, 0);

    $("#openFile").change( function(){   // When the user clicks 'Open'
        var fileObj = document.getElementById('openFile').files[0];
        var filename = fileObj.name;
        var fileExt = filename.split('.').pop();
        var reader = new FileReader();  // Instantiate a reader
        reader.readAsText(fileObj);
        reader.onload = (function(theFile) {
            if (fileExt == "py") {
                // Load python
                var code = theFile.target.result.split(/\n/);
                codeToInsert = [];
                // Strip out the spurious new lines
                code.forEach(function(item, index){
                    if (item != "\n" && item != "") {
                        codeToInsert.push(item.replace(/[\n\r]/g, ""));
                        //alert(item.charCodeAt(item.length-1));
                    }
                }); 
                pythonDoc.setValue('');
                pythonDoc.insertLines(0, codeToInsert);
            }
            else if (fileExt == "xml") {
                blocklyPlayground.clear();
                // Load Blockly
                var xml = Blockly.Xml.textToDom(theFile.target.result);
                Blockly.Xml.domToWorkspace(xml, blocklyPlayground);
            }
            else {
                // Another type of file selected
                $("<p>Only select a Blockly XML file or a Python file</p>").dialog();
            }
        });
    });
    //$("#openFile").val();
}
/* btnPrintClick - Provides the onclick functionality for btnPrint */
function btnPrintClick() {
    window.print();
}
/* Function to continually get the running status until it returns false */
function getStatus() {
    $.xmlrpc({
        url: '/pythonServer',
        methodName: 'returnStatus',
        success: function(response, status, jqXHR) {
             var responseArgs = response.toString().split(",");
             if (responseArgs[0] == "true") {
                // Highlight line of code running
                    // Range = startRow, startColumn, endRow, endColumn
                python_aceObj.getSession().removeMarker(pythonMarker); // Remove previous Marker
                pythonMarker = python_aceObj.getSession().addMarker(new Range(responseArgs[1], 0, responseArgs[1], 2000), "warning", "line", true); // Add Marker
                // Recursive call for update
                setTimeout(function() {
                  getStatus();
                }, 100);
             }
             else {
                 // No longer running
                python_aceObj.getSession().removeMarker(pythonMarker); // Remove previous Marker
                $("#btnExecute").removeClass("running");
                $("#btnExecute").addClass("stopped");
             }
            // Check stdIn stream for an input request
            var data_entry = "<input id=\"inputEntry" + inputEntryID + "\" size = \"40\" autofocus placeholder = \"Enter here\">";
            var inputRequest = responseArgs[2].toString();
            if ( inputRequest == "" ) {
                data_entry = "";
            }
            // Update console
            consoleMsgs = responseArgs.slice(3).toString().split("~$%");   // Using slice to overcome the issue of text containing commas
            var htmlMsg = "";
            for (counter=0; counter < consoleMsgs.length; counter++) {
                if ((consoleMsgs[counter].length > 0) && (consoleMsgs[counter] != '\n'))  {
                    htmlMsg += consoleMsgs[counter];
                }
                else if ( consoleMsgs[counter] == '\n' ) {
                    htmlMsg += "<br>" + ">";
                }
            }
            if ( htmlMsg != "" ) {
              $("#consoleWindow").append(htmlMsg + data_entry);
              $("#consoleWindow").scrollTop($("#consoleWindow").prop("scrollHeight"));  //Scroll the console down
              if ( data_entry != "" ) {   // Bind keypress for enter in the text input
                  $("#inputEntry" + inputEntryID).focus();
                  $("#inputEntry" + inputEntryID).keydown(function(event) { 
                    if (event.which == 13) {    // Capture enter key
                        // Make xmlRPC call using the xmlRPC library
                        $.xmlrpc({
                            url: '/pythonServer',
                            methodName: 'processUserIO',
                            params: new Array($(this).val()),
                            error: function(jqXHR, status, error) {
                                $("<p>Something went wrong " + error + "</p>").dialog();
                            }
                          });
                        this.disabled = true;
                    }
                 });
                 inputEntryID += 1;
              }
            }
        },
        error: function(jqXHR, status, error) {
            $("<p>Something went wrong " + error + "</p>").dialog();
        }
    });
}

function inputEnter(hello) {
  alert(hello);
}

/* btnExecuteClick - Provides the onclick functionality for btnExecute */
function btnExecuteClick() {
    // Stop any previously running code
    btnStopClick();
    // Clear the console
    $("#consoleWindow").html("Console:<br>>");
    // Ready data to send
    var pythonOut = "";
    for (c=0; c < pythonDoc.getLength(); c++) {
      pythonOut += pythonDoc.getLine(c) + "\n";
    }
    /* Use new simpleInject function to code-inject
       -- See code_injection v3.2.js              */
    var injectedCode = simpleInject(pythonOut.split("\n"), $("#executeSpeedSlider").slider("value"));
    // Make xmlRPC call using the xmlRPC library
     $.xmlrpc({
        url: '/pythonServer',
        methodName: 'receiveCode',
        params: new Array(injectedCode),
        success: function(response, status, jqXHR) {
             if (response == "running") {
                // Call for update
                // Change the button colour
                $("#btnExecute").removeClass("stopped");
                $("#btnExecute").addClass("running");
                getStatus();
             }
        },
        error: function(jqXHR, status, error) {
            $("<p>Something went wrong " + error + "</p>").dialog();
        }
      });
      //$("<p>RPC call made</p>").dialog();
}
/* btnStopClick - Provides the onclick functionality for btnStop */
function btnStopClick() {
    // Make xmlRPC call using the xmlRPC library
     $.xmlrpc({
        url: '/pythonServer',
        methodName: 'stopRunning',
        success: function(response, status, jqXHR) {
             // Change the colour of the Execute button
            python_aceObj.getSession().removeMarker(pythonMarker); // Remove previous Marker
            $("#btnExecute").removeClass("running");
            $("#btnExecute").addClass("stopped");
        },
        error: function(jqXHR, status, error) {
            $("<p>Something went wrong " + error + "</p>").dialog();
        }
      });
}
/* btnPythonClick - Provides the onclick functionality for btnPythonToggle */
function btnPythonClick() {
    if ($("#pythonEditor").css("visibility") == "visible") {
        $("#pythonEditor").css({       // Hide the python editor
            "visibility":"hidden"
        });
        $("#consoleWindow").css({      // Resize the console window
            "width": "100%",
            "left" : "0"
        });
        // Resize the Blockly Editor
        $("#blocklyEditor").css({
            "visibility":"visible",
            "top": "62px",
            "left": "0",
            "width": "100%",
            "height" : "height: calc((70% - 42px))"
        });
    }
    else {
        $("#pythonEditor").css({       // Show the python editor 
            "visibility":"visible",
            "left" : "50%"
        });
        // Resize the Blockly Editor
        $("#blocklyEditor").css({
            "top": "62px",
            "left": "0",
            "width": "50%",
            "height" : "height: calc((100% - 42px))"
        });
        $("#consoleWindow").css({      // Resize the console window
            "width": "50%",
            "left" : "50%"
        });
    }
    python_aceObj.resize(true); // Force the ACE editor to resize
    Blockly.svgResize(blocklyPlayground); // Force the Blockly editor to resize
}
/* btnBlocklyClick - Provides the onclick functionality for btnBlocklyToggle */
function btnBlocklyClick() {
    if ($("#blocklyEditor").css("visibility") == "visible") {
        $("#blocklyEditor").css({       // Hide the blockly editor
            "visibility":"hidden"
        });
        // Resize the Python Editor
        $("#pythonEditor").css({
            "visibility":"visible",
            "top": "62px",
            "left": "0",
            "width": "100%",
            "height" : "height: calc((70% - 42px))"
        });
        $("#consoleWindow").css({      // Resize the console window
            "width": "100%",
            "left" : "0"
        });
    }
    else {
        $("#blocklyEditor").css({       // Show the blockly editor
            "visibility":"visible"
        });
        // Resize the Python Editor
        $("#pythonEditor").css({
            "top": "62px",
            "left": "50%",
            "width": "50%",
            "height" : "height: calc((70% - 42px))"
        });
        $("#consoleWindow").css({      // Resize the console window
            "width": "50%",
            "left" : "50%"
        });
    }   
    python_aceObj.resize(true); // Force the ACE editor to resize
    Blockly.svgResize(blocklyPlayground); // Force the Blockly editor to resize
}
/* initBlockly - called to initialise the blockly editor */
function initBlockly() {
    Blockly.HSV_SATURATION = 0.72;
    Blockly.HSV_VALUE = 0.72;
    blocklyPlayground = Blockly.inject('blocklyEditor',
      {toolbox: document.getElementById('toolbox'),
      grid:
         {spacing: 20,
          length: 3,
          colour: '#ccc',
          snap: true},
     trashcan: true});
    // Add the event listener for Blockly to call the updatePythonCodeFromBlockly() function
    blocklyPlayground.addChangeListener(updatePythonCodeFromBlockly);
}
/* Initialise the Python editor (ACE) */
function initACE() {
    python_aceObj = ace.edit("pythonEditor");
    python_aceObj.setTheme("ace/theme/Chrome");
    python_aceObj.getSession().setMode("ace/mode/python");
    python_aceObj.getSession().on('change', function() {
        pythonDocChange();
    });
    pythonDoc = python_aceObj.getSession().getDocument();
    python_aceObj.setFontSize(14);
}

/* Manage the on change event for the ACE editor
    1. Determine if the change is because of the blockly editor changing or whether
       the user has editited. If it's the user the set a flag
    Used for the purpose of delivering a warning when returning to the Blockly code */
function pythonDocChange() {
    unsavedChanges = true;
    if (updatingFromBlockly) {
        pythonChangeWarning = false;
    }
    else {
        pythonChangeWarning = true;
    }
}

/* Function for Blockly's change event, it will be called by Blockly when we add it to a listener
   When the Blockly code changes we use it to update the Python code in the ACE editor */
function updatePythonCodeFromBlockly(event) {
  var pythonCode = Blockly.Python.workspaceToCode(blocklyPlayground);
  var code = pythonCode.split(/\n/);
  var codeToInsert = [];
  unsavedChanges = true;
  // Warn the user if the Python code has manually been changed
  if (pythonChangeWarning && !(updatingFromBlockly) && !(warningDialogTrigger)) {
    warningDialogTrigger = warningDialogTrigger ^ true;    // Set this to prevent the warning dialog showing more than once
    $("<p>Changes made in Blockly will overwrite your Python code. Continue?</p>").dialog({
         buttons: [ 
            { 
                text: "Overwrite Python", click: function() {
                    updatingFromBlockly = true;
                    warningDialogTrigger = false;
                    updatePythonCodeFromBlockly(event);
                    $( this ).dialog( "destroy" );
                }
            },
            {
                text: "Cancel", click: function() {
                    $( this ).dialog( "destroy" );
                    warningDialogTrigger = false;
                }
            }
        ],
        open: function(event, ui) {   // Suppress the close button
          $(".ui-dialog-titlebar-close", ui.dialog | ui).hide();
        },
        closeOnEscape: false,
        modal: true,
        height: 250,
        width:  500,
        title: "Change Warning"
    });
  }
  else if (!(warningDialogTrigger)) {
      // Strip out the spurious new lines
      code.forEach(function(item, index){
          if (item != "\n" && item != "") {
            codeToInsert.push(item);
          }
      }); 
      pythonDoc.setValue('');
      pythonDoc.insertLines(0, codeToInsert);
      updatingFromBlockly = false;
      pythonChangeWarning = false;
  }
}
/* Capture keyDown events for specific keystrokes */
$(window).keydown(function(event) {                    
    if (event.which == 83 && event.ctrlKey) {           //Capture CTRL + S
        btnSaveClick();
        event.preventDefault();    
        return false;
    }
    if (event.which == 79 && event.ctrlKey) {           //Capture CTRL + S
        btnOpenClick();
        event.preventDefault();    
        return false;
    }
    else if (event.which == 120) {                      //Capture F9
        btnExecuteClick();
        event.preventDefault();
    }
    return true;
});
window.onbeforeunload = function() {
    if ( unsavedChanges ) {
      return "You're about to end your session, are you sure?";
    }
}

