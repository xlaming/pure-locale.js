class PureLocale {
    /**
     * Constructor
     * 
     * @param  {Object} config
     */
    constructor(config = {}) {
        this.config = {
            "two_code": true,
            "default": "en",
            "allowed_languages": ["en"],
            "locales_folder": "locales",
        }
        this.parseConfiguration(config)
        this.detectLanguage()
        this.initialize()
    }

    /**
     * Initializate and load language files.
     */
    initialize() {
        let language = this.getLanguage()
        if (language == this.config.default) {
            return
        }
        fetch(`${this.config.locales_folder}/${language}.json`)
            .then(response => response.json())
            .then(json => this.translate(json));
    }

    /**
     * Language detector.
     */
    detectLanguage() {
        let userLanguage = this.config.default
        let language = navigator.language || navigator.userLanguage
        if (this.config.two_code) {
            let detectedLanguage = language.split('-')[0]
            if (this.config.allowed_languages.includes(detectedLanguage)) {
                return this.setLanguage(detectedLanguage)
            }
        }
        return this.setLanguage(userLanguage)
    }

    /**
     * Translate phrases invoked by the initializer.
     * 
     * @param  {Object} phrases
     */
    translate(phrases) {
        var specialElements = ["INPUT", "TEXTAREA"]
        let elements = document.querySelectorAll('[data-translate]')
        let translations = this.flatObject(phrases)
        elements.forEach(function(element, i) {
            let name = element.dataset.translate
            if (specialElements.includes(element.tagName)) {
                element.placeholder = translations[name]
            } else {
                element.innerHTML = translations[name]
            }
        })
    }

    /**
     * Parse configuration variables.
     * 
     * @param  {Mixed} config
     */
    parseConfiguration(config) {
        if (typeof config.two_code === 'boolean') {
            this.config.two_code = config.two_code
        }
        if (typeof config.default === 'string') {
            this.config.default = config.default
        }
        if (typeof config.locales_folder === 'string') {
            this.config.locales_folder = config.locales_folder
        }
        if (typeof config.allowed_languages === 'object') {
            this.config.allowed_languages = config.allowed_languages
        }
    }

    /**
     * Set user language.
     * 
     * @param  {} name
     */
    setLanguage(name) {
        this.currentLanguage = name
    }

    /**
     * Get current user language
     * 
     */
    getLanguage() {
        return this.currentLanguage
    }

    /**
     * Convert an object to a flatten object.
     * 
     * @param  {Object} input
     */
    flatObject(input) {
        function flat(res, key, val, pre = '') {
            const prefix = [pre, key].filter(v => v).join('.');
            return typeof val === 'object'
                ? Object.keys(val).reduce((prev, curr) => flat(prev, curr, val[curr], prefix), res)
                : Object.assign(res, {[prefix]: val});
        }
      
        return Object.keys(input).reduce((prev, curr) => flat(prev, curr, input[curr]), {});
      }
}