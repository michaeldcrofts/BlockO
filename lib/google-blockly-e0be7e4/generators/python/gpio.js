/**
 Custom library for exposing the python gpio library
 Author: Michael Crofts
 Date: 06/03/2018
 */
 
'use strict';

goog.provide('Blockly.Python.gpio');

goog.require('Blockly.Python');


// If any new block imports any library, add that library name here.
Blockly.Python.addReservedWords('GPIO');

Blockly.Python['gpio_digital_read'] = function(block) {
  // Numeric value.
  var pin = parseFloat(block.getFieldValue('PIN'));
  Blockly.Python.definitions_['import_gpio'] = 'import RPi.GPIO as GPIO';
  Blockly.Python.definitions_['set_numbering'] = 'GPIO.setmode(GPIO.BCM)';
  Blockly.Python.definitions_['set_pin_mode' + pin] = 'GPIO.setup(' + pin + ', GPIO.IN)';
  var code = 'GPIO.input(' + pin + ')';
  return [code, Blockly.Python.ORDER_ATOMIC];
};
Blockly.Python['gpio_digital_write'] = function(block) {
  // Numeric value.
  var pin = parseFloat(block.getFieldValue('PIN'));
  var val = block.getFieldValue('VAL');
  Blockly.Python.definitions_['import_gpio'] = 'import RPi.GPIO as GPIO';
  Blockly.Python.definitions_['set_numbering'] = 'GPIO.setmode(GPIO.BCM)';
  Blockly.Python.definitions_['set_pin_mode' + pin] = 'GPIO.setup(' + pin + ', GPIO.OUT)';
  var code = 'GPIO.output(' + pin + ', 0)\n';
  if (val == "HIGH") {
    code = 'GPIO.output(' + pin + ', 1)\n';
  }
  return code;
};