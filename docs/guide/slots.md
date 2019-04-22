::: tip 🚧
This section of the guide is a work in progress! Check back soon for an update.
Vue Select currently offers quite a few scoped slots, and you can check out the 
[API Docs for Slots](../api/slots.md) in the meantime while a good guide is put together.
:::

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
