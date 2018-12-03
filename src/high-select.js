(function(){
    const KEYCODES = {
        ENTER: 13,
        ESC: 27,
        ARROW_LEFT: 37,
        ARROW_UP: 38,
        ARROW_RIGHT: 39,
        ARROW_DOWN: 40,
        HOME: 36,
        END: 35
    }

    const isKeyPrintable = (keyCode) => {
        return (keyCode > 47 && keyCode < 58) || keyCode == 32 || (keyCode > 64 && keyCode < 91) || (keyCode > 95 && keyCode < 112) || (keyCode > 185 && keyCode < 193) || (keyCode > 218 && keyCode < 223);
    }

    const template = document.createElement('template');
    template.innerHTML = `
        <style>
            :host {
                display: inline-block;
                position: relative;
                user-select: none;
                outline-width: 0px;
                text-align: justify;
            }
        
            #caller {
                display: flex;
                padding: var(--caller-padding, 3px 6px);
                background: var(--caller-background, #fff);
                color: var(--caller-color, inherit);
                white-space: nowrap;
                box-shadow: var(--caller-shadow, 0px 0px 2px #666, inset 0px 0px 5px 0px #eee);
                border-radius: var(--caller-border-radius, 3px);
                height: inherit;
                width: inherit;
                align-items: center;
            }#caller :first-child{ 
                position: relative;
                width: inherit;
                overflow-x: hidden;
            }
            
            :host([disabled]) #caller {
                color: var(--caller-disabled-color, #aaa);
                background: var(--caller-disabled-background, #eee);
            }:host(:not([disabled])) #caller:hover{
                cursor: var(--caller-hover-cursor, pointer);
                background: var(--caller-hover-background, #fcfcfc);
                color: var(--caller-hover-color, #000);
            }:host(:not([disabled]):focus) #caller{
                outline: var(--caller-focus-outline, rgb(229, 151, 0) auto 1px);
            }
    
            :host([arrow]) #arrow {
                font-size: var(--arrow-font-size, 8px);
                margin: var(--arrow-margin, 0px 3px);
                color: var(--arrow-color, #000);
            }:host(:not([arrow])) #arrow {
                display: none;
            }
            
            #bigot {
                position: fixed;
                box-shadow: var(--bigot-shadow, 0px 0px 6px #ccc);
                background: var(--bigot-background, #fff);
                border: var(--bigot-border, 1px solid #ccc);
                z-index: 3;
            }
    
            #holder {
                overflow-y: auto;
            }

            :host(:not([search])) #search{
                display: none;
            }
    
            #search input[type=text]{
                outline: var(--input-outline, 0px solid #aaa);
                margin: var(--input-margin, 0px);
                width: var(--input-width, 98%);
                border-width: var(--input-border-width, 0px 0px 1px 0px);
                border-color: var(--input-border-color, #ccc);
                border-style: var(--input-border-style, solid);
                font: var(--input-font, 12pt arial);
                padding: var(--input-padding, 2px 1%);
                color: var(--input-color, #000);
                background: var(--input-background, #fff);
            }
    
            ::slotted(high-option){
                display: block;
                cursor: pointer;
                padding: 3px 6px;
                white-space: nowrap;
                height: normal;
                line-height: normal;
            }::slotted(high-option[hidden]){
                display: none;
            }::slotted([disabled]){
                background: #f9f9f9; color: #ddd;
            }::slotted(:not([considered])):hover {
                background: rgba(238, 238, 238, 0.767);
            }::slotted(high-option[considered]){
                background: #0080ff; color: #eee;
            }::slotted(high-option[selected]){
                background: #eee; color: #000;
            }

            :host-context(.dark){
                color: #e5c070;
            }

            :host-context(.dark) #caller{
                background: #282c34;
                box-shadow: 0px 0px 2px #000, inset 0px 0px 5px 0px #21252b;
            }
            
            :host-context(.dark:not([disabled])) #caller:hover{
                background: #21252b;
                color: #e5c070;
            }
            
            :host-context(.dark[arrow]) #arrow {
                color: #e5c070;
            }
            
            :host-context(.dark) #bigot {
                box-shadow: 0px 0px 6px #000;
                background: #282c34;
                border: 1px solid #000;
            }

            :host-context(.dark) #search input[type=text]{
                border-color: #666;
                background: #282c34;
                color: #e5c070;
            }

            :host-context(.dark) ::slotted([disabled]){
                background: #32363e; color: #4e5562;
            }:host-context(.dark) ::slotted(high-option[considered]){
                background: #e5c070; color: #282c34;
            }:host-context(.dark) ::slotted(high-option[selected]:not([considered])){
                background: #373c44; color: #89bd55;
            }
        </style>

        <div id="caller">
            <span id="chosen"></span> <span id="arrow">&#9660;</span>
        </div>
        <section id="bigot" hidden>
            <div id="search">
                <input type="text" spellcheck="false" tabindex="-1">
            </div>
            <div id="holder">
                <slot name="option" maxlength="20"></option>
            </div>
        </section>
    `;

    class HighSelect extends HTMLElement {
        static get observedAttributes(){
            return ['expanded', 'disabled'];
        }

        set value(value){
            if( typeof value === "string" || typeof value === "number" ){
                const options = this._allValidOptions();
                for( let option of options ){
                    if( option.value == value ){
                        option.selected = true;
                        return;
                    }
                }
            }
        }

        get value(){
            return this._selectedOption ? this._selectedOption.value : '';
        }

        set expanded(value){
            Boolean(value) ? this.setAttribute('expanded', '') : this.removeAttribute('expanded');
        }

        get expanded(){
            return this.hasAttribute('expanded');
        }

        set disabled(value){
            Boolean(value) ? this.setAttribute('disabled', '') : this.removeAttribute('disabled');
        }

        get disabled(){
            return this.hasAttribute('disabled');
        }

        constructor(){
            super();
            this._onSlotChange = this._onSlotChange.bind(this);
            this._onCallerClick = this._onCallerClick.bind(this);
            this._onKeyUp = this._onKeyUp.bind(this);
            this.attachShadow({mode: 'open'});
            this.shadowRoot.appendChild(template.content.cloneNode(true));

            this._optionSlot= this.shadowRoot.querySelector("slot[name=option]");
            this.caller     = this.shadowRoot.querySelector("#caller");
            this.chosen     = this.caller.firstElementChild;
            this.arrowElm   = this.caller.children[1];
            this.bigot      = this.shadowRoot.querySelector("#bigot");
            this.searchElm  = this.bigot.firstElementChild;
            this.input      = this.searchElm.firstElementChild;
            this.holder     = this.bigot.children[1];

            this._optionSlot.addEventListener('slotchange', this._onSlotChange);
            this.caller.addEventListener('click', this._onCallerClick);
            this.input.addEventListener('keyup', this._onKeyUp);
            document.addEventListener('scroll', function(){
                if( this.expanded ){
                    this.expanded = false;
                    this.focus();
                }
            }.bind(this));
        }

        connectedCallback(){
            this.addEventListener('blur', this._onBlur);
            this.addEventListener('mousedown', this._onMouseDown);
            this.addEventListener('mouseup', this._onMouseUp);
            this.addEventListener('keydown', this._onKeyDown);
            customElements.whenDefined("high-option").then( _ => {
                this._initializing();
            });
        }

        disconnectedCallback(){
            this.caller.removeEventListener('click', this._onCallerClick);
            this.input.removeEventListener('keyup', this._onKeyUp);
            this.removeEventListener('blur', this._onBlur);
            this.removeEventListener('mousedown', this._onMouseDown);
            this.removeEventListener('mouseup', this._onMouseUp);
            this.removeEventListener('keydown', this._onKeyDown);
        }

        attributeChangedCallback(){
            this.expanded ? this._expand() : this._collapse();
            if( this.disabled ){
                this.blur();
                this.setAttribute('tabindex', '-1');
            }
        }

        // events
        _onSlotChange(){
            this.options = this._allOptions();
        }

        _onCallerClick(event){
            this._toggle();
        }

        _onMouseDown(event){
            let option = event.target.closest('high-option');
            if( this._isValidAndEnabled(option) ){
                option.considered = true;
            }
        }

        _onMouseUp(event){
            const option = event.target.closest('high-option');
            if( this._isValidAndEnabled(option) ){
                this._select( option );
                this.expanded = false;
            }
        }

        _onKeyDown(event){
            let option;
            switch(event.keyCode){
                case KEYCODES.HOME:
                    event.preventDefault();
                    option = this._firstOption();
                    if( option )
                        this.expanded ? option.considered = true : this._select(option);
                break;
                case KEYCODES.ARROW_UP:
                    event.preventDefault();
                    option = this._previousOption();
                    if( option )
                        this.expanded ? option.considered = true : this._select(option);
                break;
                case KEYCODES.ARROW_DOWN:
                    event.preventDefault();
                    option = this._nextOption();
                    if( option )
                        this.expanded ? option.considered = true : this._select(option);
                break;
                case KEYCODES.END:
                    event.preventDefault();
                    option = this._lastOption();
                    if( option )
                        this.expanded ? option.considered = true : this._select(option);
                break;
                case KEYCODES.ESC:
                    event.preventDefault();
                    this.expanded = false;
                    this.focus();
                break;
                case KEYCODES.ENTER:
                    event.preventDefault();
                    if( this.expanded ){
                        if( this._consideredOption ){
                            this._select( this._consideredOption );
                            this.expanded = false;
                            this.focus();
                        }
                    } else {
                        this.expanded = true;
                    }
                break;
                default:
                    if( !this.expanded ){
                        if( isKeyPrintable(event.keyCode) ){
                            this.input.focus();
                            this.expanded = true;
                        } else {
                            event.preventDefault();
                        }
                    }
                break;
            }
        }

        _onKeyUp(event){
            if( event.target.value !== this._searchContent ){
                this._searching(event.target.value.trim().toLowerCase());
                
                this._searchContent = event.target.value;
            }
        }

        _onBlur(){
            this.expanded = false;
        }


        // main methods
        _initializing(){
            const allOptions = this._allOptions();
            if( !this._selectedOption && allOptions.length ) this._firstOption().selected = true;
            if( !this.hasAttribute('tabindex') ) this.setAttribute('tabindex', '0');
            this.options = allOptions;
        }

        _expand(){
            this.bigot.hidden = false;
            this._attachBigotToCaller();
            this.input.focus();
            if( this._selectedOption )
                this._selectedOption.scrollIntoView({block: "center"});
        }

        _collapse(){
            this.bigot.hidden = true;
            this._releaseBigot();
            if( this._consideredOption ){
                this._consideredOption.considered = false;
                this._consideredOption = null
            }
            this._resetSearch();
        }

        _toggle(){
            this.expanded = !this.expanded;
        }

        _select( option ){
            if( this._isValidAndEnabled(option) && option !== this._selectedOption ){
                option.selected = true;
                this._createChangeEvent();
            }
        }

        _transcend(option){
            if( this._isValidAndEnabled(option) && this._selectedOption !== option ){
                if( this._selectedOption ) this._selectedOption.selected = false;
                this._selectedOption = option;
                this.chosen.innerHTML = option.content;
            }
        }

        _consider(option){
            if( this._isValidOption(option) && this._consideredOption !== option ){
                if( this._consideredOption ) this._consideredOption.considered = false;
                this._consideredOption = option;
                option.scrollIntoView({block: "nearest"});
            }
        }
        
        _searching(content){
            let notFoundRecords, notFoundInContent, option;
            for( option of this.options ){
                if( this._isValidOption(option) )
                    notFoundRecords = option.record.toLowerCase().indexOf(content) === -1;
                notFoundInContent = option.innerText.toLowerCase().indexOf(content) === -1;
                option.hidden = notFoundInContent && notFoundRecords;
            }

            if( !this._isValidAndEnabledAndVisible(this._consideredOption) && !this._isValidAndEnabledAndVisible(this._selectedOption) ){
                const firstOption = this._firstOption();
                if( firstOption ) firstOption.considered = true;
            }
        }
        
        _resetSearch(){
            if( this.input.value ){
                this.input.value = '';
                this._searchContent = '';
                for( let option of this.options ){
                    option.hidden = false;
                }
            }
        }


        // validators
        _isValidOption( option ){
            return option instanceof HighOption && option.tagName.toLowerCase() === 'high-option';
        }

        _isValidAndEnabled( option ){
            return this._isValidOption(option) && !option.disabled;
        }

        _isValidAndEnabledAndVisible( option ){
            return this._isValidAndEnabled(option) && !option.hidden;
        }


        // option's getters
        _allOptions(){
            return Array.from(this.children);
        }

        _allValidOptions(){
            return Array.from(this.querySelectorAll('high-option:not([hidden]):not([disabled])'));
        }

        _firstOption(){
            return this.querySelector("high-option:not([disabled]):not([hidden])");
        }

        _nextOption(){
            const currentOption = this._consideredOption || this._selectedOption;
            if( this._isValidAndEnabled(currentOption) && !currentOption.hidden ){
                let nextOption = currentOption.nextElementSibling;
                while( true ){
                    if( !nextOption ) break;
                    if( !nextOption.hidden && this._isValidAndEnabled(nextOption) ) return nextOption;
                    nextOption = nextOption.nextElementSibling;
                }
            } else
                return this._firstOption();
        }

        _previousOption(){
            const currentOption = this._consideredOption || this._selectedOption;
            if( this._isValidAndEnabled(currentOption) && !currentOption.hidden ){
                let previousOption = currentOption.previousElementSibling;
                while( true ){
                    if( !previousOption ) break;
                    if( !previousOption.hidden && this._isValidAndEnabled(previousOption) ) return previousOption;
                    previousOption = previousOption.previousElementSibling;
                }
            } else
                return this._lastOption();
        }

        _lastOption(){
            const options = this._allValidOptions();
            return Object.values(options)[options.length - 1];
        }


        // helpers
        _attachBigotToCaller(){
            const callerSizeAndPosition = this.caller.getBoundingClientRect();
            const bigotSizeAndPosition = this.bigot.getBoundingClientRect();
            const topSpace = callerSizeAndPosition.top;
            const bottomSpace = window.innerHeight - callerSizeAndPosition.bottom;
            const newBigotTop = topSpace + callerSizeAndPosition.height;
            const newBigotBottom = bottomSpace + callerSizeAndPosition.height;

            this.bigot.style.minWidth = callerSizeAndPosition.width + "px";

            if( bottomSpace < bigotSizeAndPosition.height ){
                // is there enough space from top
                if( topSpace > bottomSpace ){
                    // show select on the top
                    this.bigot.style.bottom = newBigotBottom + "px";
                    
                    if( topSpace < bigotSizeAndPosition.height ) 
                        this.holder.style.maxHeight = topSpace - this.searchElm.clientHeight - 10 + "px";
                } else {
                    // show select on the bottom
                    this.bigot.style.top = newBigotTop + "px";
                    this.holder.style.maxHeight = bottomSpace - this.searchElm.clientHeight - 10 + "px";
                }
            } else {
                this.bigot.style.top = newBigotTop + "px";
            }

            if( bigotSizeAndPosition.right > window.innerWidth )
                this.bigot.style.right = "0px";

            if( bigotSizeAndPosition.left < 0 )
                this.bigot.style.left = '0px';
        }

        _releaseBigot(){
            this.holder.style.maxHeight = 'none';
            this.bigot.style.top = 'auto';
            this.bigot.style.bottom = 'auto';
            this.bigot.style.left = 'auto';
            this.bigot.style.right = 'auto';
        }

        _createChangeEvent(){
            const event = new CustomEvent('change', {
                target: this,
                bubbles: true
            });
            this.dispatchEvent(event);
        }
    }
    customElements.define('high-select', HighSelect);


    class HighOption extends HTMLElement{
        static get observedAttributes(){
            return ['selected', 'considered', 'disabled'];
        }

        set selected(value){
            Boolean(value) ? this.setAttribute('selected', '') : this.removeAttribute('selected');
        }

        get selected(){
            return this.hasAttribute('selected');
        }

        set considered(value){
            Boolean(value) ? this.setAttribute('considered', '') : this.removeAttribute('considered');
        }

        get considered(){
            return this.hasAttribute('considered');
        }

        set disabled(value){
            Boolean(value) ? this.setAttribute('disabled', '') : this.removeAttribute('disabled');
        }

        get disabled(){
            return this.hasAttribute('disabled');
        }
        
        set value(value){
            value ? this.setAttribute('value', value) : this.removeAttribute('value');
        }

        get value(){
            if( this.hasAttribute('value') ){
                return this.getAttribute('value');
            } else {
                const innerText = this.innerText.trim().toLowerCase();
                return innerText ? innerText : this.title; 
            }
        }

        set title(value){
            value ? this.setAttribute('title', value) : this.removeAttribute('title');
        }

        get title(){
            return this.hasAttribute('title') ? this.getAttribute('title') : '';
        }

        set record(value){
            value ? this.setAttribute('record', value) : this.removeAttribute('record');
        }

        get record(){
            return this.hasAttribute('record') ? this.getAttribute('record') : this.title;
        }

        set slot(value){
            this.setAttribute('slot', 'option');
        }

        get slot(){
            return this.getAttribute('slot');
        }

        get content(){
            return this.title ? this.title : this.innerHTML;
        }

        constructor(){
            super();
            if( this.slot !== 'option' ) this.slot = '';
        }

        connectedCallback(){
            this._upgradeProperty('selected');
            this._upgradeProperty('considered');
            this._upgradeProperty('disabled');
        }

        attributeChangedCallback(){
            const validAndEnable = this._haveValidParent() && !this.disabled;
            if( this.selected && validAndEnable )
                this.parentNode._transcend(this);

            if( this.considered && validAndEnable )
                this.parentNode._consider(this);
                
            if( this.disabled ){ 
                this.selected = false;
                this.considered = false;
            }
        }

        _upgradeProperty(prop) {
            if (this.hasOwnProperty(prop)) {
              let value = this[prop];
              delete this[prop];
              this[prop] = value;
            }
        }

        _haveValidParent(){
            return this.parentNode.tagName.toLowerCase() === 'high-select' ? true : false;
        }
    }
    customElements.define('high-option', HighOption);
})();