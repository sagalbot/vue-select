Vue Select aims to follow the WAI-ARIA best practices for the 
[combobox](https://www.w3.org/TR/wai-aria-practices-1.1/#combobox) and 
[listbox](https://www.w3.org/TR/wai-aria-practices-1.1/#Listbox) widgets. 

The UX of the component isdesigned around the HTML `<select>` element, while following the WAI-ARIA 
specifications and best practices for creating accessible components. 

## Combobox

- [WAI-ARIA Combobox - Best Practices](https://www.w3.org/TR/wai-aria-practices-1.1/#combobox)
- [WAI-ARIA Combobox - Specification](https://www.w3.org/TR/wai-aria-1.1/#combobox)

## Listbox

- [WAI-ARIA Listbox - Best Practices](https://www.w3.org/TR/wai-aria-practices-1.1/#Listbox)

### Autocomplete

WAI-ARIA suggests four forms of autocomplete for Comboboxes. Vue Select can be configured to provide
these use cases.

1. **No autocomplete** 

    > When the popup is triggered, the suggested values it contains are the same regardless of the 
    characters typed in the textbox. 
  
    ```html
    <v-select :filterable="false" :options="['No Autocomplete', 'List Autocomplete']" />
    ```
    <v-select :filterable="false" :options="['No Autocomplete', 'List Autocomplete']" />

2. **List autocomplete with manual selection**

    > When the popup is triggered, it presents suggested values that complete or logically 
    correspond to the characters typed in the textbox. The character string the user has 
    typed will become the value of the textbox unless the user selects a value in the popup.

    ```html
    <v-select taggable :options="['No Autocomplete', 'List Autocomplete']" />
    ```
    <v-select taggable :options="['No Autocomplete', 'List Autocomplete']" />

3. **List autocomplete with automatic selection**
 
    > When the popup is triggered, it presents suggested values that complete or logically 
    correspond to the characters typed in the textbox, and the first suggestion is automatically 
    highlighted as selected. The automatically selected suggestion becomes the value of the textbox 
    when the combobox loses focus unless the user chooses a different suggestion or changes the 
    character string in the textbox.

    ```html
    <v-select :options="['No Autocomplete', 'List Autocomplete']" />
    ```
    <v-select :options="['No Autocomplete', 'List Autocomplete']" />

4. **List with inline autocomplete** 
    
    > This is the same as list with automatic selection with one additional feature. The portion of 
    the selected suggestion that has not been typed by the user, a completion string, appears inline
     after the input cursor in the textbox. The inline completion string is visually highlighted and
      has a selected state.
      
    🚧 Vue Select does not yet support this configuration, but it is on the roadmap 
    [#865](https://github.com/sagalbot/vue-select/issues/865). 🚧
