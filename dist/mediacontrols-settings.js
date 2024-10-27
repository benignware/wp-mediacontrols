(function () {
    'use strict';

    // Regexps involved with splitting words in various case formats.
    const SPLIT_LOWER_UPPER_RE = /([\p{Ll}\d])(\p{Lu})/gu;
    const SPLIT_UPPER_UPPER_RE = /(\p{Lu})([\p{Lu}][\p{Ll}])/gu;
    // Used to iterate over the initial split result and separate numbers.
    const SPLIT_SEPARATE_NUMBER_RE = /(\d)\p{Ll}|(\p{L})\d/u;
    // Regexp involved with stripping non-word characters from the result.
    const DEFAULT_STRIP_REGEXP = /[^\p{L}\d]+/giu;
    // The replacement value for splits.
    const SPLIT_REPLACE_VALUE = "$1\0$2";
    // The default characters to keep after transforming case.
    const DEFAULT_PREFIX_SUFFIX_CHARACTERS = "";
    /**
     * Split any cased input strings into an array of words.
     */
    function split(value) {
        let result = value.trim();
        result = result
            .replace(SPLIT_LOWER_UPPER_RE, SPLIT_REPLACE_VALUE)
            .replace(SPLIT_UPPER_UPPER_RE, SPLIT_REPLACE_VALUE);
        result = result.replace(DEFAULT_STRIP_REGEXP, "\0");
        let start = 0;
        let end = result.length;
        // Trim the delimiter from around the output string.
        while (result.charAt(start) === "\0")
            start++;
        if (start === end)
            return [];
        while (result.charAt(end - 1) === "\0")
            end--;
        return result.slice(start, end).split(/\0/g);
    }
    /**
     * Split the input string into an array of words, separating numbers.
     */
    function splitSeparateNumbers(value) {
        const words = split(value);
        for (let i = 0; i < words.length; i++) {
            const word = words[i];
            const match = SPLIT_SEPARATE_NUMBER_RE.exec(word);
            if (match) {
                const offset = match.index + (match[1] ?? match[2]).length;
                words.splice(i, 1, word.slice(0, offset), word.slice(offset));
            }
        }
        return words;
    }
    /**
     * Convert a string to space separated lower case (`foo bar`).
     */
    function noCase(input, options) {
        const [prefix, words, suffix] = splitPrefixSuffix(input, options);
        return (prefix +
            words.map(lowerFactory(options?.locale)).join(options?.delimiter ?? " ") +
            suffix);
    }
    /**
     * Convert a string to camel case (`fooBar`).
     */
    function camelCase(input, options) {
        const [prefix, words, suffix] = splitPrefixSuffix(input, options);
        const lower = lowerFactory(options?.locale);
        const upper = upperFactory(options?.locale);
        const transform = pascalCaseTransformFactory(lower, upper);
        return (prefix +
            words
                .map((word, index) => {
                if (index === 0)
                    return lower(word);
                return transform(word, index);
            })
                .join("") +
            suffix);
    }
    /**
     * Convert a string to kebab case (`foo-bar`).
     */
    function kebabCase(input, options) {
        return noCase(input, { delimiter: "-", ...options });
    }
    function lowerFactory(locale) {
        return locale === false
            ? (input) => input.toLowerCase()
            : (input) => input.toLocaleLowerCase(locale);
    }
    function upperFactory(locale) {
        return (input) => input.toLocaleUpperCase(locale);
    }
    function pascalCaseTransformFactory(lower, upper) {
        return (word, index) => {
            const char0 = word[0];
            const initial = index > 0 && char0 >= "0" && char0 <= "9" ? "_" + char0 : upper(char0);
            return initial + lower(word.slice(1));
        };
    }
    function splitPrefixSuffix(input, options = {}) {
        const splitFn = options.split ?? (options.separateNumbers ? splitSeparateNumbers : split);
        const prefixCharacters = options.prefixCharacters ?? DEFAULT_PREFIX_SUFFIX_CHARACTERS;
        const suffixCharacters = options.suffixCharacters ?? DEFAULT_PREFIX_SUFFIX_CHARACTERS;
        let prefixIndex = 0;
        let suffixIndex = input.length;
        while (prefixIndex < input.length) {
            const char = input.charAt(prefixIndex);
            if (!prefixCharacters.includes(char))
                break;
            prefixIndex++;
        }
        while (suffixIndex > prefixIndex) {
            const index = suffixIndex - 1;
            const char = input.charAt(index);
            if (!suffixCharacters.includes(char))
                break;
            suffixIndex = index;
        }
        return [
            input.slice(0, prefixIndex),
            splitFn(input.slice(prefixIndex, suffixIndex)),
            input.slice(suffixIndex),
        ];
    }

    const getSettingsSections = schema => Object.keys(schema).reduce((acc, key) => {
      const item = schema[key];
      const section = item.section || 'general';
      (acc[section] = acc[section] || {})[key] = item; // Initialize section and assign item
      return acc;
    }, {});


    const getPluginSettings = (globalKey) => {
      const {
        settings: globalSettings = {},
        schema: { settings: settingsSchema = {} } = {},
        plugin: {
          Name: pluginName,
          Version: pluginVersion,
        } = {},
      } = window[globalKey] || {};

      const pluginSlug = kebabCase(pluginName);
      const pluginId = camelCase(pluginSlug);
      
      return {
        globalSettings,
        settingsSchema,
        pluginName,
        pluginVersion,
        pluginSlug,
        pluginId,
        componentClass: `is-${pluginSlug}`,
        componentTag: `x-${pluginSlug}`,
        settingsAttribute: pluginId,
        settingsSections: getSettingsSections(settingsSchema),
        updateMessageType: `${pluginId}UpdateMessage`,
        settingsFormSelector: `#${pluginSlug}-settings`,
        settingsInputSelector: `[name^="${pluginSlug}"]`,
        settingsPreviewSelector: `#${pluginSlug}-preview`,
        settingsResetButtonSelector: `#${pluginSlug}-reset-button`,
      };
    };

    const PLUGIN_SETTINGS_ID = 'mediacontrolsSettings';

    const { componentClass: componentClass$1, settingsAttribute: settingsAttribute$1 } = getPluginSettings(PLUGIN_SETTINGS_ID);

    // Helper function to build the controlslist attribute value
    const buildControlsList = (attributes, keys = [
      'fullscreenButton', 
      'overlayPlayButton', 
      'playButton', 
      'muteButton', 
      'timeline', 
      'volumeSlider', 
      'duration', 
      'currentTime'
    ]) => {
      const controlsList = [];

      keys.forEach(key => {
        // Convert key to camelCase with 'show' prefix
        const prop = `show${key.charAt(0).toUpperCase()}${key.slice(1)}`;
        
        // If the attribute is falsy, add the corresponding 'no' prefixed control name
        if (attributes[prop] !== undefined && !attributes[prop]) {
          controlsList.push(`no${key.toLowerCase()}`);
        }
      });

      return controlsList.join(' ');
    };

    const getWrapperProps = (props, globalSettings = {}) => {
      const { attributes: { [settingsAttribute$1]: settings, controls } } = props;
      const mergedSettings = { ...globalSettings, ...settings };
      
      const styles = {
        '--x-controls-bg': settings.backgroundColor || '',
        '--x-controls-bg-opacity': settings.backgroundOpacity ? settings.backgroundOpacity / 100 : '',
        '--x-controls-color': settings.textColor || '',
        '--x-controls-slide': settings.panelAnimation ? settings.panelAnimation === 'slide' ? '1' : '0' : '',
        '--x-controls-fade': settings.panelAnimation ? settings.panelAnimation === 'fade' ? '1' : '0' : '',
      };

      const style = Object.entries(styles).reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {});

      const result = {
        className: mergedSettings.enabled ? componentClass$1 : '',
      };

      result['data-controls'] = controls !== undefined && controls ? '' : undefined;

      const controlslist = buildControlsList(mergedSettings);

      result['data-controlslist'] = controlslist || undefined;

      if (Object.keys(style).length) {
        result.style = style;
      }

      return result;
    };

    const {
        componentClass,
        updateMessageType,
        settingsAttribute,
        settingsFormSelector,
        settingsInputSelector,
        settingsPreviewSelector,
        settingsResetButtonSelector,
    } = getPluginSettings(PLUGIN_SETTINGS_ID);

    class Settings {
        constructor() {
            this.form = document.querySelector(settingsFormSelector);
            this.previewWrapper = document.querySelector(settingsPreviewSelector);
            this.formElements = this.form ? [...this.form.querySelectorAll(settingsInputSelector)] : [];
            this.resetButton = document.querySelector(settingsResetButtonSelector);

            if (this.form && this.previewWrapper) {
                this.initSyncElements();
                this.updatePreview();
                this.setupResetButton();
            }
        }

        getRelatedElements(element) {
            return [...this.form.querySelectorAll(`[data-sync="${element.getAttribute('data-sync')}"]`)];
        }

        updatePreview() {
            const settings = {};

            this.formElements
                .filter(el => !el.disabled)
                .forEach(el => {
                    const prop = el.name.split('[').pop().split(']')[0];
                    settings[prop] = el.value;
                });

            const { enabled = true } = settings;
            this.previewWrapper.classList.toggle(componentClass, enabled);
            window.postMessage({ type: updateMessageType }, '*');

            const props = { attributes: { [settingsAttribute]: settings, controls: true } };
            const { className, style, ...attrs } = getWrapperProps(props);

            if (className) {
                this.previewWrapper.classList.add(className);
            }

            Object.entries(style).forEach(([styleProperty, value]) => {
                this.previewWrapper.style.setProperty(styleProperty, value);
            });
            Object.entries(attrs).forEach(([attr, value]) => {
                if (value === undefined) {
                    this.previewWrapper.removeAttribute(attr);
                } else {
                    this.previewWrapper.setAttribute(attr, value);
                }
            });
        }

        handleInput(event) {
            const relatedElements = this.getRelatedElements(event.target)
                .filter(relEl => relEl !== event.target);

            relatedElements.forEach(relEl => {
                let value = event.target.value;

                if (relEl.type === 'checkbox' || relEl.type === 'radio') {
                    relEl.checked = event.target.checked;
                } else if (relEl.type === 'hidden') {
                    relEl.disabled = false;
                    if (event.target.type === 'checkbox' || event.target.type === 'radio') {
                        value = event.target.checked ? '1' : '';
                    }
                }

                relEl.value = value;
            });

            this.updatePreview();
        }

        initSyncElements() {
            this.formElements.forEach(el => {
                const relatedElements = this.getRelatedElements(el);
                relatedElements.forEach(relEl => {
                    relEl.addEventListener('input', this.handleInput.bind(this));
                });
            });
        }

        setupResetButton() {
            if (this.resetButton) {
                this.resetButton.addEventListener('click', () => {
                    const confirmReset = confirm('Are you sure you want to reset all settings to their default values? This action cannot be undone.');

                    if (confirmReset) {
                        this.formElements.forEach(hiddenInput => {
                            const defaultValue = hiddenInput.getAttribute('data-default');
                            const relatedElements = this.getRelatedElements(hiddenInput);

                            if (hiddenInput.type === 'hidden') {
                                hiddenInput.disabled = true;
                            } else {
                                hiddenInput.value = '';
                            }

                            relatedElements.forEach(el => {
                                if (el.type === 'checkbox' || el.type === 'radio') {
                                    el.checked = defaultValue === '1';
                                } else {
                                    el.value = defaultValue;
                                }
                            });
                        });

                        this.updatePreview();
                    }
                });
            }
        }
    }

    // Initialize the Settings class when the DOM content is loaded
    document.addEventListener('DOMContentLoaded', () => new Settings());

})();
