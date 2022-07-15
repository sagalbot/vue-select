## Required

If you need to ensure that a selection is made before a form is submitted, you can 
use the `required` attribute in combination with the `search` scoped slot in order 
to do so.

However, the `search` input within the component does not actually store a value, so
simply adding the `required` attribute won't work. Instead, we'll bind the attribute
dynamically, so that it's only present if we don't have a selection.

<ValidationRequired />

```html
<v-select :options="books" label="title" v-model="selected">
  <template #search="{attributes, events}">
    <input
      class="vs__search"
      :required="!selected"
      v-bind="attributes"
      v-on="events"
    />
  </template>
</v-select>
```
