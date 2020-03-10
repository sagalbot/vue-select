::: tip <Badge text="3.8.0+" />
Pagination is supported using slots available with Vue Select 3.8 and above.
:::

Pagination can be a super helpful tool when working with large sets of data. If you have 1,000
options, the component is going to render 1,000 DOM nodes. That's a lot of nodes to insert/remove,
and chances are your user is only interested in a few of them anyways.

To implement pagination with Vue Select, you can take advantage of the `list-footer` slot. It
appears below all other options in the drop down list.

To make pagination work properly with filtering, you'll have to handle it yourself in the parent.
You can use the `filterable` boolean to turn off Vue Select's filtering, and then hook into the
`search` event to use the current search query in the parent component.

<Paginated />

<<< @/.vuepress/components/Paginated.vue
