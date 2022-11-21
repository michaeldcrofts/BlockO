/**
 Custom library for exposing some Grove functions to Blockly
 Designed to be code generated into Python and run on the Raspberry Pi
 with GrovePi+
 Author: Michael Crofts
 Date: 06/03/2018
 */
 
'use strict';

goog.provide('Blockly.Python.grove');

goog.require('Blockly.Python');


// If any new block imports any library, add that library name here.
Blockly.Python.addReservedWords('grovepi');

Blockly.Python['grove_analogue_read'] = function(block) {
  // Numeric value.
  var pin = parseFloat(block.getFieldValue('NUM'));
  Blockly.Python.definitions_['import_grovepi'] = 'import grovepi';
  Blockly.Python.definitions_['set_pin_mode' + pin] = 'grovepi.pinMode(' + pin + ', "INPUT")\n';
  var code = 'grovepi.analogRead(' + pin + ')';
  return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['grove_light_sensor'] = function(block) {
  // Numeric value.
  var pin = parseFloat(block.getFieldValue('NUM'));
  Blockly.Python.definitions_['import_grovepi'] = 'import grovepi';
  Blockly.Python.definitions_['set_pin_mode' + pin] = 'grovepi.pinMode(' + pin + ', "INPUT")\n';
  var functionName = Blockly.Python.provideFunction_(
      'lightSensorRead',
      ['def ' + Blockly.Python.FUNCTION_NAME_PLACEHOLDER_ + '(pin):',
       '  lightRawValue = grovepi.analogRead( pin ) \t # Read raw value',
       '  return (float)(1023 - lightRawValue) * 10 / lightRawValue \t # Convert raw value into usable number']);
  var code = functionName + '(' + pin + ')';
  return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['grove_digital_read'] = function(block) {
  // Numeric value.
  var pin = parseFloat(block.getFieldValue('NUM'));
  Blockly.Python.definitions_['import_grovepi'] = 'import grovepi';
  Blockly.Python.definitions_['set_pin_mode' + pin] = 'grovepi.pinMode(' + pin + ', "INPUT")\n';
  var code = 'grovepi.digitalRead(' + pin + ')';
  return [code, Blockly.Python.ORDER_ATOMIC];
};
Blockly.Python['grove_digital_write'] = function(block) {
  // Numeric value.
  var pin = parseFloat(block.getFieldValue('NUM'));
  var val = block.getFieldValue('OP');
  Blockly.Python.definitions_['import_grovepi'] = 'import grovepi';
  Blockly.Python.definitions_['set_pin_mode' + pin] = 'grovepi.pinMode(' + pin + ', "OUTPUT")\n';
  var code = 'grovepi.digitalWrite(' + pin + ', 0)\n';
  if (val == "HIGH") {
    code = 'grovepi.digitalWrite(' + pin + ', 1)\n';
  }
  return code;
};

Blockly.Python['grove_analogue_write'] = function(block) {
  // Numeric value.
  var pin = parseFloat(block.getFieldValue('NUM'));
  var val = parseFloat(block.getFieldValue('PWM'));
  var order;
  Blockly.Python.definitions_['import_grovepi'] = 'import grovepi';
  Blockly.Python.definitions_['set_pin_mode' + pin] = 'grovepi.pinMode(' + pin + ', "OUTPUT")\n';
  var code = 'grovepi.analogWrite(' + pin + ', ' + val + ')\n';
  return code;
}; 

Blockly.Python['grove_rgb_led_on'] = function(block) {
  // Numeric value.
  var pin = Blockly.Python.valueToCode(block, 'PIN', Blockly.Python.ORDER_NONE) || '0';
  var r = Blockly.Python.valueToCode(block, 'RED', Blockly.Python.ORDER_NONE) || '0';
  var g = Blockly.Python.valueToCode(block, 'GREEN', Blockly.Python.ORDER_NONE) || '0';
  var b = Blockly.Python.valueToCode(block, 'BLUE', Blockly.Python.ORDER_NONE) || '0';
  Blockly.Python.definitions_['import_grovepi'] = 'import grovepi';
  Blockly.Python.definitions_['set_pin_mode' + pin] = 'grovepi.pinMode(' + pin + ', "OUTPUT")\n';
  Blockly.Python.definitions_['RGB_LED_INIT' + pin] = 'grovepi.chainableRgbLed_init(' + pin + ', 1)\n';
  var code = 'grovepi.storeColor(' + r + ',' + g + ',' + b + ')\n';
  code += 'grovepi.chainableRgbLed_pattern(' + pin + ', 0, 0)\n';
  return code;
};

Blockly.Python['grove_play_note'] = function(block) {
  // Numeric value.
  var pin = parseFloat(block.getFieldValue('PIN'));
  var note = block.getFieldValue('NOTE');
  var val = 0
  Blockly.Python.definitions_['import_grovepi'] = 'import grovepi';
  Blockly.Python.definitions_['set_pin_mode' + pin] = 'grovepi.pinMode(' + pin + ', "OUTPUT")\n';
  switch (note) {
  	case "c":
		val = 262;
		break;
	case "d":
		val = 294;
		break;
	case "e":
		val = 330;
		break;
	case "f":
		val = 349;
		break;
	case "g":
		val = 392;
		break;
	case "a":
		val = 440;
		break;
	case "b":
		val = 494;
		break;
	case "C":
		val = 523;
		break;
	default:
		val = 0;
  }
  var code = 'grovepi.analogWrite(' + pin + ', ' + val + ')\n';
  if (val == 0) {
	code = 'grovepi.digitalWrite(' + pin + ', ' + val + ')\n';
  }
  return code;
}; 

Blockly.Python['grove_ultrasonic_read'] = function(block) {
  // Numeric value.
  var pin = parseFloat(block.getFieldValue('PIN'));
  Blockly.Python.definitions_['import_grovepi'] = 'import grovepi';
  var code = 'grovepi.ultrasonicRead(' + pin + ')';
  return [code, Blockly.Python.ORDER_ATOMIC];
};
