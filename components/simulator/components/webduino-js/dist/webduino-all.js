(function (global, undefined) {
    "use strict";

    if (global.setImmediate) {
        return;
    }

    var nextHandle = 1; // Spec says greater than zero
    var tasksByHandle = {};
    var currentlyRunningATask = false;
    var doc = global.document;
    var registerImmediate;

    function setImmediate(callback) {
      // Callback can either be a function or a string
      if (typeof callback !== "function") {
        callback = new Function("" + callback);
      }
      // Copy function arguments
      var args = new Array(arguments.length - 1);
      for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i + 1];
      }
      // Store and register the task
      var task = { callback: callback, args: args };
      tasksByHandle[nextHandle] = task;
      registerImmediate(nextHandle);
      return nextHandle++;
    }

    function clearImmediate(handle) {
        delete tasksByHandle[handle];
    }

    function run(task) {
        var callback = task.callback;
        var args = task.args;
        switch (args.length) {
        case 0:
            callback();
            break;
        case 1:
            callback(args[0]);
            break;
        case 2:
            callback(args[0], args[1]);
            break;
        case 3:
            callback(args[0], args[1], args[2]);
            break;
        default:
            callback.apply(undefined, args);
            break;
        }
    }

    function runIfPresent(handle) {
        // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
        // So if we're currently running a task, we'll need to delay this invocation.
        if (currentlyRunningATask) {
            // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
            // "too much recursion" error.
            setTimeout(runIfPresent, 0, handle);
        } else {
            var task = tasksByHandle[handle];
            if (task) {
                currentlyRunningATask = true;
                try {
                    run(task);
                } finally {
                    clearImmediate(handle);
                    currentlyRunningATask = false;
                }
            }
        }
    }

    function installNextTickImplementation() {
        registerImmediate = function(handle) {
            process.nextTick(function () { runIfPresent(handle); });
        };
    }

    function canUsePostMessage() {
        // The test against `importScripts` prevents this implementation from being installed inside a web worker,
        // where `global.postMessage` means something completely different and can't be used for this purpose.
        if (global.postMessage && !global.importScripts) {
            var postMessageIsAsynchronous = true;
            var oldOnMessage = global.onmessage;
            global.onmessage = function() {
                postMessageIsAsynchronous = false;
            };
            global.postMessage("", "*");
            global.onmessage = oldOnMessage;
            return postMessageIsAsynchronous;
        }
    }

    function installPostMessageImplementation() {
        // Installs an event handler on `global` for the `message` event: see
        // * https://developer.mozilla.org/en/DOM/window.postMessage
        // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages

        var messagePrefix = "setImmediate$" + Math.random() + "$";
        var onGlobalMessage = function(event) {
            if (event.source === global &&
                typeof event.data === "string" &&
                event.data.indexOf(messagePrefix) === 0) {
                runIfPresent(+event.data.slice(messagePrefix.length));
            }
        };

        if (global.addEventListener) {
            global.addEventListener("message", onGlobalMessage, false);
        } else {
            global.attachEvent("onmessage", onGlobalMessage);
        }

        registerImmediate = function(handle) {
            global.postMessage(messagePrefix + handle, "*");
        };
    }

    function installMessageChannelImplementation() {
        var channel = new MessageChannel();
        channel.port1.onmessage = function(event) {
            var handle = event.data;
            runIfPresent(handle);
        };

        registerImmediate = function(handle) {
            channel.port2.postMessage(handle);
        };
    }

    function installReadyStateChangeImplementation() {
        var html = doc.documentElement;
        registerImmediate = function(handle) {
            // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
            // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
            var script = doc.createElement("script");
            script.onreadystatechange = function () {
                runIfPresent(handle);
                script.onreadystatechange = null;
                html.removeChild(script);
                script = null;
            };
            html.appendChild(script);
        };
    }

    function installSetTimeoutImplementation() {
        registerImmediate = function(handle) {
            setTimeout(runIfPresent, 0, handle);
        };
    }

    // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.
    var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
    attachTo = attachTo && attachTo.setTimeout ? attachTo : global;

    // Don't get fooled by e.g. browserify environments.
    if ({}.toString.call(global.process) === "[object process]") {
        // For Node.js before 0.9
        installNextTickImplementation();

    } else if (canUsePostMessage()) {
        // For non-IE10 modern browsers
        installPostMessageImplementation();

    } else if (global.MessageChannel) {
        // For web workers, where supported
        installMessageChannelImplementation();

    } else if (doc && "onreadystatechange" in doc.createElement("script")) {
        // For IE 6–8
        installReadyStateChangeImplementation();

    } else {
        // For older browsers
        installSetTimeoutImplementation();
    }

    attachTo.setImmediate = setImmediate;
    attachTo.clearImmediate = clearImmediate;
}(typeof self === "undefined" ? typeof global === "undefined" ? this : global : self));

/*******************************************************************************
 * Copyright (c) 2013 IBM Corp.
 *
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * and Eclipse Distribution License v1.0 which accompany this distribution. 
 *
 * The Eclipse Public License is available at 
 *    http://www.eclipse.org/legal/epl-v10.html
 * and the Eclipse Distribution License is available at 
 *   http://www.eclipse.org/org/documents/edl-v10.php.
 *
 * Contributors:
 *    Andrew Banks - initial API and implementation and initial documentation
 *******************************************************************************/


// Only expose a single object name in the global namespace.
// Everything must go through this module. Global Paho.MQTT module
// only has a single public function, client, which returns
// a Paho.MQTT client object given connection details.
 
/**
 * Send and receive messages using web browsers.
 * <p> 
 * This programming interface lets a JavaScript client application use the MQTT V3.1 or
 * V3.1.1 protocol to connect to an MQTT-supporting messaging server.
 *  
 * The function supported includes:
 * <ol>
 * <li>Connecting to and disconnecting from a server. The server is identified by its host name and port number. 
 * <li>Specifying options that relate to the communications link with the server, 
 * for example the frequency of keep-alive heartbeats, and whether SSL/TLS is required.
 * <li>Subscribing to and receiving messages from MQTT Topics.
 * <li>Publishing messages to MQTT Topics.
 * </ol>
 * <p>
 * The API consists of two main objects:
 * <dl>
 * <dt><b>{@link Paho.MQTT.Client}</b></dt>
 * <dd>This contains methods that provide the functionality of the API,
 * including provision of callbacks that notify the application when a message
 * arrives from or is delivered to the messaging server,
 * or when the status of its connection to the messaging server changes.</dd>
 * <dt><b>{@link Paho.MQTT.Message}</b></dt>
 * <dd>This encapsulates the payload of the message along with various attributes
 * associated with its delivery, in particular the destination to which it has
 * been (or is about to be) sent.</dd>
 * </dl> 
 * <p>
 * The programming interface validates parameters passed to it, and will throw
 * an Error containing an error message intended for developer use, if it detects
 * an error with any parameter.
 * <p>
 * Example:
 * 
 * <code><pre>
client = new Paho.MQTT.Client(location.hostname, Number(location.port), "clientId");
client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;
client.connect({onSuccess:onConnect});

function onConnect() {
  // Once a connection has been made, make a subscription and send a message.
  console.log("onConnect");
  client.subscribe("/World");
  message = new Paho.MQTT.Message("Hello");
  message.destinationName = "/World";
  client.send(message); 
};
function onConnectionLost(responseObject) {
  if (responseObject.errorCode !== 0)
	console.log("onConnectionLost:"+responseObject.errorMessage);
};
function onMessageArrived(message) {
  console.log("onMessageArrived:"+message.payloadString);
  client.disconnect(); 
};	
 * </pre></code>
 * @namespace Paho.MQTT 
 */

if (typeof Paho === "undefined") {
	Paho = {};
}

Paho.MQTT = (function (global) {

	// Private variables below, these are only visible inside the function closure
	// which is used to define the module. 

	var version = "@VERSION@";
	var buildLevel = "@BUILDLEVEL@";
	
	/** 
	 * Unique message type identifiers, with associated
	 * associated integer values.
	 * @private 
	 */
	var MESSAGE_TYPE = {
		CONNECT: 1, 
		CONNACK: 2, 
		PUBLISH: 3,
		PUBACK: 4,
		PUBREC: 5, 
		PUBREL: 6,
		PUBCOMP: 7,
		SUBSCRIBE: 8,
		SUBACK: 9,
		UNSUBSCRIBE: 10,
		UNSUBACK: 11,
		PINGREQ: 12,
		PINGRESP: 13,
		DISCONNECT: 14
	};
	
	// Collection of utility methods used to simplify module code 
	// and promote the DRY pattern.  

	/**
	 * Validate an object's parameter names to ensure they 
	 * match a list of expected variables name for this option
	 * type. Used to ensure option object passed into the API don't
	 * contain erroneous parameters.
	 * @param {Object} obj - User options object
	 * @param {Object} keys - valid keys and types that may exist in obj. 
	 * @throws {Error} Invalid option parameter found. 
	 * @private 
	 */
	var validate = function(obj, keys) {
		for (var key in obj) {
			if (obj.hasOwnProperty(key)) {       		
				if (keys.hasOwnProperty(key)) {
					if (typeof obj[key] !== keys[key])
					   throw new Error(format(ERROR.INVALID_TYPE, [typeof obj[key], key]));
				} else {	
					var errorStr = "Unknown property, " + key + ". Valid properties are:";
					for (var key in keys)
						if (keys.hasOwnProperty(key))
							errorStr = errorStr+" "+key;
					throw new Error(errorStr);
				}
			}
		}
	};

	/**
	 * Return a new function which runs the user function bound
	 * to a fixed scope. 
	 * @param {function} User function
	 * @param {object} Function scope  
	 * @return {function} User function bound to another scope
	 * @private 
	 */
	var scope = function (f, scope) {
		return function () {
			return f.apply(scope, arguments);
		};
	};
	
	/** 
	 * Unique message type identifiers, with associated
	 * associated integer values.
	 * @private 
	 */
	var ERROR = {
		OK: {code:0, text:"AMQJSC0000I OK."},
		CONNECT_TIMEOUT: {code:1, text:"AMQJSC0001E Connect timed out."},
		SUBSCRIBE_TIMEOUT: {code:2, text:"AMQJS0002E Subscribe timed out."}, 
		UNSUBSCRIBE_TIMEOUT: {code:3, text:"AMQJS0003E Unsubscribe timed out."},
		PING_TIMEOUT: {code:4, text:"AMQJS0004E Ping timed out."},
		INTERNAL_ERROR: {code:5, text:"AMQJS0005E Internal error. Error Message: {0}, Stack trace: {1}"},
		CONNACK_RETURNCODE: {code:6, text:"AMQJS0006E Bad Connack return code:{0} {1}."},
		SOCKET_ERROR: {code:7, text:"AMQJS0007E Socket error:{0}."},
		SOCKET_CLOSE: {code:8, text:"AMQJS0008I Socket closed."},
		MALFORMED_UTF: {code:9, text:"AMQJS0009E Malformed UTF data:{0} {1} {2}."},
		UNSUPPORTED: {code:10, text:"AMQJS0010E {0} is not supported by this browser."},
		INVALID_STATE: {code:11, text:"AMQJS0011E Invalid state {0}."},
		INVALID_TYPE: {code:12, text:"AMQJS0012E Invalid type {0} for {1}."},
		INVALID_ARGUMENT: {code:13, text:"AMQJS0013E Invalid argument {0} for {1}."},
		UNSUPPORTED_OPERATION: {code:14, text:"AMQJS0014E Unsupported operation."},
		INVALID_STORED_DATA: {code:15, text:"AMQJS0015E Invalid data in local storage key={0} value={1}."},
		INVALID_MQTT_MESSAGE_TYPE: {code:16, text:"AMQJS0016E Invalid MQTT message type {0}."},
		MALFORMED_UNICODE: {code:17, text:"AMQJS0017E Malformed Unicode string:{0} {1}."},
		BUFFER_FULL: {code:18, text:"AMQJS0018E Message buffer is full, maximum buffer size: ${0}."},
	};
	
	/** CONNACK RC Meaning. */
	var CONNACK_RC = {
		0:"Connection Accepted",
		1:"Connection Refused: unacceptable protocol version",
		2:"Connection Refused: identifier rejected",
		3:"Connection Refused: server unavailable",
		4:"Connection Refused: bad user name or password",
		5:"Connection Refused: not authorized"
	};

	/**
	 * Format an error message text.
	 * @private
	 * @param {error} ERROR.KEY value above.
	 * @param {substitutions} [array] substituted into the text.
	 * @return the text with the substitutions made.
	 */
	var format = function(error, substitutions) {
		var text = error.text;
		if (substitutions) {
		  var field,start;
		  for (var i=0; i<substitutions.length; i++) {
			field = "{"+i+"}";
			start = text.indexOf(field);
			if(start > 0) {
				var part1 = text.substring(0,start);
				var part2 = text.substring(start+field.length);
				text = part1+substitutions[i]+part2;
			}
		  }
		}
		return text;
	};
	
	//MQTT protocol and version          6    M    Q    I    s    d    p    3
	var MqttProtoIdentifierv3 = [0x00,0x06,0x4d,0x51,0x49,0x73,0x64,0x70,0x03];
	//MQTT proto/version for 311         4    M    Q    T    T    4
	var MqttProtoIdentifierv4 = [0x00,0x04,0x4d,0x51,0x54,0x54,0x04];
	
	/**
	 * Construct an MQTT wire protocol message.
	 * @param type MQTT packet type.
	 * @param options optional wire message attributes.
	 * 
	 * Optional properties
	 * 
	 * messageIdentifier: message ID in the range [0..65535]
	 * payloadMessage:	Application Message - PUBLISH only
	 * connectStrings:	array of 0 or more Strings to be put into the CONNECT payload
	 * topics:			array of strings (SUBSCRIBE, UNSUBSCRIBE)
	 * requestQoS:		array of QoS values [0..2]
	 *  
	 * "Flag" properties 
	 * cleanSession:	true if present / false if absent (CONNECT)
	 * willMessage:  	true if present / false if absent (CONNECT)
	 * isRetained:		true if present / false if absent (CONNECT)
	 * userName:		true if present / false if absent (CONNECT)
	 * password:		true if present / false if absent (CONNECT)
	 * keepAliveInterval:	integer [0..65535]  (CONNECT)
	 *
	 * @private
	 * @ignore
	 */
	var WireMessage = function (type, options) { 	
		this.type = type;
		for (var name in options) {
			if (options.hasOwnProperty(name)) {
				this[name] = options[name];
			}
		}
	};
	
	WireMessage.prototype.encode = function() {
		// Compute the first byte of the fixed header
		var first = ((this.type & 0x0f) << 4);
		
		/*
		 * Now calculate the length of the variable header + payload by adding up the lengths
		 * of all the component parts
		 */

		var remLength = 0;
		var topicStrLength = new Array();
		var destinationNameLength = 0;
		
		// if the message contains a messageIdentifier then we need two bytes for that
		if (this.messageIdentifier != undefined)
			remLength += 2;

		switch(this.type) {
			// If this a Connect then we need to include 12 bytes for its header
			case MESSAGE_TYPE.CONNECT:
				switch(this.mqttVersion) {
					case 3:
						remLength += MqttProtoIdentifierv3.length + 3;
						break;
					case 4:
						remLength += MqttProtoIdentifierv4.length + 3;
						break;
				}

				remLength += UTF8Length(this.clientId) + 2;
				if (this.willMessage != undefined) {
					remLength += UTF8Length(this.willMessage.destinationName) + 2;
					// Will message is always a string, sent as UTF-8 characters with a preceding length.
					var willMessagePayloadBytes = this.willMessage.payloadBytes;
					if (!(willMessagePayloadBytes instanceof Uint8Array))
						willMessagePayloadBytes = new Uint8Array(payloadBytes);
					remLength += willMessagePayloadBytes.byteLength +2;
				}
				if (this.userName != undefined)
					remLength += UTF8Length(this.userName) + 2;	
				if (this.password != undefined)
					remLength += UTF8Length(this.password) + 2;
			break;

			// Subscribe, Unsubscribe can both contain topic strings
			case MESSAGE_TYPE.SUBSCRIBE:	        	
				first |= 0x02; // Qos = 1;
				for ( var i = 0; i < this.topics.length; i++) {
					topicStrLength[i] = UTF8Length(this.topics[i]);
					remLength += topicStrLength[i] + 2;
				}
				remLength += this.requestedQos.length; // 1 byte for each topic's Qos
				// QoS on Subscribe only
				break;

			case MESSAGE_TYPE.UNSUBSCRIBE:
				first |= 0x02; // Qos = 1;
				for ( var i = 0; i < this.topics.length; i++) {
					topicStrLength[i] = UTF8Length(this.topics[i]);
					remLength += topicStrLength[i] + 2;
				}
				break;

			case MESSAGE_TYPE.PUBREL:
				first |= 0x02; // Qos = 1;
				break;

			case MESSAGE_TYPE.PUBLISH:
				if (this.payloadMessage.duplicate) first |= 0x08;
				first  = first |= (this.payloadMessage.qos << 1);
				if (this.payloadMessage.retained) first |= 0x01;
				destinationNameLength = UTF8Length(this.payloadMessage.destinationName);
				remLength += destinationNameLength + 2;	   
				var payloadBytes = this.payloadMessage.payloadBytes;
				remLength += payloadBytes.byteLength;  
				if (payloadBytes instanceof ArrayBuffer)
					payloadBytes = new Uint8Array(payloadBytes);
				else if (!(payloadBytes instanceof Uint8Array))
					payloadBytes = new Uint8Array(payloadBytes.buffer);
				break;

			case MESSAGE_TYPE.DISCONNECT:
				break;

			default:
				;
		}

		// Now we can allocate a buffer for the message

		var mbi = encodeMBI(remLength);  // Convert the length to MQTT MBI format
		var pos = mbi.length + 1;        // Offset of start of variable header
		var buffer = new ArrayBuffer(remLength + pos);
		var byteStream = new Uint8Array(buffer);    // view it as a sequence of bytes

		//Write the fixed header into the buffer
		byteStream[0] = first;
		byteStream.set(mbi,1);

		// If this is a PUBLISH then the variable header starts with a topic
		if (this.type == MESSAGE_TYPE.PUBLISH)
			pos = writeString(this.payloadMessage.destinationName, destinationNameLength, byteStream, pos);
		// If this is a CONNECT then the variable header contains the protocol name/version, flags and keepalive time
		
		else if (this.type == MESSAGE_TYPE.CONNECT) {
			switch (this.mqttVersion) {
				case 3:
					byteStream.set(MqttProtoIdentifierv3, pos);
					pos += MqttProtoIdentifierv3.length;
					break;
				case 4:
					byteStream.set(MqttProtoIdentifierv4, pos);
					pos += MqttProtoIdentifierv4.length;
					break;
			}
			var connectFlags = 0;
			if (this.cleanSession) 
				connectFlags = 0x02;
			if (this.willMessage != undefined ) {
				connectFlags |= 0x04;
				connectFlags |= (this.willMessage.qos<<3);
				if (this.willMessage.retained) {
					connectFlags |= 0x20;
				}
			}
			if (this.userName != undefined)
				connectFlags |= 0x80;
			if (this.password != undefined)
				connectFlags |= 0x40;
			byteStream[pos++] = connectFlags; 
			pos = writeUint16 (this.keepAliveInterval, byteStream, pos);
		}

		// Output the messageIdentifier - if there is one
		if (this.messageIdentifier != undefined)
			pos = writeUint16 (this.messageIdentifier, byteStream, pos);

		switch(this.type) {
			case MESSAGE_TYPE.CONNECT:
				pos = writeString(this.clientId, UTF8Length(this.clientId), byteStream, pos); 
				if (this.willMessage != undefined) {
					pos = writeString(this.willMessage.destinationName, UTF8Length(this.willMessage.destinationName), byteStream, pos);
					pos = writeUint16(willMessagePayloadBytes.byteLength, byteStream, pos);
					byteStream.set(willMessagePayloadBytes, pos);
					pos += willMessagePayloadBytes.byteLength;
					
				}
			if (this.userName != undefined)
				pos = writeString(this.userName, UTF8Length(this.userName), byteStream, pos);
			if (this.password != undefined) 
				pos = writeString(this.password, UTF8Length(this.password), byteStream, pos);
			break;

			case MESSAGE_TYPE.PUBLISH:	
				// PUBLISH has a text or binary payload, if text do not add a 2 byte length field, just the UTF characters.	
				byteStream.set(payloadBytes, pos);
					
				break;

//    	    case MESSAGE_TYPE.PUBREC:	
//    	    case MESSAGE_TYPE.PUBREL:	
//    	    case MESSAGE_TYPE.PUBCOMP:	
//    	    	break;

			case MESSAGE_TYPE.SUBSCRIBE:
				// SUBSCRIBE has a list of topic strings and request QoS
				for (var i=0; i<this.topics.length; i++) {
					pos = writeString(this.topics[i], topicStrLength[i], byteStream, pos);
					byteStream[pos++] = this.requestedQos[i];
				}
				break;

			case MESSAGE_TYPE.UNSUBSCRIBE:	
				// UNSUBSCRIBE has a list of topic strings
				for (var i=0; i<this.topics.length; i++)
					pos = writeString(this.topics[i], topicStrLength[i], byteStream, pos);
				break;

			default:
				// Do nothing.
		}

		return buffer;
	}	

	function decodeMessage(input,pos) {
	    var startingPos = pos;
		var first = input[pos];
		var type = first >> 4;
		var messageInfo = first &= 0x0f;
		pos += 1;
		

		// Decode the remaining length (MBI format)

		var digit;
		var remLength = 0;
		var multiplier = 1;
		do {
			if (pos == input.length) {
			    return [null,startingPos];
			}
			digit = input[pos++];
			remLength += ((digit & 0x7F) * multiplier);
			multiplier *= 128;
		} while ((digit & 0x80) != 0);
		
		var endPos = pos+remLength;
		if (endPos > input.length) {
		    return [null,startingPos];
		}

		var wireMessage = new WireMessage(type);
		switch(type) {
			case MESSAGE_TYPE.CONNACK:
				var connectAcknowledgeFlags = input[pos++];
				if (connectAcknowledgeFlags & 0x01)
					wireMessage.sessionPresent = true;
				wireMessage.returnCode = input[pos++];
				break;
			
			case MESSAGE_TYPE.PUBLISH:     	    	
				var qos = (messageInfo >> 1) & 0x03;
							
				var len = readUint16(input, pos);
				pos += 2;
				var topicName = parseUTF8(input, pos, len);
				pos += len;
				// If QoS 1 or 2 there will be a messageIdentifier
				if (qos > 0) {
					wireMessage.messageIdentifier = readUint16(input, pos);
					pos += 2;
				}
				
				var message = new Paho.MQTT.Message(input.subarray(pos, endPos));
				if ((messageInfo & 0x01) == 0x01) 
					message.retained = true;
				if ((messageInfo & 0x08) == 0x08)
					message.duplicate =  true;
				message.qos = qos;
				message.destinationName = topicName;
				wireMessage.payloadMessage = message;	
				break;
			
			case  MESSAGE_TYPE.PUBACK:
			case  MESSAGE_TYPE.PUBREC:	    
			case  MESSAGE_TYPE.PUBREL:    
			case  MESSAGE_TYPE.PUBCOMP:
			case  MESSAGE_TYPE.UNSUBACK:    	    	
				wireMessage.messageIdentifier = readUint16(input, pos);
				break;
				
			case  MESSAGE_TYPE.SUBACK:
				wireMessage.messageIdentifier = readUint16(input, pos);
				pos += 2;
				wireMessage.returnCode = input.subarray(pos, endPos);	
				break;
		
			default:
				;
		}
				
		return [wireMessage,endPos];	
	}

	function writeUint16(input, buffer, offset) {
		buffer[offset++] = input >> 8;      //MSB
		buffer[offset++] = input % 256;     //LSB 
		return offset;
	}	

	function writeString(input, utf8Length, buffer, offset) {
		offset = writeUint16(utf8Length, buffer, offset);
		stringToUTF8(input, buffer, offset);
		return offset + utf8Length;
	}	

	function readUint16(buffer, offset) {
		return 256*buffer[offset] + buffer[offset+1];
	}	

	/**
	 * Encodes an MQTT Multi-Byte Integer
	 * @private 
	 */
	function encodeMBI(number) {
		var output = new Array(1);
		var numBytes = 0;

		do {
			var digit = number % 128;
			number = number >> 7;
			if (number > 0) {
				digit |= 0x80;
			}
			output[numBytes++] = digit;
		} while ( (number > 0) && (numBytes<4) );

		return output;
	}

	/**
	 * Takes a String and calculates its length in bytes when encoded in UTF8.
	 * @private
	 */
	function UTF8Length(input) {
		var output = 0;
		for (var i = 0; i<input.length; i++) 
		{
			var charCode = input.charCodeAt(i);
				if (charCode > 0x7FF)
				   {
					  // Surrogate pair means its a 4 byte character
					  if (0xD800 <= charCode && charCode <= 0xDBFF)
						{
						  i++;
						  output++;
						}
				   output +=3;
				   }
			else if (charCode > 0x7F)
				output +=2;
			else
				output++;
		} 
		return output;
	}
	
	/**
	 * Takes a String and writes it into an array as UTF8 encoded bytes.
	 * @private
	 */
	function stringToUTF8(input, output, start) {
		var pos = start;
		for (var i = 0; i<input.length; i++) {
			var charCode = input.charCodeAt(i);
			
			// Check for a surrogate pair.
			if (0xD800 <= charCode && charCode <= 0xDBFF) {
				var lowCharCode = input.charCodeAt(++i);
				if (isNaN(lowCharCode)) {
					throw new Error(format(ERROR.MALFORMED_UNICODE, [charCode, lowCharCode]));
				}
				charCode = ((charCode - 0xD800)<<10) + (lowCharCode - 0xDC00) + 0x10000;
			
			}
			
			if (charCode <= 0x7F) {
				output[pos++] = charCode;
			} else if (charCode <= 0x7FF) {
				output[pos++] = charCode>>6  & 0x1F | 0xC0;
				output[pos++] = charCode     & 0x3F | 0x80;
			} else if (charCode <= 0xFFFF) {    				    
				output[pos++] = charCode>>12 & 0x0F | 0xE0;
				output[pos++] = charCode>>6  & 0x3F | 0x80;   
				output[pos++] = charCode     & 0x3F | 0x80;   
			} else {
				output[pos++] = charCode>>18 & 0x07 | 0xF0;
				output[pos++] = charCode>>12 & 0x3F | 0x80;
				output[pos++] = charCode>>6  & 0x3F | 0x80;
				output[pos++] = charCode     & 0x3F | 0x80;
			};
		} 
		return output;
	}
	
	function parseUTF8(input, offset, length) {
		var output = "";
		var utf16;
		var pos = offset;

		while (pos < offset+length)
		{
			var byte1 = input[pos++];
			if (byte1 < 128)
				utf16 = byte1;
			else 
			{
				var byte2 = input[pos++]-128;
				if (byte2 < 0) 
					throw new Error(format(ERROR.MALFORMED_UTF, [byte1.toString(16), byte2.toString(16),""]));
				if (byte1 < 0xE0)             // 2 byte character
					utf16 = 64*(byte1-0xC0) + byte2;
				else 
				{ 
					var byte3 = input[pos++]-128;
					if (byte3 < 0) 
						throw new Error(format(ERROR.MALFORMED_UTF, [byte1.toString(16), byte2.toString(16), byte3.toString(16)]));
					if (byte1 < 0xF0)        // 3 byte character
						utf16 = 4096*(byte1-0xE0) + 64*byte2 + byte3;
								else
								{
								   var byte4 = input[pos++]-128;
								   if (byte4 < 0) 
						throw new Error(format(ERROR.MALFORMED_UTF, [byte1.toString(16), byte2.toString(16), byte3.toString(16), byte4.toString(16)]));
								   if (byte1 < 0xF8)        // 4 byte character 
										   utf16 = 262144*(byte1-0xF0) + 4096*byte2 + 64*byte3 + byte4;
					   else                     // longer encodings are not supported  
						throw new Error(format(ERROR.MALFORMED_UTF, [byte1.toString(16), byte2.toString(16), byte3.toString(16), byte4.toString(16)]));
								}
				}
			}  

				if (utf16 > 0xFFFF)   // 4 byte character - express as a surrogate pair
				  {
					 utf16 -= 0x10000;
					 output += String.fromCharCode(0xD800 + (utf16 >> 10)); // lead character
					 utf16 = 0xDC00 + (utf16 & 0x3FF);  // trail character
				  }
			output += String.fromCharCode(utf16);
		}
		return output;
	}
	
	/** 
	 * Repeat keepalive requests, monitor responses.
	 * @ignore
	 */
	var Pinger = function(client, window, keepAliveInterval) { 
		this._client = client;        	
		this._window = window;
		this._keepAliveInterval = keepAliveInterval*1000;     	
		this.isReset = false;
		
		var pingReq = new WireMessage(MESSAGE_TYPE.PINGREQ).encode(); 
		
		var doTimeout = function (pinger) {
			return function () {
				return doPing.apply(pinger);
			};
		};
		
		/** @ignore */
		var doPing = function() { 
			if (!this.isReset) {
				this._client._trace("Pinger.doPing", "Timed out");
				this._client._disconnected( ERROR.PING_TIMEOUT.code , format(ERROR.PING_TIMEOUT));
			} else {
				this.isReset = false;
				this._client._trace("Pinger.doPing", "send PINGREQ");
				this._client.socket.send(pingReq); 
				this.timeout = this._window.setTimeout(doTimeout(this), this._keepAliveInterval);
			}
		}

		this.reset = function() {
			this.isReset = true;
			this._window.clearTimeout(this.timeout);
			if (this._keepAliveInterval > 0)
				this.timeout = setTimeout(doTimeout(this), this._keepAliveInterval);
		}

		this.cancel = function() {
			this._window.clearTimeout(this.timeout);
		}
	 };
	 
	 /** 
	 * Reconnect timer
	 * @ignore
	 */
	var Reconnector = function(client, window, reconnectInterval) { 
		this._client = client;        	
		this._window = window;
		this._reconnectInterval = reconnectInterval*1000;
		
		var doTimeout = function (reconnector) {
			return function () {
				return doReconnect.apply(reconnector);
			};
		};
		
		/** @ignore */
		var doReconnect = function() { 
			if (this._client.connected) {
				this._client._trace("Reconnector.doReconnect", "ALREADY CONNECTED");
				this._window.clearTimeout(this.reconnectorTimer);
			} else {
				this._client._trace("Reconnector.doReconnect", "reconnecting");
				if (this._client.connectOptions.uris) {
					this._client.hostIndex = 0;
					this._client._doConnect(this._client.connectOptions.uris[0]);  
				} else {
					this._client._doConnect(this._client.uri);
				}
				this.reconnectorTimer = this._window.setTimeout(doTimeout(this), this._reconnectInterval);
			}
		}
		
		this.reset = function() {
			this._window.clearTimeout(this.reconnectorTimer);
			this.reconnectorTimer = this._window.setTimeout(doTimeout(this), this._reconnectInterval);
		}

		this.cancel = function() {
			this._window.clearTimeout(this.reconnectorTimer);
		}
	 }; 

	/**
	 * Monitor request completion.
	 * @ignore
	 */
	var Timeout = function(client, window, timeoutSeconds, action, args) {
		this._window = window;
		if (!timeoutSeconds)
			timeoutSeconds = 30;
		
		var doTimeout = function (action, client, args) {
			return function () {
				return action.apply(client, args);
			};
		};
		this.timeout = setTimeout(doTimeout(action, client, args), timeoutSeconds * 1000);
		
		this.cancel = function() {
			this._window.clearTimeout(this.timeout);
		}
	}; 
	
	/*
	 * Internal implementation of the Websockets MQTT V3.1 client.
	 * 
	 * @name Paho.MQTT.ClientImpl @constructor 
	 * @param {String} host the DNS nameof the webSocket host. 
	 * @param {Number} port the port number for that host.
	 * @param {String} clientId the MQ client identifier.
	 */
	var ClientImpl = function (uri, host, port, path, clientId) {
		// Check dependencies are satisfied in this browser.
		if (!("WebSocket" in global && global["WebSocket"] !== null)) {
			throw new Error(format(ERROR.UNSUPPORTED, ["WebSocket"]));
		}
		if (!("localStorage" in global && global["localStorage"] !== null)) {
			localStorage = {
				store: {},
				setItem: function (key, val) {
					this.store[key] = val;
				},
				getItem: function (key) {
					return this.store[key];
				},
				removeItem: function (key) {
					delete this.store[key];
				}
			};
		}
		if (!("ArrayBuffer" in global && global["ArrayBuffer"] !== null)) {
			throw new Error(format(ERROR.UNSUPPORTED, ["ArrayBuffer"]));
		}
		this._trace("Paho.MQTT.Client", uri, host, port, path, clientId);

		this.host = host;
		this.port = port;
		this.path = path;
		this.uri = uri;
		this.clientId = clientId;
		this._wsuri = null;

		// Local storagekeys are qualified with the following string.
		// The conditional inclusion of path in the key is for backward
		// compatibility to when the path was not configurable and assumed to
		// be /mqtt
		this._localKey=host+":"+port+(path!="/mqtt"?":"+path:"")+":"+clientId+":";

		// Create private instance-only message queue
		// Internal queue of messages to be sent, in sending order. 
		this._msg_queue = [];
		this._buffered_queue = [];

		// Messages we have sent and are expecting a response for, indexed by their respective message ids. 
		this._sentMessages = {};

		// Messages we have received and acknowleged and are expecting a confirm message for
		// indexed by their respective message ids. 
		this._receivedMessages = {};

		// Internal list of callbacks to be executed when messages
		// have been successfully sent over web socket, e.g. disconnect
		// when it doesn't have to wait for ACK, just message is dispatched.
		this._notify_msg_sent = {};

		// Unique identifier for SEND messages, incrementing
		// counter as messages are sent.
		this._message_identifier = 1;
		
		// Used to determine the transmission sequence of stored sent messages.
		this._sequence = 0;
		

		// Load the local state, if any, from the saved version, only restore state relevant to this client.   	
		for (var key in localStorage)
			if (   key.indexOf("Sent:"+this._localKey) == 0  		    
				|| key.indexOf("Received:"+this._localKey) == 0)
			this.restore(key);
	};

	// Messaging Client public instance members. 
	ClientImpl.prototype.host;
	ClientImpl.prototype.port;
	ClientImpl.prototype.path;
	ClientImpl.prototype.uri;
	ClientImpl.prototype.clientId;

	// Messaging Client private instance members.
	ClientImpl.prototype.socket;
	/* true once we have received an acknowledgement to a CONNECT packet. */
	ClientImpl.prototype.connected = false;
	/* The largest message identifier allowed, may not be larger than 2**16 but 
	 * if set smaller reduces the maximum number of outbound messages allowed.
	 */ 
	ClientImpl.prototype.maxMessageIdentifier = 65536;
	ClientImpl.prototype.connectOptions;
	ClientImpl.prototype.hostIndex;
	ClientImpl.prototype.onConnected;
	ClientImpl.prototype.onConnectionLost;
	ClientImpl.prototype.onMessageDelivered;
	ClientImpl.prototype.onMessageArrived;
	ClientImpl.prototype.traceFunction;
	ClientImpl.prototype._msg_queue = null;
	ClientImpl.prototype._buffered_queue = null;
	ClientImpl.prototype._connectTimeout;
	/* The sendPinger monitors how long we allow before we send data to prove to the server that we are alive. */
	ClientImpl.prototype.sendPinger = null;
	/* The receivePinger monitors how long we allow before we require evidence that the server is alive. */
	ClientImpl.prototype.receivePinger = null;
	/* The reconnector indicates that reconnection operation is active */
	ClientImpl.prototype.reconnector = null;
	ClientImpl.prototype.disconnectedPublishing = false;
	ClientImpl.prototype.disconnectedBufferSize = 5000;
	
	ClientImpl.prototype.receiveBuffer = null;
	
	ClientImpl.prototype._traceBuffer = null;
	ClientImpl.prototype._MAX_TRACE_ENTRIES = 100;

	ClientImpl.prototype.connect = function (connectOptions) {
		var connectOptionsMasked = this._traceMask(connectOptions, "password"); 
		this._trace("Client.connect", connectOptionsMasked, this.socket, this.connected);
		
		if (this.connected) 
			throw new Error(format(ERROR.INVALID_STATE, ["already connected"]));
		if (this.socket)
			throw new Error(format(ERROR.INVALID_STATE, ["already connected"]));
		
		this.connectOptions = connectOptions;
		
		if (connectOptions.uris) {
			this.hostIndex = 0;
			this._doConnect(connectOptions.uris[0]);  
		} else {
			this._doConnect(this.uri);  		
		}
		
	};

	ClientImpl.prototype.subscribe = function (filter, subscribeOptions) {
		this._trace("Client.subscribe", filter, subscribeOptions);
			  
		if (!this.connected)
			throw new Error(format(ERROR.INVALID_STATE, ["not connected"]));
		
		var wireMessage = new WireMessage(MESSAGE_TYPE.SUBSCRIBE);
		wireMessage.topics=[filter];
		if (subscribeOptions.qos != undefined)
			wireMessage.requestedQos = [subscribeOptions.qos];
		else 
			wireMessage.requestedQos = [0];
		
		if (subscribeOptions.onSuccess) {
			wireMessage.onSuccess = function(grantedQos) {subscribeOptions.onSuccess({invocationContext:subscribeOptions.invocationContext,grantedQos:grantedQos});};
		}

		if (subscribeOptions.onFailure) {
			wireMessage.onFailure = function(errorCode) {subscribeOptions.onFailure({invocationContext:subscribeOptions.invocationContext,errorCode:errorCode});};
		}

		if (subscribeOptions.timeout) {
			wireMessage.timeOut = new Timeout(this, window, subscribeOptions.timeout, subscribeOptions.onFailure
					, [{invocationContext:subscribeOptions.invocationContext, 
						errorCode:ERROR.SUBSCRIBE_TIMEOUT.code, 
						errorMessage:format(ERROR.SUBSCRIBE_TIMEOUT)}]);
		}
		
		// All subscriptions return a SUBACK. 
		this._requires_ack(wireMessage);
		this._schedule_message(wireMessage);
	};

	/** @ignore */
	ClientImpl.prototype.unsubscribe = function(filter, unsubscribeOptions) {  
		this._trace("Client.unsubscribe", filter, unsubscribeOptions);
		
		if (!this.connected)
		   throw new Error(format(ERROR.INVALID_STATE, ["not connected"]));
		
		var wireMessage = new WireMessage(MESSAGE_TYPE.UNSUBSCRIBE);
		wireMessage.topics = [filter];
		
		if (unsubscribeOptions.onSuccess) {
			wireMessage.callback = function() {unsubscribeOptions.onSuccess({invocationContext:unsubscribeOptions.invocationContext});};
		}
		if (unsubscribeOptions.timeout) {
			wireMessage.timeOut = new Timeout(this, window, unsubscribeOptions.timeout, unsubscribeOptions.onFailure
					, [{invocationContext:unsubscribeOptions.invocationContext,
						errorCode:ERROR.UNSUBSCRIBE_TIMEOUT.code,
						errorMessage:format(ERROR.UNSUBSCRIBE_TIMEOUT)}]);
		}
	 
		// All unsubscribes return a SUBACK.         
		this._requires_ack(wireMessage);
		this._schedule_message(wireMessage);
	};
	 
	ClientImpl.prototype.send = function (message) {
		this._trace("Client.send", message);

		if (!this.connected) {
			if (this.reconnector && this.disconnectedPublishing) {
				//this._trace("Client.send", this._buffered_queue.length, this.disconnectedBufferSize);
				if (this._buffered_queue.length === this.disconnectedBufferSize) {
					throw new Error(format(ERROR.BUFFER_FULL, [this._buffered_queue.length]));
				} else {
					this._buffered_queue.push(message);
					return;
				}
			} else {
				throw new Error(format(ERROR.INVALID_STATE, ["not connected"]));
			}
		}
		
		wireMessage = new WireMessage(MESSAGE_TYPE.PUBLISH);
		wireMessage.payloadMessage = message;
		
		if (message.qos > 0)
			this._requires_ack(wireMessage);
		else if (this.onMessageDelivered)
			this._notify_msg_sent[wireMessage] = this.onMessageDelivered(wireMessage.payloadMessage);
		this._schedule_message(wireMessage);
	};
	
	ClientImpl.prototype.disconnect = function () {
		this._trace("Client.disconnect");

		if (!this.socket)
			throw new Error(format(ERROR.INVALID_STATE, ["not connecting or connected"]));
		
		wireMessage = new WireMessage(MESSAGE_TYPE.DISCONNECT);

		// Run the disconnected call back as soon as the message has been sent,
		// in case of a failure later on in the disconnect processing.
		// as a consequence, the _disconected call back may be run several times.
		this._notify_msg_sent[wireMessage] = scope(this._disconnected, this);

		this._schedule_message(wireMessage);
	};
	
	ClientImpl.prototype.getTraceLog = function () {
		if ( this._traceBuffer !== null ) {
			this._trace("Client.getTraceLog", new Date());
			this._trace("Client.getTraceLog in flight messages", this._sentMessages.length);
			for (var key in this._sentMessages)
				this._trace("_sentMessages ",key, this._sentMessages[key]);
			for (var key in this._receivedMessages)
				this._trace("_receivedMessages ",key, this._receivedMessages[key]);
			
			return this._traceBuffer;
		}
	};
	
	ClientImpl.prototype.startTrace = function () {
		if ( this._traceBuffer === null ) {
			this._traceBuffer = [];
		}
		this._trace("Client.startTrace", new Date(), version);
	};
	
	ClientImpl.prototype.stopTrace = function () {
		delete this._traceBuffer;
	};

	ClientImpl.prototype._doConnect = function (wsurl) {
		// When the socket is open, this client will send the CONNECT WireMessage using the saved parameters. 
		if (this.connectOptions.useSSL) {
		    var uriParts = wsurl.split(":");
		    uriParts[0] = "wss";
		    wsurl = uriParts.join(":");
		}
		this._wsuri = wsurl;
		this.connected = false;
		if (this.connectOptions.mqttVersion < 4) {
			this.socket = new WebSocket(wsurl, ["mqttv3.1"]);
		} else {
			this.socket = new WebSocket(wsurl, ["mqtt"]);
		}
		this.socket.binaryType = 'arraybuffer';
		
		this.socket.onopen = scope(this._on_socket_open, this);
		this.socket.onmessage = scope(this._on_socket_message, this);
		this.socket.onerror = scope(this._on_socket_error, this);
		this.socket.onclose = scope(this._on_socket_close, this);
		
		this.sendPinger = new Pinger(this, window, this.connectOptions.keepAliveInterval);
		this.receivePinger = new Pinger(this, window, this.connectOptions.keepAliveInterval);
		
		this._connectTimeout = new Timeout(this, window, this.connectOptions.timeout, this._disconnected,  [ERROR.CONNECT_TIMEOUT.code, format(ERROR.CONNECT_TIMEOUT)]);
	};

	
	// Schedule a new message to be sent over the WebSockets
	// connection. CONNECT messages cause WebSocket connection
	// to be started. All other messages are queued internally
	// until this has happened. When WS connection starts, process
	// all outstanding messages. 
	ClientImpl.prototype._schedule_message = function (message) {
		this._msg_queue.push(message);
		// Process outstanding messages in the queue if we have an  open socket, and have received CONNACK. 
		if (this.connected && this.reconnector === null) {
			this._process_queue();
		}
	};

	ClientImpl.prototype.store = function(prefix, wireMessage) {
		var storedMessage = {type:wireMessage.type, messageIdentifier:wireMessage.messageIdentifier, version:1};
		
		switch(wireMessage.type) {
		  case MESSAGE_TYPE.PUBLISH:
			  if(wireMessage.pubRecReceived)
				  storedMessage.pubRecReceived = true;
			  
			  // Convert the payload to a hex string.
			  storedMessage.payloadMessage = {};
			  var hex = "";
			  var messageBytes = wireMessage.payloadMessage.payloadBytes;
			  for (var i=0; i<messageBytes.length; i++) {
				if (messageBytes[i] <= 0xF)
				  hex = hex+"0"+messageBytes[i].toString(16);
				else 
				  hex = hex+messageBytes[i].toString(16);
			  }
			  storedMessage.payloadMessage.payloadHex = hex;
			  
			  storedMessage.payloadMessage.qos = wireMessage.payloadMessage.qos;
			  storedMessage.payloadMessage.destinationName = wireMessage.payloadMessage.destinationName;
			  if (wireMessage.payloadMessage.duplicate) 
				  storedMessage.payloadMessage.duplicate = true;
			  if (wireMessage.payloadMessage.retained) 
				  storedMessage.payloadMessage.retained = true;	   
			  
			  // Add a sequence number to sent messages.
			  if ( prefix.indexOf("Sent:") == 0 ) {
				  if ( wireMessage.sequence === undefined )
					  wireMessage.sequence = ++this._sequence;
				  storedMessage.sequence = wireMessage.sequence;
			  }
			  break;    
			  
			default:
				throw Error(format(ERROR.INVALID_STORED_DATA, [key, storedMessage]));
		}
		localStorage.setItem(prefix+this._localKey+wireMessage.messageIdentifier, JSON.stringify(storedMessage));
	};
	
	ClientImpl.prototype.restore = function(key) {    	
		var value = localStorage.getItem(key);
		var storedMessage = JSON.parse(value);
		
		var wireMessage = new WireMessage(storedMessage.type, storedMessage);
		
		switch(storedMessage.type) {
		  case MESSAGE_TYPE.PUBLISH:
			  // Replace the payload message with a Message object.
			  var hex = storedMessage.payloadMessage.payloadHex;
			  var buffer = new ArrayBuffer((hex.length)/2);
			  var byteStream = new Uint8Array(buffer); 
			  var i = 0;
			  while (hex.length >= 2) { 
				  var x = parseInt(hex.substring(0, 2), 16);
				  hex = hex.substring(2, hex.length);
				  byteStream[i++] = x;
			  }
			  var payloadMessage = new Paho.MQTT.Message(byteStream);
			  
			  payloadMessage.qos = storedMessage.payloadMessage.qos;
			  payloadMessage.destinationName = storedMessage.payloadMessage.destinationName;
			  if (storedMessage.payloadMessage.duplicate) 
				  payloadMessage.duplicate = true;
			  if (storedMessage.payloadMessage.retained) 
				  payloadMessage.retained = true;	 
			  wireMessage.payloadMessage = payloadMessage;
			  
			  break;    
			  
			default:
			  throw Error(format(ERROR.INVALID_STORED_DATA, [key, value]));
		}
							
		if (key.indexOf("Sent:"+this._localKey) == 0) {
			wireMessage.payloadMessage.duplicate = true;
			this._sentMessages[wireMessage.messageIdentifier] = wireMessage;    		    
		} else if (key.indexOf("Received:"+this._localKey) == 0) {
			this._receivedMessages[wireMessage.messageIdentifier] = wireMessage;
		}
	};
	
	ClientImpl.prototype._process_queue = function () {
		var message = null;
		// Process messages in order they were added
		var fifo = this._msg_queue.reverse();

		// Send all queued messages down socket connection
		while ((message = fifo.pop())) {
			this._socket_send(message);
			// Notify listeners that message was successfully sent
			if (this._notify_msg_sent[message]) {
				this._notify_msg_sent[message]();
				delete this._notify_msg_sent[message];
			}
		}
	};

	/**
	 * Expect an ACK response for this message. Add message to the set of in progress
	 * messages and set an unused identifier in this message.
	 * @ignore
	 */
	ClientImpl.prototype._requires_ack = function (wireMessage) {
		var messageCount = Object.keys(this._sentMessages).length;
		if (messageCount > this.maxMessageIdentifier)
			throw Error ("Too many messages:"+messageCount);

		while(this._sentMessages[this._message_identifier] !== undefined) {
			this._message_identifier++;
		}
		wireMessage.messageIdentifier = this._message_identifier;
		this._sentMessages[wireMessage.messageIdentifier] = wireMessage;
		if (wireMessage.type === MESSAGE_TYPE.PUBLISH) {
			this.store("Sent:", wireMessage);
		}
		if (this._message_identifier === this.maxMessageIdentifier) {
			this._message_identifier = 1;
		}
	};

	/** 
	 * Called when the underlying websocket has been opened.
	 * @ignore
	 */
	ClientImpl.prototype._on_socket_open = function () {      
		// Create the CONNECT message object.
		var wireMessage = new WireMessage(MESSAGE_TYPE.CONNECT, this.connectOptions); 
		wireMessage.clientId = this.clientId;
		this._socket_send(wireMessage);
	};

	/** 
	 * Called when the underlying websocket has received a complete packet.
	 * @ignore
	 */
	ClientImpl.prototype._on_socket_message = function (event) {
		this._trace("Client._on_socket_message", event.data);
		var messages = this._deframeMessages(event.data);
		for (var i = 0; i < messages.length; i+=1) {
		    this._handleMessage(messages[i]);
		}
	}
	
	ClientImpl.prototype._deframeMessages = function(data) {
		var byteArray = new Uint8Array(data);
	    if (this.receiveBuffer) {
	        var newData = new Uint8Array(this.receiveBuffer.length+byteArray.length);
	        newData.set(this.receiveBuffer);
	        newData.set(byteArray,this.receiveBuffer.length);
	        byteArray = newData;
	        delete this.receiveBuffer;
	    }
		try {
		    var offset = 0;
		    var messages = [];
		    while(offset < byteArray.length) {
		        var result = decodeMessage(byteArray,offset);
		        var wireMessage = result[0];
		        offset = result[1];
		        if (wireMessage !== null) {
		            messages.push(wireMessage);
		        } else {
		            break;
		        }
		    }
		    if (offset < byteArray.length) {
		    	this.receiveBuffer = byteArray.subarray(offset);
		    }
		} catch (error) {
			this._disconnected(ERROR.INTERNAL_ERROR.code , format(ERROR.INTERNAL_ERROR, [error.message,error.stack.toString()]));
			return;
		}
		return messages;
	}
	
	ClientImpl.prototype._handleMessage = function(wireMessage) {
		
		this._trace("Client._handleMessage", wireMessage);

		try {
			switch(wireMessage.type) {
			case MESSAGE_TYPE.CONNACK:
				this._connectTimeout.cancel();
				this._connectTimeout = null;
				
				// If we have started using clean session then clear up the local state.
				if (this.connectOptions.cleanSession) {
					for (var key in this._sentMessages) {	    		
						var sentMessage = this._sentMessages[key];
						localStorage.removeItem("Sent:"+this._localKey+sentMessage.messageIdentifier);
					}
					this._sentMessages = {};

					for (var key in this._receivedMessages) {
						var receivedMessage = this._receivedMessages[key];
						localStorage.removeItem("Received:"+this._localKey+receivedMessage.messageIdentifier);
					}
					this._receivedMessages = {};
				}
				// Client connected and ready for business.
				if (wireMessage.returnCode === 0) {
					this.connected = true;
					// Jump to the end of the list of uris and stop looking for a good host.
					if (this.connectOptions.uris)
						this.hostIndex = this.connectOptions.uris.length;
				} else {
					this._disconnected(ERROR.CONNACK_RETURNCODE.code , format(ERROR.CONNACK_RETURNCODE, [wireMessage.returnCode, CONNACK_RC[wireMessage.returnCode]]));
					break;
				}
				
				// Resend messages.
				var sequencedMessages = new Array();
				for (var msgId in this._sentMessages) {
					if (this._sentMessages.hasOwnProperty(msgId))
						sequencedMessages.push(this._sentMessages[msgId]);
				}
		  
				// Sort sentMessages into the original sent order.
				var sequencedMessages = sequencedMessages.sort(function(a,b) {return a.sequence - b.sequence;} );
				for (var i=0, len=sequencedMessages.length; i<len; i++) {
					var sentMessage = sequencedMessages[i];
					if (sentMessage.type == MESSAGE_TYPE.PUBLISH && sentMessage.pubRecReceived) {
						var pubRelMessage = new WireMessage(MESSAGE_TYPE.PUBREL, {messageIdentifier:sentMessage.messageIdentifier});
						this._schedule_message(pubRelMessage);
					} else {
						this._schedule_message(sentMessage);
					}
				}

				// Send buffered messages
				if (this.reconnector) {
					var fifo = this._buffered_queue.reverse();
					var message = null;
					while(message = fifo.pop()) {
						var wireMessage = new WireMessage(MESSAGE_TYPE.PUBLISH);
						wireMessage.payloadMessage = message;
						if (message.qos > 0)
							this._requires_ack(wireMessage);
						else if (this.onMessageDelivered)
							this._notify_msg_sent[wireMessage] = this.onMessageDelivered(wireMessage.payloadMessage);
						this._schedule_message(wireMessage);
					}
					this._buffered_queue = [];
				}

				// Execute the connectOptions.onSuccess callback if there is one.
				if (this.connectOptions.onSuccess && (this.reconnector == null)) {
					this.connectOptions.onSuccess({invocationContext:this.connectOptions.invocationContext});
				}
				
				reconnect = false;
				if (this.connectOptions.reconnect && this.reconnector) {
					reconnect = true;
					this.reconnector.cancel();
					this.reconnector = null;
					// Execute the onConnected callback if there is one.
					if (this.onConnected) {
						this.onConnected({reconnect:reconnect, uri:this._wsuri});
					}
				}

				// Process all queued messages now that the connection is established. 
				this._process_queue();
				break;
		
			case MESSAGE_TYPE.PUBLISH:
				this._receivePublish(wireMessage);
				break;

			case MESSAGE_TYPE.PUBACK:
				var sentMessage = this._sentMessages[wireMessage.messageIdentifier];
				 // If this is a re flow of a PUBACK after we have restarted receivedMessage will not exist.
				if (sentMessage) {
					delete this._sentMessages[wireMessage.messageIdentifier];
					localStorage.removeItem("Sent:"+this._localKey+wireMessage.messageIdentifier);
					if (this.onMessageDelivered)
						this.onMessageDelivered(sentMessage.payloadMessage);
				}
				break;
			
			case MESSAGE_TYPE.PUBREC:
				var sentMessage = this._sentMessages[wireMessage.messageIdentifier];
				// If this is a re flow of a PUBREC after we have restarted receivedMessage will not exist.
				if (sentMessage) {
					sentMessage.pubRecReceived = true;
					var pubRelMessage = new WireMessage(MESSAGE_TYPE.PUBREL, {messageIdentifier:wireMessage.messageIdentifier});
					this.store("Sent:", sentMessage);
					this._schedule_message(pubRelMessage);
				}
				break;
								
			case MESSAGE_TYPE.PUBREL:
				var receivedMessage = this._receivedMessages[wireMessage.messageIdentifier];
				localStorage.removeItem("Received:"+this._localKey+wireMessage.messageIdentifier);
				// If this is a re flow of a PUBREL after we have restarted receivedMessage will not exist.
				if (receivedMessage) {
					this._receiveMessage(receivedMessage);
					delete this._receivedMessages[wireMessage.messageIdentifier];
				}
				// Always flow PubComp, we may have previously flowed PubComp but the server lost it and restarted.
				var pubCompMessage = new WireMessage(MESSAGE_TYPE.PUBCOMP, {messageIdentifier:wireMessage.messageIdentifier});
				this._schedule_message(pubCompMessage);                    
					
				
				break;

			case MESSAGE_TYPE.PUBCOMP: 
				var sentMessage = this._sentMessages[wireMessage.messageIdentifier];
				delete this._sentMessages[wireMessage.messageIdentifier];
				localStorage.removeItem("Sent:"+this._localKey+wireMessage.messageIdentifier);
				if (this.onMessageDelivered)
					this.onMessageDelivered(sentMessage.payloadMessage);
				break;
				
			case MESSAGE_TYPE.SUBACK:
				var sentMessage = this._sentMessages[wireMessage.messageIdentifier];
				if (sentMessage) {
					if(sentMessage.timeOut)
						sentMessage.timeOut.cancel();
					// This will need to be fixed when we add multiple topic support
          			if (wireMessage.returnCode[0] === 0x80) {
						if (sentMessage.onFailure) {
							sentMessage.onFailure(wireMessage.returnCode);
						} 
					} else if (sentMessage.onSuccess) {
						sentMessage.onSuccess(wireMessage.returnCode);
					}
					delete this._sentMessages[wireMessage.messageIdentifier];
				}
				break;
				
			case MESSAGE_TYPE.UNSUBACK:
				var sentMessage = this._sentMessages[wireMessage.messageIdentifier];
				if (sentMessage) { 
					if (sentMessage.timeOut)
						sentMessage.timeOut.cancel();
					if (sentMessage.callback) {
						sentMessage.callback();
					}
					delete this._sentMessages[wireMessage.messageIdentifier];
				}

				break;
				
			case MESSAGE_TYPE.PINGRESP:
				/* The sendPinger or receivePinger may have sent a ping, the receivePinger has already been reset. */
				this.sendPinger.reset();
				break;
				
			case MESSAGE_TYPE.DISCONNECT:
				// Clients do not expect to receive disconnect packets.
				this._disconnected(ERROR.INVALID_MQTT_MESSAGE_TYPE.code , format(ERROR.INVALID_MQTT_MESSAGE_TYPE, [wireMessage.type]));
				break;

			default:
				this._disconnected(ERROR.INVALID_MQTT_MESSAGE_TYPE.code , format(ERROR.INVALID_MQTT_MESSAGE_TYPE, [wireMessage.type]));
			};
		} catch (error) {
			this._disconnected(ERROR.INTERNAL_ERROR.code , format(ERROR.INTERNAL_ERROR, [error.message,error.stack.toString()]));
			return;
		}
	};
	
	/** @ignore */
	ClientImpl.prototype._on_socket_error = function (error) {
		this._disconnected(ERROR.SOCKET_ERROR.code , format(ERROR.SOCKET_ERROR, [error.data]));
	};

	/** @ignore */
	ClientImpl.prototype._on_socket_close = function () {
		this._disconnected(ERROR.SOCKET_CLOSE.code , format(ERROR.SOCKET_CLOSE));
	};

	/** @ignore */
	ClientImpl.prototype._socket_send = function (wireMessage) {
		
		if (wireMessage.type == 1) {
			var wireMessageMasked = this._traceMask(wireMessage, "password"); 
			this._trace("Client._socket_send", wireMessageMasked);
		}
		else this._trace("Client._socket_send", wireMessage);
		
		this.socket.send(wireMessage.encode());
		/* We have proved to the server we are alive. */
		this.sendPinger.reset();
	};
	
	/** @ignore */
	ClientImpl.prototype._receivePublish = function (wireMessage) {
		switch(wireMessage.payloadMessage.qos) {
			case "undefined":
			case 0:
				this._receiveMessage(wireMessage);
				break;

			case 1:
				var pubAckMessage = new WireMessage(MESSAGE_TYPE.PUBACK, {messageIdentifier:wireMessage.messageIdentifier});
				this._schedule_message(pubAckMessage);
				this._receiveMessage(wireMessage);
				break;

			case 2:
				this._receivedMessages[wireMessage.messageIdentifier] = wireMessage;
				this.store("Received:", wireMessage);
				var pubRecMessage = new WireMessage(MESSAGE_TYPE.PUBREC, {messageIdentifier:wireMessage.messageIdentifier});
				this._schedule_message(pubRecMessage);

				break;

			default:
				throw Error("Invaild qos="+wireMmessage.payloadMessage.qos);
		};
	};

	/** @ignore */
	ClientImpl.prototype._receiveMessage = function (wireMessage) {
		if (this.onMessageArrived) {
			this.onMessageArrived(wireMessage.payloadMessage);
		}
	};

	/**
	 * Client has connected.
	 * @param {reconnect} [boolean] indicate if this was a result of reconnect operation.
	 * @param {uri} [string] fully qualified WebSocket URI of the server.
	 */
	ClientImpl.prototype._connected = function (reconnect, uri) {
		// Execute the onConnected callback if there is one.  
		if (this.onConnected)
			this.onConnected({reconnect:reconnect, uri:uri}); 
	};
	
	/**
	 * Client has disconnected either at its own request or because the server
	 * or network disconnected it. Remove all non-durable state.
	 * @param {errorCode} [number] the error number.
	 * @param {errorText} [string] the error text.
	 * @ignore
	 */
	ClientImpl.prototype._disconnected = function (errorCode, errorText) {
		this._trace("Client._disconnected", errorCode, errorText, new Date());
		if (this.connected && errorCode === ERROR.CONNECT_TIMEOUT.code) {
			return;
		}
		
		this.sendPinger.cancel();
		this.receivePinger.cancel();
		if (this._connectTimeout) {
			this._connectTimeout.cancel();
			this._connectTimeout = null;
		}
		
		if (!this.reconnector) {
			// Clear message buffers.
			this._msg_queue = [];
			this._notify_msg_sent = {};
		}
	   
		if (this.socket) {
			// Cancel all socket callbacks so that they cannot be driven again by this socket.
			this.socket.onopen = null;
			this.socket.onmessage = null;
			this.socket.onerror = null;
			this.socket.onclose = null;
			if (this.socket.readyState === 1)
				this.socket.close();
			delete this.socket;
		}
		
		if (this.connectOptions.uris && this.hostIndex < this.connectOptions.uris.length-1) {
			// Try the next host.
			this.hostIndex++;
			this._doConnect(this.connectOptions.uris[this.hostIndex]);
		
		} else {
		
			if (errorCode === undefined) {
				errorCode = ERROR.OK.code;
				errorText = format(ERROR.OK);
			}
			
			// Run any application callbacks last as they may attempt to reconnect and hence create a new socket.
			if (this.connected) {
				this.connected = false;
				// Execute the connectionLostCallback if there is one, and we were connected.       
				if (this.onConnectionLost) {
					reconnect = false;
					if (this.connectOptions.reconnect)
						reconnect = this.connectOptions.reconnect;
					this.onConnectionLost({errorCode:errorCode, errorMessage:errorText, reconnect:reconnect, uri:this._wsuri});
				}
				if (errorCode !== ERROR.OK.code && this.connectOptions.reconnect) {
					this._trace("Client._disconnected", "starting auto reconnect");
					this.reconnector = new Reconnector(this, window, this.connectOptions.reconnectInterval);
					this.reconnector.reset();
				}
			} else if (this.reconnector) {
				this._trace("Client._disconnected", "auto reconnect is already in progress", new Date());
			} else {
				// Otherwise we never had a connection, so indicate that the connect has failed.
				if (this.connectOptions.mqttVersion === 4 && this.connectOptions.mqttVersionExplicit === false) {
					this._trace("Failed to connect V4, dropping back to V3")
					this.connectOptions.mqttVersion = 3;
					if (this.connectOptions.uris) {
						this.hostIndex = 0;
						this._doConnect(this.connectOptions.uris[0]);  
					} else {
						this._doConnect(this.uri);
					}	
				} else if(this.connectOptions.onFailure) {
					this.connectOptions.onFailure({invocationContext:this.connectOptions.invocationContext, errorCode:errorCode, errorMessage:errorText});
				}
			}
		}
	};

	/** @ignore */
	ClientImpl.prototype._trace = function () {
		// Pass trace message back to client's callback function
		if (this.traceFunction) {
			for (var i in arguments)
			{	
				if (typeof arguments[i] !== "undefined")
					arguments[i] = JSON.stringify(arguments[i]);
			}
			var record = Array.prototype.slice.call(arguments).join("");
			this.traceFunction ({severity: "Debug", message: record	});
		}

		//buffer style trace
		if ( this._traceBuffer !== null ) {  
			for (var i = 0, max = arguments.length; i < max; i++) {
				if ( this._traceBuffer.length == this._MAX_TRACE_ENTRIES ) {    
					this._traceBuffer.shift();              
				}
				if (i === 0) this._traceBuffer.push(arguments[i]);
				else if (typeof arguments[i] === "undefined" ) this._traceBuffer.push(arguments[i]);
				else this._traceBuffer.push("  "+JSON.stringify(arguments[i]));
		   };
		};
	};
	
	/** @ignore */
	ClientImpl.prototype._traceMask = function (traceObject, masked) {
		var traceObjectMasked = {};
		for (var attr in traceObject) {
			if (traceObject.hasOwnProperty(attr)) {
				if (attr == masked) 
					traceObjectMasked[attr] = "******";
				else
					traceObjectMasked[attr] = traceObject[attr];
			} 
		}
		return traceObjectMasked;
	};

	// ------------------------------------------------------------------------
	// Public Programming interface.
	// ------------------------------------------------------------------------
	
	/** 
	 * The JavaScript application communicates to the server using a {@link Paho.MQTT.Client} object. 
	 * <p>
	 * Most applications will create just one Client object and then call its connect() method,
	 * however applications can create more than one Client object if they wish. 
	 * In this case the combination of host, port and clientId attributes must be different for each Client object.
	 * <p>
	 * The send, subscribe and unsubscribe methods are implemented as asynchronous JavaScript methods 
	 * (even though the underlying protocol exchange might be synchronous in nature). 
	 * This means they signal their completion by calling back to the application, 
	 * via Success or Failure callback functions provided by the application on the method in question. 
	 * Such callbacks are called at most once per method invocation and do not persist beyond the lifetime 
	 * of the script that made the invocation.
	 * <p>
	 * In contrast there are some callback functions, most notably <i>onMessageArrived</i>, 
	 * that are defined on the {@link Paho.MQTT.Client} object.  
	 * These may get called multiple times, and aren't directly related to specific method invocations made by the client. 
	 *
	 * @name Paho.MQTT.Client    
	 * 
	 * @constructor
	 *  
	 * @param {string} host - the address of the messaging server, as a fully qualified WebSocket URI, as a DNS name or dotted decimal IP address.
	 * @param {number} port - the port number to connect to - only required if host is not a URI
	 * @param {string} path - the path on the host to connect to - only used if host is not a URI. Default: '/mqtt'.
	 * @param {string} clientId - the Messaging client identifier, between 1 and 23 characters in length.
	 * 
	 * @property {string} host - <i>read only</i> the server's DNS hostname or dotted decimal IP address.
	 * @property {number} port - <i>read only</i> the server's port.
	 * @property {string} path - <i>read only</i> the server's path.
	 * @property {string} clientId - <i>read only</i> used when connecting to the server.
	 * @property {function} onConnectionLost - called when a connection has been lost. 
	 *                            after a connect() method has succeeded.
	 *                            Establish the call back used when a connection has been lost. The connection may be
	 *                            lost because the client initiates a disconnect or because the server or network 
	 *                            cause the client to be disconnected. The disconnect call back may be called without 
	 *                            the connectionComplete call back being invoked if, for example the client fails to 
	 *                            connect.
	 *                            A single response object parameter is passed to the onConnectionLost callback containing the following fields:
	 *                            <ol>   
	 *                            <li>errorCode
	 *                            <li>errorMessage       
	 *                            </ol>
	 * @property {function} onMessageDelivered called when a message has been delivered. 
	 *                            All processing that this Client will ever do has been completed. So, for example,
	 *                            in the case of a Qos=2 message sent by this client, the PubComp flow has been received from the server
	 *                            and the message has been removed from persistent storage before this callback is invoked. 
	 *                            Parameters passed to the onMessageDelivered callback are:
	 *                            <ol>   
	 *                            <li>{@link Paho.MQTT.Message} that was delivered.
	 *                            </ol>    
	 * @property {function} onMessageArrived called when a message has arrived in this Paho.MQTT.client. 
	 *                            Parameters passed to the onMessageArrived callback are:
	 *                            <ol>   
	 *                            <li>{@link Paho.MQTT.Message} that has arrived.
	 *                            </ol>    
	 */
	var Client = function (host, port, path, clientId) {
	    
	    var uri;
	    
		if (typeof host !== "string")
			throw new Error(format(ERROR.INVALID_TYPE, [typeof host, "host"]));
	    
	    if (arguments.length == 2) {
	        // host: must be full ws:// uri
	        // port: clientId
	        clientId = port;
	        uri = host;
	        var match = uri.match(/^(wss?):\/\/((\[(.+)\])|([^\/]+?))(:(\d+))?(\/.*)$/);
	        if (match) {
	            host = match[4]||match[2];
	            port = parseInt(match[7]);
	            path = match[8];
	        } else {
	            throw new Error(format(ERROR.INVALID_ARGUMENT,[host,"host"]));
	        }
	    } else {
	        if (arguments.length == 3) {
				clientId = path;
				path = "/mqtt";
			}
			if (typeof port !== "number" || port < 0)
				throw new Error(format(ERROR.INVALID_TYPE, [typeof port, "port"]));
			if (typeof path !== "string")
				throw new Error(format(ERROR.INVALID_TYPE, [typeof path, "path"]));
			
			var ipv6AddSBracket = (host.indexOf(":") != -1 && host.slice(0,1) != "[" && host.slice(-1) != "]");
			uri = "ws://"+(ipv6AddSBracket?"["+host+"]":host)+":"+port+path;
		}

		var clientIdLength = 0;
		for (var i = 0; i<clientId.length; i++) {
			var charCode = clientId.charCodeAt(i);                   
			if (0xD800 <= charCode && charCode <= 0xDBFF)  {    			
				 i++; // Surrogate pair.
			}   		   
			clientIdLength++;
		}     	   	
		if (typeof clientId !== "string" || clientIdLength > 65535)
			throw new Error(format(ERROR.INVALID_ARGUMENT, [clientId, "clientId"])); 
		
		var client = new ClientImpl(uri, host, port, path, clientId);
		this._getHost =  function() { return host; };
		this._setHost = function() { throw new Error(format(ERROR.UNSUPPORTED_OPERATION)); };
			
		this._getPort = function() { return port; };
		this._setPort = function() { throw new Error(format(ERROR.UNSUPPORTED_OPERATION)); };

		this._getPath = function() { return path; };
		this._setPath = function() { throw new Error(format(ERROR.UNSUPPORTED_OPERATION)); };

		this._getURI = function() { return uri; };
		this._setURI = function() { throw new Error(format(ERROR.UNSUPPORTED_OPERATION)); };
		
		this._getClientId = function() { return client.clientId; };
		this._setClientId = function() { throw new Error(format(ERROR.UNSUPPORTED_OPERATION)); };
		
		this._getOnConnected = function() { return client.onConnected; };
		this._setOnConnected = function(newOnConnected) { 
			if (typeof newOnConnected === "function")
				client.onConnected = newOnConnected;
			else 
				throw new Error(format(ERROR.INVALID_TYPE, [typeof newOnConnected, "onConnected"]));
		};

		this._getDisconnectedPublishing = function() { return client.disconnectedPublishing; };
		this._setDisconnectedPublishing = function(newDisconnectedPublishing) {
			client.disconnectedPublishing = newDisconnectedPublishing;
		}
		
		this._getDisconnectedBufferSize = function() { return client.disconnectedBufferSize; };
		this._setDisconnectedBufferSize = function(newDisconnectedBufferSize) {
			client.disconnectedBufferSize = newDisconnectedBufferSize;
		}
		
		this._getOnConnectionLost = function() { return client.onConnectionLost; };
		this._setOnConnectionLost = function(newOnConnectionLost) { 
			if (typeof newOnConnectionLost === "function")
				client.onConnectionLost = newOnConnectionLost;
			else 
				throw new Error(format(ERROR.INVALID_TYPE, [typeof newOnConnectionLost, "onConnectionLost"]));
		};

		this._getOnMessageDelivered = function() { return client.onMessageDelivered; };
		this._setOnMessageDelivered = function(newOnMessageDelivered) { 
			if (typeof newOnMessageDelivered === "function")
				client.onMessageDelivered = newOnMessageDelivered;
			else 
				throw new Error(format(ERROR.INVALID_TYPE, [typeof newOnMessageDelivered, "onMessageDelivered"]));
		};
	   
		this._getOnMessageArrived = function() { return client.onMessageArrived; };
		this._setOnMessageArrived = function(newOnMessageArrived) { 
			if (typeof newOnMessageArrived === "function")
				client.onMessageArrived = newOnMessageArrived;
			else 
				throw new Error(format(ERROR.INVALID_TYPE, [typeof newOnMessageArrived, "onMessageArrived"]));
		};

		this._getTrace = function() { return client.traceFunction; };
		this._setTrace = function(trace) {
			if(typeof trace === "function"){
				client.traceFunction = trace;
			}else{
				throw new Error(format(ERROR.INVALID_TYPE, [typeof trace, "onTrace"]));
			}
		};
		
		/** 
		 * Connect this Messaging client to its server. 
		 * 
		 * @name Paho.MQTT.Client#connect
		 * @function
		 * @param {Object} connectOptions - attributes used with the connection. 
		 * @param {number} connectOptions.timeout - If the connect has not succeeded within this 
		 *                    number of seconds, it is deemed to have failed.
		 *                    The default is 30 seconds.
		 * @param {string} connectOptions.userName - Authentication username for this connection.
		 * @param {string} connectOptions.password - Authentication password for this connection.
		 * @param {Paho.MQTT.Message} connectOptions.willMessage - sent by the server when the client
		 *                    disconnects abnormally.
		 * @param {Number} connectOptions.keepAliveInterval - the server disconnects this client if
		 *                    there is no activity for this number of seconds.
		 *                    The default value of 60 seconds is assumed if not set.
		 * @param {boolean} connectOptions.cleanSession - if true(default) the client and server 
		 *                    persistent state is deleted on successful connect.
		 * @param {boolean} connectOptions.useSSL - if present and true, use an SSL Websocket connection.
		 * @param {object} connectOptions.invocationContext - passed to the onSuccess callback or onFailure callback.
		 * @param {function} connectOptions.onSuccess - called when the connect acknowledgement 
		 *                    has been received from the server.
		 * A single response object parameter is passed to the onSuccess callback containing the following fields:
		 * <ol>
		 * <li>invocationContext as passed in to the onSuccess method in the connectOptions.       
		 * </ol>
		 * @config {function} [onFailure] called when the connect request has failed or timed out.
		 * A single response object parameter is passed to the onFailure callback containing the following fields:
		 * <ol>
		 * <li>invocationContext as passed in to the onFailure method in the connectOptions.       
		 * <li>errorCode a number indicating the nature of the error.
		 * <li>errorMessage text describing the error.      
		 * </ol>
		 * @config {Array} [hosts] If present this contains either a set of hostnames or fully qualified
		 * WebSocket URIs (ws://example.com:1883/mqtt), that are tried in order in place 
		 * of the host and port paramater on the construtor. The hosts are tried one at at time in order until
		 * one of then succeeds.
		 * @config {Array} [ports] If present the set of ports matching the hosts. If hosts contains URIs, this property
		 * is not used.
		 * @throws {InvalidState} if the client is not in disconnected state. The client must have received connectionLost
		 * or disconnected before calling connect for a second or subsequent time.
		 */
		this.connect = function (connectOptions) {
			connectOptions = connectOptions || {} ;
			validate(connectOptions,  {timeout:"number",
									   userName:"string", 
									   password:"string", 
									   willMessage:"object", 
									   keepAliveInterval:"number", 
									   cleanSession:"boolean", 
									   useSSL:"boolean",
									   invocationContext:"object", 
									   onSuccess:"function", 
									   onFailure:"function",
									   hosts:"object",
									   ports:"object",
									   reconnect:"boolean",
									   reconnectInterval:"number",
									   mqttVersion:"number",
									   mqttVersionExplicit:"boolean",
									   uris: "object"});
			
			// If no keep alive interval is set, assume 60 seconds.
			if (connectOptions.keepAliveInterval === undefined)
				connectOptions.keepAliveInterval = 60;

			if (connectOptions.mqttVersion > 4 || connectOptions.mqttVersion < 3) {
				throw new Error(format(ERROR.INVALID_ARGUMENT, [connectOptions.mqttVersion, "connectOptions.mqttVersion"]));
			}

			if (connectOptions.mqttVersion === undefined) {
				connectOptions.mqttVersionExplicit = false;
				connectOptions.mqttVersion = 4;
			} else {
				connectOptions.mqttVersionExplicit = true;
			}

			//Check that if password is set, so is username
			if (connectOptions.password !== undefined && connectOptions.userName === undefined)
				throw new Error(format(ERROR.INVALID_ARGUMENT, [connectOptions.password, "connectOptions.password"]))
			
			if (connectOptions.reconnectInterval === undefined)
				connectOptions.reconnectInterval = 10;

			if (connectOptions.willMessage) {
				if (!(connectOptions.willMessage instanceof Message))
					throw new Error(format(ERROR.INVALID_TYPE, [connectOptions.willMessage, "connectOptions.willMessage"]));
				// The will message must have a payload that can be represented as a string.
				// Cause the willMessage to throw an exception if this is not the case.
				connectOptions.willMessage.stringPayload;
				
				if (typeof connectOptions.willMessage.destinationName === "undefined")
					throw new Error(format(ERROR.INVALID_TYPE, [typeof connectOptions.willMessage.destinationName, "connectOptions.willMessage.destinationName"]));
			}
			if (typeof connectOptions.cleanSession === "undefined")
				connectOptions.cleanSession = true;
			if (connectOptions.hosts) {
			    
				if (!(connectOptions.hosts instanceof Array) )
					throw new Error(format(ERROR.INVALID_ARGUMENT, [connectOptions.hosts, "connectOptions.hosts"]));
				if (connectOptions.hosts.length <1 )
					throw new Error(format(ERROR.INVALID_ARGUMENT, [connectOptions.hosts, "connectOptions.hosts"]));
				
				var usingURIs = false;
				for (var i = 0; i<connectOptions.hosts.length; i++) {
					if (typeof connectOptions.hosts[i] !== "string")
						throw new Error(format(ERROR.INVALID_TYPE, [typeof connectOptions.hosts[i], "connectOptions.hosts["+i+"]"]));
					if (/^(wss?):\/\/((\[(.+)\])|([^\/]+?))(:(\d+))?(\/.*)$/.test(connectOptions.hosts[i])) {
						if (i == 0) {
							usingURIs = true;
						} else if (!usingURIs) {
							throw new Error(format(ERROR.INVALID_ARGUMENT, [connectOptions.hosts[i], "connectOptions.hosts["+i+"]"]));
						}
					} else if (usingURIs) {
						throw new Error(format(ERROR.INVALID_ARGUMENT, [connectOptions.hosts[i], "connectOptions.hosts["+i+"]"]));
					}
				}
				
				if (!usingURIs) {
					if (!connectOptions.ports)
						throw new Error(format(ERROR.INVALID_ARGUMENT, [connectOptions.ports, "connectOptions.ports"]));
					if (!(connectOptions.ports instanceof Array) )
						throw new Error(format(ERROR.INVALID_ARGUMENT, [connectOptions.ports, "connectOptions.ports"]));
					if (connectOptions.hosts.length != connectOptions.ports.length)
						throw new Error(format(ERROR.INVALID_ARGUMENT, [connectOptions.ports, "connectOptions.ports"]));
					
					connectOptions.uris = [];
					
					for (var i = 0; i<connectOptions.hosts.length; i++) {
						if (typeof connectOptions.ports[i] !== "number" || connectOptions.ports[i] < 0)
							throw new Error(format(ERROR.INVALID_TYPE, [typeof connectOptions.ports[i], "connectOptions.ports["+i+"]"]));
						var host = connectOptions.hosts[i];
						var port = connectOptions.ports[i];
						
						var ipv6 = (host.indexOf(":") != -1);
						uri = "ws://"+(ipv6?"["+host+"]":host)+":"+port+path;
						connectOptions.uris.push(uri);
					}
				} else {
					connectOptions.uris = connectOptions.hosts;
				}
			}
			
			client.connect(connectOptions);
		};
	 
		/** 
		 * Subscribe for messages, request receipt of a copy of messages sent to the destinations described by the filter.
		 * 
		 * @name Paho.MQTT.Client#subscribe
		 * @function
		 * @param {string} filter describing the destinations to receive messages from.
		 * <br>
		 * @param {object} subscribeOptions - used to control the subscription
		 *
		 * @param {number} subscribeOptions.qos - the maiximum qos of any publications sent 
		 *                                  as a result of making this subscription.
		 * @param {object} subscribeOptions.invocationContext - passed to the onSuccess callback 
		 *                                  or onFailure callback.
		 * @param {function} subscribeOptions.onSuccess - called when the subscribe acknowledgement
		 *                                  has been received from the server.
		 *                                  A single response object parameter is passed to the onSuccess callback containing the following fields:
		 *                                  <ol>
		 *                                  <li>invocationContext if set in the subscribeOptions.       
		 *                                  </ol>
		 * @param {function} subscribeOptions.onFailure - called when the subscribe request has failed or timed out.
		 *                                  A single response object parameter is passed to the onFailure callback containing the following fields:
		 *                                  <ol>
		 *                                  <li>invocationContext - if set in the subscribeOptions.       
		 *                                  <li>errorCode - a number indicating the nature of the error.
		 *                                  <li>errorMessage - text describing the error.      
		 *                                  </ol>
		 * @param {number} subscribeOptions.timeout - which, if present, determines the number of
		 *                                  seconds after which the onFailure calback is called.
		 *                                  The presence of a timeout does not prevent the onSuccess
		 *                                  callback from being called when the subscribe completes.         
		 * @throws {InvalidState} if the client is not in connected state.
		 */
		this.subscribe = function (filter, subscribeOptions) {
			if (typeof filter !== "string")
				throw new Error("Invalid argument:"+filter);
			subscribeOptions = subscribeOptions || {} ;
			validate(subscribeOptions,  {qos:"number", 
										 invocationContext:"object", 
										 onSuccess:"function", 
										 onFailure:"function",
										 timeout:"number"
										});
			if (subscribeOptions.timeout && !subscribeOptions.onFailure)
				throw new Error("subscribeOptions.timeout specified with no onFailure callback.");
			if (typeof subscribeOptions.qos !== "undefined" 
				&& !(subscribeOptions.qos === 0 || subscribeOptions.qos === 1 || subscribeOptions.qos === 2 ))
				throw new Error(format(ERROR.INVALID_ARGUMENT, [subscribeOptions.qos, "subscribeOptions.qos"]));
			client.subscribe(filter, subscribeOptions);
		};

		/**
		 * Unsubscribe for messages, stop receiving messages sent to destinations described by the filter.
		 * 
		 * @name Paho.MQTT.Client#unsubscribe
		 * @function
		 * @param {string} filter - describing the destinations to receive messages from.
		 * @param {object} unsubscribeOptions - used to control the subscription
		 * @param {object} unsubscribeOptions.invocationContext - passed to the onSuccess callback 
		                                      or onFailure callback.
		 * @param {function} unsubscribeOptions.onSuccess - called when the unsubscribe acknowledgement has been received from the server.
		 *                                    A single response object parameter is passed to the 
		 *                                    onSuccess callback containing the following fields:
		 *                                    <ol>
		 *                                    <li>invocationContext - if set in the unsubscribeOptions.     
		 *                                    </ol>
		 * @param {function} unsubscribeOptions.onFailure called when the unsubscribe request has failed or timed out.
		 *                                    A single response object parameter is passed to the onFailure callback containing the following fields:
		 *                                    <ol>
		 *                                    <li>invocationContext - if set in the unsubscribeOptions.       
		 *                                    <li>errorCode - a number indicating the nature of the error.
		 *                                    <li>errorMessage - text describing the error.      
		 *                                    </ol>
		 * @param {number} unsubscribeOptions.timeout - which, if present, determines the number of seconds
		 *                                    after which the onFailure callback is called. The presence of
		 *                                    a timeout does not prevent the onSuccess callback from being
		 *                                    called when the unsubscribe completes
		 * @throws {InvalidState} if the client is not in connected state.
		 */
		this.unsubscribe = function (filter, unsubscribeOptions) {
			if (typeof filter !== "string")
				throw new Error("Invalid argument:"+filter);
			unsubscribeOptions = unsubscribeOptions || {} ;
			validate(unsubscribeOptions,  {invocationContext:"object", 
										   onSuccess:"function", 
										   onFailure:"function",
										   timeout:"number"
										  });
			if (unsubscribeOptions.timeout && !unsubscribeOptions.onFailure)
				throw new Error("unsubscribeOptions.timeout specified with no onFailure callback.");
			client.unsubscribe(filter, unsubscribeOptions);
		};

		/**
		 * Send a message to the consumers of the destination in the Message.
		 * 
		 * @name Paho.MQTT.Client#send
		 * @function 
		 * @param {string|Paho.MQTT.Message} topic - <b>mandatory</b> The name of the destination to which the message is to be sent. 
		 * 					   - If it is the only parameter, used as Paho.MQTT.Message object.
		 * @param {String|ArrayBuffer} payload - The message data to be sent. 
		 * @param {number} qos The Quality of Service used to deliver the message.
		 * 		<dl>
		 * 			<dt>0 Best effort (default).
		 *     			<dt>1 At least once.
		 *     			<dt>2 Exactly once.     
		 * 		</dl>
		 * @param {Boolean} retained If true, the message is to be retained by the server and delivered 
		 *                     to both current and future subscriptions.
		 *                     If false the server only delivers the message to current subscribers, this is the default for new Messages. 
		 *                     A received message has the retained boolean set to true if the message was published 
		 *                     with the retained boolean set to true
		 *                     and the subscrption was made after the message has been published. 
		 * @throws {InvalidState} if the client is not connected.
		 */   
		this.send = function (topic,payload,qos,retained) {   
			var message ;  
			
			if(arguments.length == 0){
				throw new Error("Invalid argument."+"length");

			}else if(arguments.length == 1) {

				if (!(topic instanceof Message) && (typeof topic !== "string"))
					throw new Error("Invalid argument:"+ typeof topic);

				message = topic;
				if (typeof message.destinationName === "undefined")
					throw new Error(format(ERROR.INVALID_ARGUMENT,[message.destinationName,"Message.destinationName"]));
				client.send(message); 

			}else {
				//parameter checking in Message object 
				message = new Message(payload);
				message.destinationName = topic;
				if(arguments.length >= 3)
					message.qos = qos;
				if(arguments.length >= 4)
					message.retained = retained;
				client.send(message); 
			}
		};
		
		/** 
		 * Normal disconnect of this Messaging client from its server.
		 * 
		 * @name Paho.MQTT.Client#disconnect
		 * @function
		 * @throws {InvalidState} if the client is already disconnected.     
		 */
		this.disconnect = function () {
			client.disconnect();
		};
		
		/** 
		 * Get the contents of the trace log.
		 * 
		 * @name Paho.MQTT.Client#getTraceLog
		 * @function
		 * @return {Object[]} tracebuffer containing the time ordered trace records.
		 */
		this.getTraceLog = function () {
			return client.getTraceLog();
		}
		
		/** 
		 * Start tracing.
		 * 
		 * @name Paho.MQTT.Client#startTrace
		 * @function
		 */
		this.startTrace = function () {
			client.startTrace();
		};
		
		/** 
		 * Stop tracing.
		 * 
		 * @name Paho.MQTT.Client#stopTrace
		 * @function
		 */
		this.stopTrace = function () {
			client.stopTrace();
		};

		this.isConnected = function() {
			return client.connected;
		};
	};

	Client.prototype = {
		get host() { return this._getHost(); },
		set host(newHost) { this._setHost(newHost); },
			
		get port() { return this._getPort(); },
		set port(newPort) { this._setPort(newPort); },

		get path() { return this._getPath(); },
		set path(newPath) { this._setPath(newPath); },
			
		get clientId() { return this._getClientId(); },
		set clientId(newClientId) { this._setClientId(newClientId); },
		
		get onConnected() { return this._getOnConnected(); },
		set onConnected(newOnConnected) { this._setOnConnected(newOnConnected); },

		get disconnectedPublishing() { return this._getDisconnectedPublishing(); },
		set disconnectedPublishing(newDisconnectedPublishing) { this._setDisconnectedPublishing(newDisconnectedPublishing); },		
		
		get disconnectedBufferSize() { return this._getDisconnectedBufferSize(); },
		set disconnectedBufferSize(newDisconnectedBufferSize) { this._setDisconnectedBufferSize(newDisconnectedBufferSize); },
		
		get onConnectionLost() { return this._getOnConnectionLost(); },
		set onConnectionLost(newOnConnectionLost) { this._setOnConnectionLost(newOnConnectionLost); },

		get onMessageDelivered() { return this._getOnMessageDelivered(); },
		set onMessageDelivered(newOnMessageDelivered) { this._setOnMessageDelivered(newOnMessageDelivered); },
		
		get onMessageArrived() { return this._getOnMessageArrived(); },
		set onMessageArrived(newOnMessageArrived) { this._setOnMessageArrived(newOnMessageArrived); },

		get trace() { return this._getTrace(); },
		set trace(newTraceFunction) { this._setTrace(newTraceFunction); }	

	};
	
	/** 
	 * An application message, sent or received.
	 * <p>
	 * All attributes may be null, which implies the default values.
	 * 
	 * @name Paho.MQTT.Message
	 * @constructor
	 * @param {String|ArrayBuffer} payload The message data to be sent.
	 * <p>
	 * @property {string} payloadString <i>read only</i> The payload as a string if the payload consists of valid UTF-8 characters.
	 * @property {ArrayBuffer} payloadBytes <i>read only</i> The payload as an ArrayBuffer.
	 * <p>
	 * @property {string} destinationName <b>mandatory</b> The name of the destination to which the message is to be sent
	 *                    (for messages about to be sent) or the name of the destination from which the message has been received.
	 *                    (for messages received by the onMessage function).
	 * <p>
	 * @property {number} qos The Quality of Service used to deliver the message.
	 * <dl>
	 *     <dt>0 Best effort (default).
	 *     <dt>1 At least once.
	 *     <dt>2 Exactly once.     
	 * </dl>
	 * <p>
	 * @property {Boolean} retained If true, the message is to be retained by the server and delivered 
	 *                     to both current and future subscriptions.
	 *                     If false the server only delivers the message to current subscribers, this is the default for new Messages. 
	 *                     A received message has the retained boolean set to true if the message was published 
	 *                     with the retained boolean set to true
	 *                     and the subscrption was made after the message has been published. 
	 * <p>
	 * @property {Boolean} duplicate <i>read only</i> If true, this message might be a duplicate of one which has already been received. 
	 *                     This is only set on messages received from the server.
	 *                     
	 */
	var Message = function (newPayload) {  
		var payload;
		if (   typeof newPayload === "string" 
			|| newPayload instanceof ArrayBuffer
			|| newPayload instanceof Int8Array
			|| newPayload instanceof Uint8Array
			|| newPayload instanceof Int16Array
			|| newPayload instanceof Uint16Array
			|| newPayload instanceof Int32Array
			|| newPayload instanceof Uint32Array
			|| newPayload instanceof Float32Array
			|| newPayload instanceof Float64Array
		   ) {
			payload = newPayload;
		} else {
			throw (format(ERROR.INVALID_ARGUMENT, [newPayload, "newPayload"]));
		}

		this._getPayloadString = function () {
			if (typeof payload === "string")
				return payload;
			else
				return parseUTF8(payload, 0, payload.length); 
		};

		this._getPayloadBytes = function() {
			if (typeof payload === "string") {
				var buffer = new ArrayBuffer(UTF8Length(payload));
				var byteStream = new Uint8Array(buffer); 
				stringToUTF8(payload, byteStream, 0);

				return byteStream;
			} else {
				return payload;
			};
		};

		var destinationName = undefined;
		this._getDestinationName = function() { return destinationName; };
		this._setDestinationName = function(newDestinationName) { 
			if (typeof newDestinationName === "string")
				destinationName = newDestinationName;
			else 
				throw new Error(format(ERROR.INVALID_ARGUMENT, [newDestinationName, "newDestinationName"]));
		};
				
		var qos = 0;
		this._getQos = function() { return qos; };
		this._setQos = function(newQos) { 
			if (newQos === 0 || newQos === 1 || newQos === 2 )
				qos = newQos;
			else 
				throw new Error("Invalid argument:"+newQos);
		};

		var retained = false;
		this._getRetained = function() { return retained; };
		this._setRetained = function(newRetained) { 
			if (typeof newRetained === "boolean")
				retained = newRetained;
			else 
				throw new Error(format(ERROR.INVALID_ARGUMENT, [newRetained, "newRetained"]));
		};
		
		var duplicate = false;
		this._getDuplicate = function() { return duplicate; };
		this._setDuplicate = function(newDuplicate) { duplicate = newDuplicate; };
	};
	
	Message.prototype = {
		get payloadString() { return this._getPayloadString(); },
		get payloadBytes() { return this._getPayloadBytes(); },
		
		get destinationName() { return this._getDestinationName(); },
		set destinationName(newDestinationName) { this._setDestinationName(newDestinationName); },
		
		get qos() { return this._getQos(); },
		set qos(newQos) { this._setQos(newQos); },

		get retained() { return this._getRetained(); },
		set retained(newRetained) { this._setRetained(newRetained); },

		get duplicate() { return this._getDuplicate(); },
		set duplicate(newDuplicate) { this._setDuplicate(newDuplicate); }
	};
	   
	// Module contents.
	return {
		Client: Client,
		Message: Message
	};
})(window);

var webduino = webduino || {
  version: '0.4.14'
};

if (typeof exports !== 'undefined') {
  module.exports = webduino;
}

+(function (factory) {
  if (typeof exports === 'undefined') {
    factory(webduino || {});
  } else {
    module.exports = factory;
  }
}(function (scope) {
  'use strict';

  // source:
  // https://raw.githubusercontent.com/Gozala/events/master/events.js
  var proto;

  function EventEmitter() {
    this._events = this._events || {};
    this._maxListeners = this._maxListeners || undefined;
  }

  proto = EventEmitter.prototype;
  proto._events = undefined;
  proto._maxListeners = undefined;

  // By default EventEmitters will print a warning if more than 10 listeners are
  // added to it. This is a useful default which helps finding memory leaks.
  EventEmitter.defaultMaxListeners = 10;

  // Obviously not all Emitters should be limited to 10. This function allows
  // that to be increased. Set to zero for unlimited.
  proto.setMaxListeners = function (n) {
    if (!isNumber(n) || n < 0 || isNaN(n))
      throw TypeError('n must be a positive number');
    this._maxListeners = n;
    return this;
  };

  proto.emit = function (type) {
    var er, handler, len, args, i, listeners;

    if (!this._events)
      this._events = {};

    // If there is no 'error' event listener then throw.
    // EDIT: Do not throw unhandled 'error' in the browser. (mz)
    // if (type === 'error') {
    //   if (!this._events.error ||
    //     (isObject(this._events.error) && !this._events.error.length)) {
    //     er = arguments[1];
    //     if (er instanceof Error) {
    //       throw er; // Unhandled 'error' event
    //     }
    //     throw TypeError('Uncaught, unspecified "error" event.');
    //   }
    // }

    handler = this._events[type];

    if (isUndefined(handler))
      return false;

    if (isFunction(handler)) {
      switch (arguments.length) {
        // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
        // slower
      default:
        args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
      }
    } else if (isObject(handler)) {
      args = Array.prototype.slice.call(arguments, 1);
      listeners = handler.slice();
      len = listeners.length;
      for (i = 0; i < len; i++)
        listeners[i].apply(this, args);
    }

    return true;
  };

  proto.addListener = function (type, listener) {
    var m;

    if (!isFunction(listener))
      throw TypeError('listener must be a function');

    if (!this._events)
      this._events = {};

    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (this._events.newListener)
      this.emit('newListener', type,
        isFunction(listener.listener) ?
        listener.listener : listener);

    if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
      this._events[type] = listener;
    else if (isObject(this._events[type]))
    // If we've already got an array, just append.
      this._events[type].push(listener);
    else
    // Adding the second element, need to change to array.
      this._events[type] = [this._events[type], listener];

    // Check for listener leak
    if (isObject(this._events[type]) && !this._events[type].warned) {
      if (!isUndefined(this._maxListeners)) {
        m = this._maxListeners;
      } else {
        m = EventEmitter.defaultMaxListeners;
      }

      if (m && m > 0 && this._events[type].length > m) {
        this._events[type].warned = true;
        console.error('(node) warning: possible EventEmitter memory ' +
          'leak detected. %d listeners added. ' +
          'Use emitter.setMaxListeners() to increase limit.',
          this._events[type].length);
        if (typeof console.trace === 'function') {
          // not supported in IE 10
          console.trace();
        }
      }
    }

    return this;
  };

  proto.on = proto.addListener;

  proto.once = function (type, listener) {
    if (!isFunction(listener))
      throw TypeError('listener must be a function');

    var fired = false;

    function g() {
      this.removeListener(type, g);

      if (!fired) {
        fired = true;
        listener.apply(this, arguments);
      }
    }

    g.listener = listener;
    this.on(type, g);

    return this;
  };

  // emits a 'removeListener' event iff the listener was removed
  proto.removeListener = function (type, listener) {
    var list, position, length, i;

    if (!isFunction(listener))
      throw TypeError('listener must be a function');

    if (!this._events || !this._events[type])
      return this;

    list = this._events[type];
    length = list.length;
    position = -1;

    if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
      delete this._events[type];
      if (this._events.removeListener)
        this.emit('removeListener', type, listener);

    } else if (isObject(list)) {
      for (i = length; i-- > 0;) {
        if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
          position = i;
          break;
        }
      }

      if (position < 0)
        return this;

      if (list.length === 1) {
        list.length = 0;
        delete this._events[type];
      } else {
        list.splice(position, 1);
      }

      if (this._events.removeListener)
        this.emit('removeListener', type, listener);
    }

    return this;
  };

  proto.removeAllListeners = function (type) {
    var key, listeners;

    if (!this._events)
      return this;

    // not listening for removeListener, no need to emit
    if (!this._events.removeListener) {
      if (arguments.length === 0)
        this._events = {};
      else if (this._events[type])
        delete this._events[type];
      return this;
    }

    // emit removeListener for all listeners on all events
    if (arguments.length === 0) {
      for (key in this._events) {
        if (key === 'removeListener') continue;
        this.removeAllListeners(key);
      }
      this.removeAllListeners('removeListener');
      this._events = {};
      return this;
    }

    listeners = this._events[type];

    if (isFunction(listeners)) {
      this.removeListener(type, listeners);
    } else if (listeners) {
      // LIFO order
      while (listeners.length)
        this.removeListener(type, listeners[listeners.length - 1]);
    }
    delete this._events[type];

    return this;
  };

  proto.listeners = function (type) {
    var ret;
    if (!this._events || !this._events[type])
      ret = [];
    else if (isFunction(this._events[type]))
      ret = [this._events[type]];
    else
      ret = this._events[type].slice();
    return ret;
  };

  EventEmitter.listenerCount = function (emitter, type) {
    var ret;
    if (!emitter._events || !emitter._events[type])
      ret = 0;
    else if (isFunction(emitter._events[type]))
      ret = 1;
    else
      ret = emitter._events[type].length;
    return ret;
  };

  function isFunction(arg) {
    return typeof arg === 'function';
  }

  function isNumber(arg) {
    return typeof arg === 'number';
  }

  function isObject(arg) {
    return typeof arg === 'object' && arg !== null;
  }

  function isUndefined(arg) {
    return arg === void 0;
  }

  scope.EventEmitter = EventEmitter;
}));

+(function (factory) {
  if (typeof exports === 'undefined') {
    factory(webduino || {});
  } else {
    module.exports = factory;
  }
}(function (scope) {
  'use strict';

  var isBrowser = typeof exports === 'undefined';

  var objProto = Object.prototype,
    owns = objProto.hasOwnProperty,
    toStr = objProto.toString;

  function isFn(value) {
    return typeof value === 'function';
  }

  function isObject(value) {
    return '[object Object]' === toStr.call(value);
  }

  function isHash(value) {
    return isObject(value) && value.constructor === Object && !value.nodeType && !value.setInterval;
  }

  function isArray(value) {
    return Array.isArray(value);
  }

  // source:
  // https://github.com/dreamerslab/node.extend/blob/master/lib/extend.js
  function extend() {
    var target = arguments[0] || {};
    var i = 1;
    var length = arguments.length;
    var deep = false;
    var options, name, src, copy, copy_is_array, clone;

    // Handle a deep copy situation
    if (typeof target === 'boolean') {
      deep = target;
      target = arguments[1] || {};
      // skip the boolean and the target
      i = 2;
    }

    // Handle case when target is a string or something (possible in deep copy)
    if (typeof target !== 'object' && !isFn(target)) {
      target = {};
    }

    for (; i < length; i++) {
      // Only deal with non-null/undefined values
      options = arguments[i]
      if (options !== null) {
        if (typeof options === 'string') {
          options = options.split('');
        }
        // Extend the base object
        for (name in options) {
          src = target[name];
          copy = options[name];

          // Prevent never-ending loop
          if (target === copy) {
            continue;
          }

          // Recurse if we're merging plain objects or arrays
          if (deep && copy && (isHash(copy) || (copy_is_array = isArray(copy)))) {
            if (copy_is_array) {
              copy_is_array = false;
              clone = src && isArray(src) ? src : [];
            } else {
              clone = src && isHash(src) ? src : {};
            }

            // Never move original objects, clone them
            target[name] = extend(deep, clone, copy);

            // Don't bring in undefined values
          } else if (typeof copy !== 'undefined') {
            target[name] = copy;
          }
        }
      }
    }

    // Return the modified object
    return target;
  }

  function parseURL(str) {
    if (isBrowser) {
      var url = document.createElement('a');
      url.href = str;
      return url;
    } else {
      return require('url').parse(str);
    }
  }

  function randomId() {
    return (Math.random() * Date.now()).toString(36).replace(/\./g, '');
  }

  scope.util = {
    isFn: isFn,
    isFunction: isFn,
    isObject: isObject,
    isHash: isHash,
    isArray: isArray,
    extend: extend,
    parseURL: parseURL,
    randomId: randomId
  };
}));

+(function (factory) {
  if (typeof exports === 'undefined') {
    factory(webduino || {});
  } else {
    module.exports = factory;
  }
}(function (scope) {
  'use strict';

  if (typeof exports !== 'undefined' && typeof Promise === 'undefined') {
    Promise = require('es6-promise').Promise;
  }

  // source: 
  // https://raw.githubusercontent.com/twistdigital/es6-promisify/release/2.0.0/lib/promisify.js

  // Promise Context object constructor.
  function Context(resolve, reject, custom) {
    this.resolve = resolve;
    this.reject = reject;
    this.custom = custom;
  }

  // Default callback function - rejects on truthy error, otherwise resolves
  function callback(ctx, err, result) {
    if (typeof ctx.custom === 'function') {
      var cust = function () {
        // Bind the callback to itself, so the resolve and reject
        // properties that we bound are available to the callback.
        // Then we push it onto the end of the arguments array.
        return ctx.custom.apply(cust, arguments);
      };
      cust.resolve = ctx.resolve;
      cust.reject = ctx.reject;
      cust.call(null, err, result);
    } else {
      if (err) {
        return ctx.reject(err);
      }
      ctx.resolve(result);
    }
  }

  function promisify(original, custom) {
    return function () {

      // Store original context
      var that = this,
        args = Array.prototype.slice.call(arguments);

      // Return the promisified function
      return new Promise(function (resolve, reject) {

        // Create a Context object
        var ctx = new Context(resolve, reject, custom);

        // Append the callback bound to the context
        args.push(callback.bind(null, ctx));

        // Call the function
        original.apply(that, args);
      });
    };
  }

  scope.util.promisify = promisify;
}));

+(function (factory) {
  if (typeof exports === 'undefined') {
    factory(webduino || {});
  } else {
    module.exports = factory;
  }
}(function (scope) {
  'use strict';

  var EventEmitter = scope.EventEmitter,
    proto;

  var TransportEvent = {
    OPEN: 'open',
    MESSAGE: 'message',
    ERROR: 'error',
    CLOSE: 'close'
  };

  function Transport(options) {
    EventEmitter.call(this);
  }

  Transport.prototype = proto = Object.create(EventEmitter.prototype, {

    constructor: {
      value: Transport
    },

    isOpen: {
      value: false
    }

  });

  proto.send = function (payload) {
    throw new Error('direct call on abstract method.');
  };

  proto.close = function () {
    throw new Error('direct call on abstract method.');
  };

  proto.flush = function () {
    throw new Error('direct call on abstract method.');
  };

  scope.TransportEvent = TransportEvent;
  scope.Transport = Transport;
  scope.transport = scope.transport || {};
}));

+(function (scope) {
  'use strict';

  var push = Array.prototype.push;

  var Transport = scope.Transport,
    TransportEvent = scope.TransportEvent,
    util = scope.util,
    proto;

  var STATUS = {
    OK: 'OK'
  };

  var TOPIC = {
    PING: '/PING',
    PONG: '/PONG',
    STATUS: '/STATUS'
  };

  function MqttTransport(options) {
    Transport.call(this, options);

    this._options = options;
    this._client = null;
    this._timer = null;
    this._sendTimer = null;
    this._buf = [];

    this._status = '';

    this._connHandler = onConnect.bind(this);
    this._connFailedHandler = onConnectFailed.bind(this);
    this._messageHandler = onMessage.bind(this);
    this._sendOutHandler = sendOut.bind(this);
    this._disconnHandler = onDisconnect.bind(this);

    init(this);
  }

  function init(self) {
    self._client = new Paho.MQTT.Client(self._options.server,
      '_' + self._options.device + (self._options.multi ? '.' + util.randomId() : '')
    );
    self._client.onMessageArrived = self._messageHandler;
    self._client.onConnectionLost = self._disconnHandler;
    self._client.onConnected = self._connHandler;
    self._client.connect({
      userName: self._options.login || '',
      password: self._options.password || '',
      timeout: MqttTransport.CONNECT_TIMEOUT,
      keepAliveInterval: MqttTransport.KEEPALIVE_INTERVAL,
      onSuccess: self._connHandler,
      onFailure: self._connFailedHandler,
      reconnect: !!self._options.autoReconnect,
      reconnectInterval: MqttTransport.RECONNECT_PERIOD
    });
  }

  function onConnect() {
    this._client.subscribe(this._options.device + TOPIC.PONG);
    this._client.subscribe(this._options.device + TOPIC.STATUS);
  }

  function onConnectFailed(respObj) {
    this.emit(TransportEvent.ERROR, new Error(respObj.errorMessage));
  }

  function onMessage(message) {
    var dest = message.destinationName,
      oldStatus = this._status;

    switch (dest.substr(dest.lastIndexOf('/') + 1)) {

    case 'STATUS':
      this._status = message.payloadString;
      detectStatusChange(this, this._status, oldStatus);
      break;

    default:
      (this._status === STATUS.OK) && this.emit(TransportEvent.MESSAGE, message.payloadBytes);
      break;

    }
  }

  function detectStatusChange(self, newStatus, oldStatus) {
    if (newStatus === oldStatus) {
      return;
    }

    if (newStatus === STATUS.OK) {
      self.emit(TransportEvent.OPEN);
    } else {
      self.emit(TransportEvent.ERROR, new Error('board connection failed.'));
    }
  }

  function onDisconnect(respObj) {
    if (!respObj.errorCode || !respObj.reconnect) {
      delete this._client;
      respObj.errorCode && this.emit(TransportEvent.ERROR, new Error(respObj.errorMessage));
      this.emit(TransportEvent.CLOSE);
    }
  }

  function sendOut() {
    var payload = new Paho.MQTT.Message(new Uint8Array(this._buf).buffer);
    payload.destinationName = this._options.device + TOPIC.PING;
    payload.qos = 0;
    this.isOpen && this._client.send(payload);
    clearBuf(this);
  }

  function clearBuf(self) {
    self._buf = [];
    clearImmediate(self._sendTimer);
    self._sendTimer = null;
  }

  MqttTransport.prototype = proto = Object.create(Transport.prototype, {

    constructor: {
      value: MqttTransport
    },

    isOpen: {
      get: function () {
        return this._client && this._client.isConnected();
      }
    }

  });

  proto.send = function (payload) {
    if (this._buf.length + payload.length + this._options.device.length + TOPIC.PING.length + 4 >
      MqttTransport.MAX_PACKET_SIZE) {
      this._sendOutHandler();
    }
    push.apply(this._buf, payload);
    if (!this._sendTimer) {
      this._sendTimer = setImmediate(this._sendOutHandler);
    }
  };

  proto.close = function () {
    if (this._client) {
      if (this._client.isConnected()) {
        this._client.disconnect();
      } else {
        delete this._client;
      }
    }
  };

  proto.flush = function () {
    if (this._buf && this._buf.length) {
      this._sendOutHandler();
    }
  };

  MqttTransport.RECONNECT_PERIOD = 1;

  MqttTransport.KEEPALIVE_INTERVAL = 15;

  MqttTransport.CONNECT_TIMEOUT = 30;

  MqttTransport.MAX_PACKET_SIZE = 128;

  scope.transport.mqtt = MqttTransport;
}(webduino));

+(function (scope) {
  'use strict';

  var push = Array.prototype.push,
    WebSocketClient = WebSocket;

  var Transport = scope.Transport,
    TransportEvent = scope.TransportEvent,
    proto;

  function WebSocketTransport(options) {
    Transport.call(this, options);

    this._options = options;
    this._client = null;
    this._sendTimer = null;
    this._buf = [];

    this._connHandler = onConnect.bind(this);
    this._messageHandler = onMessage.bind(this);
    this._sendOutHandler = sendOut.bind(this);
    this._disconnHandler = onDisconnect.bind(this);
    this._errorHandler = onError.bind(this);

    init(this);
  }

  function init(self) {
    var url = self._options.url;
    self._options.url = url.indexOf('ws://') === 0 ? url : 'ws://' + url;
    self._client = new WebSocketClient(self._options.url);
    self._client.binaryType = 'arraybuffer';
    self._client.onopen = self._connHandler;
    self._client.onmessage = self._messageHandler;
    self._client.onclose = self._disconnHandler;
    self._client.onerror = self._errorHandler;
  }

  function onConnect(event) {
    this.emit(TransportEvent.OPEN, event);
  }

  function onMessage(event) {
    this.emit(TransportEvent.MESSAGE, new Uint8Array(event.data));
  }

  function onDisconnect(event) {
    delete this._client;
    this.emit(TransportEvent.CLOSE, event);
  }

  function onError(event) {
    this.emit(TransportEvent.ERROR, event);
  }

  function sendOut() {
    var payload = new Uint8Array(this._buf).buffer;
    this.isOpen && this._client.send(payload);
    clearBuf(this);
  }

  function clearBuf(self) {
    self._buf = [];
    clearImmediate(self._sendTimer);
    self._sendTimer = null;
  }

  WebSocketTransport.prototype = proto = Object.create(Transport.prototype, {

    constructor: {
      value: WebSocketTransport
    },

    isOpen: {
      get: function () {
        return this._client && this._client.readyState === WebSocketClient.OPEN;
      }
    }

  });

  proto.send = function (payload) {
    if (this._buf.length + payload.length > WebSocketTransport.MAX_PACKET_SIZE) {
      this._sendOutHandler();
    }
    push.apply(this._buf, payload);
    if (!this._sendTimer) {
      this._sendTimer = setImmediate(this._sendOutHandler);
    }
  };

  proto.close = function () {
    if (this._client) {
      if (this._client.readyState === WebSocketClient.OPEN) {
        this._client.close();
      } else {
        delete this._client;
      }
    }
  };

  proto.flush = function () {
    if (this._buf && this._buf.length) {
      this._sendOutHandler();
    }
  };

  WebSocketTransport.MAX_PACKET_SIZE = 64;

  scope.transport.websocket = WebSocketTransport;
}(webduino));

+(function (factory) {
  if (typeof exports === 'undefined') {
    factory(webduino || {});
  } else {
    module.exports = factory;
  }
}(function (scope) {
  'use strict';

  var EventEmitter = scope.EventEmitter,
    proto;

  var PinEvent = {
    CHANGE: 'change',
    RISING_EDGE: 'risingEdge',
    FALLING_EDGE: 'fallingEdge'
  };

  function Pin(board, number, type) {
    EventEmitter.call(this);

    this._board = board;
    this._type = type;
    this._capabilities = {};
    this._number = number;
    this._analogNumber = undefined;
    this._analogWriteResolution = 255; // default
    this._analogReadResolution = 1023; // default
    this._value = 0;
    this._lastValue = -1;
    this._preFilterValue = 0;
    this._average = 0;
    this._minimum = Math.pow(2, 16);
    this._maximum = 0;
    this._sum = 0;
    this._numSamples = 0;
    this._filters = null;
    this._generator = null;
    this._state = undefined;
    this._analogReporting = false;

    this._sendOutHandler = sendOut.bind(this);
    this._autoSetValueCallback = this.autoSetValue.bind(this);

    managePinListener(this);
  }

  function managePinListener(self) {
    var type = self._type,
      board = self._board;

    if (type === Pin.DOUT || type === Pin.AOUT || type === Pin.SERVO) {
      if (!EventEmitter.listenerCount(self, PinEvent.CHANGE)) {
        self.on(PinEvent.CHANGE, self._sendOutHandler);
      }
    } else {
      if (EventEmitter.listenerCount(self, PinEvent.CHANGE)) {
        try {
          self.removeListener(PinEvent.CHANGE, self._sendOutHandler);
        } catch (e) {
          // Pin had reference to other handler, ignore
          debug("debug: caught self removeEventListener exception");
        }
      }
    }
  }

  function sendOut(self) {
    var type = self._type,
      pinNum = self._number,
      board = self._board,
      value = self.value;

    switch (type) {
    case Pin.DOUT:
      board.sendDigitalData(pinNum, value);
      break;
    case Pin.AOUT:
      board.sendAnalogData(pinNum, value);
      break;
    case Pin.SERVO:
      board.sendServoData(pinNum, value);
      break;
    }
  }

  Pin.prototype = proto = Object.create(EventEmitter.prototype, {

    constructor: {
      value: Pin
    },

    capabilities: {
      get: function () {
        return this._capabilities;
      }
    },

    analogNumber: {
      get: function () {
        return this._analogNumber;
      }
    },

    number: {
      get: function () {
        return this._number;
      }
    },

    analogWriteResolution: {
      get: function () {
        return this._analogWriteResolution;
      }
    },

    analogReadResolution: {
      get: function () {
        return this._analogReadResolution;
      }
    },

    state: {
      get: function () {
        return this._state;
      },
      set: function (val) {
        if (this._type === Pin.PWM) {
          val = val / this._analogWriteResolution;
        }
        this.value = this._value = this._state = val;
      }
    },

    type: {
      get: function () {
        return this._type;
      }
    },

    average: {
      get: function () {
        return this._average;
      }
    },

    minimum: {
      get: function () {
        return this._minimum;
      }
    },

    maximum: {
      get: function () {
        return this._maximum;
      }
    },

    value: {
      get: function () {
        return this._value;
      },
      set: function (val) {
        this._lastValue = this._value;
        this._preFilterValue = val;
        this._value = this.applyFilters(val);
        this.calculateMinMaxAndMean(this._value);
        this.detectChange(this._lastValue, this._value);
      }
    },

    lastValue: {
      get: function () {
        return this._lastValue;
      }
    },

    preFilterValue: {
      get: function () {
        return this._preFilterValue;
      }
    },

    filters: {
      get: function () {
        return this._filters;
      },
      set: function (filters) {
        this._filters = filters;
      }
    },

    generator: {
      get: function () {
        return this._generator;
      }
    }

  });

  proto.setAnalogNumber = function (num) {
    this._analogNumber = num;
  };

  proto.setAnalogWriteResolution = function (value) {
    this._analogWriteResolution = value;
  };

  proto.setAnalogReadResolution = function (value) {
    this._analogReadResolution = value;
  };

  proto.setCapabilities = function (capabilities) {
    this._capabilities = capabilities;
    var analogWriteRes = this._capabilities[Pin.PWM];
    var analogReadRes = this._capabilities[Pin.AIN];
    if (analogWriteRes) {
      this._analogWriteResolution = Math.pow(2, analogWriteRes) - 1;
    }
    if (analogReadRes) {
      this._analogReadResolution = Math.pow(2, analogReadRes) - 1;
    }
  };

  proto.setMode = function (mode, silent) {
    var pinNum = this._number,
      board = this._board;

    if (mode >= 0 && mode < Pin.TOTAL_PIN_MODES) {
      this._type = mode;
      managePinListener(this);

      if (!silent || silent !== true) {
        board.setPinMode(pinNum, mode);
      }
    }
  };

  proto.detectChange = function (oldValue, newValue) {
    if (oldValue === newValue) {
      return;
    }
    this.emit(PinEvent.CHANGE, this);
    if (oldValue <= 0 && newValue !== 0) {
      this.emit(PinEvent.RISING_EDGE, this);
    } else if (oldValue !== 0 && newValue <= 0) {
      this.emit(PinEvent.FALLING_EDGE, this);
    }
  };

  proto.clearWeight = function () {
    this._sum = this._average;
    this._numSamples = 1;
  };

  proto.calculateMinMaxAndMean = function (val) {
    var MAX_SAMPLES = Number.MAX_VALUE;

    this._minimum = Math.min(val, this._minimum);
    this._maximum = Math.max(val, this._maximum);
    this._sum += val;
    this._average = this._sum / (++this._numSamples);
    if (this._numSamples >= MAX_SAMPLES) {
      this.clearWeight();
    }
  };

  proto.clear = function () {
    this._minimum = this._maximum = this._average = this._lastValue = this._preFilterValue;
    this.clearWeight();
  };

  proto.addFilter = function (newFilter) {
    if (newFilter === null) {
      return;
    }
    if (this._filters === null) {
      this._filters = [];
    }
    this._filters.push(newFilter);
  };

  proto.removeFilter = function (filterToRemove) {
    var index;

    if (this._filters.length < 1) {
      return;
    }
    index = this._filters.indexOf(filterToRemove);
    if (index !== -1) {
      this._filters.splice(index, 1);
    }
  };

  proto.addGenerator = function (newGenerator) {
    this.removeGenerator();
    this._generator = newGenerator;
    this._generator.on('update', this._autoSetValueCallback);
  };

  proto.removeGenerator = function () {
    if (this._generator !== null) {
      this._generator.removeListener('update', this._autoSetValueCallback);
    }
    delete this._generator;
  };

  proto.removeAllFilters = function () {
    delete this._filters;
  };

  proto.autoSetValue = function (val) {
    this.value = val;
  };

  proto.applyFilters = function (val) {
    var result;

    if (this._filters === null) {
      return val;
    }
    result = val;
    var len = this._filters.length;
    for (var i = 0; i < len; i++) {
      result = this._filters[i].processSample(result);
    }
    return result;
  };

  proto.read = function () {
    var type = this._type,
      board = this._board,
      self = this;

    switch (type) {
    case Pin.DOUT:
    case Pin.AOUT:
    case Pin.SERVO:
      return board.queryPinState(self._number).then(function (pin) {
        return pin.state;
      });

    case Pin.AIN:
      if (!self._analogReporting) {
        board.enableAnalogPin(self._analogNumber);
      }

    case Pin.DIN:
      return new Promise(function (resolve) {
        setImmediate(function () {
          resolve(self.value);
        });
      });
    }
  };

  proto.write = function (value) {
    var type = this._type;

    if (type === Pin.DOUT || type === Pin.AOUT || type === Pin.SERVO) {
      this.value = value;
    }
  };

  Pin.HIGH = 1;
  Pin.LOW = 0;
  Pin.ON = 1;
  Pin.OFF = 0;
  Pin.DIN = 0x00;
  Pin.DOUT = 0x01;
  Pin.AIN = 0x02;
  Pin.AOUT = 0x03;
  Pin.PWM = 0x03;
  Pin.SERVO = 0x04;
  Pin.SHIFT = 0x05;
  Pin.I2C = 0x06;
  Pin.ONEWIRE = 0x07;
  Pin.STEPPER = 0x08;
  Pin.TOTAL_PIN_MODES = 9;

  scope.PinEvent = PinEvent;
  scope.Pin = Pin;
}));

+(function (factory) {
  if (typeof exports === 'undefined') {
    factory(webduino || {});
  } else {
    module.exports = factory;
  }
}(function (scope) {
  'use strict';

  var EventEmitter = scope.EventEmitter;

  function Module() {
    EventEmitter.call(this);
  }

  Module.prototype = Object.create(EventEmitter.prototype, {

    constructor: {
      value: Module
    },

    type: {
      get: function () {
        return this._type;
      }
    }

  });

  scope.Module = Module;
  scope.module = scope.module || {};
}));

+(function (factory) {
  if (typeof exports === 'undefined') {
    factory(webduino || {});
  } else {
    module.exports = factory;
  }
}(function (scope) {
  'use strict';

  var push = Array.prototype.push;

  var EventEmitter = scope.EventEmitter,
    TransportEvent = scope.TransportEvent,
    Transport = scope.Transport,
    Pin = scope.Pin,
    util = scope.util,
    proto;

  var BoardEvent = {
    ANALOG_DATA: 'analogData',
    DIGITAL_DATA: 'digitalData',
    FIRMWARE_VERSION: 'firmwareVersion',
    FIRMWARE_NAME: 'firmwareName',
    STRING_MESSAGE: 'stringMessage',
    SYSEX_MESSAGE: 'sysexMessage',
    PIN_STATE_RESPONSE: 'pinStateResponse',
    READY: 'ready',
    ERROR: 'error',
    BEFOREDISCONNECT: 'beforeDisconnect',
    DISCONNECT: 'disconnect'
  };

  // Message command bytes (128-255/0x80-0xFF)
  var DIGITAL_MESSAGE = 0x90,
    ANALOG_MESSAGE = 0xE0,
    REPORT_ANALOG = 0xC0,
    REPORT_DIGITAL = 0xD0,
    SET_PIN_MODE = 0xF4,
    REPORT_VERSION = 0xF9,
    SYSEX_RESET = 0xFF,
    START_SYSEX = 0xF0,
    END_SYSEX = 0xF7;

  // Extended command set using sysex (0-127/0x00-0x7F)
  var SERVO_CONFIG = 0x70,
    STRING_DATA = 0x71,
    SHIFT_DATA = 0x75,
    I2C_REQUEST = 0x76,
    I2C_REPLY = 0x77,
    I2C_CONFIG = 0x78,
    EXTENDED_ANALOG = 0x6F,
    PIN_STATE_QUERY = 0x6D,
    PIN_STATE_RESPONSE = 0x6E,
    CAPABILITY_QUERY = 0x6B,
    CAPABILITY_RESPONSE = 0x6C,
    ANALOG_MAPPING_QUERY = 0x69,
    ANALOG_MAPPING_RESPONSE = 0x6A,
    REPORT_FIRMWARE = 0x79,
    SAMPLING_INTERVAL = 0x7A,
    SYSEX_NON_REALTIME = 0x7E,
    SYSEX_REALTIME = 0x7F;

  function Board(options) {
    EventEmitter.call(this);

    this._options = options;
    this._buf = [];
    this._digitalPort = [];
    this._numPorts = 0;
    this._analogPinMapping = [];
    this._digitalPinMapping = [];
    this._i2cPins = [];
    this._ioPins = [];
    this._totalPins = 0;
    this._totalAnalogPins = 0;
    this._samplingInterval = 19;
    this._isReady = false;
    this._firmwareName = '';
    this._firmwareVersion = 0;
    this._capabilityQueryResponseReceived = false;
    this._numPinStateRequests = 0;
    this._transport = null;
    this._pinStateEventCenter = new EventEmitter();

    this._initialVersionResultHandler = onInitialVersionResult.bind(this);
    this._openHandler = onOpen.bind(this);
    this._messageHandler = onMessage.bind(this);
    this._errorHandler = onError.bind(this);
    this._closeHandler = onClose.bind(this);
    this._cleanupHandler = cleanup.bind(this);

    attachCleanup(this);
    this._setTransport(this._options.transport);
  }

  function onInitialVersionResult(event) {
    var version = event.version * 10,
      name = event.name;

    if (version >= 23) {
      // TODO: do reset and handle response
      // this.systemReset();
      this.queryCapabilities();
    } else {
      throw new Error('You must upload StandardFirmata version 2.3 ' +
        'or greater from Arduino version 1.0 or higher');
    }
  }

  function onOpen() {
    this.begin();
  }

  function onMessage(data) {
    var len = data.length;

    if (len) {
      for (var i = 0; i < len; i++) {
        this.processInput(data[i]);
      }
    } else {
      this.processInput(data);
    }
  }

  function onError(error) {
    this._isReady = false;
    this.emit(BoardEvent.ERROR, error);
    setImmediate(this.disconnect.bind(this));
  }

  function onClose() {
    this._isReady = false;
    this._transport.removeAllListeners();
    delete this._transport;
    this.emit(BoardEvent.DISCONNECT);
  }

  function cleanup() {
    this.disconnect(function () {
      if (typeof exports !== 'undefined') {
        process.exit();
      }
    });
  }

  function attachCleanup(self) {
    if (typeof exports === 'undefined') {
      window.addEventListener('beforeunload', self._cleanupHandler);
    } else {
      process.addListener('SIGINT', self._cleanupHandler);
      process.addListener('uncaughtException', self._cleanupHandler);
    }
  }

  function unattachCleanup(self) {
    if (typeof exports === 'undefined') {
      window.removeEventListener('beforeunload', self._cleanupHandler);
    } else {
      process.removeListener('SIGINT', self._cleanupHandler);
      process.removeListener('uncaughtException', self._cleanupHandler);
    }
  }

  function debug(msg) {
    console && console.log(msg.stack || msg);
  }

  Board.prototype = proto = Object.create(EventEmitter.prototype, {

    constructor: {
      value: Board
    },

    samplingInterval: {
      get: function () {
        return this._samplingInterval;
      },
      set: function (interval) {
        if (interval >= Board.MIN_SAMPLING_INTERVAL && interval <= Board.MAX_SAMPLING_INTERVAL) {
          this._samplingInterval = interval;
          this.send([
            START_SYSEX,
            SAMPLING_INTERVAL,
            interval & 0x007F, (interval >> 7) & 0x007F,
            END_SYSEX
          ]);
        } else {
          throw new Error('warning: Sampling interval must be between ' + Board.MIN_SAMPLING_INTERVAL +
            ' and ' + Board.MAX_SAMPLING_INTERVAL);
        }
      }
    },

    isReady: {
      get: function () {
        return this._isReady;
      }
    },

    isConnected: {
      get: function () {
        return this._transport && this._transport.isOpen;
      }
    }

  });

  proto.begin = function () {
    this.once(BoardEvent.FIRMWARE_NAME, this._initialVersionResultHandler);
    this.reportFirmware();
  };

  proto.processInput = function (inputData) {
    var len, cmd;

    this._buf.push(inputData);
    len = this._buf.length;
    cmd = this._buf[0];

    if (cmd >= 128 && cmd !== START_SYSEX) {
      if (len === 3) {
        this.processMultiByteCommand(this._buf);
        this._buf = [];
      }
    } else if (cmd === START_SYSEX && inputData === END_SYSEX) {
      this.processSysexCommand(this._buf);
      this._buf = [];
    } else if (inputData >= 128 && cmd < 128) {
      this._buf = [];
      if (inputData !== END_SYSEX) {
        this._buf.push(inputData);
      }
    }
  };

  proto.processMultiByteCommand = function (commandData) {
    var command = commandData[0],
      channel;

    if (command < 0xF0) {
      command = command & 0xF0;
      channel = commandData[0] & 0x0F;
    }

    switch (command) {
    case DIGITAL_MESSAGE:
      this.processDigitalMessage(channel, commandData[1], commandData[2]);
      break;
    case REPORT_VERSION:
      this._firmwareVersion = commandData[1] + commandData[2] / 10;
      this.emit(BoardEvent.FIRMWARE_VERSION, {
        version: this._firmwareVersion
      });
      break;
    case ANALOG_MESSAGE:
      this.processAnalogMessage(channel, commandData[1], commandData[2]);
      break;
    }
  };

  proto.processDigitalMessage = function (port, bits0_6, bits7_13) {
    var offset = port * 8,
      lastPin = offset + 8,
      portVal = bits0_6 | (bits7_13 << 7),
      pinVal,
      pin = {};

    if (lastPin >= this._totalPins) {
      lastPin = this._totalPins;
    }

    var j = 0;
    for (var i = offset; i < lastPin; i++) {
      pin = this.getDigitalPin(i);

      if (pin === undefined) {
        return;
      }

      if (pin.type === Pin.DIN) {
        pinVal = (portVal >> j) & 0x01;
        if (pinVal !== pin.value) {
          pin.value = pinVal;
          this.emit(BoardEvent.DIGITAL_DATA, {
            pin: pin
          });
        }
      }
      j++;
    }
  };

  proto.processAnalogMessage = function (channel, bits0_6, bits7_13) {
    var analogPin = this.getAnalogPin(channel);

    if (analogPin === undefined) {
      return;
    }

    analogPin.value = this.getValueFromTwo7bitBytes(bits0_6, bits7_13) / analogPin.analogReadResolution;
    if (analogPin.value !== analogPin.lastValue) {
      if (this._isReady) {
        analogPin._analogReporting = true;
      }
      this.emit(BoardEvent.ANALOG_DATA, {
        pin: analogPin
      });
    }
  };

  proto.processSysexCommand = function (sysexData) {
    sysexData.shift();
    sysexData.pop();

    var command = sysexData[0];
    switch (command) {
    case REPORT_FIRMWARE:
      this.processQueryFirmwareResult(sysexData);
      break;
    case STRING_DATA:
      this.processSysExString(sysexData);
      break;
    case CAPABILITY_RESPONSE:
      this.processCapabilitiesResponse(sysexData);
      break;
    case PIN_STATE_RESPONSE:
      this.processPinStateResponse(sysexData);
      break;
    case ANALOG_MAPPING_RESPONSE:
      this.processAnalogMappingResponse(sysexData);
      break;
    default:
      this.emit(BoardEvent.SYSEX_MESSAGE, {
        message: sysexData
      });
      break;
    }
  };

  proto.processQueryFirmwareResult = function (msg) {
    var data;

    for (var i = 3, len = msg.length; i < len; i += 2) {
      data = msg[i];
      data += msg[i + 1];
      this._firmwareName += String.fromCharCode(data);
    }
    this._firmwareVersion = msg[1] + msg[2] / 10;
    this.emit(BoardEvent.FIRMWARE_NAME, {
      name: this._firmwareName,
      version: this._firmwareVersion
    });
  };

  proto.processSysExString = function (msg) {
    var str = '',
      data,
      len = msg.length;

    for (var i = 1; i < len; i += 2) {
      data = msg[i];
      data += msg[i + 1];
      str += String.fromCharCode(data);
    }
    this.emit(BoardEvent.STRING_MESSAGE, {
      message: str
    });
  };

  proto.processCapabilitiesResponse = function (msg) {
    var pinCapabilities = {},
      byteCounter = 1,
      pinCounter = 0,
      analogPinCounter = 0,
      len = msg.length,
      type,
      pin;

    this._capabilityQueryResponseReceived = true;

    while (byteCounter <= len) {
      if (msg[byteCounter] === 127) {

        this._digitalPinMapping[pinCounter] = pinCounter;
        type = undefined;

        if (pinCapabilities[Pin.DOUT]) {
          type = Pin.DOUT;
        }

        if (pinCapabilities[Pin.AIN]) {
          type = Pin.AIN;
          this._analogPinMapping[analogPinCounter++] = pinCounter;
        }

        pin = new Pin(this, pinCounter, type);
        pin.setCapabilities(pinCapabilities);
        this._ioPins[pinCounter] = pin;

        if (pin._capabilities[Pin.I2C]) {
          this._i2cPins.push(pin.number);
        }

        pinCapabilities = {};
        pinCounter++;
        byteCounter++;
      } else {
        pinCapabilities[msg[byteCounter]] = msg[byteCounter + 1];
        byteCounter += 2;
      }
    }

    this._numPorts = Math.ceil(pinCounter / 8);

    for (var j = 0; j < this._numPorts; j++) {
      this._digitalPort[j] = 0;
    }

    this._totalPins = pinCounter;
    this._totalAnalogPins = analogPinCounter;
    this.queryAnalogMapping();
  };

  proto.processAnalogMappingResponse = function (msg) {
    var len = msg.length;

    for (var i = 1; i < len; i++) {
      if (msg[i] !== 127) {
        this._analogPinMapping[msg[i]] = i - 1;
        this.getPin(i - 1).setAnalogNumber(msg[i]);
      }
    }

    this.startup();
  };

  proto.startup = function () {
    this._isReady = true;
    this.emit(BoardEvent.READY, this);
    this.enableDigitalPins();
  };

  proto.systemReset = function () {
    this.send([SYSEX_RESET]);
  };

  proto.processPinStateResponse = function (msg) {
    if (this._numPinStateRequests <= 0) {
      return;
    }

    var len = msg.length,
      pinNum = msg[1],
      pinType = msg[2],
      pinState,
      pin = this._ioPins[pinNum];

    if (len > 4) {
      pinState = this.getValueFromTwo7bitBytes(msg[3], msg[4]);
    } else if (len > 3) {
      pinState = msg[3];
    }

    if (pin.type !== pinType) {
      pin.setMode(pinType, true);
    }

    pin.state = pinState;

    this._numPinStateRequests--;
    if (this._numPinStateRequests < 0) {
      this._numPinStateRequests = 0;
    }

    this._pinStateEventCenter.emit(pinNum, pin);

    this.emit(BoardEvent.PIN_STATE_RESPONSE, {
      pin: pin
    });
  };

  proto.toDec = function (ch) {
    ch = ch.substring(0, 1);
    var decVal = ch.charCodeAt(0);
    return decVal;
  };

  proto.sendAnalogData = function (pin, value) {
    var pwmResolution = this.getDigitalPin(pin).analogWriteResolution;

    value *= pwmResolution;
    value = (value < 0) ? 0 : value;
    value = (value > pwmResolution) ? pwmResolution : value;

    if (pin > 15 || value > Math.pow(2, 14)) {
      this.sendExtendedAnalogData(pin, value);
    } else {
      this.send([ANALOG_MESSAGE | (pin & 0x0F), value & 0x007F, (value >> 7) & 0x007F]);
    }
  };

  proto.sendExtendedAnalogData = function (pin, value) {
    var analogData = [];

    // If > 16 bits
    if (value > Math.pow(2, 16)) {
      throw new Error('Extended Analog values > 16 bits are not currently supported by StandardFirmata');
    }

    analogData[0] = START_SYSEX;
    analogData[1] = EXTENDED_ANALOG;
    analogData[2] = pin;
    analogData[3] = value & 0x007F;
    analogData[4] = (value >> 7) & 0x007F; // Up to 14 bits

    // If > 14 bits
    if (value >= Math.pow(2, 14)) {
      analogData[5] = (value >> 14) & 0x007F;
    }

    analogData.push(END_SYSEX);
    this.send(analogData);
  };

  proto.sendDigitalData = function (pin, value) {
    var portNum = Math.floor(pin / 8);

    if (value === Pin.HIGH) {
      // Set the bit
      this._digitalPort[portNum] |= (value << (pin % 8));
    } else if (value === Pin.LOW) {
      // Clear the bit
      this._digitalPort[portNum] &= ~(1 << (pin % 8));
    } else {
      // Should not happen...
      throw new Error('Invalid value passed to sendDigital, value must be 0 or 1.');
    }

    this.sendDigitalPort(portNum, this._digitalPort[portNum]);
  };

  proto.sendServoData = function (pin, value) {
    var servoPin = this.getDigitalPin(pin);

    if (servoPin.type === Pin.SERVO && servoPin.lastValue !== value) {
      this.sendAnalogData(pin, value);
    }
  };

  proto.queryCapabilities = function () {
    this.send([START_SYSEX, CAPABILITY_QUERY, END_SYSEX]);
  };

  proto.queryAnalogMapping = function () {
    this.send([START_SYSEX, ANALOG_MAPPING_QUERY, END_SYSEX]);
  };

  proto.getValueFromTwo7bitBytes = function (lsb, msb) {
    return (msb << 7) | lsb;
  };

  proto.getTransport = function () {
    return this._transport;
  };

  proto._setTransport = function (trsp) {
    var klass = trsp;

    if (typeof trsp === 'string') {
      klass = scope.transport[trsp];
    }

    if (klass && (trsp = new klass(this._options))) {
      trsp.on(TransportEvent.OPEN, this._openHandler);
      trsp.on(TransportEvent.MESSAGE, this._messageHandler);
      trsp.on(TransportEvent.ERROR, this._errorHandler);
      trsp.on(TransportEvent.CLOSE, this._closeHandler);
      this._transport = trsp;
    }
  };

  proto.reportVersion = function () {
    this.send(REPORT_VERSION);
  };

  proto.reportFirmware = function () {
    this.send([START_SYSEX, REPORT_FIRMWARE, END_SYSEX]);
  };

  proto.enableDigitalPins = function () {
    for (var i = 0; i < this._numPorts; i++) {
      this.sendDigitalPortReporting(i, Pin.ON);
    }
  };

  proto.disableDigitalPins = function () {
    for (var i = 0; i < this._numPorts; i++) {
      this.sendDigitalPortReporting(i, Pin.OFF);
    }
  };

  proto.sendDigitalPortReporting = function (port, mode) {
    this.send([(REPORT_DIGITAL | port), mode]);
  };

  proto.enableAnalogPin = function (pinNum) {
    this.sendAnalogPinReporting(pinNum, Pin.ON);
    this.getAnalogPin(pinNum)._analogReporting = true;
  };

  proto.disableAnalogPin = function (pinNum) {
    this.sendAnalogPinReporting(pinNum, Pin.OFF);
    this.getAnalogPin(pinNum)._analogReporting = false;
  };

  proto.sendAnalogPinReporting = function (pinNum, mode) {
    this.send([REPORT_ANALOG | pinNum, mode]);
  };

  proto.setDigitalPinMode = function (pinNum, mode, silent) {
    this.getDigitalPin(pinNum).setMode(mode, silent);
  };

  proto.setAnalogPinMode = function (pinNum, mode, silent) {
    this.getAnalogPin(pinNum).setMode(mode, silent);
  };

  proto.setPinMode = function (pinNum, mode) {
    this.send([SET_PIN_MODE, pinNum, mode]);
  };

  proto.enablePullUp = function (pinNum) {
    this.sendDigitalData(pinNum, Pin.HIGH);
  };

  proto.getFirmwareName = function () {
    return this._firmwareName;
  };

  proto.getFirmwareVersion = function () {
    return this._firmwareVersion;
  };

  proto.getPinCapabilities = function () {
    var capabilities = [],
      len,
      pinElements,
      pinCapabilities,
      hasCapabilities;

    var modeNames = {
      0: 'input',
      1: 'output',
      2: 'analog',
      3: 'pwm',
      4: 'servo',
      5: 'shift',
      6: 'i2c',
      7: 'onewire',
      8: 'stepper'
    };

    len = this._ioPins.length;
    for (var i = 0; i < len; i++) {
      pinElements = {};
      pinCapabilities = this._ioPins[i]._capabilities;
      hasCapabilities = false;

      for (var mode in pinCapabilities) {
        if (pinCapabilities.hasOwnProperty(mode)) {
          hasCapabilities = true;
          if (mode >= 0) {
            pinElements[modeNames[mode]] = this._ioPins[i]._capabilities[mode];
          }
        }
      }

      if (!hasCapabilities) {
        capabilities[i] = {
          'not available': '0'
        };
      } else {
        capabilities[i] = pinElements;
      }
    }

    return capabilities;
  };

  proto.queryPinState = function (pins, callback) {
    var self = this,
      promises = [],
      cmds = [],
      done;

    done = self._pinStateEventCenter.once.bind(self._pinStateEventCenter);
    pins = util.isArray(pins) ? pins : [pins];
    pins = pins.map(function (pin) {
      return pin instanceof Pin ? pin : self.getPin(pin)
    });

    pins.forEach(function (pin) {
      promises.push(util.promisify(done, function (pin) {
        this.resolve(pin);
      })(pin.number));
      push.apply(cmds, [START_SYSEX, PIN_STATE_QUERY, pin.number, END_SYSEX]);
      self._numPinStateRequests++;
    });

    self.send(cmds);

    if (typeof callback === 'function') {
      Promise.all(promises).then(function (pins) {
        callback.call(self, pins.length > 1 ? pins : pins[0]);
      });
    } else {
      return pins.length > 1 ? promises : promises[0];
    }
  };

  proto.sendDigitalPort = function (portNumber, portData) {
    this.send([DIGITAL_MESSAGE | (portNumber & 0x0F), portData & 0x7F, portData >> 7]);
  };

  proto.sendString = function (str) {
    var decValues = [];
    for (var i = 0, len = str.length; i < len; i++) {
      decValues.push(this.toDec(str[i]) & 0x007F);
      decValues.push((this.toDec(str[i]) >> 7) & 0x007F);
    }
    this.sendSysex(STRING_DATA, decValues);
  };

  proto.sendSysex = function (command, data) {
    var sysexData = [];
    sysexData[0] = START_SYSEX;
    sysexData[1] = command;
    for (var i = 0, len = data.length; i < len; i++) {
      sysexData.push(data[i]);
    }
    sysexData.push(END_SYSEX);
    this.send(sysexData);
  };

  proto.sendServoAttach = function (pin, minPulse, maxPulse) {
    var servoPin,
      servoData = [];

    minPulse = minPulse || 544; // Default value = 544
    maxPulse = maxPulse || 2400; // Default value = 2400

    servoData[0] = START_SYSEX;
    servoData[1] = SERVO_CONFIG;
    servoData[2] = pin;
    servoData[3] = minPulse % 128;
    servoData[4] = minPulse >> 7;
    servoData[5] = maxPulse % 128;
    servoData[6] = maxPulse >> 7;
    servoData[7] = END_SYSEX;

    this.send(servoData);

    servoPin = this.getDigitalPin(pin);
    servoPin.setMode(Pin.SERVO, true);
  };

  proto.getPin = function (pinNum) {
    return this._ioPins[pinNum];
  };

  proto.getAnalogPin = function (pinNum) {
    return this._ioPins[this._analogPinMapping[pinNum]];
  };

  proto.getDigitalPin = function (pinNum) {
    return this._ioPins[this._digitalPinMapping[pinNum]];
  };

  proto.getPins = function () {
    return this._ioPins;
  };

  proto.analogToDigital = function (analogPinNum) {
    return this.getAnalogPin(analogPinNum).number;
  };

  proto.getPinCount = function () {
    return this._totalPins;
  };

  proto.getAnalogPinCount = function () {
    return this._totalAnalogPins;
  };

  proto.getI2cPins = function () {
    return this._i2cPins;
  };

  proto.reportCapabilities = function () {
    var capabilities = this.getPinCapabilities(),
      len = capabilities.length,
      resolution;

    for (var i = 0; i < len; i++) {
      debug('Pin ' + i + ':');
      for (var mode in capabilities[i]) {
        if (capabilities[i].hasOwnProperty(mode)) {
          resolution = capabilities[i][mode];
          debug('\t' + mode + ' (' + resolution + (resolution > 1 ? ' bits)' : ' bit)'));
        }
      }
    }
  };

  proto.send = function (data) {
    this.isConnected && this._transport.send(data);
  };

  proto.close = function (callback) {
    this.disconnect(callback);
  };

  proto.flush = function () {
    this.isConnected && this._transport.flush();
  };

  proto.disconnect = function (callback) {
    callback = callback || function () {};
    if (this.isConnected) {
      this.emit(BoardEvent.BEFOREDISCONNECT);
    }
    this._isReady = false;
    unattachCleanup(this);
    if (this._transport) {
      if (this._transport.isOpen) {
        this.once(BoardEvent.DISCONNECT, callback);
        this._transport.close();
      } else {
        this._transport.removeAllListeners();
        delete this._transport;
        callback();
      }
    } else {
      callback();
    }
  };

  Board.MIN_SAMPLING_INTERVAL = 20;

  Board.MAX_SAMPLING_INTERVAL = 15000;

  scope.BoardEvent = BoardEvent;

  scope.Board = Board;
  scope.board = scope.board || {};
}));

+(function (factory) {
  if (typeof exports === 'undefined') {
    factory(webduino || {});
  } else {
    module.exports = factory;
  }
}(function (scope) {
  'use strict';

  var util = scope.util,
    TransportEvent = scope.TransportEvent,
    Board = scope.Board,
    proto;

  function WebArduino(options) {
    if (typeof options === 'string') {
      options = {
        device: options
      };
    }
    options = util.extend(getDefaultOptions(options), options);
    options.server = parseServer(options.server);

    Board.call(this, options);
  }

  function getDefaultOptions(opts) {
    return {
      transport: 'mqtt',
      server: WebArduino.DEFAULT_SERVER,
      login: 'admin',
      password: 'password',
      autoReconnect: false,
      multi: false
    };
  }

  function parseServer(url) {
    if (url.indexOf('://') === -1) {
      url = (typeof location !== 'undefined' &&
          location.protocol === 'https:' ? 'wss:' : 'ws:') +
        '//' + url;
    }
    url = util.parseURL(url);
    return url.protocol + '//' + url.host + '/';
  }

  WebArduino.prototype = proto = Object.create(Board.prototype, {
    constructor: {
      value: WebArduino
    }
  });

  proto.reportFirmware = function () {
    var msg = [
      240, 121, 2, 4, 119, 0, 101, 0, 98, 0, 100, 0, 117, 0, 105, 0,
      110, 0, 111, 0, 46, 0, 105, 0, 110, 0, 111, 0, 247
    ];
    mockMessageEvent(this, msg);
  };

  proto.queryCapabilities = function () {
    var msg = [
      240, 108, 127, 127,
      0, 1, 1, 1, 4, 14, 127,
      0, 1, 1, 1, 3, 8, 4, 14, 127,
      0, 1, 1, 1, 4, 14, 127,
      0, 1, 1, 1, 3, 8, 4, 14, 127,
      0, 1, 1, 1, 3, 8, 4, 14, 127,
      0, 1, 1, 1, 4, 14, 127,
      0, 1, 1, 1, 4, 14, 127,
      0, 1, 1, 1, 3, 8, 4, 14, 127,
      0, 1, 1, 1, 3, 8, 4, 14, 127,
      0, 1, 1, 1, 3, 8, 4, 14, 127,
      0, 1, 1, 1, 4, 14, 127,
      0, 1, 1, 1, 4, 14, 127,
      0, 1, 1, 1, 2, 10, 4, 14, 127,
      0, 1, 1, 1, 2, 10, 4, 14, 127,
      0, 1, 1, 1, 2, 10, 4, 14, 127,
      0, 1, 1, 1, 2, 10, 4, 14, 127,
      0, 1, 1, 1, 2, 10, 4, 14, 127,
      0, 1, 1, 1, 2, 10, 4, 14, 127,
      2, 10, 127, 2, 10, 127, 247
    ];
    mockMessageEvent(this, msg);
  };

  proto.queryAnalogMapping = function () {
    var msg = [
      240, 106, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127,
      0, 1, 2, 3, 4, 5, 6, 7, 247
    ];
    mockMessageEvent(this, msg);
  };

  WebArduino.DEFAULT_SERVER = 'wss://ws.webduino.io:443';

  function mockMessageEvent(board, message) {
    board._transport.emit(TransportEvent.MESSAGE, message);
  }

  scope.WebArduino = WebArduino;
}));

+(function (factory) {
  if (typeof exports === 'undefined') {
    factory(webduino || {});
  } else {
    module.exports = factory;
  }
}(function (scope) {
  'use strict';

  var util = scope.util,
    Board = scope.Board,
    BoardEvent = scope.BoardEvent,
    proto;

  function Arduino(options) {
    if (typeof options === 'string') {
      options = {
        transport: 'serial',
        path: options
      };
    }
    options = util.extend(getDefaultOptions(options), options);

    Board.call(this, options);
  }

  function getDefaultOptions(opts) {
    var def = {
      serial: {
        transport: 'serial',
        baudRate: 57600
      },
      bluetooth: {
        transport: 'bluetooth',
        uuid: '1101'
      }
    };

    return def[opts.transport] || {};
  }

  Arduino.prototype = proto = Object.create(Board.prototype, {
    constructor: {
      value: Arduino
    }
  });

  proto.begin = function () {
    this.once(BoardEvent.FIRMWARE_NAME, this._initialVersionResultHandler);
    if (this._options.transport !== 'serial') {
      this.reportFirmware();
    }
  };

  scope.Arduino = Arduino;
}));

var chrome = chrome || {};

chrome._api = (function (window) {

  'use strict';

  var slice = Array.prototype.slice,
    undef = undefined,
    callbackHash = {},
    listenerHash = {},
    apiCalls = 0;

  function proxyRequest(api) {
    return function () {
      var params = slice.call(arguments),
        id = ++apiCalls + '';

      if (typeof params[params.length - 1] === 'function') {
        callbackHash[id] = params.pop();
      }
      invoke(id, api, params);
    };
  }

  function proxyAddListener(api) {
    return function (listener) {
      var id = ++apiCalls + '';

      if (typeof listener === 'function') {
        listenerHash[id] = listener;
        invoke(id, api, []);
      }
    };
  }

  function proxyRemoveListener(api) {
    return function (listener) {
      Object.keys(listenerHash).some(function (id) {
        if (listenerHash[id] === listener) {
          delete listenerHash[id];
          invoke(id, api, []);
          return true;
        }
      });
    };
  }

  function invoke(id, method, params) {
    delete chrome.runtime.lastError;
    window.postMessage({
      jsonrpc: '2.0',
      id: id,
      method: method,
      params: params
    }, window.location.origin);
  }

  window.addEventListener('message', function (event) {
    var msg = event.data;

    if (msg.jsonrpc && !msg.method) {
      if (msg.exception) {
        if (callbackHash[msg.id]) {
          delete callbackHash[msg.id];
        }
        throw new Error(msg.exception);
      } else {
        if (msg.error) {
          chrome.runtime.lastError = {
            message: msg.error
          };
        }
        if (callbackHash[msg.id]) {
          callbackHash[msg.id].apply(undef, msg.result);
          delete callbackHash[msg.id];
        } else if (listenerHash[msg.id]) {
          listenerHash[msg.id].apply(undef, msg.result);
        }
      }
    }
  }, false);

  return {
    proxyRequest: proxyRequest,
    proxyAddListener: proxyAddListener,
    proxyRemoveListener: proxyRemoveListener
  };

}(window));

chrome.runtime = chrome.runtime || {};

chrome.serial = chrome.serial || (function (_api) {

  'use strict';

  var slice = Array.prototype.slice,
    undef = undefined,
    proxyRequest = _api.proxyRequest,
    proxyAddListener = _api.proxyAddListener,
    proxyRemoveListener = _api.proxyRemoveListener,
    proxiedSend = proxyRequest('chrome.serial.send');

  return {
    getDevices: proxyRequest('chrome.serial.getDevices'),

    connect: proxyRequest('chrome.serial.connect'),

    update: proxyRequest('chrome.serial.update'),

    disconnect: proxyRequest('chrome.serial.disconnect'),

    setPaused: proxyRequest('chrome.serial.setPaused'),

    getInfo: proxyRequest('chrome.serial.getInfo'),

    getConnections: proxyRequest('chrome.serial.getConnections'),

    send: function (connectionId, data, callback) {
      proxiedSend.apply(undef, [connectionId, slice.call(new Uint8Array(data)), callback]);
    },

    flush: proxyRequest('chrome.serial.flush'),

    getControlSignals: proxyRequest('chrome.serial.getControlSignals'),

    setControlSignals: proxyRequest('chrome.serial.setControlSignals'),

    setBreak: proxyRequest('chrome.serial.setBreak'),

    clearBreak: proxyRequest('chrome.serial.clearBreak'),

    onReceive: {
      addListener: proxyAddListener('chrome.serial.onReceive.addListener'),
      removeListener: proxyRemoveListener('chrome.serial.onReceive.removeListener')
    },

    onReceiveError: {
      addListener: proxyAddListener('chrome.serial.onReceiveError.addListener'),
      removeListener: proxyRemoveListener('chrome.serial.onReceiveError.removeListener')
    }
  };

}(chrome._api));

+(function (scope) {
  'use strict';

  var push = Array.prototype.push,
    serial = chrome.serial;

  var Transport = scope.Transport,
    TransportEvent = scope.TransportEvent,
    proto;

  function SerialTransport(options) {
    Transport.call(this, options);

    this._options = options;
    this._connectionId = null;
    this._sendTimer = null;
    this._buf = [];

    this._connHandler = onConnect.bind(this);
    this._messageHandler = onMessage.bind(this);
    this._sendOutHandler = sendOut.bind(this);
    this._disconnHandler = onDisconnect.bind(this);
    this._errorHandler = onError.bind(this);

    init(this);
  }

  function init(self) {
    var options = self._options;
    serial.onReceive.addListener(self._messageHandler);
    serial.onReceiveError.addListener(self._errorHandler);
    serial.connect(options.path, {
      bitrate: options.baudRate
    }, self._connHandler);
  }

  function onConnect(connectionInfo) {
    this._connectionId = connectionInfo.connectionId;
    this.emit(TransportEvent.OPEN);
  }

  function onMessage(message) {
    if (message.connectionId === this._connectionId) {
      this.emit(TransportEvent.MESSAGE, message.data);
    }
  }

  function onDisconnect(result) {
    serial.onReceive.removeListener(this._messageHandler);
    serial.onReceiveError.removeListener(this._errorHandler);
    delete this._connectionId;
    this.emit(TransportEvent.CLOSE);
  }

  function onError(info) {
    this.emit(TransportEvent.ERROR, new Error(JSON.stringify(info)));
  }

  function sendOut() {
    var payload = new Uint8Array(this._buf).buffer;
    this.isOpen && serial.send(this._connectionId, payload);
    clearBuf(this);
  }

  function clearBuf(self) {
    self._buf = [];
    clearImmediate(self._sendTimer);
    self._sendTimer = null;
  }

  SerialTransport.prototype = proto = Object.create(Transport.prototype, {

    constructor: {
      value: SerialTransport
    },

    isOpen: {
      get: function () {
        return !!this._connectionId;
      }
    }

  });

  proto.send = function (payload) {
    push.apply(this._buf, payload);
    if (!this._sendTimer) {
      this._sendTimer = setImmediate(this._sendOutHandler);
    }
  };

  proto.close = function () {
    if (this._connectionId) {
      serial.disconnect(this._connectionId, this._disconnHandler);
    }
  };

  scope.transport.serial = SerialTransport;
}(webduino));

chrome.bluetooth = chrome.bluetooth || (function (_api) {

  'use strict';

  var proxyRequest = _api.proxyRequest;

  return {
    getAdapterState: proxyRequest('chrome.bluetooth.getAdapterState'),
    getDevice: proxyRequest('chrome.bluetooth.getDevice'),
    getDevices: proxyRequest('chrome.bluetooth.getDevices'),
    startDiscovery: proxyRequest('chrome.bluetooth.startDiscovery'),
    stopDiscovery: proxyRequest('chrome.bluetooth.stopDiscovery')
  };

}(chrome._api));

chrome.bluetoothSocket = chrome.bluetoothSocket || (function (_api) {

  'use strict';

  var slice = Array.prototype.slice,
    undef = undefined,
    proxyRequest = _api.proxyRequest,
    proxyAddListener = _api.proxyAddListener,
    proxyRemoveListener = _api.proxyRemoveListener,
    proxiedSend = proxyRequest('chrome.bluetoothSocket.send');

  return {
    create: proxyRequest('chrome.bluetoothSocket.create'),

    connect: proxyRequest('chrome.bluetoothSocket.connect'),

    update: proxyRequest('chrome.bluetoothSocket.update'),

    disconnect: proxyRequest('chrome.bluetoothSocket.disconnect'),

    close: proxyRequest('chrome.bluetoothSocket.close'),

    setPaused: proxyRequest('chrome.bluetoothSocket.setPaused'),

    getInfo: proxyRequest('chrome.bluetoothSocket.getInfo'),

    getSockets: proxyRequest('chrome.bluetoothSocket.getSockets'),

    send: function (socketId, data, callback) {
      proxiedSend.apply(undef, [socketId, slice.call(new Uint8Array(data)), callback]);
    },

    listenUsingRfcomm: proxyRequest('chrome.bluetoothSocket.listenUsingRfcomm'),

    listenUsingL2cap: proxyRequest('chrome.bluetoothSocket.listenUsingL2cap'),

    onAccept: {
      addListener: proxyAddListener('chrome.bluetoothSocket.onAccept.addListener'),
      removeListener: proxyRemoveListener('chrome.bluetoothSocket.onAccept.removeListener')
    },

    onAcceptError: {
      addListener: proxyAddListener('chrome.bluetoothSocket.onAcceptError.addListener'),
      removeListener: proxyRemoveListener('chrome.bluetoothSocket.onAcceptError.removeListener')
    },

    onReceive: {
      addListener: proxyAddListener('chrome.bluetoothSocket.onReceive.addListener'),
      removeListener: proxyRemoveListener('chrome.bluetoothSocket.onReceive.removeListener')
    },

    onReceiveError: {
      addListener: proxyAddListener('chrome.bluetoothSocket.onReceiveError.addListener'),
      removeListener: proxyRemoveListener('chrome.bluetoothSocket.onReceiveError.removeListener')
    }
  };

}(chrome._api));

+(function (scope) {
  'use strict';

  var push = Array.prototype.push,
    bluetooth = chrome.bluetoothSocket;

  var Transport = scope.Transport,
    TransportEvent = scope.TransportEvent,
    retry = 0,
    proto;

  function BluetoothTransport(options) {
    Transport.call(this, options);

    this._options = options;
    this._socketId = null;
    this._sendTimer = null;
    this._buf = [];

    this._messageHandler = onMessage.bind(this);
    this._sendOutHandler = sendOut.bind(this);
    this._disconnHandler = onDisconnect.bind(this);
    this._errorHandler = onError.bind(this);

    init(this);
  }

  function init(self) {
    var options = self._options;

    getSocketId(options.address, function (err, socketId) {
      if (err || !socketId) {
        self.emit(TransportEvent.ERROR, new Error(err));
      } else {
        bluetooth.onReceive.addListener(self._messageHandler);
        bluetooth.onReceiveError.addListener(self._errorHandler);
        bluetooth.connect(socketId, options.address, options.uuid, function () {
          if (chrome.runtime.lastError) {
            console.log(chrome.runtime.lastError.message);
            bluetooth.close(socketId, function () {
              bluetooth.onReceive.removeListener(self._messageHandler);
              bluetooth.onReceiveError.removeListener(self._errorHandler);
              if (++retry <= BluetoothTransport.MAX_RETRIES) {
                init(self);
              } else {
                self.emit(TransportEvent.ERROR, new Error('too many retries'));
              }
            });
          } else {
            retry = 0;
            self._socketId = socketId;
            self.emit(TransportEvent.OPEN);
          }
        });
      }
    });
  }

  function getSocketId(address, callback) {
    var socketId;

    chrome.bluetooth.getAdapterState(function (state) {
      if (state.available) {
        chrome.bluetooth.getDevice(address, function (dev) {
          if (dev) {
            bluetooth.getSockets(function (scks) {
              scks.some(function (sck) {
                if (!sck.connected) {
                  socketId = sck.socketId;
                  return true;
                }
              });
              if (typeof socketId === 'undefined') {
                bluetooth.create(function (createInfo) {
                  callback(null, createInfo.socketId);
                });
              } else {
                callback(null, socketId);
              }
            });
          } else {
            callback('No such device "' + address + '"');
          }
        });
      } else {
        callback('Bluetooth adapter not available');
      }
    });
  }

  function onMessage(message) {
    if (message.socketId === this._socketId) {
      this.emit(TransportEvent.MESSAGE, message.data);
    }
  }

  function onDisconnect() {
    bluetooth.onReceive.removeListener(this._messageHandler);
    bluetooth.onReceiveError.removeListener(this._errorHandler);
    delete this._socketId;
    this.emit(TransportEvent.CLOSE);
  }

  function onError(info) {
    this.emit(TransportEvent.ERROR, new Error(JSON.stringify(info)));
  }

  function sendOut() {
    var payload = new Uint8Array(this._buf).buffer;
    this.isOpen && bluetooth.send(this._socketId, payload);
    clearBuf(this);
  }

  function clearBuf(self) {
    self._buf = [];
    clearImmediate(self._sendTimer);
    self._sendTimer = null;
  }

  BluetoothTransport.prototype = proto = Object.create(Transport.prototype, {

    constructor: {
      value: BluetoothTransport
    },

    isOpen: {
      get: function () {
        return !!this._socketId;
      }
    }

  });

  proto.send = function (payload) {
    push.apply(this._buf, payload);
    if (!this._sendTimer) {
      this._sendTimer = setImmediate(this._sendOutHandler);
    }
  };

  proto.close = function () {
    if (this._socketId) {
      bluetooth.close(this._socketId, this._disconnHandler);
    }
  };

  BluetoothTransport.MAX_RETRIES = 10;

  scope.transport.bluetooth = BluetoothTransport;
}(webduino));

+(function (factory) {
  if (typeof exports === 'undefined') {
    factory(webduino || {});
  } else {
    module.exports = factory;
  }
}(function (scope) {
  'use strict';

  var util = scope.util,
    TransportEvent = scope.TransportEvent,
    Board = scope.Board,
    proto;

  function Smart(options) {
    if (typeof options === 'string') {
      options = {
        url: options
      };
    }
    options = util.extend(getDefaultOptions(options), options);
    options.server = parseServer(options.server);

    Board.call(this, options);
  }

  function getDefaultOptions(opts) {
    return {
      transport: 'websocket',
      server: Smart.DEFAULT_SERVER,
      login: 'admin',
      password: 'password',
      autoReconnect: false,
      multi: false
    };
  }

  function parseServer(url) {
    if (url.indexOf('://') === -1) {
      url = (typeof location !== 'undefined' &&
          location.protocol === 'https:' ? 'wss:' : 'ws:') +
        '//' + url;
    }
    url = util.parseURL(url);
    return url.protocol + '//' + url.host + '/';
  }

  Smart.prototype = proto = Object.create(Board.prototype, {
    constructor: {
      value: Smart
    }
  });

  Smart.DEFAULT_SERVER = 'wss://ws.webduino.io:443';

  scope.board.Smart = Smart;
}));

+(function (factory) {
  if (typeof exports === 'undefined') {
    factory(webduino || {});
  } else {
    module.exports = factory;
  }
}(function (scope) {
  'use strict';

  var self;
  var proto;
  var sendLength = 50;
  var sendArray = [];
  var sending = false;
  var sendAck = '';
  var sendCallback;
  var Module = scope.Module;
  var _callback;
  var _dataString;

  function toArray(str) {
    var data = [];
    for (var i = 0; i < str.length; i++) {
      data.push(str.charCodeAt(i));
    }
    return data;
  }


  function DataTransfer(board) {
    Module.call(this);
    this._board = board;
    self = this;
    //board.send([0xF0, 0x04, 0x20, dataType /*init*/ , 0xF7]);
    board.on(webduino.BoardEvent.SYSEX_MESSAGE,
      function (event) {
        var data = event.message;
        sending = false;
        if (data[0] == 0x20) {
          switch (data[1] /*dataType*/ ) {
            case 0: //String
              var str = "";
              for (var i = 2; i < data.length; i++) {
                str += String.fromCharCode(data[i]);
              }
              _dataString = str;
              _callback(0, str);
              break;
          }
        }
      });
    startQueue(board);
  }

  DataTransfer.prototype = proto = Object.create(Module.prototype, {
    constructor: {
      value: DataTransfer
    }
  });

  proto.sendString = function (msg, callback) {
    var cmdArray = [0xF0, 0x04, 0x20, 0x0];
    cmdArray = cmdArray.concat(toArray(msg));
    cmdArray.push(0xF7);
    this._board.send(cmdArray);
    if (callback !== undefined) {
      _callback = callback;
    }
  }

  proto.onMessage = function (callback) {
    if (callback !== undefined) {
      _callback = callback;
    }
  }

  proto.getDataString = function () {
    return _dataString;
  }

  function startQueue(board) {
    setInterval(function () {
      if (sending || sendArray.length == 0) {
        return;
      }
      sending = true;
      var sendObj = sendArray.shift();
      sendAck = sendObj.ack;
      if (sendAck > 0) {
        board.send(sendObj.obj);
      } else {
        sending = false;
        sendCallback();
      }
    }, 0);
  }

  scope.module.DataTransfer = DataTransfer;
}));
+(function (factory) {
  if (typeof exports === 'undefined') {
    factory(webduino || {});
  } else {
    module.exports = factory;
  }
}(function (scope) {
  'use strict';

  var Module = scope.Module,
    BoardEvent = scope.BoardEvent;
  var self;
  var proto;
  var sendLen = 32;
  var lastSendIR = false;
  var debugFlag = false;

  function log(obj) {
    if (debugFlag) {
      console.log(obj);
    }
  }

  function IRRAW(board, pinMapping) {
    Module.call(this);
    this._board = board;
    this.pinSendIR = this.pinRecvIR = -1;
    self = this;
    if (typeof pinMapping === 'object') {
      if (pinMapping['send']) {
        this.pinSendIR = pinMapping['send'];
      }
      if (pinMapping['recv']) {
        this.pinRecvIR = pinMapping['recv'];
      }
    }
    onMessage();
  }

  function onMessage() {
    self._board.on(webduino.BoardEvent.SYSEX_MESSAGE, function (event) {
      var m = event.message;
      //send IR data to Board
      if (m[0] == 0x04 && m[1] == 0x09 && m[2] == 0x0B) {
        log("send IR data to Board callback");
        if (lastSendIR) {
          //store OK
          lastSendIR = false;
          log("send pin:" + self.pinSendIR);
          self._board.send([0xf0, 0x04, 0x09, 0x0C, self.pinSendIR, 0xF7]);
        }
      }
      //trigger IR send
      else if (m[0] == 0x04 && m[1] == 0x09 && m[2] == 0x0C) {
        log("trigger IR send callback...");
        self.irSendCallback();
      }
      //record IR data
      else if (m[0] == 0x04 && m[1] == 0x09 && m[2] == 0x0D) {
        log("record IR callback...");
        var strInfo = '';
        for (var i = 3; i < m.length; i++) {
          strInfo += String.fromCharCode(m[i]);
        }
        self.irData = strInfo.substring(4);
        self.irRecvCallback(self.irData);
      } else {
        log(event);
      }
    });
  }


  function send(startPos, data) {
    var CMD = [0xf0, 0x04, 0x09, 0x0A];
    var raw = [];
    raw = raw.concat(CMD);
    var n = '0000' + startPos.toString(16);
    n = n.substring(n.length - 4);
    for (var i = 0; i < 4; i++) {
      raw.push(n.charCodeAt(i));
    }
    raw.push(0xf7);
    // send Data //  
    CMD = [0xf0, 0x04, 0x09, 0x0B];
    raw = raw.concat(CMD);
    for (i = 0; i < data.length; i++) {
      raw.push(data.charCodeAt(i));
    }
    raw.push(0xf7);
    self._board.send(raw);
  }

  function sendIRCmd(cmd, len) {
    for (var i = 0; i < cmd.length; i = i + len) {
      var data = cmd.substring(i, i + len);
      send(i / 8, data);
    }
    lastSendIR = true;
  }

  IRRAW.prototype = proto = Object.create(Module.prototype, {
    constructor: {
      value: IRRAW
    }
  });

  proto.recv = function (callback) {
    self.irRecvCallback = callback;
    if (self.pinRecvIR > 0) {
      self._board.send([0xF0, 0x04, 0x09, 0x0D, self.pinRecvIR, 0xF7]);
      log("wait recv...");
    }
  };

  proto.send = function (data, callback) {
    if (self.pinSendIR > 0) {
      sendIRCmd(data, sendLen);
      self.irSendCallback = callback;
    }
  }

  proto.debug = function (val) {
    if (typeof val == 'boolean') {
      self.isDebug = val;
    }
  }

  proto.sendPin = function (pin) {
    this.pinSendIR = pin;
  }
  proto.recvPin = function (pin) {
    this.pinRecvIR = pin;
  }

  scope.module.IRRAW = IRRAW;
}));
+(function (factory) {
  if (typeof exports === 'undefined') {
    factory(webduino || {});
  } else {
    module.exports = factory;
  }
}(function (scope) {
  'use strict';

  var self;
  var proto;
  var sendLength = 50;
  var sendArray = [];
  var sending = false;
  var sendAck = '';
  var sendCallback;
  var Module = scope.Module;
  var sendAndAckCount = 0;
  var waitAckAndSend = [];
  var _play;

  function DFPlayer(board, RX, TX) {
    Module.call(this);
    this._board = board;
    this._rx = RX;
    this._tx = TX;
    self = this;
    board.on(webduino.BoardEvent.SYSEX_MESSAGE,
      function (event) {
        sendAndAckCount--;
        var m = event.message;
        var resp = m[2];
        sending = false;
        if (waitAckAndSend.length > 0) {
          var cmd = waitAckAndSend.shift();
          self._board.send(cmd);
        }
      });
    startQueue(board);
  }

  DFPlayer.prototype = proto = Object.create(Module.prototype, {
    constructor: {
      value: DFPlayer
    },
    play: {
      get: function () {
        return _play;
      },
      set: function (val) {
        _play = val;
      }
    }
  });

  proto.init = function () {
    var cmd = [0xF0, 0x04, 0x19, 0x0 /*init*/ , this._rx, this._tx, 0xF7];
    sendAndAckCount++;
    this._board.send(cmd);
  }

  proto.play = function (num) {
    var cmd = [0xF0, 0x04, 0x19, 0x01, num, 0xF7];
    sendAndAckCount++;
    waitAckAndSend.push(cmd);
  }

  proto.start = function () {
    sendAndAckCount++;
    waitAckAndSend.push([0xF0, 0x04, 0x19, 0x02 /*Start*/ , 0xF7]);
  }

  proto.stop = function () {
    sendAndAckCount++;
    waitAckAndSend.push([0xF0, 0x04, 0x19, 0x03 /*Stop*/ , 0xF7]);
  }

  proto.pause = function () {
    sendAndAckCount++;
    waitAckAndSend.push([0xF0, 0x04, 0x19, 0x04 /*Pause*/ , 0xF7]);
  }

  proto.volume = function (volume) {
    sendAndAckCount++;
    waitAckAndSend.push([0xF0, 0x04, 0x19, 0x05, volume, 0xF7]);
  }

  proto.previous = function () {
    sendAndAckCount++;
    waitAckAndSend.push([0xF0, 0x04, 0x19, 0x06 /*Previous*/ , 0xF7]);
  }

  proto.next = function () {
    sendAndAckCount++;
    waitAckAndSend.push([0xF0, 0x04, 0x19, 0x07 /*Next*/ , 0xF7]);
  }

  proto.loop = function (num) {
    sendAndAckCount++;
    waitAckAndSend.push([0xF0, 0x04, 0x19, 0x08, num, 0xF7]);
  }

  function startQueue(board) {
    setInterval(function () {
      if (sendAndAckCount == waitAckAndSend.length && waitAckAndSend.length > 0) {
        var cmd = waitAckAndSend.shift();
        board.send(cmd);
      }
      if (sending || sendArray.length == 0) {
        return;
      }
      sending = true;
      var sendObj = sendArray.shift();
      sendAck = sendObj.ack;
      if (sendAck > 0) {
        board.send(sendObj.obj);
      } else {
        sending = false;
        sendCallback();
      }
    }, 0);
  }

  scope.module.DFPlayer = DFPlayer;
}));
+(function (factory) {
  if (typeof exports === 'undefined') {
    factory(webduino || {});
  } else {
    module.exports = factory;
  }
}(function (scope) {
  'use strict';

  var self;
  var proto;
  var sendLength = 50;
  var sendArray = [];
  var sending = false;
  var sendAck = '';
  var sendCallback;
  var Module = scope.Module;
  var _backlight;

  function LCD1602(board) {
    Module.call(this);
    this._board = board;
    self = this;
    board.send([0xF0, 0x04, 0x18, 0x0 /*init*/ , 0xF7]);
    board.on(webduino.BoardEvent.SYSEX_MESSAGE,
      function (event) {
        var m = event.message;
        sending = false;
      });
    startQueue(board);
  }

  LCD1602.prototype = proto = Object.create(Module.prototype, {
    constructor: {
      value: LCD1602
    },
    backlight: {
      get: function () {
        return _backlight;
      },
      set: function (val) {
        _backlight = val;
      }
    }
  });

  proto.print = function (txt) {
    var cmd = [0xF0, 0x04, 0x18, 0x02];
    cmd = cmd.concat(toASCII(txt));
    cmd.push(0xF7);
    this._board.send(cmd);
  }

  proto.cursor = function (col, row) {
    this._board.send([0xF0, 0x04, 0x18, 0x01, col, row, 0xF7]);
  }

  proto.clear = function () {
    this._board.send([0xF0, 0x04, 0x18, 0x03, 0xF7]);
  }

  function toASCII(str) {
    var data = [];
    for (var i = 0; i < str.length; i++) {
      var charCode = str.charCodeAt(i).toString(16);
      if (charCode.length == 1) {
        charCode = '0' + charCode;
      }
      var highChar = charCode.charAt(0);
      var lowChar = charCode.charAt(1);
      data.push(highChar.charCodeAt(0));
      data.push(lowChar.charCodeAt(0));
    }
    return data;
  }

  function startQueue(board) {
    setInterval(function () {
      if (sending || sendArray.length == 0) {
        return;
      }
      sending = true;
      var sendObj = sendArray.shift();
      sendAck = sendObj.ack;
      if (sendAck > 0) {
        board.send(sendObj.obj);
      } else {
        sending = false;
        sendCallback();
      }
    }, 0);
  }

  scope.module.LCD1602 = LCD1602;
}));
+(function (factory) {
  if (typeof exports === 'undefined') {
    factory(webduino || {});
  } else {
    module.exports = factory;
  }
}(function (scope) {
  'use strict';

  var Pin = scope.Pin,
    Module = scope.Module,
    BoardEvent = scope.BoardEvent,
    proto;

  function Led(board, pin, driveMode) {
    Module.call(this);

    this._board = board;
    this._pin = pin;
    this._driveMode = driveMode || Led.SOURCE_DRIVE;
    this._supportsPWM = undefined;
    this._blinkTimer = null;

    this._board.on(BoardEvent.BEFOREDISCONNECT, this._clearBlinkTimer.bind(this));
    this._board.on(BoardEvent.ERROR, this._clearBlinkTimer.bind(this));

    if (this._driveMode === Led.SOURCE_DRIVE) {
      this._onValue = 1;
      this._offValue = 0;
    } else if (this._driveMode === Led.SYNC_DRIVE) {
      this._onValue = 0;
      this._offValue = 1;
    } else {
      throw new Error('driveMode should be Led.SOURCE_DRIVE or Led.SYNC_DRIVE');
    }

    if (pin.capabilities[Pin.PWM]) {
      board.setDigitalPinMode(pin.number, Pin.PWM);
      this._supportsPWM = true;
    } else {
      board.setDigitalPinMode(pin.number, Pin.DOUT);
      this._supportsPWM = false;
    }
  }

  function checkPinState(self, pin, state, callback) {
    self._board.queryPinState(pin, function (pin) {
      if (pin.state === state) {
        callback.call(self);
      }
    });
  }

  Led.prototype = proto = Object.create(Module.prototype, {

    constructor: {
      value: Led
    },

    intensity: {
      get: function () {
        return this._pin.value;
      },
      set: function (val) {
        if (!this._supportsPWM) {
          if (val < 0.5) {
            val = 0;
          } else {
            val = 1;
          }
        }

        if (this._driveMode === Led.SOURCE_DRIVE) {
          this._pin.value = val;
        } else if (this._driveMode === Led.SYNC_DRIVE) {
          this._pin.value = 1 - val;
        }
      }
    }

  });

  /**
   * Set led to on.
   * @param {Function} [callback] - Led state changed callback.
   */
  proto.on = function (callback) {
    this._clearBlinkTimer();
    this._pin.value = this._onValue;
    if (typeof callback === 'function') {
      checkPinState(this, this._pin, this._pin.value, callback);
    }
  };

  /**
   * Set led to off.
   * @param {Function} [callback] - Led state changed callback.
   */
  proto.off = function (callback) {
    this._clearBlinkTimer();
    this._pin.value = this._offValue;
    if (typeof callback === 'function') {
      checkPinState(this, this._pin, this._pin.value, callback);
    }
  };

  /**
   * Toggle led between on/off.
   * @param {Function} [callback] - Led state changed callback.
   */
  proto.toggle = function (callback) {
    if (this._blinkTimer) {
      this.off();
    } else {
      this._pin.value = 1 - this._pin.value;
    }
    if (typeof callback === 'function') {
      checkPinState(this, this._pin, this._pin.value, callback);
    }
  };

  /**
   * Set led blinking. Both msec and callback are optional
   * and can be passed as the only one parameter.
   * @param {number} [msec=1000] - Led blinking interval.
   * @param {Function} [callback] - Led state changed callback.
   */
  proto.blink = function (msec, callback) {
    if (arguments.length === 1 && typeof arguments[0] === 'function') {
      callback = arguments[0];
    }
    msec = parseInt(msec);
    msec = isNaN(msec) || msec <= 0 ? 1000 : msec;

    this._clearBlinkTimer();
    this._blinkTimer = this._blink(msec, callback);
  };

  proto._blink = function (msec, callback) {
    var self = this;
    return setTimeout(function () {
      self._pin.value = 1 - self._pin.value;
      if (typeof callback === 'function') {
        checkPinState(self, self._pin, self._pin.value, callback);
      }
      self._blinkTimer = self._blink(msec, callback);
    }, msec);
  };

  proto._clearBlinkTimer = function () {
    if (this._blinkTimer) {
      clearTimeout(this._blinkTimer);
      this._blinkTimer = null;
    }
  };

  Led.SOURCE_DRIVE = 0;
  Led.SYNC_DRIVE = 1;

  scope.module.Led = Led;
}));

+(function (factory) {
  if (typeof exports === 'undefined') {
    factory(webduino || {});
  } else {
    module.exports = factory;
  }
}(function (scope) {
  'use strict';

  var Led = scope.module.Led,
    Module = scope.Module,
    proto;

  function RGBLed(board, redLedPin, greenLedPin, blueLedPin, driveMode) {
    Module.call(this);

    if (driveMode === undefined) {
      driveMode = RGBLed.COMMON_ANODE;
    }

    this._board = board;
    this._redLed = new Led(board, redLedPin, driveMode);
    this._greenLed = new Led(board, greenLedPin, driveMode);
    this._blueLed = new Led(board, blueLedPin, driveMode);

    this.setColor(0, 0, 0);
  }

  function hexToR(h) {
    return parseInt(h.substring(0, 2), 16)
  }

  function hexToG(h) {
    return parseInt(h.substring(2, 4), 16)
  }

  function hexToB(h) {
    return parseInt(h.substring(4, 6), 16)
  }

  function cutHex(h) {
    return (h.charAt(0) == "#") ? h.substring(1, 7) : h
  }

  RGBLed.prototype = proto = Object.create(Module.prototype, {
    constructor: {
      value: RGBLed
    }
  });

  proto.setColor = function (red, green, blue, callback) {
    if (typeof green === 'undefined' || typeof green === 'function') {
      var color = cutHex(red);
      callback = green;
      red = hexToR(color);
      green = hexToG(color);
      blue = hexToB(color);
    }

    red = red / 255;
    green = green / 255;
    blue = blue / 255;

    this._redLed.intensity = red;
    this._greenLed.intensity = green;
    this._blueLed.intensity = blue;

    if (typeof callback === 'function') {
      var self = this,
        redPin = this._redLed._pin,
        greenPin = this._greenLed._pin,
        bluePin = this._blueLed._pin;

      this._board.queryPinState([redPin, greenPin, bluePin], function (pins) {
        if (pins[0].state === redPin.value &&
          pins[1].state === greenPin.value &&
          pins[2].state === bluePin.value) {
          callback.call(self);
        }
      });
    }
  };

  RGBLed.COMMON_ANODE = Led.SYNC_DRIVE;
  RGBLed.COMMON_CATHODE = Led.SOURCE_DRIVE;

  scope.module.RGBLed = RGBLed;
}));

+(function (factory) {
  if (typeof exports === 'undefined') {
    factory(webduino || {});
  } else {
    module.exports = factory;
  }
}(function (scope) {
  'use strict';

  var PinEvent = scope.PinEvent,
    Pin = scope.Pin,
    Module = scope.Module;

  var ButtonEvent = {
    PRESS: "pressed",
    RELEASE: "released",
    LONG_PRESS: "longPress",
    SUSTAINED_PRESS: "sustainedPress"
  };

  function Button(board, pin, buttonMode, sustainedPressInterval) {
    Module.call(this);

    this._board = board;
    this._pin = pin;
    this._repeatCount = 0;
    this._timer = null;
    this._timeout = null;

    this._buttonMode = buttonMode || Button.PULL_DOWN;
    this._sustainedPressInterval = sustainedPressInterval || 1000;
    this._debounceInterval = 20;
    this._pressHandler = onPress.bind(this);
    this._releaseHandler = onRelease.bind(this);
    this._sustainedPressHandler = onSustainedPress.bind(this);

    board.setDigitalPinMode(pin.number, Pin.DIN);

    if (this._buttonMode === Button.INTERNAL_PULL_UP) {
      board.enablePullUp(pin.number);
      this._pin.value = Pin.HIGH;
    } else if (this._buttonMode === Button.PULL_UP) {
      this._pin.value = Pin.HIGH;
    }

    this._pin.on(PinEvent.CHANGE, onPinChange.bind(this));
  }

  function onPinChange(pin) {
    var btnVal = pin.value;
    var stateHandler;

    if (this._buttonMode === Button.PULL_DOWN) {
      if (btnVal === 1) {
        stateHandler = this._pressHandler;
      } else {
        stateHandler = this._releaseHandler;
      }
    } else if (this._buttonMode === Button.PULL_UP || this._buttonMode === Button.INTERNAL_PULL_UP) {
      if (btnVal === 1) {
        stateHandler = this._releaseHandler;
      } else {
        stateHandler = this._pressHandler;
      }
    }

    if (this._timeout) {
      clearTimeout(this._timeout);
    }
    this._timeout = setTimeout(stateHandler, this._debounceInterval);
  }

  function onPress() {
    this.emit(ButtonEvent.PRESS);
    if (this._timer) {
      clearInterval(this._timer);
      delete this._timer;
    }
    this._timer = setInterval(this._sustainedPressHandler, this._sustainedPressInterval);
  }

  function onRelease() {
    this.emit(ButtonEvent.RELEASE);
    if (this._timer) {
      clearInterval(this._timer);
      delete this._timer;
    }
    this._repeatCount = 0;
  }

  function onSustainedPress() {
    if (this._repeatCount > 0) {
      this.emit(ButtonEvent.SUSTAINED_PRESS);
    } else {
      this.emit(ButtonEvent.LONG_PRESS);
    }
    this._repeatCount++;
  }

  Button.prototype = Object.create(Module.prototype, {

    constructor: {
      value: Button
    },

    buttonMode: {
      get: function () {
        return this._buttonMode;
      }
    },

    sustainedPressInterval: {
      get: function () {
        return this._sustainedPressInterval;
      },
      set: function (intervalTime) {
        this._sustainedPressInterval = intervalTime;
      }
    }

  });

  Button.PULL_DOWN = 0;
  Button.PULL_UP = 1;
  Button.INTERNAL_PULL_UP = 2;

  scope.module.ButtonEvent = ButtonEvent;
  scope.module.Button = Button;
}));

+(function (factory) {
  if (typeof exports === 'undefined') {
    factory(webduino || {});
  } else {
    module.exports = factory;
  }
}(function (scope) {
  'use strict';

  var Module = scope.Module,
    BoardEvent = scope.BoardEvent,
    proto;

  var ULTRASONIC_MESSAGE = 0x01,
    MIN_PING_INTERVAL = 20,
    MIN_RESPONSE_TIME = 30,
    RETRY_INTERVAL = 5000;

  var UltrasonicEvent = {
    PING: 'ping',
    PING_ERROR: 'pingError'
  };

  function Ultrasonic(board, trigger, echo) {
    Module.call(this);

    this._type = 'HC-SR04';
    this._board = board;
    this._trigger = trigger;
    this._echo = echo;
    this._distance = null;
    this._lastRecv = null;
    this._pingTimer = null;
    this._pingCallback = function () {};

    this._board.on(BoardEvent.BEFOREDISCONNECT, this.stopPing.bind(this));
    this._messageHandler = onMessage.bind(this);
    this._board.on(BoardEvent.ERROR, this.stopPing.bind(this));
  }

  function onMessage(event) {
    var message = event.message;

    if (message[0] !== ULTRASONIC_MESSAGE) {
      return;
    } else {
      processUltrasonicData(this, message);
    }
  }

  function processUltrasonicData(self, data) {
    var str = '',
      i = 3,
      d1, d2;

    if (data[1] === self._trigger.number && data[2] === self._echo.number) {

      while (i < data.length) {
        d1 = data[i];
        d2 = data[i + 1];
        str += (d1 - 48);
        d2 && (str += (d2 - 48));
        i += 2;
      }

      self._lastRecv = Date.now();
      self.emit(UltrasonicEvent.PING, parseInt(str));
    }
  }

  Ultrasonic.prototype = proto = Object.create(Module.prototype, {
    constructor: {
      value: Ultrasonic
    },

    distance: {
      get: function () {
        return this._distance;
      }
    }
  });

  proto.ping = function (callback, interval) {
    var self = this,
      timer;

    self.stopPing();

    if (typeof callback === 'function') {
      self._pingCallback = function (distance) {
        self._distance = distance;
        callback(distance);
      };
      self._board.on(BoardEvent.SYSEX_MESSAGE, self._messageHandler);
      self.on(UltrasonicEvent.PING, self._pingCallback);

      timer = function () {
        self._board.sendSysex(ULTRASONIC_MESSAGE, [self._trigger.number, self._echo.number]);
        if (interval) {
          interval = Math.max(interval, MIN_PING_INTERVAL);
          if (self._lastRecv === null || Date.now() - self._lastRecv < 5 * interval) {
            self._pingTimer = setTimeout(timer, interval);
          } else {
            self.stopPing();
            setTimeout(function () {
              self.ping(callback, interval);
            }, RETRY_INTERVAL);
          }
        }
      };

      timer();
    } else {
      return new Promise(function (resolve, reject) {
        self.ping(function (cm) {
          setTimeout(function () {
            resolve(cm);
          }, MIN_RESPONSE_TIME);
        });
      });
    }
  };

  proto.stopPing = function () {
    this.removeListener(UltrasonicEvent.PING, this._pingCallback);
    this._board.removeListener(BoardEvent.SYSEX_MESSAGE, this._messageHandler);
    this._lastRecv = null;

    if (this._pingTimer) {
      clearTimeout(this._pingTimer);
      delete this._pingTimer;
    }
  };

  scope.module.UltrasonicEvent = UltrasonicEvent;
  scope.module.Ultrasonic = Ultrasonic;
}));

+(function (factory) {
  if (typeof exports === 'undefined') {
    factory(webduino || {});
  } else {
    module.exports = factory;
  }
}(function (scope) {
  'use strict';

  var Pin = scope.Pin,
    Module = scope.Module;

  function Servo(board, pin, minAngle, maxAngle) {
    Module.call(this);

    this._type = 'SG90';
    this._board = board;
    this._pin = pin;
    this._angle = undefined;
    this._minAngle = minAngle || 0;
    this._maxAngle = maxAngle || 180;

    board.sendServoAttach(pin.number);
    board.setDigitalPinMode(pin.number, Pin.SERVO);
  }

  Servo.prototype = Object.create(Module.prototype, {

    constructor: {
      value: Servo
    },

    angle: {
      get: function () {
        if (this._pin._type === Pin.SERVO) {
          return this._angle;
        }
      },
      set: function (val) {
        if (this._pin._type === Pin.SERVO) {
          this._angle = val;
          this._pin.value = Math.max(0, Math.min(1, (this._angle - this._minAngle) /
            (this._maxAngle - this._minAngle) * Servo.COEF_TO_0_180));

        }
      }
    }

  });

  Servo.COEF_TO_0_180 = 180 / 255;

  scope.module.Servo = Servo;
}));

+(function (factory) {
  if (typeof exports === 'undefined') {
    factory(webduino || {});
  } else {
    module.exports = factory;
  }
}(function (scope) {
  'use strict';

  var PinEvent = scope.PinEvent,
    Pin = scope.Pin,
    Module = scope.Module;

  var TiltEvent = {
    HIGH: 'high',
    LOW: 'low'
  };

  function Tilt(board, pin) {
    Module.call(this);

    this._board = board;
    this._pin = pin;

    board.setDigitalPinMode(pin.number, Pin.DIN);

    this._pin.value = Pin.HIGH;
    this._pin.on(PinEvent.CHANGE, onPinChange.bind(this));
  }

  function onPinChange(pin) {
    if (pin.value === Pin.HIGH) {
      this.emit(TiltEvent.HIGH);
    } else {
      this.emit(TiltEvent.LOW);
    }
  }

  Tilt.prototype = Object.create(Module.prototype, {
    constructor: {
      value: Tilt
    }
  });

  scope.module.TiltEvent = TiltEvent;
  scope.module.Tilt = Tilt;
}));

+(function (factory) {
  if (typeof exports === 'undefined') {
    factory(webduino || {});
  } else {
    module.exports = factory;
  }
}(function (scope) {
  'use strict';

  var PinEvent = scope.PinEvent,
    Pin = scope.Pin,
    Module = scope.Module;

  var PirEvent = {
    DETECTED: 'detected',
    ENDED: 'ended'
  };

  function Pir(board, pin) {
    Module.call(this);

    this._board = board;
    this._pin = pin;

    board.setDigitalPinMode(pin.number, Pin.DIN);

    this._pin.value = Pin.HIGH;
    this._pin.on(PinEvent.CHANGE, onPinChange.bind(this));
  }

  function onPinChange(pin) {
    if (pin.value === Pin.HIGH) {
      this.emit(PirEvent.DETECTED);
    } else {
      this.emit(PirEvent.ENDED);
    }
  }

  Pir.prototype = Object.create(Module.prototype, {
    constructor: {
      value: Pir
    }
  });

  scope.module.PirEvent = PirEvent;
  scope.module.Pir = Pir;
}));

+(function (factory) {
  if (typeof exports === 'undefined') {
    factory(webduino || {});
  } else {
    module.exports = factory;
  }
}(function (scope) {
  'use strict';

  var PinEvent = scope.PinEvent,
    Pin = scope.Pin,
    Module = scope.Module;

  var ShockEvent = {
    HIGH: 'high',
    LOW: 'low'
  };

  function Shock(board, pin) {
    Module.call(this);

    this._board = board;
    this._pin = pin;

    board.setDigitalPinMode(pin.number, Pin.DIN);

    this._pin.value = Pin.HIGH;
    this._pin.on(PinEvent.CHANGE, onPinChange.bind(this));
  }

  function onPinChange(pin) {
    if (pin.value === Pin.HIGH) {
      this.emit(ShockEvent.HIGH);
    } else {
      this.emit(ShockEvent.LOW);
    }
  }

  Shock.prototype = Object.create(Module.prototype, {
    constructor: {
      value: Shock
    }
  });

  scope.module.ShockEvent = ShockEvent;
  scope.module.Shock = Shock;
}));

+(function (factory) {
  if (typeof exports === 'undefined') {
    factory(webduino || {});
  } else {
    module.exports = factory;
  }
}(function (scope) {
  'use strict';

  var PinEvent = scope.PinEvent,
    Pin = scope.Pin,
    Module = scope.Module;

  var SoundEvent = {
    DETECTED: 'detected',
    ENDED: 'ended'
  };

  function Sound(board, pin) {
    Module.call(this);

    this._type = 'FC_04';
    this._board = board;
    this._pin = pin;

    board.setDigitalPinMode(pin.number, Pin.DIN);

    this._pin.value = Pin.HIGH;
    this._pin.on(PinEvent.CHANGE, onPinChange.bind(this));
  }

  function onPinChange(pin) {
    if (pin.value === Pin.LOW) {
      this.emit(SoundEvent.DETECTED);
    } else {
      this.emit(SoundEvent.ENDED);
    }
  }

  Sound.prototype = Object.create(Module.prototype, {
    constructor: {
      value: Sound
    }
  });

  scope.module.SoundEvent = SoundEvent;
  scope.module.Sound = Sound;
}));

+(function (factory) {
  if (typeof exports === 'undefined') {
    factory(webduino || {});
  } else {
    module.exports = factory;
  }
}(function (scope) {
  'use strict';

  var Pin = scope.Pin,
    Module = scope.Module,
    proto;

  function Relay(board, pin) {
    Module.call(this);

    this._type = 'KY-019';
    this._board = board;
    this._pin = pin;

    this._onValue = 1;
    this._offValue = 0;

    board.setDigitalPinMode(pin.number, Pin.DOUT);

    this.off();
  }

  function checkPinState(self, pin, state, callback) {
    self._board.queryPinState(pin, function (pin) {
      if (pin.state === state) {
        callback.call(self);
      }
    });
  }

  Relay.prototype = proto = Object.create(Module.prototype, {
    constructor: {
      value: Relay
    }
  });

  proto.on = function (callback) {
    this._pin.value = this._onValue;
    if (typeof callback === 'function') {
      checkPinState(this, this._pin, this._pin.value, callback);
    }
  };

  proto.off = function (callback) {
    this._pin.value = this._offValue;
    if (typeof callback === 'function') {
      checkPinState(this, this._pin, this._pin.value, callback);
    }
  };

  proto.toggle = function (callback) {
    this._pin.value = 1 - this._pin.value;
    if (typeof callback === 'function') {
      checkPinState(this, this._pin, this._pin.value, callback);
    }
  };

  scope.module.Relay = Relay;
}));

+(function (factory) {
  if (typeof exports === 'undefined') {
    factory(webduino || {});
  } else {
    module.exports = factory;
  }
}(function (scope) {
  'use strict';

  var Module = scope.Module,
    BoardEvent = scope.BoardEvent,
    proto;

  var DHT_MESSAGE = [0x04, 0x04],
    MIN_READ_INTERVAL = 1000,
    MIN_RESPONSE_TIME = 30,
    RETRY_INTERVAL = 6000;

  var DhtEvent = {
    READ: 'read',
    READ_ERROR: 'readError'
  };

  function Dht(board, pin) {
    Module.call(this);

    this._type = 'DHT11';
    this._board = board;
    this._pin = pin;
    this._humidity = null;
    this._temperature = null;
    this._lastRecv = null;
    this._readTimer = null;
    this._readCallback = function () {};

    this._board.on(BoardEvent.BEFOREDISCONNECT, this.stopRead.bind(this));
    this._messageHandler = onMessage.bind(this);
    this._board.on(BoardEvent.ERROR, this.stopRead.bind(this));
  }

  function onMessage(event) {
    var message = event.message;

    if (message[0] !== DHT_MESSAGE[0] || message[1] !== DHT_MESSAGE[1]) {
      return;
    } else {
      processDhtData(this, message);
    }
  }

  function processDhtData(self, data) {
    var str = '',
      i = 3,
      MAX = 4,
      dd = [],
      d1, d2;

    if (data[2] === self._pin.number) {

      while (i < data.length) {
        d1 = data[i];
        d2 = data[i + 1];
        str += (d1 - 48);
        d2 && (str += (d2 - 48));
        i += 2;

        if ((i - 3) % MAX === 0) {
          dd.push(parseInt(str) / 100);
          str = '';
        }
      }

      self._lastRecv = Date.now();
      self.emit(DhtEvent.READ, dd[0], dd[1]);
    }
  }

  Dht.prototype = proto = Object.create(Module.prototype, {
    constructor: {
      value: Dht
    },

    humidity: {
      get: function () {
        return this._humidity;
      }
    },

    temperature: {
      get: function () {
        return this._temperature;
      }
    }
  });

  proto.read = function (callback, interval) {
    var self = this,
      timer;

    self.stopRead();

    if (typeof callback === 'function') {
      self._readCallback = function (humidity, temperature) {
        self._humidity = humidity;
        self._temperature = temperature;
        callback({
          humidity: humidity,
          temperature: temperature
        });
      };
      self._board.on(BoardEvent.SYSEX_MESSAGE, self._messageHandler);
      self.on(DhtEvent.READ, self._readCallback);

      timer = function () {
        self._board.sendSysex(DHT_MESSAGE[0], [DHT_MESSAGE[1], self._pin.number]);
        if (interval) {
          interval = Math.max(interval, MIN_READ_INTERVAL);
          if (self._lastRecv === null || Date.now() - self._lastRecv < 5 * interval) {
            self._readTimer = setTimeout(timer, interval);
          } else {
            self.stopRead();
            setTimeout(function () {
              self.read(callback, interval);
            }, RETRY_INTERVAL);
          }
        }
      };

      timer();
    } else {
      return new Promise(function (resolve, reject) {
        self.read(function (data) {
          self._humidity = data.humidity;
          self._temperature = data.temperature;
          setTimeout(function () {
            resolve(data);
          }, MIN_RESPONSE_TIME);
        });
      });
    }
  };

  proto.stopRead = function () {
    this.removeListener(DhtEvent.READ, this._readCallback);
    this._board.removeListener(BoardEvent.SYSEX_MESSAGE, this._messageHandler);
    this._lastRecv = null;

    if (this._readTimer) {
      clearTimeout(this._readTimer);
      delete this._readTimer;
    }
  };

  scope.module.DhtEvent = DhtEvent;
  scope.module.Dht = Dht;
}));

+(function (factory) {
  if (typeof exports === 'undefined') {
    factory(webduino || {});
  } else {
    module.exports = factory;
  }
}(function (scope) {
  'use strict';

  var push = Array.prototype.push;

  var util = scope.util,
    Module = scope.Module,
    BoardEvent = scope.BoardEvent,
    proto;

  var BUZZER_MESSAGE = [0x04, 0x07],
    TONE_MIN_LENGTH = 100;

  var BUZZER_STATE = {
    PLAYING: 'playing',
    STOPPED: 'stopped',
    PAUSED: 'paused'
  };

  var FREQUENCY = {
    REST: 0,
    B0: 31,
    C1: 33,
    CS1: 35,
    D1: 37,
    DS1: 39,
    E1: 41,
    F1: 44,
    FS1: 46,
    G1: 49,
    GS1: 52,
    A1: 55,
    AS1: 58,
    B1: 62,
    C2: 65,
    CS2: 69,
    D2: 73,
    DS2: 78,
    E2: 82,
    F2: 87,
    FS2: 93,
    G2: 98,
    GS2: 104,
    A2: 110,
    AS2: 117,
    B2: 123,
    C3: 131,
    CS3: 139,
    D3: 147,
    DS3: 156,
    E3: 165,
    F3: 175,
    FS3: 185,
    G3: 196,
    GS3: 208,
    A3: 220,
    AS3: 233,
    B3: 247,
    C4: 262,
    CS4: 277,
    D4: 294,
    DS4: 311,
    E4: 330,
    F4: 349,
    FS4: 370,
    G4: 392,
    GS4: 415,
    A4: 440,
    AS4: 466,
    B4: 494,
    C5: 523,
    CS5: 554,
    D5: 587,
    DS5: 622,
    E5: 659,
    F5: 698,
    FS5: 740,
    G5: 784,
    GS5: 831,
    A5: 880,
    AS5: 932,
    B5: 988,
    C6: 1047,
    CS6: 1109,
    D6: 1175,
    DS6: 1245,
    E6: 1319,
    F6: 1397,
    FS6: 1480,
    G6: 1568,
    GS6: 1661,
    A6: 1760,
    AS6: 1865,
    B6: 1976,
    C7: 2093,
    CS7: 2217,
    D7: 2349,
    DS7: 2489,
    E7: 2637,
    F7: 2794,
    FS7: 2960,
    G7: 3136,
    GS7: 3322,
    A7: 3520,
    AS7: 3729,
    B7: 3951,
    C8: 4186,
    CS8: 4435,
    D8: 4699,
    DS8: 4978
  };

  function Buzzer(board, pin) {
    Module.call(this);

    this._board = board;
    this._pin = pin;
    this._timer = null;
    this._sequence = null;
    this._state = BUZZER_STATE.STOPPED;

    this._board.on(BoardEvent.BEFOREDISCONNECT, this.stop.bind(this));
    this._board.on(BoardEvent.ERROR, this.stop.bind(this));
  }

  function getDuration(duration) {
    duration = isNaN(duration = parseInt(duration)) ? TONE_MIN_LENGTH : duration;
    return Math.max(duration, TONE_MIN_LENGTH);
  }

  function padDurations(durations, len) {
    var durLen = durations.length,
      dur = durLen ? durations[durLen - 1] : TONE_MIN_LENGTH;

    if (durLen < len) {
      push.apply(durations, new Array(len - durLen));
      for (var i = durLen; i < durations.length; i++) {
        durations[i] = dur;
      }
    }

    return durations;
  }

  function playNext(self) {
    var seq = self._sequence,
      note;

    if (seq && seq.length > 0) {
      note = seq.pop();
      self.tone(note.frequency, note.duration);
      self._timer = setTimeout(function () {
        playNext(self);
      }, note.duration + Buzzer.TONE_DELAY);
    } else {
      self.stop();
    }
  }

  Buzzer.prototype = proto = Object.create(Module.prototype, {
    constructor: {
      value: Buzzer
    }
  });

  proto.tone = function (freq, duration) {
    var freqData = [];

    if (isNaN(freq = parseInt(freq)) || freq <= 0 || freq > 9999) {
      return;
    }

    freq = ('0000' + freq).substr(-4, 4);
    freqData[0] = parseInt('0x' + freq[0] + freq[1]);
    freqData[1] = parseInt('0x' + freq[2] + freq[3]);
    duration = Math.round(getDuration(duration) / TONE_MIN_LENGTH);
    this._board.sendSysex(BUZZER_MESSAGE[0], [BUZZER_MESSAGE[1], this._pin.number]
      .concat(freqData).concat(duration));
  };

  proto.play = function (notes, tempos) {
    if (typeof notes !== 'undefined') {
      var len = notes.length,
        durations = padDurations(
          (util.isArray(tempos) ? tempos : []).map(function (t) {
            return getDuration(1000 / t);
          }), len
        );

      this.stop();
      this._sequence = [];
      for (var i = len - 1; i >= 0; i--) {
        this._sequence.push({
          frequency: FREQUENCY[notes[i].toUpperCase()],
          duration: durations[i]
        });
      }
    } else {
      if (this._state === BUZZER_STATE.PLAYING) {
        return;
      }
    }

    this._state = BUZZER_STATE.PLAYING;
    playNext(this);
  };

  proto.pause = function () {
    if (this._state !== BUZZER_STATE.PLAYING) {
      return;
    }

    if (this._timer) {
      clearTimeout(this._timer);
      delete this._timer;
    }

    this._state = BUZZER_STATE.PAUSED;
  };

  proto.stop = function () {
    if (this._timer) {
      clearTimeout(this._timer);
      delete this._timer;
    }

    delete this._sequence;
    this._state = BUZZER_STATE.STOPPED;
  };

  Buzzer.FREQUENCY = FREQUENCY;

  Buzzer.TONE_DELAY = 60;

  scope.module.Buzzer = Buzzer;
}));

+(function (factory) {
  if (typeof exports === 'undefined') {
    factory(webduino || {});
  } else {
    module.exports = factory;
  }
}(function (scope) {
  'use strict';

  var Pin = scope.Pin,
    Module = scope.Module,
    BoardEvent = scope.BoardEvent,
    proto;

  function Max7219(board, din, cs, clk) {
    Module.call(this);
    this._board = board;
    this._din = din;
    this._cs = cs;
    this._clk = clk;
    this._intensity = 0;
    this._data = 'ffffffffffffffff';

    this._board.on(BoardEvent.BEFOREDISCONNECT, this.animateStop.bind(this));
    this._board.on(BoardEvent.ERROR, this.animateStop.bind(this));
    this._board.send([0xf0, 4, 8, 0, din.number, cs.number, clk.number, 0xf7]);
  }

  Max7219.prototype = proto = Object.create(Module.prototype, {
    constructor: {
      value: Max7219
    },
    intensity: {
      get: function () {
        return this._intensity;
      },
      set: function (val) {
        if (val >= 0 && val <= 15) {
          this._board.send([0xf0, 4, 8, 3, val, 0xf7]);
          this._intensity = val;
        }
      }
    }
  });

  proto.on = function (data) {
    if (data) {
      this._data = data;
    } else {
      data = this._data;
    }

    if (!data) {
      return false;
    }

    var sendData = [0xf0, 4, 8, 1];
    var i = 0;
    var len = data.length;

    for (; i < len; i++) {
      sendData.push(data.charCodeAt(i));
    }

    sendData.push(0xf7);
    this._board.send(sendData);
  };

  proto.off = function () {
    this._board.send([0xf0, 4, 8, 2, 0xf7]);
  };

  proto.animate = function(data, times, duration, callback) {
    var p = 0;

    if (typeof arguments[arguments.length - 1] === 'function') {
      callback = arguments[arguments.length - 1];
    } else {
      callback = function() {};
    }

    var run = function() {
      this.on(data[p++ % data.length]);
      this._timer = setTimeout(run, times);
    }.bind(this);

    var stop = function() {
      clearTimeout(this._timer);
      callback();
    }.bind(this);

    if (times && times > 0) {
      run();
    }

    if (duration && duration > 0) {
      this._timerDuration = setTimeout(stop, duration);
    }
  };

  proto.animateStop = function() {
    clearTimeout(this._timer);
    clearTimeout(this._timerDuration);
  };

  scope.module.Max7219 = Max7219;
}));
+(function(factory) {
  if (typeof exports === 'undefined') {
    factory(webduino || {});
  } else {
    module.exports = factory;
  }
}(function(scope) {
  'use strict';

  var Module = scope.Module,
    BoardEvent = scope.BoardEvent,
    proto;

  var ADXL345Event = {
    MESSAGE: 'message'
  };

  function ADXL345(board) {
    Module.call(this);
    this._board = board;
    this._baseAxis = 'z';
    this._sensitive = 10;
    this._detectTime = 50;
    this._messageHandler = onMessage.bind(this);
    this._init = false;
    this._info = {
      x: 0,
      y: 0,
      z: 0,
      fXg: 0,
      fYg: 0,
      fZg: 0
    };
    this._callback = function() {};
    this._board.send([0xf0, 0x04, 0x0b, 0x00, 0xf7]);
  }

  function onMessage(event) {
    var msg = event.message;
    var msgPort = [0x04, 0x0b, 0x04];
    var stus = true;
    var alpha = 0.5;
    var x, y, z;

    if (msg.length !== 9) {
      return false;
    }

    msgPort.forEach(function(val, idx, ary) {
      if (val !== msg[idx]) {
        stus = false;
      }
    });

    if (!stus) {
      return false;
    }

    x = (msg[3] << 8 | msg[4]) - 1024;
    y = (msg[5] << 8 | msg[6]) - 1024;
    z = (msg[7] << 8 | msg[8]) - 1024;

    this.emit(ADXL345Event.MESSAGE, x, y, z);
  }

  function calcFixed(base, data, fixedInfo) {
    Object.getOwnPropertyNames(data).forEach(function(key, idx, ary) {
      fixedInfo[key] = data[key];

      if (key === base) {
        if (data[key] > 0) {
          fixedInfo[key] = data[key] - 256;
        } else {
          fixedInfo[key] = data[key] + 256;
        }
      }
    });
  }

  function estimateRollandPitch(x, y, z, fXg, fYg, fZg) {
    var alpha = 0.5;
    var roll, pitch;

    // Low Pass Filter
    fXg = x * alpha + (fXg * (1.0 - alpha));
    fYg = y * alpha + (fYg * (1.0 - alpha));
    fZg = z * alpha + (fZg * (1.0 - alpha));

    // Roll & Pitch Equations
    roll  = (Math.atan2(-fYg, fZg) * 180.0) / Math.PI;
    pitch = (Math.atan2(fXg, Math.sqrt(fYg * fYg + fZg * fZg)) * 180.0) / Math.PI;
    roll = roll.toFixed(2);
    pitch = pitch.toFixed(2);

    return {
      roll: roll,
      pitch: pitch,
      fXg: fXg,
      fYg: fYg,
      fZg: fZg
    };
  }

  ADXL345.prototype = proto = Object.create(Module.prototype, {
    constructor: {
      value: ADXL345
    },
    state: {
      get: function() {
        return this._state;
      },
      set: function(val) {
        this._state = val;
      }
    }
  });

  proto.on = function(callback) {
    var _this = this;

    this._board.send([0xf0, 0x04, 0x0b, 0x01, 0xf7]);

    if (typeof callback !== 'function') {
      callback = function() {};
    }

    this._callback = function(x, y, z) {
      var info = _this._info;
      var rt;

      if (!_this._init) {
        _this._init = true;
        calcFixed(this._baseAxis, {x:x, y:y, z:z}, info);
      }

      x -= info.x;
      y -= info.y;
      z -= info.z;

      rt = estimateRollandPitch(x, y, z, info.fXg, info.fYg, info.fZg);
      ['fXg', 'fYg', 'fZg'].forEach(function(val, idx, ary) {
        info[val] = rt[val];
      });

      // uint : mg -> g
      x = (x / 256).toFixed(2);
      y = (y / 256).toFixed(2);
      z = (z / 256).toFixed(2);

      callback(x, y, z, rt.roll, rt.pitch);
    };

    this._state = 'on';
    this._board.on(BoardEvent.SYSEX_MESSAGE, this._messageHandler);
    this.addListener(ADXL345Event.MESSAGE, this._callback);
  };

  proto.off = function() {
    this._state = 'off';
    this._board.send([0xf0, 0x04, 0x0b, 0x02, 0xf7]);
    this._board.removeListener(BoardEvent.SYSEX_MESSAGE, this._messageHandler);
    this.removeListener(ADXL345Event.MESSAGE, this._callback);
    this._callback = null;
  };

  proto.refresh = function() {
    this._init = false;
    if (this._init === true) {
      this._info = {
        x: 0,
        y: 0,
        z: 0,
        fXg: 0,
        fYg: 0,
        fZg: 0
      };
    }
  };

  proto.setBaseAxis = function(val) {
    this._baseAxis = val;
  };

  proto.setSensitivity = function(sensitive) {
    if (sensitive !== this._sensitive) {
      this._sensitive = sensitive;
      this._board.send([0xf0, 0x04, 0x0b, 0x03, sensitive, 0xf7]);
    }
  };

  proto.setDetectTime = function(detectTime) {
    if (detectTime !== this._detectTime) {
      this._detectTime = detectTime;
      this._board.send([0xf0, 0x04, 0x0b, 0x04, detectTime, 0xf7]);
    }
  };

  scope.module.ADXL345 = ADXL345;
}));
+(function(factory) {
    if (typeof exports === 'undefined') {
        factory(webduino || {});
    } else {
        module.exports = factory;
    }
}(function(scope) {
    'use strict';

    var Module = scope.Module,
        BoardEvent = scope.BoardEvent,
        proto;

    var HX711_MESSAGE = [0x04, 0x15];

    var HX711Event = {
        MESSAGE: 'message'
    };

    function HX711(board, sckPin, dtPin) {
        Module.call(this);
        this._board = board;
        this._dt = !isNaN(dtPin) ? board.getDigitalPin(dtPin) : dtPin;
        this._sck = !isNaN(sckPin) ? board.getDigitalPin(sckPin) : sckPin;

        this._init = false;
        this._weight = 0;
        this._callback = function() {};
        this._messageHandler = onMessage.bind(this);
        this._board.send([0xf0, 0x04, 0x15, 0x00,
            this._sck._number, this._dt._number, 0xf7
        ]);
    }

    function onMessage(event) {
        var msg = event.message;
        if (msg[0] == HX711_MESSAGE[0] && msg[1] == HX711_MESSAGE[1]) {
            this.emit(HX711Event.MESSAGE, msg.slice(2));
        }
    }

    HX711.prototype = proto = Object.create(Module.prototype, {
        constructor: {
            value: HX711
        },
        state: {
            get: function() {
                return this._state;
            },
            set: function(val) {
                this._state = val;
            }
        }
    });

    proto.on = function(callback) {
        var _this = this;
        this._board.send([0xf0, 0x04, 0x15, 0x01, 0xf7]);
        if (typeof callback !== 'function') {
            callback = function() {};
        }
        this._callback = function(rawData) {
            var weight = '';
            for (var i = 0; i < rawData.length; i++) {
                weight += (rawData[i] - 0x30);
            }
            _this._weight = parseFloat(weight);
            callback(_this._weight);
        };
        this._state = 'on';
        this._board.on(BoardEvent.SYSEX_MESSAGE, this._messageHandler);
        this.addListener(HX711Event.MESSAGE, this._callback);
    };

    proto.off = function() {
        this._state = 'off';
        this._board.send([0xf0, 0x04, 0x15, 0x02, 0xf7]);
        this._board.removeListener(BoardEvent.SYSEX_MESSAGE, this._messageHandler);
        this.removeListener(HX711Event.MESSAGE, this._callback);
        this._callback = null;
    };

    scope.module.HX711 = HX711;
}));
+(function (factory) {
  if (typeof exports === 'undefined') {
    factory(webduino || {});
  } else {
    module.exports = factory;
  }
}(function (scope) {
  'use strict';

  var self;
  var proto;
  var _textSize = 2;
  var _cursorX = 0;
  var _cursorY = 0;
  var sendLength = 50;
  var sendArray = [];
  var sending = false;
  var sendAck = '';
  var sendCallback;
  var Module = scope.Module;

  function SSD1306(board) {
    Module.call(this);
    this._board = board;
    self = this;
    board.send([0xF0, 0x04, 0x01, 0x0, 0xF7]);
    board.send([0xF0, 0x04, 0x01, 0x02, _cursorX, _cursorY, 0xF7]);
    board.send([0xF0, 0x04, 0x01, 0x03, _textSize, 0xF7]);
    board.send([0xF0, 0x04, 0x01, 0x01, 0xF7]);
    board.on(webduino.BoardEvent.SYSEX_MESSAGE,
      function (event) {
        var m = event.message;
        sending = false;
      });
    startQueue(board);
  }

  SSD1306.prototype = proto = Object.create(Module.prototype, {
    constructor: {
      value: SSD1306
    },
    textSize: {
      get: function () {
        return _textSize;
      },
      set: function (val) {
        this._board.send([0xF0, 0x04, 0x01, 0x03, val, 0xF7]);
        _textSize = val;
      }
    },
    cursorX: {
      get: function () {
        return _cursorX;
      },
      set: function (val) {
        _cursorX = val;
      }
    },
    cursorY: {
      get: function () {
        return _cursorY;
      },
      set: function (val) {
        _cursorY = val;
      }
    }
  });

  proto.clear = function () {
    this._board.send([0xF0, 0x04, 0x01, 0x01, 0xF7]);
  }

  proto.drawImage = function (num) {
    this._board.send([0xF0, 0x04, 0x01, 0x05, num, 0xF7]);
  }

  proto.render = function () {
    this._board.send([0xF0, 0x04, 0x01, 0x06, 0xF7]);
  }

  proto.save = function (data, callback) {
    sendCallback = callback;
    for (var i = 0; i < data.length; i = i + sendLength) {
      var chunk = data.substring(i, i + sendLength);
      saveChunk(i / 2, chunk);
    }
    sendArray.push({ 'obj': {}, 'ack': 0 });
  }

  function saveChunk(startPos, data) {
    var CMD = [0xf0, 0x04, 0x01, 0x0A];
    var raw = [];
    raw = raw.concat(CMD);
    var n = '0000' + startPos.toString(16);
    n = n.substring(n.length - 4);
    for (var i = 0; i < 4; i++) {
      raw.push(n.charCodeAt(i));
    }
    raw.push(0xf7);
    // send Data //  
    CMD = [0xf0, 0x04, 0x01, 0x0B];
    raw = raw.concat(CMD);
    for (i = 0; i < data.length; i++) {
      raw.push(data.charCodeAt(i));
    }
    raw.push(0xf7);
    sendArray.push({ 'obj': raw, 'ack': 0x0B });
  }


  function startQueue(board) {
    setInterval(function () {
      if (sending || sendArray.length == 0) {
        return;
      }
      sending = true;
      var sendObj = sendArray.shift();
      sendAck = sendObj.ack;
      if (sendAck > 0) {
        board.send(sendObj.obj);
      } else {
        sending = false;
        sendCallback();
      }
    }, 0);
  }

  proto.print = function (cursorX, cursorY, str) {
    var len = arguments.length;
    if (len == 3) {
      _cursorX = cursorX;
      _cursorY = cursorY;
      this._board.send([0xF0, 0x04, 0x01, 0x02, cursorX, cursorY, 0xF7]);
    } else {
      str = cursorX;
      this._board.send([0xF0, 0x04, 0x01, 0x02, _cursorX, _cursorY, 0xF7]);
    }
    var strCMD = [0xF0, 0x04, 0x01, 0x04];
    for (var i = 0; i < str.length; i++) {
      strCMD.push(str.charCodeAt(i));
    }
    strCMD.push(0xF7);
    this._board.send(strCMD);
  }
  scope.module.SSD1306 = SSD1306;
}));
+(function(factory) {
    if (typeof exports === 'undefined') {
        factory(webduino || {});
    } else {
        module.exports = factory;
    }
}(function(scope) {
    'use strict';

    var Module = scope.Module,
        BoardEvent = scope.BoardEvent,
        proto;

    var BARCODE_MESSAGE = [0x04, 0x16];

    var BarcodeEvent = {
        MESSAGE: 'message'
    };

    function Barcode(board, rxPin, txPin) {
        Module.call(this);
        this._board = board;
        this._rx = !isNaN(rxPin) ? board.getDigitalPin(rxPin) : rxPin;
        this._tx = !isNaN(txPin) ? board.getDigitalPin(txPin) : txPin;

        this._init = false;
        this._scanData = '';
        this._callback = function() {};
        this._messageHandler = onMessage.bind(this);
        this._board.send([0xf0, 0x04, 0x16, 0x00,
            this._rx._number, this._tx._number, 0xf7
        ]);
    }

    function onMessage(event) {
        var msg = event.message;
        if (msg[0] == BARCODE_MESSAGE[0] && msg[1] == BARCODE_MESSAGE[1]) {
            this.emit(BarcodeEvent.MESSAGE, msg.slice(2));
        }
    }

    Barcode.prototype = proto = Object.create(Module.prototype, {
        constructor: {
            value: Barcode
        },
        state: {
            get: function() {
                return this._state;
            },
            set: function(val) {
                this._state = val;
            }
        }
    });

    proto.on = function(callback) {
        var _this = this;
        this._board.send([0xf0, 0x04, 0x16, 0x01, 0xf7]);
        if (typeof callback !== 'function') {
            callback = function() {};
        }
        this._callback = function(rawData) {
            var scanData = '';
            for (var i = 0; i < rawData.length; i++) {
                scanData += String.fromCharCode(rawData[i]);
            }
            _this._scanData = scanData;
            callback(_this._scanData);
        };
        this._state = 'on';
        this._board.on(BoardEvent.SYSEX_MESSAGE, this._messageHandler);
        this.addListener(BarcodeEvent.MESSAGE, this._callback);
    };

    proto.off = function() {
        this._state = 'off';
        this._board.send([0xf0, 0x04, 0x16, 0x02, 0xf7]);
        this._board.removeListener(BoardEvent.SYSEX_MESSAGE, this._messageHandler);
        this.removeListener(BarcodeEvent.MESSAGE, this._callback);
        this._callback = null;
    };

    scope.module.Barcode = Barcode;
}));
+(function(factory) {
  if (typeof exports === 'undefined') {
    factory(webduino || {});
  } else {
    module.exports = factory;
  }
}(function(scope) {
  'use strict';

  var Module = scope.Module,
    proto;

  function IRLed(board, encode) {
    Module.call(this);
    this._board = board;
    this._encode = encode;
    this._board.send([0xf4, 0x09, 0x03, 0xe9, 0x00, 0x00]);
  }

  IRLed.prototype = proto = Object.create(Module.prototype, {
    constructor: {
      value: IRLed
    }
  });

  proto.send = function(code) {
    var aryCode = [0x09, 0x04];
    var ary;
    code = code || this._encode;
    
    if (code) {
      ary = code.match(/\w{2}/g);

      // data length
      aryCode.push(ary.length * 8);

      ary.forEach(function(val) {
        for (var i = 0, len = val.length; i < len; i++) {
          aryCode.push(val.charCodeAt(i));
        }
      });
      
      this._board.sendSysex(0x04, aryCode);
    }
  };

  proto.updateEncode = function(code) {
    this._encode = code;
  };

  scope.module.IRLed = IRLed;
}));

+(function (factory) {
  if (typeof exports === 'undefined') {
    factory(webduino || {});
  } else {
    module.exports = factory;
  }
}(function (scope) {
  'use strict';

  var Module = scope.Module,
    BoardEvent = scope.BoardEvent,
    proto;

  var IRRecvEvent = {
    MESSAGE: 'message',
    MESSAGE_ERROR: 'messageError'
  };

  function IRRecv(board, pin) {
    Module.call(this);
    this._board = board;
    this._pin = pin;
    this._messageHandler = onMessage.bind(this);
    this._recvCallback = function () {};
    this._recvErrorCallback = function () {};
    this._board.send([0xf0, 0x04, 0x0A, 0x01, 0xf7]);
  }

  function onMessage(event) {
    var recvChk = [0x04, 0x10];
    var msg = event.message;
    var data = msg.slice(2);
    var str = '';
    var i, tp, len;

    for (i = 0, len = recvChk.length; i < len; i++) {
      if (recvChk[i] !== msg[i]) {
        return false;
      }
    }

    for (i = 0; i < data.length; i++) {
      tp = String.fromCharCode(data[i]);
      str += tp.toLowerCase();
    }

    if (str !== 'ffffffff') {
      this.emit(IRRecvEvent.MESSAGE, str);
    } else {
      this.emit(IRRecvEvent.MESSAGE_ERROR, str, msg);
    }
  }

  IRRecv.prototype = proto = Object.create(Module.prototype, {
    constructor: {
      value: IRRecv
    },
    state: {
      get: function () {
        return this._state;
      },
      set: function (val) {
        this._state = val;
      }
    }
  });

  proto.on = function (callback, errorCallback) {
    var aryCode = [0xf0, 0x04, 0x0A, 0x00];

    if (typeof callback !== 'function') {
      callback = function () {};
    }

    if (typeof errorCallback !== 'function') {
      errorCallback = function () {};
    }

    if (this._pin) {
      aryCode.push(this._pin.number, 0xf7);
      this._board.send(aryCode);
      this._state = 'on';

      this._recvCallback = function (value) {
        callback(value);
      };

      this._recvErrorCallback = function (value, msg) {
        errorCallback(value, msg);
      };

      this._board.on(BoardEvent.SYSEX_MESSAGE, this._messageHandler);
      this.addListener(IRRecvEvent.MESSAGE, this._recvCallback);
      this.addListener(IRRecvEvent.MESSAGE_ERROR, this._recvErrorCallback);
    }
  };

  proto.off = function () {
    this._board.send([0xf0, 0x04, 0x0A, 0x01, 0xf7]);
    this._state = 'off';

    this._board.removeListener(BoardEvent.SYSEX_MESSAGE, this._messageHandler);
    this.removeListener(IRRecvEvent.MESSAGE, this._recvCallback);
    this.removeListener(IRRecvEvent.MESSAGE_ERROR, this._recvErrorCallback);
    this._recvCallback = null;
    this._recvErrorCallback = null
  };

  scope.module.IRRecv = IRRecv;
}));
+(function(factory) {
  if (typeof exports === 'undefined') {
    factory(webduino || {});
  } else {
    module.exports = factory;
  }
}(function(scope) {
  'use strict';

  var Module = scope.Module;
  var BoardEvent = scope.BoardEvent;
  var PinEvent = scope.PinEvent;
  var Pin = scope.Pin;
  var Button = scope.module.Button;
  var ButtonEvent = scope.module.ButtonEvent;
  var proto;

  var JoystickEvent = {
    MESSAGE: 'message'
  };

  function Joystick(board, analogPinX, analogPinY, pinZ) {
    Module.call(this);
    this._board = board;
    this._pinX = Number(analogPinX);
    this._pinY = Number(analogPinY);
    this._pinZ = pinZ;
    this._data = {
      x: 0,
      y: 0,
      z: 0
    };

    board.enableAnalogPin(this._pinX);
    board.enableAnalogPin(this._pinY);
    board.addListener(BoardEvent.ANALOG_DATA, onMessage.bind(this));

    this._button = new Button(board, pinZ);
    this._button.on(ButtonEvent.PRESS, onPinChange.bind(this));
    this._button.on(ButtonEvent.RELEASE, onPinChange.bind(this));
  }

  function onMessage(event) {
    var pin = event.pin;

    if (pin.analogNumber !== this._pinX && pin.analogNumber !== this._pinY) {
      return false;
    } 

    if (pin.analogNumber === this._pinX) {
      this._data.x = pin.value;
    }

    if (pin.analogNumber === this._pinY) {
      this._data.y = pin.value;
    }

    this.emit(JoystickEvent.MESSAGE, this._data.x, this._data.y, this._data.z);
  }

  function onPinChange(pin) {
    this._data.z = this._button._pin.value;
  }

  Joystick.prototype = proto = Object.create(Module.prototype, {
    constructor: {
      value: Joystick
    }
  });

  scope.module.JoystickEvent = JoystickEvent;
  scope.module.Joystick = Joystick;
}));

+(function(factory) {
  if (typeof exports === 'undefined') {
    factory(webduino || {});
  } else {
    module.exports = factory;
  }
}(function(scope) {
  'use strict';

  var Module = scope.Module,
    BoardEvent = scope.BoardEvent,
    PinEvent = scope.PinEvent,
    Pin = scope.Pin,
    proto;

  var MQ2Event = {
    MESSAGE: 'message',
    DETECTED: 'detected',
    ENDED: 'ended'
  };

  function MQ2(board, analogPinNumber, pin) {
    Module.call(this);
    this._board = board;

    if (analogPinNumber) {
      this._pinNumber = Number(analogPinNumber);
      this._messageHandler = onMessage.bind(this);
    }

    if (pin) {
      this._pin = pin;
      board.setDigitalPinMode(pin.number, Pin.DIN);
      this._pin.value = Pin.LOW;
      this._pin.on(PinEvent.CHANGE, onPinChange.bind(this));
    }
  }

  function onMessage(event) {
    var pin = event.pin;
    if (this._pinNumber !== pin.analogNumber) {
      return false;
    }

    this.emit(MQ2Event.MESSAGE, pin.value);
  }

  function onPinChange(pin) {
    if (pin.value === Pin.HIGH) {
      this.emit(MQ2Event.DETECTED);
    } else {
      this.emit(MQ2Event.ENDED);
    }
  }

  MQ2.prototype = proto = Object.create(Module.prototype, {
    constructor: {
      value: MQ2
    },
    state: {
      get: function() {
        return this._state;
      },
      set: function(val) {
        this._state = val;
      }
    }
  });

  proto.on = function(callback) {
    if (typeof callback !== 'function') {
      callback = function() {};
    }

    this._state = 'on';
    this._board.enableAnalogPin(this._pinNumber);
    this._analogCallback = function(val) {
      callback(val);
    };
    this._board.on(BoardEvent.ANALOG_DATA, this._messageHandler);
    this.addListener(MQ2Event.MESSAGE, this._analogCallback);
  };

  proto.off = function() {
    this._state = 'off';
    this._board.disableAnalogPin(this._pinNumber);
    this._board.removeListener(BoardEvent.ANALOG_DATA, this._messageHandler);
    if (this._analogCallback) {
      this.removeListener(MQ2Event.MESSAGE, this._analogCallback);
      this._analogCallback = null;
    }
  };

  proto.onEvent = function(type, handler) {
    this.addListener(type, handler);
  };

  proto.offEvent = function(type, handler) {
    this.removeListener(type, handler);
  };

  scope.module.MQ2 = MQ2;
}));

+(function(factory) {
  if (typeof exports === 'undefined') {
    factory(webduino || {});
  } else {
    module.exports = factory;
  }
}(function(scope) {
  'use strict';

  var Module = scope.Module,
    BoardEvent = scope.BoardEvent,
    proto;

  var PhotocellEvent = {
    MESSAGE: 'message'
  };

  function Photocell(board, analogPinNumber) {
    Module.call(this);
    this._board = board;
    this._pinNumber = Number(analogPinNumber);
    this._messageHandler = onMessage.bind(this);
  }

  function onMessage(event) {
    var pin = event.pin;
    if (this._pinNumber !== pin.analogNumber) {
      return false;
    }

    this.emit(PhotocellEvent.MESSAGE, pin.value);
  }

  Photocell.prototype = proto = Object.create(Module.prototype, {
    constructor: {
      value: Photocell
    },
    state: {
      get: function() {
        return this._state;
      },
      set: function(val) {
        this._state = val;
      }
    }
  });

  proto.on = function(callback) {
    var _this = this;

    this._board.enableAnalogPin(this._pinNumber);

    if (typeof callback !== 'function') {
      callback = function() {};
    }

    this._callback = function(val) {
      callback(val);
    };

    this._state = 'on';
    this._board.on(BoardEvent.ANALOG_DATA, this._messageHandler);
    this.addListener(PhotocellEvent.MESSAGE, this._callback);
  };

  proto.off = function() {
    this._state = 'off';
    this._board.disableAnalogPin(this._pinNumber);
    this._board.removeListener(BoardEvent.ANALOG_DATA, this._messageHandler);
    this.removeListener(PhotocellEvent.MESSAGE, this._callback);
    this._callback = null;
  };

  scope.module.Photocell = Photocell;
}));

+(function(factory) {
  if (typeof exports === 'undefined') {
    factory(webduino || {});
  } else {
    module.exports = factory;
  }
}(function(scope) {
  'use strict';

  var Module = scope.Module,
    BoardEvent = scope.BoardEvent,
    proto;

  var PotEvent = {
    MESSAGE: 'message'
  };

  function Pot(board, analogPinNumber) {
    Module.call(this);
    this._board = board;
    this._pinNumber = Number(analogPinNumber);
    this._messageHandler = onMessage.bind(this);
  }

  function onMessage(event) {
    var pin = event.pin;
    if (this._pinNumber !== pin.analogNumber) {
      return false;
    }

    this.emit(PotEvent.MESSAGE, pin.value);
  }

  Pot.prototype = proto = Object.create(Module.prototype, {
    constructor: {
      value: Pot
    },
    state: {
      get: function() {
        return this._state;
      },
      set: function(val) {
        this._state = val;
      }
    }
  });

  proto.on = function(callback) {
    var _this = this;

    this._board.enableAnalogPin(this._pinNumber);

    if (typeof callback !== 'function') {
      callback = function() {};
    }

    this._callback = function(val) {
      callback(val);
    };

    this._state = 'on';
    this._board.on(BoardEvent.ANALOG_DATA, this._messageHandler);
    this.addListener(PotEvent.MESSAGE, this._callback);
  };

  proto.off = function() {
    this._state = 'off';
    this._board.disableAnalogPin(this._pinNumber);
    this._board.removeListener(BoardEvent.ANALOG_DATA, this._messageHandler);
    this.removeListener(PotEvent.MESSAGE, this._callback);
    this._callback = null;
  };

  scope.module.Pot = Pot;
}));

+(function (factory) {
  if (typeof exports === 'undefined') {
    factory(webduino || {});
  } else {
    module.exports = factory;
  }
}(function (scope) {
  'use strict';

  var Module = scope.Module,
    BoardEvent = scope.BoardEvent,
    proto;

  var RFIDEvent = {
    ENTER: 'enter',
    LEAVE: 'leave'
  };

  function RFID(board) {
    Module.call(this);

    this._board = board;
    this._isReading = false;
    this._enterHandlers = [];
    this._leaveHandlers = [];

    this._messageHandler = onMessage.bind(this);
    this._board.on(BoardEvent.BEFOREDISCONNECT, this.destroy.bind(this));
    this._board.on(BoardEvent.ERROR, this.destroy.bind(this));
    this._board.send([0xf0, 0x04, 0x0f, 0x00, 0xf7]);
  }

  function onMessage(event) {
    var _this = this;
    var msg = event.message;
    var val;

    if (!msg.length) {
      return false;
    }

    if (msg.length === 1) {
      val = 0;
      _this._leaveHandlers.forEach(function (fn, idx, ary) {
        fn.call(_this, val);
      });
      _this.emit(RFIDEvent.LEAVE, val);
    } else {
      val = String.fromCharCode.apply(null, msg);
      _this._enterHandlers.forEach(function (fn, idx, ary) {
        fn.call(_this, val);
      });
      _this.emit(RFIDEvent.ENTER, val);
    }
  }

  RFID.prototype = proto = Object.create(Module.prototype, {
    constructor: {
      value: RFID
    },

    isReading: {
      get: function () {
        return this._isReading;
      }
    }
  });

  proto.read = function (enterHandler, leaveHandler) {
    if (!this._isReading) {
      this._board.send([0xf0, 0x04, 0x0f, 0x01, 0xf7]);
      this._board.on(BoardEvent.SYSEX_MESSAGE, this._messageHandler);
      this._isReading = true;
    }

    if (typeof enterHandler === 'function') {
      this._enterHandlers.push(enterHandler);
    }

    if (typeof leaveHandler === 'function') {
      this._leaveHandlers.push(leaveHandler);
    }
  };

  proto.stopRead = function () {
    if (this._isReading) {
      this._board.send([0xf0, 0x04, 0x0f, 0x02, 0xf7]);
      this._board.removeListener(BoardEvent.SYSEX_MESSAGE, this._messageHandler);
      this._isReading = false;
      this._enterHandlers = [];
      this._leaveHandlers = [];
    }
  };

  proto.off = function (evtType, handler) {
    this.removeListener(evtType, handler);
  };

  proto.destroy = function () {
    this.stopRead();
    this.removeAllListeners(RFIDEvent.ENTER);
    this.removeAllListeners(RFIDEvent.LEAVE);
  };

  scope.module.RFIDEvent = RFIDEvent;
  scope.module.RFID = RFID;
}));

+(function(factory) {
  if (typeof exports === 'undefined') {
    factory(webduino || {});
  } else {
    module.exports = factory;
  }
}(function(scope) {
  'use strict';

  var Module = scope.Module,
    BoardEvent = scope.BoardEvent,
    proto;

  var SoilEvent = {
    MESSAGE: 'message'
  };

  function Soil(board, analogPinNumber) {
    Module.call(this);
    this._board = board;
    this._pinNumber = Number(analogPinNumber);
    this._messageHandler = onMessage.bind(this);
  }

  function formatter(val) {
    val = Math.round(val * 10000) / 100;
    return val;
  }

  function onMessage(event) {
    var pin = event.pin;

    if (this._pinNumber !== pin.analogNumber) {
      return false;
    }

    this.emit(SoilEvent.MESSAGE, formatter(pin.value));
  }

  Soil.prototype = proto = Object.create(Module.prototype, {
    constructor: {
      value: Soil
    },
    state: {
      get: function() {
        return this._state;
      },
      set: function(val) {
        this._state = val;
      }
    }
  });

  proto.on = function(callback) {
    var _this = this;

    this._board.enableAnalogPin(this._pinNumber);

    if (typeof callback !== 'function') {
      callback = function() {};
    }

    this._callback = function(val) {
      callback(val);
    };

    this._state = 'on';
    this._board.on(BoardEvent.ANALOG_DATA, this._messageHandler);
    this.addListener(SoilEvent.MESSAGE, this._callback);
  };

  proto.off = function() {
    this._state = 'off';
    this._board.disableAnalogPin(this._pinNumber);
    this._board.removeListener(BoardEvent.ANALOG_DATA, this._messageHandler);
    this.removeListener(SoilEvent.MESSAGE, this._callback);
    this._callback = null;
  };

  scope.module.Soil = Soil;
}));

+(function(factory) {
    if (typeof exports === 'undefined') {
        factory(webduino || {});
    } else {
        module.exports = factory;
    }
}(function(scope) {
    'use strict';

    var Module = scope.Module,
        BoardEvent = scope.BoardEvent,
        proto;

    var G3_MESSAGE = [0x04, 0x10],
        MIN_READ_INTERVAL = 1000,
        MIN_RESPONSE_TIME = 30,
        RETRY_INTERVAL = 6000;

    var G3Event = {
        READ: 'read',
        READ_ERROR: 'readError'
    };

    function G3(board, rx, tx) {
        Module.call(this);

        this._type = 'G3';
        this._board = board;
        this._rx = rx;
        this._tx = tx;
        this._pm25 = null;
        this._pm10 = null;
        this._readTimer = null;
        this._readCallback = function() {};

        this._board.on(BoardEvent.BEFOREDISCONNECT, this.stopRead.bind(this));
        this._messageHandler = onMessage.bind(this);
        this._board.on(BoardEvent.ERROR, this.stopRead.bind(this));
        this._board.sendSysex(G3_MESSAGE[0], [G3_MESSAGE[1], 0, rx.number, tx.number]);
    }

    function onMessage(event) {
        var message = event.message;

        if (message[0] !== G3_MESSAGE[0] || message[1] !== G3_MESSAGE[1]) {
            return;
        } else {
            processG3Data(this, message);
        }
    }

    function processG3Data(self, data) {
        var str = '',i = 1;
        for(var i=2;i<data.length;i++){
            str += String.fromCharCode(data[i]);
        }
        str = str.split(',');
        self._lastRecv = Date.now();
        self.emit(G3Event.READ, str[0], str[1]);
    }

    G3.prototype = proto = Object.create(Module.prototype, {
        constructor: {
            value: G3
        },

        pm25: {
            get: function() {
                return this._pm25;
            }
        },

        pm10: {
            get: function() {
                return this._pm10;
            }
        }
    });

    proto.read = function(callback, interval) {
        var self = this,
            timer;

        self.stopRead();

        if (typeof callback === 'function') {
            self._readCallback = function(pm25, pm10) {
                self._pm25 = pm25;
                self._pm10 = pm10;
                callback({
                    pm25: pm25,
                    pm10: pm10
                });
            };
            self._board.on(BoardEvent.SYSEX_MESSAGE, self._messageHandler);
            self.on(G3Event.READ, self._readCallback);

            timer = function() {
                self._board.sendSysex(G3_MESSAGE[0], [G3_MESSAGE[1], 3]);
                if (interval) {
                    interval = Math.max(interval, MIN_READ_INTERVAL);
                    if (self._lastRecv === null || Date.now() - self._lastRecv < 5 * interval) {
                        self._readTimer = setTimeout(timer, interval);
                    } else {
                        self.stopRead();
                        setTimeout(function() {
                            self.read(callback, interval);
                        }, RETRY_INTERVAL);
                    }
                }
            };

            timer();
        } else {
            return new Promise(function(resolve, reject) {
                self.read(function(data) {
                    self._pm25 = data.pm25;
                    self._pm10 = data.pm10;
                    setTimeout(function() {
                        resolve(data);
                    }, MIN_RESPONSE_TIME);
                });
            });
        }
    };

    proto.stopRead = function() {
        this.removeListener(G3Event.READ, this._readCallback);
        this._board.removeListener(BoardEvent.SYSEX_MESSAGE, this._messageHandler);
        this._lastRecv = null;

        if (this._readTimer) {
            clearTimeout(this._readTimer);
            delete this._readTimer;
        }
    };

    scope.module.G3Event = G3Event;
    scope.module.G3 = G3;
}));
+(function(factory) {
  if (typeof exports === 'undefined') {
    factory(webduino || {});
  } else {
    module.exports = factory;
  }
}(function(scope) {
  'use strict';

  var Module = scope.Module,
    BoardEvent = scope.BoardEvent,
    proto;

  var StepperEvent = {
    MESSAGE: 'message'
  };

  function Stepper(board, config) {
    Module.call(this);
    this._board = board;
    this._stepperNumber = Number(config.stepperNumber);
    this._interface = Number(config.interface);
    this._stepPerRevolution = Number(config.stepsPerRevolution);
    this._pin1 = Number(config.pin1);
    this._pin2 = Number(config.pin2);
    this._pin3 = Number(config.pin3);
    this._pin4 = Number(config.pin4);
    this._messageHandler = onMessage.bind(this);

    var val = transferNumber(this._stepPerRevolution, 2);
    var cmd = [].concat(0xF0, 0x72, 0x00, this._stepperNumber, this._interface, val, this._pin1, this._pin3, this._pin2, this._pin4, 0xF7);
    this._board.send(cmd);
  }

  function onMessage(event) {
    var msg = event.message;

    if (msg[0] !== Number(0x72)) {
      return false
    }

    this.emit(StepperEvent.MESSAGE, { status: true, stepperNumber: msg[1] });
  }

  // 2048 => [0, 16] => [0x00, 0x10]
  function transferNumber(value, num) {
    var str = value.toString(2);
    var ary = [];
    var end = str.length;
    var start;

    for (var i = 1; i < num + 1; i++) {
      start = -7 * i;
      ary.push(str.slice(start, end));
      end = start;
    }

    ary.forEach(function(val, idx, target) {
      val = parseInt(val, 2);
      val > 0 || (val = 0);
      target[idx] = val;
    });
    return ary;
  }

  Stepper.prototype = proto = Object.create(Module.prototype, {
    constructor: {
      value: Stepper
    }
  });

  proto.on = function(command, callback) {
    var _this = this;

    var stepperNumber = Number(command.stepperNumber) || 0;
    var direction = Number(command.direction) || 0;
    var stepNumber = Number(command.stepNumber) || 0;
    var speed = Number(command.speed) || 10;
    var speedAry = [];
    var stepNumberAry = [];
    var cmd;

    speedAry = transferNumber(speed, 2);
    stepNumberAry = transferNumber(stepNumber, 3);
    cmd = [].concat(0xF0, 0x72, 0x01, stepperNumber, direction, stepNumberAry, speedAry, 0xF7);

    this._board.send(cmd);

    if (typeof callback !== 'function') {
      callback = function() {};
    }

    this._callback = function(val) {
      _this.off();
      callback(val);
    };

    this._board.on(BoardEvent.SYSEX_MESSAGE, this._messageHandler);
    this.addListener(StepperEvent.MESSAGE, this._callback);
  };

  proto.off = function() {
    this._board.removeListener(BoardEvent.SYSEX_MESSAGE, this._messageHandler);
    this.removeListener(StepperEvent.MESSAGE, this._callback);
    this._callback = null;
  };

  scope.module.Stepper = Stepper;
}));
