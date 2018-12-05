# high-select

High-select is a webcomponent custom element, looks like classic select html element but with more capabilities, for instance: putting html tags in its options, customizing search records for any options and customizing its styles.


## Installation

You can use high-select via script tag or node.

### Script Tag

add below tag to your html document

```html
<script  type="module" src='https://unpkg.com/high-select@0.0.5/lib/high-select.js'></script>
```

### npm

```npm
 npm install high-select --save
````

once you installed the package, you can add this tag to your html document

```html
<script  type="module" src='node_modules/high-select/lib/high-select.js'></script>
```

## Usage

first, create your high-select tag

```html
<high-select></high-select>
```

then add some options inside it

```html
<high-select>
    <hi-option> option 1 </high-option>
    <hi-option> option 2 </high-option>
    <hi-option> option 3 </high-option>
    <hi-option> option 4 </high-option>
    <hi-option> option 5 </high-option>
</high-select>
```

your high-select element is ready.

## How does it work?

`high-select` let you select an option from a list of them, like the classic one. so the value of selected option will be the value of the select element.

### value of an option

until you give an `option` a `value` attribute the option `innerText` would be the value of that. so if you have a custom value you must put it in the value attribute like thise.

```html
<high-option value="1"> Option 1 </high-option>
```

### default value of select

if you give an option a `selected` attribute, it would be the select value untill user change it. otherwise the first option would be selected be default.

### search

to enable search in options you sould give the `high-select` a `search` attribute.

```html
<high-select search></high-select>
```

#### customize the search

give options a `record` attribute and put your records there, when user search for a something, high-select search for any string in the `record` attribute and the option's innerText that match the case.

```html
<high-select search>
    <high-option value="1" record="one uno"> option 1 </high-option>
</high-select>
```

### using html in options

you allowed to use html like images and ... in options, but you must give the option a `title` attribute, so when user select the option the title would be shown as selected option.

```html
<high-select search>
    <high-option>Select a country</high-option>
    <high-option value="it" title="italy">
        <img src="an-image-of-italy">    
    <high-option>
    <high-option value="fr" title="france">
        <img src="an-image-of-france">    
    <high-option>
</high-select>
```

### disabling

you can disable `high-select` and its options at any time just give them a `disabled` attribute.

### manipulating by javascript

`high-select` states could be change via javascript.

#### getting select value

select the `high-select` element and get its value property.

```javascript
document.querySelector("high-select").value;
```

#### changing the select value

put the value in the `high-select` value property.

```javascript
document.querySelector("high-select").value = "it";
```

if the value you give high-select would not be available in options, it simply ignore it.

#### change options selected property

if you give any options of `high-select` a `selected` property.
the option change the select value.

```javascript
document.querySelector("high-select").children[2].selected = true;
```


### change event

you can catch the change event of `high-select` by listening to it. whenever the value change by user interacting with element, `high-select` tells you.

```javascript
document.querySelector("high-select").addEventListener("change", function(){
    console.log(this.value);
});
```

## user Experience

user could interact with `high-select` via mouse and keyboard easily. (Enter, Esc, Arrow down, Arrow up, Home, End)

## styling

### high-select's HTML structor

`high-select` use shadow dom for the most part of itself, so styling it would not be so easy, the structure of its shadowdom is like this:

there is an element with id of `caller`, caller would call the list of options which it is in another element with id `bigot`.
inside begiot we have `search` which contains an input element and `holder` which hold the options.

### styling variables

there is list of css variable that make you able to change the shadow dom's elements style:

--caller-padding
--caller-background
--caller-shadow
--caller-color
--caller-border-radius

--caller-disabled-color
--caller-disabled-background

--caller-hover-cursor
--caller-hover-background
--caller-hover-color

--caller-focus-outline

--arrow-font-size
--arrow-margin
--arrow-color

--bigot-shadow
--bigot-background
--bigot-border

--input-outline
--input-margin
--input-width
--input-border-width
--input-border-color
--input-border-style
--input-font
--input-padding
--input-color
--input-background

please suggest us if you think there could be more variables needed.
 
## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## License

MIT LICENSE


