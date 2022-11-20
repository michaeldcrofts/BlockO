/**
 Custom library for exposing the fourletterphat python module from Pimoroni
 Note - the fourletterphat module must be installed on the RPi seperately.
 Author: Michael Crofts
 Date: 08/03/2019
 */
'use strict';

goog.provide('Blockly.Blocks.flp');  // Deprecated
goog.provide('Blockly.Constants.FLP');

goog.require('Blockly.Blocks');
goog.require('Blockly');


/**
 * Common HSV hue for all blocks in this category.
 * Should be the same as Blockly.Msg.TEXTS_HUE
 * @readonly
 */
Blockly.Constants.FLP.HUE = 290;
/** @deprecated Use Blockly.Constants.Text.HUE */
Blockly.Blocks.flp.HUE = Blockly.Constants.FLP.HUE;

Blockly.defineBlocksWithJsonArray([  // BEGIN JSON EXTRACT
  // Block for clearing the four digit display
  {
    "type": "flp_clear",
    "message0" : "flp.clear()",
    "previousStatement": null,
    "nextStatement": null,
    "colour": Blockly.Constants.FLP.HUE,
    "tooltip": "Clears the display."
  },
  // Block for sending the output to the FLP
  {
    "type": "flp_show",
    "message0" : "flp.show()",
    "previousStatement": null,
    "nextStatement": null,
    "colour": Blockly.Constants.FLP.HUE,
    "tooltip": "Send the output to the four letter display."
  },
  // Block for setting a digit on the display
  {
    "type": "flp_set_digit",
    "message0": "flp.set_digit( %1, %2 )",
    "args0": [
      {
        "type": "input_value",
        "name": "DIGIT",
      },
      {
        "type": "input_value",
        "name": "TXT",
      }],
    "inputsInline": true,
    "previousStatement": null,
    "nextStatement": null,
    "colour": Blockly.Constants.FLP.HUE,
    "tooltip": "flp.set_digit( [digit 0-3], [character to display] )",
  },
  // Block for setting a digit on the display
  {
    "type": "flp_print_str",
    "message0": "flp.print_str( %1 )",
    "args0": [
      {
        "type": "input_value",
        "name": "TXT",
      }],
    "inputsInline": true,
    "previousStatement": null,
    "nextStatement": null,
    "colour": Blockly.Constants.FLP.HUE,
    "tooltip": "flp.set_digit( [digit 0-3], [character to display] )",
  },
  
]);  // END JSON EXTRACT (Do not delete this comment.)
