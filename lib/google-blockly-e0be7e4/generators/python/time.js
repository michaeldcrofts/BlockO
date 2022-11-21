/**
 Custom library for expoising the python Time library
 Author: Michael Crofts
 Date: 06/03/2018
 */
 
'use strict';

goog.provide('Blockly.Python.time');

goog.require('Blockly.Python');


// If any new block imports any library, add that library name here.
Blockly.Python.addReservedWords('time');

Blockly.Python['time_sleep'] = function(block) {
  var delay = parseFloat(block.getFieldValue('SEC'));
  Blockly.Python.definitions_['import_time'] = 'import time';
  var code = 'time.sleep('+ delay + ')\n';
  return code;
};
Blockly.Python['time_sleep_input'] = function(block) {
  var delay = Blockly.Python.valueToCode(block, 'NUM', Blockly.Python.ORDER_NONE) || '0';
  Blockly.Python.definitions_['import_time'] = 'import time';
  var code = 'time.sleep('+ delay + ')\n';
  return code;
};

