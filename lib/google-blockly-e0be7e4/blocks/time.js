/**
 Custom library for exposing the python Time library
 Author: Michael Crofts
 Date: 06/03/2018
 */
'use strict';

goog.provide('Blockly.Blocks.time');  // Deprecated
goog.provide('Blockly.Constants.Time');

goog.require('Blockly.Blocks');
goog.require('Blockly');


/**
 * Common HSV hue for all blocks in this category.
 * Should be the same as Blockly.Msg.TEXTS_HUE
 * @readonly
 */
Blockly.Constants.Grove.HUE = 120;
/** @deprecated Use Blockly.Constants.Text.HUE */
Blockly.Blocks.time.HUE = Blockly.Constants.Time.HUE;

Blockly.defineBlocksWithJsonArray([  // BEGIN JSON EXTRACT
  // Block for time.sleep function
  {
    "type": "time_sleep",
    "message0" : "sleep(%1)",
    "args0": [{
      "type" : "field_number",
      "name" : "SEC",
      "value" : 1
    }],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "120",
    "tooltip": "Delay in seconds."
  },
  {
    "type": "time_sleep_input",
    "message0": "sleep(%1)",
      "args0": [
        {
          "type": "input_value",
          "name": "NUM",
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "colour": "120",
      "tooltip": "",
      "helpUrl": ""
  },
  {
    "type": "logo",
    "message0" : "BlockO %1",
    "args0": [
        {
          "type": "input_value",
          "name": "TEXT"
        }
      ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "350",
    "tooltip": ""
  }
]);  // END JSON EXTRACT (Do not delete this comment.)
