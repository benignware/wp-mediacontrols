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

    const { componentClass, componentTag, updateMessageType } = getPluginSettings(PLUGIN_SETTINGS_ID);

    (() => {
      // Static registry to store instances
      const registry = new Map();
      const isBlockEditor = !!document.querySelector('.block-editor');

      if (isBlockEditor) {
          // Prevent running in the block editor host since it will run in the iframe
          return;
      }

      const handleUpdate = () => {
        const targetNodes = [...document.querySelectorAll(`.${componentClass}`)];

        let addedNodes = targetNodes.filter((node) => !registry.has(node));
        const removedNodes = [...registry.keys()].filter((node) => !targetNodes.includes(node));
        const unchangedNodes = targetNodes.filter((node) => registry.has(node));
        
        // Process added nodes
        addedNodes.forEach((node) => {
          const instance = document.createElement(componentTag);
          
          instance.forElement = node;
          node.parentElement.insertBefore(instance, node);
          registry.set(node, instance);
        });

        // Process unchanged nodes
        unchangedNodes.forEach((node) => {
          const instance = registry.get(node);
          
          instance.render();
        });

        // Process removed nodes
        removedNodes.forEach((node) => {
          const instance = registry.get(node);

          if (instance.dispose) {
            instance.dispose();
          }

          if (instance instanceof HTMLElement) {
            instance.remove();
          }
          
          registry.delete(node);
        });
      };

      // MutationObserver to detect DOM changes (nodes added or removed)
      const observer = new MutationObserver((mutationsList) => {
        mutationsList.forEach((mutation) => {
          if (mutation.type === 'childList') {
            mutation.removedNodes.forEach((removedNode) => {
              // Check if the removed node or its children have class 'is-mediacontrols'
              if (
                removedNode.classList && removedNode.classList.contains(componentClass)
                || removedNode.querySelector && removedNode.querySelector(`.${componentClass}`)
              ) {
                handleUpdate();
              }
            });
          }
        });
      });

      // Start observing the document for changes (additions/removals)
      observer.observe(document.body, {
        childList: true, // Observes changes to the direct children of the target
        subtree: true,   // Observes changes to all descendants of the target
      });

      window.addEventListener('message', (event) => {
        if (event.data.type === updateMessageType) {
          handleUpdate();
        }
      });

      document.addEventListener('DOMContentLoaded', handleUpdate);

      handleUpdate();
    })();

})();
