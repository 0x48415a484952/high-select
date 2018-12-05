(function(){const a={ENTER:13,ESC:27,ARROW_LEFT:37,ARROW_UP:38,ARROW_RIGHT:39,ARROW_DOWN:40,HOME:36,END:35},b=f=>{return 47<f&&58>f||32==f||64<f&&91>f||95<f&&112>f||185<f&&193>f||218<f&&223>f},c=document.createElement('template');c.innerHTML=`
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
    
            ::slotted(high-option), high-option{
                display: block;
                cursor: pointer;
                padding: 3px 6px;
                height: auto;
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
    `;class d extends HTMLElement{static get observedAttributes(){return['expanded','disabled']}set value(f){if('string'==typeof f||'number'==typeof f){const g=this._allValidOptions();for(let h of g)if(h.value==f)return void(h.selected=!0)}}get value(){return this._selectedOption?this._selectedOption.value:''}set expanded(f){!!f?this.setAttribute('expanded',''):this.removeAttribute('expanded')}get expanded(){return this.hasAttribute('expanded')}set disabled(f){!!f?this.setAttribute('disabled',''):this.removeAttribute('disabled')}get disabled(){return this.hasAttribute('disabled')}constructor(){super(),this._onSlotChange=this._onSlotChange.bind(this),this._onCallerClick=this._onCallerClick.bind(this),this._onKeyUp=this._onKeyUp.bind(this),this.attachShadow({mode:'open'}),this.shadowRoot.appendChild(c.content.cloneNode(!0)),this._optionSlot=this.shadowRoot.querySelector('slot[name=option]'),this.caller=this.shadowRoot.querySelector('#caller'),this.chosen=this.caller.firstElementChild,this.arrowElm=this.caller.children[1],this.bigot=this.shadowRoot.querySelector('#bigot'),this.searchElm=this.bigot.firstElementChild,this.input=this.searchElm.firstElementChild,this.holder=this.bigot.children[1],this._optionSlot.addEventListener('slotchange',this._onSlotChange),this.caller.addEventListener('click',this._onCallerClick),this.input.addEventListener('keyup',this._onKeyUp),document.addEventListener('scroll',function(){this.expanded&&(this.expanded=!1,this.focus())}.bind(this))}connectedCallback(){this.addEventListener('blur',this._onBlur),this.addEventListener('mousedown',this._onMouseDown),this.addEventListener('mouseup',this._onMouseUp),this.addEventListener('keydown',this._onKeyDown),customElements.whenDefined('high-option').then(()=>{this._initializing()})}disconnectedCallback(){this.caller.removeEventListener('click',this._onCallerClick),this.input.removeEventListener('keyup',this._onKeyUp),this.removeEventListener('blur',this._onBlur),this.removeEventListener('mousedown',this._onMouseDown),this.removeEventListener('mouseup',this._onMouseUp),this.removeEventListener('keydown',this._onKeyDown)}attributeChangedCallback(){this.expanded?this._expand():this._collapse(),this.disabled&&(this.blur(),this.setAttribute('tabindex','-1'))}_onSlotChange(){this._initializing()}_onCallerClick(){this._toggle()}_onMouseDown(f){let g=f.target.closest('high-option');this._isValidAndEnabled(g)&&(g.considered=!0)}_onMouseUp(f){const g=f.target.closest('high-option');this._isValidAndEnabled(g)&&(this._select(g),this.expanded=!1)}_onKeyDown(f){let g;switch(f.keyCode){case a.HOME:f.preventDefault(),g=this._firstOption(),g&&(this.expanded?g.considered=!0:this._select(g));break;case a.ARROW_UP:f.preventDefault(),g=this._previousOption(),g&&(this.expanded?g.considered=!0:this._select(g));break;case a.ARROW_DOWN:f.preventDefault(),g=this._nextOption(),g&&(this.expanded?g.considered=!0:this._select(g));break;case a.END:f.preventDefault(),g=this._lastOption(),g&&(this.expanded?g.considered=!0:this._select(g));break;case a.ESC:f.preventDefault(),this.expanded=!1,this.focus();break;case a.ENTER:f.preventDefault(),this.expanded?this._consideredOption&&(this._select(this._consideredOption),this.expanded=!1,this.focus()):this.expanded=!0;break;default:!this.expanded&&b(f.keyCode)&&(this.input.focus(),this.expanded=!0);}}_onKeyUp(f){f.target.value!==this._searchContent&&(this._searching(f.target.value.trim().toLowerCase()),this._searchContent=f.target.value)}_onBlur(){this.expanded=!1}_initializing(){const f=this._allOptions();!this._selectedOption&&f.length&&(this._firstOption().selected=!0),this.hasAttribute('tabindex')||this.setAttribute('tabindex','0'),this.options=f}_expand(){this.bigot.hidden=!1,this._attachBigotToCaller(),this.input.focus(),this._selectedOption&&this._selectedOption.scrollIntoView({block:'center'})}_collapse(){this.bigot.hidden=!0,this._releaseBigot(),this._consideredOption&&(this._consideredOption.considered=!1,this._consideredOption=null),this._resetSearch()}_toggle(){this.expanded=!this.expanded}_select(f){this._isValidAndEnabled(f)&&f!==this._selectedOption&&(f.selected=!0,this._createChangeEvent())}_transcend(f){this._isValidAndEnabled(f)&&this._selectedOption!==f&&(this._selectedOption&&(this._selectedOption.selected=!1),this._selectedOption=f,this.chosen.innerHTML=f.content)}_consider(f){this._isValidOption(f)&&this._consideredOption!==f&&(this._consideredOption&&(this._consideredOption.considered=!1),this._consideredOption=f,f.scrollIntoView({block:'nearest'}))}_searching(f){let g,h,i;for(i of this.options)this._isValidOption(i)&&(g=-1===i.record.toLowerCase().indexOf(f)),h=-1===i.innerText.toLowerCase().indexOf(f),i.hidden=h&&g;if(!this._isValidAndEnabledAndVisible(this._consideredOption)&&!this._isValidAndEnabledAndVisible(this._selectedOption)){const j=this._firstOption();j&&(j.considered=!0)}}_resetSearch(){if(this.input.value){this.input.value='',this._searchContent='';for(let f of this.options)f.hidden=!1}}_isValidOption(f){return f instanceof e&&'high-option'===f.tagName.toLowerCase()}_isValidAndEnabled(f){return this._isValidOption(f)&&!f.disabled}_isValidAndEnabledAndVisible(f){return this._isValidAndEnabled(f)&&!f.hidden}_allOptions(){return Array.from(this.children)}_allValidOptions(){return Array.from(this.querySelectorAll('high-option:not([hidden]):not([disabled])'))}_firstOption(){return this.querySelector('high-option:not([disabled]):not([hidden])')}_nextOption(){const f=this._consideredOption||this._selectedOption;if(this._isValidAndEnabled(f)&&!f.hidden)for(let g=f.nextElementSibling;!!g;){if(!g.hidden&&this._isValidAndEnabled(g))return g;g=g.nextElementSibling}else return this._firstOption()}_previousOption(){const f=this._consideredOption||this._selectedOption;if(this._isValidAndEnabled(f)&&!f.hidden)for(let g=f.previousElementSibling;!!g;){if(!g.hidden&&this._isValidAndEnabled(g))return g;g=g.previousElementSibling}else return this._lastOption()}_lastOption(){const f=this._allValidOptions();return Object.values(f)[f.length-1]}_attachBigotToCaller(){const f=this.caller.getBoundingClientRect(),g=this.bigot.getBoundingClientRect(),h=f.top,i=window.innerHeight-f.bottom,j=h+f.height,k=i+f.height;this.bigot.style.minWidth=f.width+'px',i<g.height?h>i?(this.bigot.style.bottom=k+'px',h<g.height&&(this.holder.style.maxHeight=h-this.searchElm.clientHeight-10+'px')):(this.bigot.style.top=j+'px',this.holder.style.maxHeight=i-this.searchElm.clientHeight-10+'px'):this.bigot.style.top=j+'px',g.right>window.innerWidth&&(this.bigot.style.right='0px'),0>g.left&&(this.bigot.style.left='0px')}_releaseBigot(){this.holder.style.maxHeight='none',this.bigot.style.top='auto',this.bigot.style.bottom='auto',this.bigot.style.left='auto',this.bigot.style.right='auto'}_createChangeEvent(){const f=new CustomEvent('change',{target:this,bubbles:!0});this.dispatchEvent(f)}}customElements.define('high-select',d);class e extends HTMLElement{static get observedAttributes(){return['selected','considered','disabled']}set selected(f){!!f?this.setAttribute('selected',''):this.removeAttribute('selected')}get selected(){return this.hasAttribute('selected')}set considered(f){!!f?this.setAttribute('considered',''):this.removeAttribute('considered')}get considered(){return this.hasAttribute('considered')}set disabled(f){!!f?this.setAttribute('disabled',''):this.removeAttribute('disabled')}get disabled(){return this.hasAttribute('disabled')}set value(f){f?this.setAttribute('value',f):this.removeAttribute('value')}get value(){if(this.hasAttribute('value'))return this.getAttribute('value');const f=this.innerText.trim().toLowerCase();return f?f:this.title}set title(f){f?this.setAttribute('title',f):this.removeAttribute('title')}get title(){return this.hasAttribute('title')?this.getAttribute('title'):''}set record(f){f?this.setAttribute('record',f):this.removeAttribute('record')}get record(){return this.hasAttribute('record')?this.getAttribute('record'):this.title}set slot(f){this.setAttribute('slot','option')}get slot(){return this.hasAttribute('slot')?this.getAttribute('slot'):''}get content(){return this.title?this.title:this.innerHTML}constructor(){super()}connectedCallback(){'option'!==this.slot&&(this.slot=''),this._upgradeProperty('selected'),this._upgradeProperty('considered'),this._upgradeProperty('disabled')}attributeChangedCallback(){const f=this._haveValidParent()&&!this.disabled;this.selected&&f&&this.parentNode._transcend(this),this.considered&&f&&this.parentNode._consider(this),this.disabled&&(this.selected=!1,this.considered=!1)}_upgradeProperty(f){if(this.hasOwnProperty(f)){let g=this[f];delete this[f],this[f]=g}}_haveValidParent(){return!!this.parentNode&&'high-select'===this.parentNode.tagName.toLowerCase()}}customElements.define('high-option',e)})();