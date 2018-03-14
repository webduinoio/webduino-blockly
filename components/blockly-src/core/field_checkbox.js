/**
 * @license
 * Visual Blocks Editor
 *
 * Copyright 2012 Google Inc.
 * https://developers.google.com/blockly/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Checkbox field.  Checked or not checked.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Blockly.FieldCheckbox');

goog.require('Blockly.Field');

// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#jv23mw

/**
 * Class for a checkbox field.
 * @param {string} state The initial state of the field ('TRUE' or 'FALSE').
 * @param {Function=} opt_validator A function that is executed when a new
 *     option is selected.  Its sole argument is the new checkbox state.  If
 *     it returns a value, this becomes the new checkbox state, unless the
 *     value is null, in which case the change is aborted.
 * @extends {Blockly.Field}
 * @constructor
 */
Blockly.FieldCheckbox = function (state, opt_validator) {
  Blockly.FieldCheckbox.superClass_.constructor.call(this, '', opt_validator);
  // Set the initial state.
  this.setValue(state);
};
goog.inherits(Blockly.FieldCheckbox, Blockly.Field);

/**
 * Character for the checkmark.
 */
Blockly.FieldCheckbox.CHECK_CHAR = '\u2713'; // '█'

/**
 * Mouse cursor style when over the hotspot that initiates editability.
 */
Blockly.FieldCheckbox.prototype.CURSOR = 'default';


window._FieldCheckboxCustomType_color = 'rgb(255,255,255)';

function isFieldCheckboxCustomType(ele) {
  return typeof ele.name == 'undefined' ? false :
    (ele.name.indexOf('_m') == 0 && ele.name.length == 4);
}

function setFieldCheckboxCustomTypeColor(strColor) {
  window._FieldCheckboxCustomType_color = strColor;
}

function getFieldCheckboxCustomTypeColor() {
  return window._FieldCheckboxCustomType_color.toLowerCase();
}

/**
 * Install this checkbox on a block.
 * @param {!Blockly.Block} block The block containing this text.
 */
Blockly.FieldCheckbox.prototype.init = function (block) {
  if (this.fieldGroup_) {
    // Checkbox has already been initialized once.
    return;
  }
  Blockly.FieldCheckbox.superClass_.init.call(this, block);
  //專為點矩陣打造
  if (isFieldCheckboxCustomType(this)) {
    // The checkbox doesn't use the inherited text element.
    // Instead it uses a custom checkmark element that is either visible or not.
    this.checkElement_ = Blockly.createSvgElement('text', {
        'class': 'blocklyText blocklyCheckbox',
        'x': -5, //-3
        'y': 12 //14
      },
      this.fieldGroup_);
    var textNode = document.createTextNode('█');
    this.checkElement_.appendChild(textNode);
    this.state_ = ("" + this.state_).toUpperCase();
    this.checkElement_.style.display = this.state_.indexOf("TRUE") == 0 ? 'block' : 'none';
    this.checkElement_.style.fill = this.state_.indexOf("TRUE") == 0 ? this.state_.substring(5).toLowerCase() : 'rgb(0,0,0)';
  } else {
    this.checkElement_ = Blockly.createSvgElement('text', {
        'class': 'blocklyText blocklyCheckbox',
        'x': -3,
        'y': 14
      },
      this.fieldGroup_);
    var textNode = document.createTextNode(Blockly.FieldCheckbox.CHECK_CHAR);
    this.checkElement_.appendChild(textNode);
    this.checkElement_.style.display = this.state_ ? 'block' : 'none';
  }
};

/**
 * Return 'TRUE' if the checkbox is checked, 'FALSE' otherwise.
 * @return {string} Current state.
 */
Blockly.FieldCheckbox.prototype.getValue = function () {
  if (isFieldCheckboxCustomType(this)) {
    var val = String(this.state_).toUpperCase();
    //console.log(this.name, " getVal:", val);
    return val;
  } else {
    return String(this.state_).toUpperCase();
  }
};


/**
 * Set the checkbox to be checked if strBool is 'TRUE', unchecks otherwise.
 * @param {string} strBool New state.
 */
Blockly.FieldCheckbox.prototype.setValue = function (strBool) {
  if (isFieldCheckboxCustomType(this)) {
    var newState = strBool.indexOf('TRUE') == 0;
    newState = newState ? strBool : "FALSE"; //TRUE強迫改成吃紅色
    if (this.state_ !== newState) {
      if (this.sourceBlock_ && Blockly.Events.isEnabled()) {
        Blockly.Events.fire(new Blockly.Events.Change(
          this.sourceBlock_, 'field', this.name, this.state_, newState));
      }
      this.state_ = newState;
      if (this.checkElement_) {
        this.checkElement_.style.display = newState.indexOf('TRUE') == 0 ? 'block' : 'none';
        this.checkElement_.style.fill = newState.indexOf('TRUE') == 0 ? newState.substring(5).toLowerCase() : 'rgb(0,0,0)';
      }
    }
  } else {
    var newState = (strBool == 'TRUE');
    if (this.state_ !== newState) {
      if (this.sourceBlock_ && Blockly.Events.isEnabled()) {
        Blockly.Events.fire(new Blockly.Events.Change(
          this.sourceBlock_, 'field', this.name, this.state_, newState));
      }
      this.state_ = newState;
      if (this.checkElement_) {
        this.checkElement_.style.display = newState ? 'block' : 'none';
      }
    }
  }
};

/**
 * Toggle the state of the checkbox.
 * @private
 */
Blockly.FieldCheckbox.prototype.showEditor_ = function () {
  if (isFieldCheckboxCustomType(this)) {
    var newState = this.state_.indexOf('TRUE') == 0 ? "FALSE" : "TRUE_" + getFieldCheckboxCustomTypeColor(); //TRUE強迫改成吃紅色;
    if (this.sourceBlock_ && this.validator_) {
      // Call any validation function, and allow it to override.
      var override = this.validator_(newState);
      if (override !== undefined) {
        newState = override;
      }
    }
    if (newState !== null) {
      this.setValue(newState);
    }
  } else {
    var newState = !this.state_;
    if (this.sourceBlock_ && this.validator_) {
      // Call any validation function, and allow it to override.
      var override = this.validator_(newState);
      if (override !== undefined) {
        newState = override;
      }
    }
    if (newState !== null) {
      this.setValue(String(newState).toUpperCase());
    }
  }
};