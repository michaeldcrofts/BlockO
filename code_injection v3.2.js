/*
Date: 28/01/19
Author: MDC
Version 3.2.1 (V1 JS Port)

BlockO code injection algorithm, first tested in Python and then ported into JavaScript
*/
/*
// Support functions for testing
$(document).ready(function() { 
	// Buttons, bind click functions
    $("#btnInject").click(btnInjectClick);    // Name of the function to call when clicked
}); // End $(document.ready()

function btnInjectClick () {
	var msg = $("#originalCode").val();
	msgSplit = msg.split("\n");
	msgSplit = simpleInject(msgSplit);
	msgSplit.forEach ( function (msg) {
		$("#injectedCode").append("<p>" + msg + "</p>");
	});
	//$("#injectedCode").html("<p>" + msg + "</p>");
}
// End support functions for testing
*/

/*
	Support functions to the main Code Injection algorithm
*/

/* 	removeString(String) ->  String
	Removes string literals and returns line with these replaced by the token __STRING__
*/
function removeString(line) {	// V1
	var newLine = "";		// Empty string to eventually return
	var prevChar = "";		// Used to check for escape characters
	var charMinusTwo = "";	// Used to check the escape character wasn't escaped itself e.g. \\"
	var stringStart = -1
	var strDenote = ""
	var charPos = 0

	while ( charPos < line.length ) {
		if ( ( ['"', "'"].includes(line[charPos]) ) && ( ( prevChar != "\\" ) || ( prevChar + charMinusTwo == "\\\\" ) ) ) {
			// We've found a quote, but we don't want it if it has been escaped - unless the escape char was itself escaped
			if ( line[charPos] + prevChar + charMinusTwo == "'''" && strDenote == "'" ) {		// What we thought was a string literal was actually a block comment
				stringStart = -1;
				newLine = newLine.substr(0, newLine.length - "__STRING__".length) + "'''";		// Remedial work to remove token and copy the missed chars
			}
			else if ( stringStart < 0 ) {					// We've found the start of a string literal
				stringStart = charPos;
				strDenote = line[charPos];
			}
			else if ( line[charPos] == strDenote ) {		// Found the end of a string literal
				stringStart = -1;
				newLine += "__STRING__";
			}
			// There is a final case of a string wrapped inside a string - e.g. "a 'b' c ". These can be ignored
		}
		else if ( stringStart < 0 ) {						// No string character found yet, so safely copy the char
			newLine += line[charPos];
		}
		charMinusTwo = prevChar;
		prevChar = line[charPos];
		charPos += 1
	}
	// If the loop exits with stringStart > -1 then there was a syntax error, we're not checking for that so we'll ignore
	return newLine;
}

/* 	removeComment(String) ->  String
	Looks for the # symbol and disregards anything after it
	IMPORTANT: This incorporates much of removeString function (v1) and should follow the same versioning
*/

function removeComment(line) { // V1
    var newLine = "";
    var prevChar = "";       // Used to check for escape characters
    var charMinusTwo = "";   // Used to check the escape character wasn't escaped itself e.g. \\"
    var stringStart = -1;
    var strDenote = "";
    var charPos = 0;
    var escape = false;

 	while ( ( charPos < line.length ) && ( escape == false ) ) {
        if ( ( ['"', "'"].includes(line[charPos]) ) && ( ( prevChar != "\\" ) || ( prevChar + charMinusTwo == "\\\\" ) ) ) {
        // We've found a quote, but we don't want it if it has been escaped - unless the escape char was itself escaped
            if ( line[charPos] + prevChar + charMinusTwo == "'''" && strDenote == "'" ) {    // What we thought was a string literal was actually a block comment
                stringStart = -1;
            }
            else if ( stringStart < 0 ) {                           // We've found the start of a string literal
                stringStart = charPos;
                strDenote = line[charPos];
            }
            else if ( line[charPos] == strDenote ) {                // Found the end of a string literal
                stringStart = -1;
            }
            // There is a final case of a string wrapped inside a string - e.g. "a 'b' c ". These can be ignored
        }	
        else if ( stringStart < 0 && line[charPos] == "#" ) {       // Found # not inside a string
            escape = true;
        }
        if ( escape == false ) {
            newLine += line[charPos];                               // Copy across the character
        }
        charMinusTwo = prevChar;
        prevChar = line[charPos];
        charPos += 1;
	}
    // If the loop exits with stringStart > -1 then there was a syntax error, we're not checking for that so we'll ignore
    if ( newLine.includes("\n") == false ) {
    	// javascript not() ??
        newLine += "\n";
    }
    return newLine
}

/* removeWhiteSpaces(String) -> String
	Removes all forms of whitespace from the given string
*/

function removeWhiteSpaces(line) {
	var lineChars = "";
	var charCounter = 0;
	while ( charCounter < line.length ) {
		if ( [""," ","\t","\n"].includes(line[charCounter]) == false ) {
			lineChars += line[charCounter];
		}
		charCounter += 1;
	}
	return lineChars;
}


/*
	END OF Support functions to the main Code Injection algorithm
*/

/*
####### Simple Inject - The odd line might be missed, but that's preferred to a heavy-weight algorithm###########
# Avoid muliline comments and lines ending with one of [',','[','(','{']
# Conditions we don't inject in: Multi-line Comment, Suite start (if, while etc.), comma terminator, brackets,skip next line, string (inline check)

function simpleInject(Array of String) -> Array of String
*/

function simpleInject(code, delay) {
	const MULTI_COMMENT = 0b100000000;
	const SUITE_START = 0b01000000;
	const BRACKET_COUNT = 0b00010000;
	const SKIP_NEXT = 0b00001000;
	const STRING = 0b00000100;

	var parseFlags = 0b00000000;

	var counter = 0;
	var bracketCount = 0;
	var sleepTime = delay;
	var injectDefinitions = [
	                    "import time" + "; " + "import sys" + "; " + "global _thread_running_, _thread_lineOfExec_" + "\n"
	                    ]; 		// Threading variables to communicate
	var newCode = injectDefinitions;
	/* Parse line-by-line, removes comments beginning with # but leaves multi-line comments in place, removes empty lines */
	while ( counter < code.length ) {
		// code needs to be an array of Strings - each string a line of Python code
		var lineToKeep = removeComment(code[counter]);	// Remove inline comments (#)
	    // Let's remove the string literals so that the rest of the line can be parsed without fear of interpreting the contents of a string
	    var line = removeString(lineToKeep);
	    // String literals are not allowed to span multiple lines and so there is no danger in doing so.
	    var injectEachLine = "_lineOfExecution_ = " + String(counter) + "; " + "(lambda: time.sleep(" + String(sleepTime) + "), lambda: exit(0)" + ")[_thread_running_ == False]()" + "\n";
	    if ( removeWhiteSpaces(line).length > 0 ) { 					// Only continue if we're not dealing with a blank line
	    	if ( line.includes("'''") ) {                       		// CASE 1: start or end of block comment
	    		parseFlags = parseFlags ^ MULTI_COMMENT;        		// XOR to flip the MULTI_COMMENT bit in parseFlags
	            parseFlags = parseFlags | SKIP_NEXT;            		// Up the SKIP_NEXT bit in case of end of block comment
	    	}
	    	else if ( removeWhiteSpaces(line).substr(-1) == ',' ) {    	// CASE 2: Comma terminator, skip this line
	            parseFlags = parseFlags | SKIP_NEXT;
	        }
	        else if ( removeWhiteSpaces(line).substr(-1) == ':' ) {		// CASE 3: Colon terminator - This is the end of a SUITE
	            parseFlags = parseFlags & ~SUITE_START;
	            parseFlags = parseFlags | SKIP_NEXT;             		// End of suite found, but we still want to skip this line
	        }
	        else if ( !(parseFlags & MULTI_COMMENT) ) {          		// CASE 4: Keyword checks. Require that we're not inside a comment block
	            lineSoFar = "";
	        	for ( var strCounter = 0; strCounter < line.length; strCounter++ ) {
	        		lineSoFar += line[strCounter];
	                if ( line[strCounter] == " " ) {
	                    lineSoFar = removeWhiteSpaces(lineSoFar);
	                    if ( ["if", "elif", "while", "for", "try", "with", "def", "except", "exception"].includes(lineSoFar) ) {	// Start of suite found   
	                        parseFlags = parseFlags | SUITE_START;
	                    }
	                }
	        	}
	        }
	        // Count the number of brackets, regardless of most of the other checks
	        if ( !(parseFlags & MULTI_COMMENT) ) {             			// CASE 5: Count brackets, outside of comments
	        	for ( var strCounter = 0; strCounter < line.length; strCounter++ ) {
	        		if ( ['[',']','(',')','{','}'].includes(line[strCounter]) ) {
	                    bracketCount += 1;
	        		}
	        	}
	            if ( bracketCount % 2 == 1 ) {                         	 // Check for an odd number of brackets (not bullet-proof)
	                parseFlags = parseFlags | BRACKET_COUNT;	         // Turn bracket count flag off, but do not reset the counter
	            }
	            else {
	                bracketCount = 0;
	                parseFlags = parseFlags & ~BRACKET_COUNT;
	            }
	        }
	        if ( parseFlags == 0b00000000 ) {                    		// INJECT DECISION: If parseFlags is clean then inject the code, otherwise don't
	            newLine = lineToKeep.substr(0, lineToKeep.length -1);       // Truncate the newline char
	            // Clean the line of spurious white space at the end and any trailing semi-colons
	            charPos = newLine.length - 1;
	            var end = false;
	            while ( charPos > 0 && end == false ) {
	                if ( !([" ", "\t", "\n", ";"].includes(newLine[charPos])) ) {
	                    newLine = newLine.substr(0, charPos+1);
	                    end = true;
	                }
	                charPos = charPos - 1;
	            }
	            // End of spurious white space cleansing
	            newLine += "; " + injectEachLine
	        }
	        else {                                           			// INJECT DECISION: Line not suitable for injection, just copy
	            newLine = lineToKeep;
	        }
	        newCode.push(newLine);
	        // RESET Line dependent flags, use of bitwise & and bitwise not to turn off these bits
	        parseFlags = parseFlags & ~SKIP_NEXT & ~STRING;
		}
		counter += 1;
	}
	return newCode;
}
