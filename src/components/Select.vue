<style scoped>
  .dropdown {
    position: relative;
  }

  .open-indicator {
    position: absolute;
    top: 10px;
    right: 10px;
    display: inline-block;
    cursor: pointer;
    pointer-events: all;
    transition: all 150ms cubic-bezier(1.000, -0.115, 0.975, 0.855);
    transition-timing-function: cubic-bezier(1.000, -0.115, 0.975, 0.855);
  }

  .open .open-indicator {
    transform: rotate(180deg);
  }

  .dropdown-toggle {
    display: block;
    padding: 0;
    background: none;
    border: 1px solid rgba(60,60,60,.26);
    border-radius: 4px;
    white-space: normal;
  }
  .searchable .dropdown-toggle {
    cursor: text;
  }

  .open .dropdown-toggle {
    /*background: none;*/
    /*border-color: #337ab7;*/
    border-bottom: none;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }

  .dropdown-menu {
    margin: 0;
    width: 100%;
    overflow-y: scroll;
    border-top: none;
    /*border-color: #337ab7;*/
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }

  .alert {
    height: 26px;
    margin: 4px 1px 0px 3px;
    padding: 0 0.25em;
    float: left;
    line-height: 1.7em;
  }

  .alert .close {
    float: none;
    margin-right: 0;
    font-size: 20px;
  }

  input[type=search],
  input[type=search]:focus {
    display: inline-block;
    border: none;
    outline: none;
    margin: 0;
    width: 10em;
    max-width: 100%;
    background: none;
    position: relative;
    box-shadow: none;
    float: left;
    clear: none;
  }

  input[type=search]:disabled {
    cursor: pointer;
  }

  li a {
    cursor: pointer;
  }

  .active a {
    background: rgba(50,50,50,.1);
    color: #333;
  }

  .highlight a,
  li:hover a {
    background: #337ab7;
    color: #fff;
  }
</style>

<template>
  <div class="dropdown" :class="{open: open, searchable: searchable}">
    <div v-el:toggle @mousedown.prevent="toggleDropdown" class="dropdown-toggle clearfix" type="button">
        <span class="form-control" v-if="!searchable && isValueEmpty">
          {{ placeholder }}
        </span>

        <span class="alert alert-info" v-for="option in valueAsArray">
          {{{ getOptionLabel(option) }}}
          <button v-if="multiple" @click="select(option)" type="button" class="close">
            <span aria-hidden="true">&times;</span>
          </button>
        </span>

        <input
          v-el:search
          v-show="searchable"
          v-model="search"
          @keydown.delete="maybeDeleteValue"
          @keydown.esc="onEscape"
          @keydown.up.prevent="typeAheadUp"
          @keydown.down.prevent="typeAheadDown"
          @keydown.enter.prevent="typeAheadSelect"
          @blur="open = false"
          type="search"
          class="form-control"
          :placeholder="searchPlaceholder"
        >

        <i v-el:open-indicator role="presentation" class="open-indicator glyphicon-chevron-down glyphicon"></i>
    </div>

    <ul v-show="open" v-el:dropdown-menu :transition="transition" :style="{ 'max-height': maxHeight }" class="dropdown-menu animated">
      <li v-for="option in filteredOptions" :class="{ active: isOptionSelected(option), highlight: $index === typeAheadPointer }" @mouseover="typeAheadPointer = $index">
        <a @mousedown.prevent="select(option)">
          {{{ getOptionLabel(option) }}}
        </a>
      </li>
      <li transition="fade" v-if="!filteredOptions.length" class="divider"></li>
      <li transition="fade" v-if="!filteredOptions.length" class="text-center">Sorry, no matching options.</li>
    </ul>
  </div>
</template>


<script>
  export default {

    props: {
      value: {
        twoway: true,
        required: true
      },
      options: {
        type: Array,
        default() { return [] },
      },
      maxHeight: {
        type: String,
        default: '400px'
      },
      searchable: {
        type: Boolean,
        default: true
      },
      multiple: {
        type: Boolean,
        default: false
      },
      placeholder: {
        type: String,
        default: ''
      },
      transition: {
        type: String,
        default: 'expand'
      },
      clearSearchOnSelect: {
        type: Boolean,
        default: true
      }
    },

    data() {
      return {
        search: '',
        open: false,
        typeAheadPointer: -1,
      }
    },

    watch: {
      options() {
        this.$set('value', this.multiple ? [] : null)
      },
      multiple( val ) {
        this.$set('value', val ? [] : null)
      }
    },

    methods: {
      select(option) {
          if (! this.isOptionSelected(option) ) {
            if (this.multiple) {

              if( ! this.value ) {
                  this.$set('value', [option])
              } else {
                this.value.push(option)
              }

            } else {
              this.value = option
            }
          } else {
            if (this.multiple) {
              this.value.$remove(option)
            }
          }

          if (!this.multiple) {
            this.open = !this.open
          }

          if( this.clearSearchOnSelect ) {
            this.search = ''
          }
      },

      toggleDropdown( e ) {
        if( e.target === this.$els.openIndicator || e.target === this.$els.search || e.target === this.$els.toggle || e.target === this.$el ) {
          if( this.open ) {
            this.$els.search.blur() // dropdown will close on blur
          } else {
            this.open = true
            this.$els.search.focus()
          }
        }
      },

      isOptionSelected( option ) {
        if( this.multiple && this.value ) {
          return this.value.indexOf(option) !== -1
        }

        return this.value === option;
      },

      getOptionValue( option ) {
        if( typeof option === 'object' && option.value ) {
          return option.value;
        }

        return option;
      },

      getOptionLabel( option ) {
        if( typeof option === 'object' && option.label ) {
          return option.label;
        }

        return option;
      },

      typeAheadUp() {
        if (this.typeAheadPointer > 0) this.typeAheadPointer--
      },

      typeAheadDown() {
        if (this.typeAheadPointer < this.filteredOptions.length - 1) this.typeAheadPointer++
      },

      typeAheadSelect() {
        if( this.filteredOptions[ this.typeAheadPointer ] ) {
          this.select( this.filteredOptions[ this.typeAheadPointer ] );
        }

        if( this.clearSearchOnSelect ) {
          this.search = "";
        }
      },

      onEscape() {
        if( ! this.search.length ) {
          this.open = false
        } else {
          this.$set('search', '')
        }
      },

      maybeDeleteValue() {
        if( ! this.$els.search.value.length ) {
          this.value.pop();
        }
      }
    },

    computed: {
      searchPlaceholder() {
        if( this.isValueEmpty && this.placeholder ) {
          return this.placeholder;
        }
      },

      filteredOptions() {
        return this.$options.filters.filterBy(this.options, this.search)
      },

      isValueEmpty() {
        if( this.value ) {
          return ! this.value.length
        }

        return true;
      },

      valueAsArray() {
        if( this.multiple ) {
          return this.value
        } else if (this.value) {
            return [this.value]
        }

        return []
      }
    }

  }
</script>
