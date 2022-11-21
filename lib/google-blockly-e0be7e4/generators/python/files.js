/**
 Custom library for file handling
 Author: Michael Crofts
 Date: 09/03/2019
 */
 
'use strict';

goog.provide('Blockly.Python.files');

goog.require('Blockly.Python');


// If any new block imports any library, add that library name here.

Blockly.Python['files_open'] = function(block) {
  var VAR_NAME = Blockly.Python.variableDB_.getName(block.getFieldValue('VAR_NAME'), Blockly.Variables.NAME_TYPE);
  var FNAME = Blockly.Python.valueToCode(block, 'FNAME', Blockly.Python.ORDER_ATOMIC);
  var MODE = block.getFieldValue('MODE');
  var code = VAR_NAME + ' = open( ' + FNAME + ', \'' + MODE + '\' )\n';
  return code;
};
Blockly.Python['files_close'] = function(block) {
  var VAR_NAME = Blockly.Python.variableDB_.getName(block.getFieldValue('VAR_NAME'), Blockly.Variables.NAME_TYPE);
  var code = VAR_NAME + '.close();'
  return code;
};
Blockly.Python['files_write'] = function(block) {
  var VAR_NAME = Blockly.Python.variableDB_.getName(block.getFieldValue('VAR_NAME'), Blockly.Variables.NAME_TYPE);
  var WRITE_DATA = Blockly.Python.valueToCode(block, 'WRITE_DATA', Blockly.Python.ORDER_ATOMIC);
  var code = VAR_NAME + '.write( ' + WRITE_DATA + ' )\n';
  return code;
};
Blockly.Python['files_read'] = function(block) {
  var VAR_NAME = Blockly.Python.variableDB_.getName(block.getFieldValue('VAR_NAME'), Blockly.Variables.NAME_TYPE);
  var code = VAR_NAME + '.read()';
  return [code, Blockly.Python.ORDER_ATOMIC];
};
Blockly.Python['files_readlines'] = function(block) {
  var VAR_NAME = Blockly.Python.variableDB_.getName(block.getFieldValue('VAR_NAME'), Blockly.Variables.NAME_TYPE);
  var code = VAR_NAME + '.readlines()';
  return [code, Blockly.Python.ORDER_ATOMIC];
};