/**
 Custom library for exposing some Grove functions to Blockly
 Designed to be code generated into Python and run on the Raspberry Pi
 with GrovePi+
 Author: Michael Crofts
 Date: 06/03/2018
 */
'use strict';

goog.provide('Blockly.Blocks.grove');  // Deprecated
goog.provide('Blockly.Constants.Grove');

goog.require('Blockly.Blocks');
goog.require('Blockly');


/**
 * Common HSV hue for all blocks in this category.
 * Should be the same as Blockly.Msg.TEXTS_HUE
 * @readonly
 */
Blockly.Constants.Grove.HUE = 358;
/** @deprecated Use Blockly.Constants.Text.HUE */
Blockly.Blocks.grove.HUE = Blockly.Constants.Grove.HUE;

Blockly.defineBlocksWithJsonArray([  // BEGIN JSON EXTRACT
  // Block for analogue read of the GrovePi device
  {
    "type": "grove_analogue_read",
    "message0": "analogue read %1",
    "args0": [{
      "type": "field_number",
      "name": "NUM",
      "value": 0
    }],
    "output": "Number",
    "colour": "358",
    "tooltip": "Returns the value of connected analogue device.",
  },
  // Block for light sensor on the GrovePi device
  {
    "type": "grove_light_sensor",
    "message0": "light sensor read %1",
    "args0": [{
      "type": "field_number",
      "name": "NUM",
      "value": 0
    }],
    "output": "Number",
    "colour": "358",
    "tooltip": "Returns the value of the connected analogue light sensor.",
  },
  // Block for digital read of the GrovePi device
  {
    "type": "grove_digital_read",
    "message0": "digital read %1",
    "args0": [{
      "type": "field_number",
      "name": "NUM",
      "value": 0
    }],
    "output": "Number",
    "colour": "358",
    "tooltip": "Returns the value of connected digital device.",
  },
  // Block for digital write of the GrovePi device
  {
    "type": "grove_digital_write",
    "message0": "digital write pin %1 to %2",
    "args0": [
      {
        "type": "field_number",
        "name": "NUM",
        "value": 0
      },
      {
        "type": "field_dropdown",
        "name": "OP",
        "options": [
          ["HIGH", "HIGH"],
          ["LOW", "LOW"]
        ]
      }
    ],
    "inputsInline": true,
    "previousStatement": null,
    "nextStatement": null,
    "colour": "358",
    "tooltip": "Sets pin HIGH (1) or LOW (0)."
  },
  // Block for analogue write of the GrovePi device
  {
    "type": "grove_analogue_write",
    "message0": "analogue write pin %1 to %2",
    "args0": [
      {
        "type": "field_number",
        "name": "NUM",
        "value": 0
      },
      {
        "type": "field_number",
        "name": "PWM",
        "value": 0
      }
    ],
    "inputsInline": true,
    "previousStatement": null,
    "nextStatement": null,
    "colour": "358",
    "tooltip": "Sets PWM duty cycle (0-255) for pin."
  },
  // Block for switching Grove RGB LED on to a colour
  {
    "type": "grove_rgb_led_on",
    "message0": "RGB LED on to colour (%1, %2, %3) on pin %4",
    "args0": [
      {
        "type": "input_value",
        "name": "RED",
        "value": 255
      },
      {
        "type": "input_value",
        "name": "GREEN",
        "value": 255
      },
      {
        "type": "input_value",
        "name": "BLUE",
        "value": 255
      },
      {
        "type": "input_value",
        "name": "PIN",
        "value": 0
      }
    ],
    "inputsInline": true,
    "previousStatement": null,
    "nextStatement": null,
    "colour": "358",
    "tooltip": "Switches on an LED to colour given by (r, g, b)"
  }, 
// Block for PWM write (mainly for sound)
  {
    "type": "grove_play_note",
    "message0": "play note %1 to pin %2",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "NOTE",
        "options": [
          ["c", "c"],
          ["d", "d"],
	  ["e", "e"],
	  ["f", "f"],
	  ["g", "g"],
	  ["a", "a"],
	  ["b", "b"],
	  ["C", "C"],
	  ["none", "none"]
        ]
      },
	{
        "type": "field_number",
        "name": "PIN",
        "value": 3
      }
    ],
    "inputsInline": true,
    "previousStatement": null,
    "nextStatement": null,
    "colour": "358",
    "tooltip": "Sets PWM duty cycle (0-255) for pin."
  },
// Block for ultrasonic read of the GrovePi device
  {
    "type": "grove_ultrasonic_read",
    "message0": "ultrasonic read %1",
    "args0": [{
      "type": "field_number",
      "name": "PIN",
      "value": 4
    }],
    "output": "Number",
    "colour": "358",
    "tooltip": "Returns the distance in inches",
  }
]);  // END JSON EXTRACT (Do not delete this comment.)
