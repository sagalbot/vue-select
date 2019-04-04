module.exports = {
    
    props: {

        /**
         *  Override vue-select default texts. 
         *  By default vue-select will use theses values  
         *  
         *  noResults : "Sorry no matching options."
         *  loading : "Loading..."
         *  searchOption : "Search for options"
         *  clearSelection : "Clear selection"
         *  
         *  @type {Object}
         */
        texts : {
            type: Object, 
            default : () => ({}),
        },
        
    },

    computed: {

        /**
         *  Return a dictionnary of text value to 
         *  use. Default texts are overriding by 
         *  texts prop. 
         * 
         *  @returns {Object}
         */
        textValues(){

            var defaultTexts = {
                noResults : "Sorry, no matching options.", 
                loading : "Loading...",
                searchOption : "Search for options",
                clearSelection : "Clear selection"
            }

            return {
                ...defaultTexts,
                ...this.texts
            }
        }
    },

}
