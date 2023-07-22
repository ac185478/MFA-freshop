const Keyboard = {
    multiMode: true,
    selectedElement: "",
    elements: {
        main: null,
        keysContainer: null,
        keys: []
    },
    keyboard_type: "numeric",
    eventHandlers: {
        oninput: null,
        onclose: null
    },

    properties: {
        value: "",
        capsLock: false
    },

    init() {
        // Create main elements
        Keyboard.elements.main = document.createElement("div");
        Keyboard.elements.keysContainer = document.createElement("div");

        // Setup main elements
        Keyboard.elements.main.classList.add("keyboard");
        Keyboard.elements.keysContainer.classList.add("keyboard__keys");

        if(Keyboard.multiMode == false){
            // Run only full keyboard
            Keyboard._setupKeyboard("alfa");
        }
        
        Keyboard.elements.keys = Keyboard.elements.keysContainer.querySelectorAll(".keyboard__key");
        Keyboard.elements.main.appendChild(Keyboard.elements.keysContainer);        
        document.querySelector('body').appendChild(Keyboard.elements.main);

        Keyboard._setupKeyboard("password");
        document.addEventListener('click',function(event){

            if(event.target.matches('input[type="password"]')){
                Keyboard._setupKeyboard("password");
                Keyboard.selectedElement = event.target;
                Keyboard.open(event.target.value, currentValue => {
                    event.target.value = currentValue;
                });
            }

            
        }, true);
    },

    _setupKeyboard(type) {
        Keyboard.elements.keysContainer.innerHTML = "";
        Keyboard.elements.keysContainer.appendChild(Keyboard._createKeys(type));
    },
    _createKeys(keyboard_type) {
        const fragment = document.createDocumentFragment();
        var keyLayout = [];
        function getRandomInt(n) {
            return Math.floor(Math.random() * n);
          }
          function shuffle(s) {
            var arr = s.split('');           // Convert String to array
            var n = arr.length;              // Length of the array
            
            for(var i=0 ; i<n-1 ; ++i) {
              var j = getRandomInt(n);       // Get random of [0, n-1]
              
              var temp = arr[i];             // Swap arr[i] and arr[j]
              arr[i] = arr[j];
              arr[j] = temp;
            }
            
            s = arr.join('');                // Convert Array to string
            return s;                        // Return shuffled string
          }
        let val = shuffle('0123456789');
        console.log(val);
        if(keyboard_type == "password"){
            keyLayout = [
                val[0], val[1], val[2], "br", val[3], val[4], val[5], "br", val[6], val[7], val[8], "br", val[9], "backspace","done"
                ];
        } else {
            
        }
        

        // Creates HTML for an icon
        const createIconHTML = (icon_name) => {
            return `<i class="material-icons">${icon_name}</i>`;
        };

        keyLayout.forEach(key => {
            const keyElement = document.createElement("button");
            const insertLineBreak = ["backspace", "p", "enter", "?", "br"].indexOf(key) !== -1;

            // Add attributes/classes
            keyElement.setAttribute("type", "button");
            keyElement.classList.add("keyboard__key");

            switch (key) {
                case "backspace":
                    keyElement.classList.add("backspace-btn");
                    keyElement.innerHTML = createIconHTML("backspace");

                    keyElement.addEventListener("click", () => {
                        this.properties.value = this.properties.value.substring(0, this.properties.value.length - 1);
                        this._triggerEvent("oninput");
                    });

                    break;

                

                case "done":
                    keyElement.classList.add("keyboard__key--wide", "keyboard__key--dark");
                    keyElement.innerHTML = createIconHTML("check_circle");

                    keyElement.addEventListener("click", () => {
                        this.close();
                        this._triggerEvent("onclose");
                    });

                    break;

                case "br":
                    keyElement.classList.add("hide-me");
                    break;

                default:
                    keyElement.textContent = key.toLowerCase();                    
                    keyElement.addEventListener("click", () => {
                        this.properties.value += this.properties.capsLock ? key.toUpperCase() : key.toLowerCase();
                        this._triggerEvent("oninput");                 
                        
                        // Propagate Keyboard event
                        this._fireKeyEvent();
                           
                    });                    

                    break;
            }

            fragment.appendChild(keyElement);

            if (insertLineBreak) {
                fragment.appendChild(document.createElement("br"));
            }
        });

        
        return fragment;
    },

    _fireKeyEvent(){
        let evt = new KeyboardEvent("input", {
            bubbles: true,
            cancelable: true,
            view: window
        });
        
        // Create and dispatch keyboard simulated Event
        Keyboard.selectedElement.dispatchEvent(evt);
     },

    _triggerEvent(handlerName) {
        if (typeof this.eventHandlers[handlerName] == "function") {
            console.log(this.eventHandlers[handlerName]);  
            this.eventHandlers[handlerName](this.properties.value);
        }
    },

    _toggleCapsLock() {
        this.properties.capsLock = !this.properties.capsLock;

        for (const key of this.elements.keys) {
            if (key.childElementCount === 0) {
                key.textContent = this.properties.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
            }
        }
    },

    open(initialValue, oninput, onclose) {
        this.properties.value = initialValue || "";
        this.eventHandlers.oninput = oninput;
        // this.eventHandlers.onclose = onclose;
        // this.elements.main.classList.remove("keyboard--hidden");

    },

    close() {
        this.properties.value = "";
        // this.eventHandlers.oninput = oninput;
        // this.eventHandlers.onclose = onclose;
        // this.elements.main.classList.add("keyboard--hidden");
    }
};

  setTimeout(function(){
    console.log("###### Keyboard -  The page has loaded succ.");
    Keyboard.init();
}, 500);
