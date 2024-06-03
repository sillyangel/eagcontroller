function keyEvent(name, state) {
    const keyName = name.toUpperCase().charCodeAt(0)
    window.dispatchEvent(new KeyboardEvent(state, {
		key: name,
		keyCode: keyName,
		which: keyName
    }));
}
function shiftKeyEvent(state) {
    window.dispatchEvent(new KeyboardEvent(state, {
		keyCode: 16,
		which: 16
    }));
}
function mouseEvent(number, state, canvas) {
	canvas.dispatchEvent(new PointerEvent(state, {"button": number}))
}
function wheelEvent(canvas, delta) {
	canvas.dispatchEvent(new WheelEvent("wheel", {
		"wheelDeltaY": delta
  }));
}
// Check for gamepad support
if (!('getGamepads' in navigator)) {
    console.log('Gamepad API not supported');
}

window.addEventListener('gamepadconnected', function(e) {
    console.log('Gamepad connected');
    // Start polling for button presses
    gamepadPolling();
});

function gamepadPolling() {
	var canvas = document.querySelector('canvas');
    let gamepads = navigator.getGamepads();
    for(let i = 0; i < gamepads.length; i++) {
        let gamepad = gamepads[i];
        if(gamepad) {
            // Assuming the left stick is represented by axes 0 (X-axis) and 1 (Y-axis)
            let leftStickX = gamepad.axes[0];
            let leftStickY = gamepad.axes[1];

            // You might want to add some deadzone to ignore small movements
            let deadzone = 0.2;

            // Reset all movement to 'keyup' state
            keyEvent("w", "keyup");
            keyEvent("a", "keyup");
            keyEvent("s", "keyup");
            keyEvent("d", "keyup");

            if(Math.abs(leftStickX) > deadzone || Math.abs(leftStickY) > deadzone) {
                if(leftStickY < 0) {
                    keyEvent("w", "keydown"); // Up
                }
                if(leftStickY > 0) {
                    keyEvent("s", "keydown"); // Down
                }
                if(leftStickX > 0) {
                    keyEvent("d", "keydown"); // Right
                }
                if(leftStickX < 0) {
                    keyEvent("a", "keydown"); // Left
                }
            }
			// Assuming the right stick is represented by axes 2 (X-axis) and 3 (Y-axis)
			let buttonStates = [];
			let buttonKeyMapping = {
				0: " ",
				3: "e",
				13: "q",
				2: "e",
				1: "À",
				11: "shift",
				10: "r",
				9: "À"
			};

		let lastButtonPressTime = {};

		// Inside your gamepadPolling function...
		for(let button in buttonKeyMapping) {
			if(gamepad.buttons[button].pressed) {
				let currentTime = Date.now();
				let timeSinceLastPress = lastButtonPressTime[button] ? currentTime - lastButtonPressTime[button] : Infinity;

				// Only trigger event if enough time has passed since the last press
				if(timeSinceLastPress > 200) { // 200ms delay
					// Existing button press logic...
					lastButtonPressTime[button] = currentTime;
				}
			} else {
				// Existing button release logic...
				lastButtonPressTime[button] = 0;
			}
		}

				if(gamepad.buttons[4].pressed) {
					wheelEvent(canvas, 2);
				}
				if(gamepad.buttons[5].pressed) {
					wheelEvent(canvas, -2);
				}
				if(gamepad.buttons[7].pressed) {
					mouseEvent(0, "mousedown", canvas)
				} else {
					mouseEvent(0, "mouseup", canvas)
				}
				if(gamepad.buttons[6].pressed) {
					mouseEvent(2, "mousedown", canvas)
				} else {
					mouseEvent(2, "mouseup", canvas)
				}
		}
    }

    // Continue polling
    requestAnimationFrame(gamepadPolling);
}
