/**
 Custom library for exposing the python gpio library
 Author: Michael Crofts
 Date: 06/03/2018
 */
'use strict';

goog.provide('Blockly.Blocks.files');  // Deprecated
goog.provide('Blockly.Constants.FILES');

goog.require('Blockly.Blocks');
goog.require('Blockly');


/**
 * Common HSV hue for all blocks in this category.
 * Should be the same as Blockly.Msg.TEXTS_HUE
 * @readonly
 */

Blockly.Constants.FILES.HUE = 45;
Blockly.Blocks.files.HUE = Blockly.Constants.FILES.HUE;

Blockly.defineBlocksWithJsonArray([  // BEGIN JSON EXTRACT
 // Block for opening a file
  {
    "type": "files_open",
    "message0": "%1 = open( %2, %3 )",
    "args0": [
      {
        "type": "field_variable",
        "name": "VAR_NAME",
        "variable": "fileHandle"
      },
      {
        "type": "input_value",
        "name": "FNAME"
      },
      {
        "type": "field_dropdown",
        "name": "MODE",
        "options": [
          ["Write","w"],
          ["Read","r"],
          ["Append","a"]
        ]
      }
    ],
    "inputsInline": true,
    "previousStatement": null,
    "nextStatement": null,
    "colour": Blockly.Constants.FILES.HUE,
    "tooltip": "Returns a handle to the file"
  },
  // Block for closing a file
  {
    "type": "files_close",
    "message0": "%1 .close()",
    "args0": [
      {
        "type": "field_variable",
        "name": "VAR_NAME",
        "variable": "fileHandle"
      },
    ],
    "inputsInline": true,
    "previousStatement": null,
    "nextStatement": null,
    "colour": Blockly.Constants.FILES.HUE,
    "tooltip": "Closes a file"
  },
  // Block for writing to a file
  {
    "type": "files_write",
    "message0": "%1 .write( %2 )",
    "args0": [
      {
        "type": "field_variable",
        "name": "VAR_NAME",
        "variable": "fileHandle"
      },
      {
        "type": "input_value",
        "name": "WRITE_DATA"
      }
    ],
    "inputsInline": true,
    "previousStatement": null,
    "nextStatement": null,
    "colour": Blockly.Constants.FILES.HUE,
    "tooltip": "Writes to a file"
  },
  // Block for reading from a file
  {
    "type": "files_read",
    "message0": "%1 .read()",
    "args0": [
      {
        "type": "field_variable",
        "name": "VAR_NAME",
        "variable": "fileHandle"
      }
    ],
    "output": null,
    "colour": Blockly.Constants.FILES.HUE,
    "tooltip": "Reads a file at once"
  },
  // Block for reading from a file
  {
    "type": "files_readlines",
    "message0": "%1 .readlines()",
    "args0": [
      {
        "type": "field_variable",
        "name": "VAR_NAME",
        "variable": "fileHandle"
      }
    ],
    "output": null,
    "colour": Blockly.Constants.FILES.HUE,
    "tooltip": "Reads a file into a list"
  },
  
]);  // END JSON EXTRACT (Do not delete this comment.)
