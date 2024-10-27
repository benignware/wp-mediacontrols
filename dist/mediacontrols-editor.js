(function () {
  'use strict';

  const {
    addFilter: addFilter$1
  } = wp.hooks;
  const {
    Fragment: Fragment$1,
    cloneElement,
    Children
  } = wp.element;
  const {
    InspectorControls: InspectorControls$1
  } = wp.blockEditor;
  const {
    PanelBody: PanelBody$1,
    Button: Button$1,
    BaseControl,
    ToggleControl: ToggleControl$2,
    SelectControl: SelectControl$1
  } = wp.components;
  const {
    createHigherOrderComponent: createHigherOrderComponent$1
  } = wp.compose;
  const {
    MediaUpload,
    MediaUploadCheck
  } = wp.blockEditor;
  const {
    __: __$1,
    _x,
    sprintf
  } = wp.i18n;

  // Import hooks from wp.element
  const {
    useMemo,
    useCallback,
    Platform
  } = wp.element;

  // Preload options
  const options = [{
    value: 'auto',
    label: __$1('Auto')
  }, {
    value: 'metadata',
    label: __$1('Metadata')
  }, {
    value: 'none',
    label: _x('None', 'Preload value')
  }];

  // Add video-related attributes to the core/cover block
  function addVideoAttributes(settings, name) {
    if (name === 'core/cover') {
      settings.attributes = {
        ...settings.attributes,
        controls: {
          type: 'boolean',
          default: false
        },
        autoplay: {
          type: 'boolean',
          default: true
        },
        loop: {
          type: 'boolean',
          default: true
        },
        muted: {
          type: 'boolean',
          default: true
        },
        playsInline: {
          type: 'boolean',
          default: false
        },
        preload: {
          type: 'string',
          default: 'auto'
        },
        poster: {
          type: 'string'
        }
      };
    }
    return settings;
  }

  // Register the new attributes for the cover block
  addFilter$1('blocks.registerBlockType', 'mediacontrols/cover-video-settings', addVideoAttributes);

  // Video Settings Component
  const VideoSettings = ({
    setAttributes,
    attributes
  }) => {
    const {
      autoplay,
      controls,
      loop,
      muted,
      playsInline,
      preload
    } = attributes;
    const autoPlayHelpText = __$1('Autoplay may cause usability issues for some users.');
    const getAutoplayHelp = Platform.select({
      web: useCallback(checked => checked ? autoPlayHelpText : null, []),
      native: autoPlayHelpText
    });
    const toggleFactory = useMemo(() => {
      const toggleAttribute = attribute => newValue => {
        setAttributes({
          [attribute]: newValue
        });
      };
      return {
        autoplay: toggleAttribute('autoplay'),
        loop: toggleAttribute('loop'),
        muted: toggleAttribute('muted'),
        controls: toggleAttribute('controls'),
        playsInline: toggleAttribute('playsInline')
      };
    }, [setAttributes]);
    const onChangePreload = useCallback(value => {
      setAttributes({
        preload: value
      });
    }, [setAttributes]);
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(ToggleControl$2, {
      label: __$1('Autoplay'),
      onChange: toggleFactory.autoplay,
      checked: !!autoplay,
      help: getAutoplayHelp
    }), /*#__PURE__*/React.createElement(ToggleControl$2, {
      label: __$1('Loop'),
      onChange: toggleFactory.loop,
      checked: !!loop
    }), /*#__PURE__*/React.createElement(ToggleControl$2, {
      label: __$1('Muted'),
      onChange: toggleFactory.muted,
      checked: !!muted
    }), /*#__PURE__*/React.createElement(ToggleControl$2, {
      label: __$1('Playback controls'),
      onChange: toggleFactory.controls,
      checked: !!controls
    }), /*#__PURE__*/React.createElement(ToggleControl$2, {
      label: __$1('Play inline'),
      onChange: toggleFactory.playsInline,
      checked: !!playsInline,
      help: __$1('When enabled, videos will play directly within the webpage on mobile browsers, instead of opening in a fullscreen player.')
    }), /*#__PURE__*/React.createElement(SelectControl$1, {
      label: __$1('Preload'),
      value: preload,
      onChange: onChangePreload,
      options: options,
      hideCancelButton: true
    }));
  };

  // Higher Order Component to extend the Cover block
  const withVideoSettings = createHigherOrderComponent$1(BlockEdit => {
    return props => {
      const {
        attributes,
        setAttributes,
        name
      } = props;

      // Only modify the core/cover block
      if (name !== 'core/cover') {
        return /*#__PURE__*/React.createElement(BlockEdit, props);
      }
      const {
        backgroundType,
        hasParallax,
        controls,
        autoplay,
        loop,
        poster,
        url
      } = attributes;

      // Function to handle the selection of the poster image
      const onSelectPoster = media => {
        setAttributes({
          poster: media.url
        });
      };

      // Function to remove the selected poster image
      const onRemovePoster = () => {
        setAttributes({
          poster: undefined
        });
      };
      const videoPosterDescription = `video-poster-description-${props.clientId}`;
      const isVideoBackground = backgroundType === 'video';
      return /*#__PURE__*/React.createElement(Fragment$1, null, /*#__PURE__*/React.createElement(BlockEdit, props), /*#__PURE__*/React.createElement(InspectorControls$1, null, /*#__PURE__*/React.createElement(PanelBody$1, {
        title: "Video Settings",
        initialOpen: false
      }, isVideoBackground && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(ToggleControl$2, {
        label: __$1('Fixed background'),
        checked: hasParallax // Use the new attribute
        ,
        onChange: newValue => setAttributes({
          hasParallax: newValue
        }) // Wire up the toggle control
      }), /*#__PURE__*/React.createElement(VideoSettings, {
        setAttributes: setAttributes,
        attributes: attributes
      }), /*#__PURE__*/React.createElement(MediaUploadCheck, null, /*#__PURE__*/React.createElement("div", {
        className: "editor-video-poster-control"
      }, /*#__PURE__*/React.createElement(BaseControl.VisualLabel, null, __$1('Poster image')), /*#__PURE__*/React.createElement(MediaUpload, {
        title: __$1('Select poster image'),
        onSelect: onSelectPoster,
        allowedTypes: ['image'],
        render: ({
          open
        }) => /*#__PURE__*/React.createElement(Button$1, {
          variant: "primary",
          onClick: open,
          "aria-describedby": videoPosterDescription
        }, !poster ? __$1('Select') : __$1('Replace'))
      }), /*#__PURE__*/React.createElement("p", {
        id: videoPosterDescription,
        hidden: true
      }, poster ? sprintf(/* translators: %s: poster image URL. */
      __$1('The current poster image URL is %s'), poster) : __$1('There is no poster image currently selected')), poster && /*#__PURE__*/React.createElement(Button$1, {
        onClick: onRemovePoster,
        variant: "tertiary"
      }, __$1('Remove'))))))));
    };
  }, 'withVideoSettings');

  // Hook into BlockEdit for the Cover block.
  addFilter$1('editor.BlockEdit', 'my-plugin/cover-video-settings', withVideoSettings);

  function _extends() {
    return _extends = Object.assign ? Object.assign.bind() : function (n) {
      for (var e = 1; e < arguments.length; e++) {
        var t = arguments[e];
        for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
      }
      return n;
    }, _extends.apply(null, arguments);
  }

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
   * Convert a string to pascal case (`FooBar`).
   */
  function pascalCase(input, options) {
      const [prefix, words, suffix] = splitPrefixSuffix(input, options);
      const lower = lowerFactory(options?.locale);
      const upper = upperFactory(options?.locale);
      const transform = pascalCaseTransformFactory(lower, upper);
      return prefix + words.map(transform).join("") + suffix;
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

  const PLUGIN_SETTINGS_ID = 'mediacontrolsSettings';

  const getSettingsSections = schema => Object.keys(schema).reduce((acc, key) => {
    const item = schema[key];
    const section = item.section || 'general';
    (acc[section] = acc[section] || {})[key] = item; // Initialize section and assign item
    return acc;
  }, {});
  const getPluginSettings = globalKey => {
    const {
      settings: globalSettings = {},
      schema: {
        settings: settingsSchema = {}
      } = {},
      plugin: {
        Name: pluginName,
        Version: pluginVersion
      } = {}
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
      settingsResetButtonSelector: `#${pluginSlug}-reset-button`
    };
  };

  const {
    RangeControl,
    SelectControl,
    ToggleControl: ToggleControl$1,
    ColorPicker,
    Dropdown,
    ColorIndicator,
    Popover,
    Button,
    __experimentalHStack: HStack,
    FlexItem
  } = wp.components;
  wp.i18n;
  const {
    withState
  } = wp.compose;
  const BlockRemovalListener = ({
    onBlockRemove
  }) => {
    const {
      select
    } = wp.data;
    const {
      useEffect,
      useState
    } = wp.element;
    const {
      store: blockEditorStore
    } = wp.blockEditor;
    const blocks = select(blockEditorStore).getBlocks();
    const [prevBlocks, setPrevBlocks] = useState(blocks);
    useEffect(() => {
      if (prevBlocks.length > blocks.length) {
        const removedBlocks = prevBlocks.filter(prevBlock => !blocks.some(block => block.clientId === prevBlock.clientId));
        if (removedBlocks.length && typeof onBlockRemove === 'function') {
          // Execute the callback for each removed block
          removedBlocks.forEach(block => onBlockRemove(block));
        }
      }

      // Update the previous blocks state to the current state
      setPrevBlocks(blocks);
    }, [blocks, prevBlocks, onBlockRemove]);
    return null;
  };
  const renderControl = ({
    type,
    label,
    value,
    onChange,
    ...props
  }) => {
    switch (type) {
      case 'boolean':
        return /*#__PURE__*/React.createElement(ToggleControl$1, _extends({
          label: label,
          checked: value,
          onChange: onChange
        }, props));
      case 'number':
        return /*#__PURE__*/React.createElement(RangeControl, _extends({
          label: label,
          value: value,
          onChange: onChange
        }, props));
      case 'select':
        return /*#__PURE__*/React.createElement(SelectControl, _extends({
          label: label,
          value: value,
          options: props.options,
          onChange: onChange
        }, props));
      case 'color':
        return /*#__PURE__*/React.createElement(ColorPickerControl, {
          label: label,
          value: value,
          onChange: onChange,
          __experimentalIsRenderedInSidebar: true
        });
      default:
        return null;
    }
  };

  // ColorPickerControl component
  const ColorPickerControl = withState({
    isOpen: false
  })(({
    label,
    value,
    onChange,
    isOpen,
    setState,
    __experimentalIsRenderedInSidebar
  }) => {
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Dropdown, {
      contentClassName: "color-picker-dropdown",
      renderToggle: ({
        onToggle
      }) => /*#__PURE__*/React.createElement(Button, {
        className: "components-color-picker-button",
        style: {
          padding: 0
        },
        onClick: () => {
          onToggle();
          setState({
            isOpen: !isOpen
          }); // Toggle dropdown visibility
        },
        "aria-expanded": isOpen
      }, /*#__PURE__*/React.createElement(HStack, {
        justify: "flex-start"
      }, /*#__PURE__*/React.createElement(ColorIndicator, {
        className: "block-editor-panel-color-gradient-settings__color-indicator",
        colorValue: value
      }), /*#__PURE__*/React.createElement(FlexItem, {
        className: "block-editor-panel-color-gradient-settings__color-name",
        title: label
      }, label))),
      renderContent: () => /*#__PURE__*/React.createElement(Popover, {
        position: "middle center",
        onClose: () => setState({
          isOpen: false
        })
      }, /*#__PURE__*/React.createElement(ColorPicker, {
        color: value // Pass the current color
        ,
        onChangeComplete: newColor => {
          onChange(newColor.hex); // Use the hex value
          setState({
            isOpen: false
          }); // Close dropdown on color selection
        },
        __experimentalIsRenderedInSidebar: __experimentalIsRenderedInSidebar // Pass down the prop
      }))
    }));
  });

  // Used to get related elements
  // const getInputType = (el) => {
  //   const relatedElements = getRelatedElements(el);

  //   for (const relEl of relatedElements) {
  //       const type = relEl.dataset.type
  //           || {
  //               checkbox: 'boolean',
  //               radio: 'boolean', // TODO: radio may be select, need to check
  //               select: 'select',
  //               text: 'text',
  //           }[relEl.type]

  //       if (type) {
  //           return type;
  //       }
  //   }

  //   return 'string';
  // }

  const {
    componentClass,
    settingsAttribute: settingsAttribute$1
  } = getPluginSettings(PLUGIN_SETTINGS_ID);
  const isSupportedBlock = block => {
    const {
      name,
      attributes = null
    } = block;
    if (['core/video', 'core/cover'].includes(name)) {
      if (attributes && name === 'core/cover') {
        return attributes.backgroundType === 'video';
      }
      return true;
    }
    return false;
  };

  // Helper function to build the controlslist attribute value
  const buildControlsList = (attributes, keys = ['fullscreenButton', 'overlayPlayButton', 'playButton', 'muteButton', 'timeline', 'volumeSlider', 'duration', 'currentTime']) => {
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
    const {
      attributes: {
        [settingsAttribute$1]: settings,
        controls
      }
    } = props;
    const mergedSettings = {
      ...globalSettings,
      ...settings
    };
    const styles = {
      '--x-controls-bg': settings.backgroundColor || '',
      '--x-controls-bg-opacity': settings.backgroundOpacity ? settings.backgroundOpacity / 100 : '',
      '--x-controls-color': settings.textColor || '',
      '--x-controls-slide': settings.panelAnimation ? settings.panelAnimation === 'slide' ? '1' : '0' : '',
      '--x-controls-fade': settings.panelAnimation ? settings.panelAnimation === 'fade' ? '1' : '0' : ''
    };
    const style = Object.entries(styles).reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {});
    const result = {
      className: mergedSettings.enabled ? componentClass : ''
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
    __
  } = wp.i18n;
  const {
    Fragment
  } = wp.element;
  const {
    ToggleControl,
    PanelBody,
    __experimentalToolsPanel: ToolsPanel,
    __experimentalToolsPanelItem: ToolsPanelItem
  } = wp.components;
  const {
    InspectorControls
  } = wp.blockEditor;
  const {
    createHigherOrderComponent
  } = wp.compose;
  const {
    addFilter
  } = wp.hooks;
  const {
    pluginName,
    pluginSlug,
    settingsAttribute,
    settingsSections = {},
    updateMessageType,
    globalSettings
  } = getPluginSettings(PLUGIN_SETTINGS_ID);
  const dispatchUpdateMessage = () => {
    const iframeWindow = document.querySelector('[name="editor-canvas"]').contentWindow;
    if (iframeWindow) {
      iframeWindow.postMessage({
        type: updateMessageType
      }, '*');
    }
  };

  // Add custom attributes
  const addSettingsAttribute = (settings, name) => {
    if (isSupportedBlock({
      name
    })) {
      settings.attributes = {
        ...settings.attributes,
        [settingsAttribute]: {
          type: 'object',
          default: {}
        }
      };
    }
    return settings;
  };

  // Add filter to include the custom attributes
  wp.hooks.addFilter('blocks.registerBlockType', `${pluginSlug}/settings`, addSettingsAttribute);

  // Extend BlockEdit to add custom controls to the sidebar
  const addSettingsControls = createHigherOrderComponent(BlockEdit => {
    return props => {
      const {
        attributes,
        setAttributes,
        name: blockName
      } = props;
      if (!isSupportedBlock(props)) {
        return /*#__PURE__*/React.createElement(BlockEdit, props);
      }
      const handleBlockRemove = () => {
        dispatchUpdateMessage();
      };
      const updateSetting = (key, value) => {
        if (value === null) {
          const {
            [key]: _,
            ...newSettings
          } = attributes[settingsAttribute];
          setAttributes({
            ...attributes,
            [settingsAttribute]: newSettings
          });
          dispatchUpdateMessage();
        } else {
          setAttributes({
            ...attributes,
            [settingsAttribute]: {
              ...attributes[settingsAttribute],
              [key]: value
            }
          });
        }
        dispatchUpdateMessage();
      };
      const {
        controls,
        style: styles
      } = settingsSections;
      const resetAllStyles = () => {
        const newSettings = Object.keys(settings).reduce((acc, key) => {
          // Skip style properties
          if (!settingsSections.style.hasOwnProperty(key)) {
            acc[key] = settings[key]; // Keep the other fields intact
          }
          return acc;
        }, {});
        setAttributes({
          [settingsAttribute]: newSettings
        });
        dispatchUpdateMessage();
      };
      const settings = {
        ...globalSettings,
        ...attributes[settingsAttribute]
      };
      const enabledLabel = __('Enabled');
      return /*#__PURE__*/React.createElement(Fragment, null, /*#__PURE__*/React.createElement(BlockEdit, props), /*#__PURE__*/React.createElement(BlockRemovalListener, {
        onBlockRemove: handleBlockRemove
      }), /*#__PURE__*/React.createElement(InspectorControls, null, /*#__PURE__*/React.createElement(PanelBody, {
        title: pluginName,
        initialOpen: true
      }, /*#__PURE__*/React.createElement(ToggleControl, {
        label: enabledLabel,
        checked: settings.enabled,
        onChange: value => updateSetting('enabled', value)
      }), settings.enabled && /*#__PURE__*/React.createElement(Fragment, null, Object.entries(controls).map(([key, {
        name,
        label,
        type
      }]) => /*#__PURE__*/React.createElement("div", {
        key: name,
        style: {
          marginBottom: '10px'
        }
      }, renderControl({
        type,
        label,
        checked: settings[key],
        onChange: value => updateSetting(key, value)
      })))))), settings.enabled && /*#__PURE__*/React.createElement(InspectorControls, {
        group: "styles"
      }, /*#__PURE__*/React.createElement(ToolsPanel, {
        label: __(pluginName),
        resetAll: resetAllStyles
      }, Object.entries(styles).map(([key, {
        name,
        label,
        type,
        min,
        max,
        unit,
        options = []
      }]) => /*#__PURE__*/React.createElement(ToolsPanelItem, {
        key: name,
        hasValue: () => attributes[settingsAttribute][key] !== undefined,
        label: label,
        onDeselect: () => updateSetting(key, null) // Clear value when deselected
        ,
        onSelect: () => updateSetting(key, globalSettings[key]) // Set to global value when selected
      }, renderControl({
        type,
        label,
        value: settings[key],
        options,
        onChange: value => updateSetting(key, value),
        min,
        max,
        unit
      }))))));
    };
  }, `with${pascalCase(pluginName)}Inspector`);
  wp.hooks.addFilter('editor.BlockEdit', `${pluginSlug}/controls`, addSettingsControls);
  const withSettingsStyle = createHigherOrderComponent(BlockListBlock => {
    return props => {
      const {
        attributes
      } = props;
      const {
        [settingsAttribute]: settings
      } = attributes;
      if (!isSupportedBlock(props) || !settings) {
        return /*#__PURE__*/React.createElement(BlockListBlock, props);
      }
      const wrapperProps = getWrapperProps(props, globalSettings);
      return /*#__PURE__*/React.createElement(BlockListBlock, _extends({}, props, {
        wrapperProps: wrapperProps
      }));
    };
  }, 'withMediaControlsSettingsStyle');
  addFilter('editor.BlockListBlock', `${pluginSlug}/settings-style`, withSettingsStyle);

})();
