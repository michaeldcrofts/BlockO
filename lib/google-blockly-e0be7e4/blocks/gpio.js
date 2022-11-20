/**
 Custom library for exposing the python gpio library
 Author: Michael Crofts
 Date: 06/03/2018
 */
'use strict';

goog.provide('Blockly.Blocks.gpio');  // Deprecated
goog.provide('Blockly.Constants.Gpio');

goog.require('Blockly.Blocks');
goog.require('Blockly');


/**
 * Common HSV hue for all blocks in this category.
 * Should be the same as Blockly.Msg.TEXTS_HUE
 * @readonly
 */
Blockly.Constants.Gpio.HUE = 240;
/** @deprecated Use Blockly.Constants.Text.HUE */
Blockly.Blocks.gpio.HUE = Blockly.Constants.Gpio.HUE;

Blockly.defineBlocksWithJsonArray([  // BEGIN JSON EXTRACT
  // Block for digital write to gpio pin
  {
    "type": "gpio_digital_write",
    "message0" : "GPIO.output( %1, %2 )",
    "args0": [{
      "type" : "field_number",
      "name" : "PIN",
      "value" : 0
    },
    {
      "type": "field_dropdown",
      "name": "VAL",
      "options": [
        ["HIGH", "HIGH"],
        ["LOW", "LOW"]
        ]
    }],
    //"inputsInline": true,
    "previousStatement": null,
    "nextStatement": null,
    "colour": "240",
    "tooltip": "Sets pin HIGH (1) or LOW (o)."
  },
  
  // Block for digital read of the gpio pin
  {
    "type" : "gpio_digital_read",
    "message0" : "GPIO.input( %1 )",
    "args0": [{
       "type" : "field_number",
       "name" : "PIN",
       "value" : 0
    }],
    "output" : null,
    "colour" : "240",
    "tooltip" : "Returns 1 or 0 (HIGH or LOW) for the connected device",
    "extensions": ["parent_tooltip_when_inline"]
  }
]);  // END JSON EXTRACT (Do not delete this comment.)
