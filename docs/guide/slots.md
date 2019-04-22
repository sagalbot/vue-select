#### Scoped Slot `option`

vue-select provides the scoped `option` slot in order to create custom dropdown templates.

```html
<v-select :options="options" label="title">
    <template slot="option" slot-scope="option">
        <span :class="option.icon"></span>
        {{ option.title }}
    </template>
  </v-select>
``` 

Using the `option` slot with `slot-scope="option"` gives the 
provides the current option variable to the template.

<CodePen url="NXBwYG" height="500"/>
