/**
 Custom library for exposing the fourletter phat module from Pimoroni
 Author: Michael Crofts
 Date: 08/03/2019
 */
 
'use strict';

goog.provide('Blockly.Python.flp');

goog.require('Blockly.Python');


// If any new block imports any library, add that library name here.
Blockly.Python.addReservedWords('fourletterphat');
Blockly.Python.addReservedWords('flp');

Blockly.Python['flp_clear'] = function(block) {
  Blockly.Python.definitions_['import_flp'] = 'import fourletterphat as flp';
  var code = 'flp.clear()\n';
  return code;
};
Blockly.Python['flp_show'] = function(block) {
  Blockly.Python.definitions_['import_flp'] = 'import fourletterphat as flp';
  var code = 'flp.show()\n';
  return code;
};
Blockly.Python['flp_set_digit'] = function(block) {
  Blockly.Python.definitions_['import_flp'] = 'import fourletterphat as flp';
  var DIGIT = Blockly.Python.valueToCode(block, 'DIGIT', Blockly.Python.ORDER_ATOMIC);
  var TXT = Blockly.Python.valueToCode(block, 'TXT', Blockly.Python.ORDER_ATOMIC);
  var code = 'flp.set_digit( ' + DIGIT + ', ' + TXT + ' )\n';
  return code;
};
Blockly.Python['flp_print_str'] = function(block) {
  Blockly.Python.definitions_['import_flp'] = 'import fourletterphat as flp';
  var TXT = Blockly.Python.valueToCode(block, 'TXT', Blockly.Python.ORDER_ATOMIC);
  var code = 'flp.print_str( ' + TXT + ' )\n';
  return code;
};
