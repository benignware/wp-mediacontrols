(function () {
  'use strict';

  /**
   * WordPress dependencies
   */
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
    SelectControl: SelectControl$2
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
    }), /*#__PURE__*/React.createElement(SelectControl$2, {
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

  const {
    RangeControl: RangeControl$1,
    SelectControl: SelectControl$1,
    ToggleControl: ToggleControl$1,
    ColorPalette,
    ColorPicker,
    Dropdown,
    ColorIndicator,
    Popover,
    Button,
    __experimentalHStack: HStack,
    Flex,
    FlexItem
  } = wp.components;
  wp.blockEditor;
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
    return null; // No UI, purely an event listener
  };

  // const {
  //   RangeControl,
  //   SelectControl,
  //   ToggleControl,
  //   ColorPalette,
  //   Dropdown,
  //   Popover,
  //   Button,
  // } = wp.components;
  // const { withState } = wp.compose;
  // const { __ } = wp.i18n;

  const renderControl = ({
    type,
    label,
    value,
    onChange,
    ...props
  }) => {
    // console.log('renderControl', type, label, value, onChange, props);
    switch (type) {
      case 'boolean':
        return /*#__PURE__*/React.createElement(ToggleControl$1, _extends({
          label: label,
          checked: value,
          onChange: onChange
        }, props));
      case 'number':
        return /*#__PURE__*/React.createElement(RangeControl$1, _extends({
          label: label,
          value: value,
          onChange: onChange
        }, props));
      case 'select':
        return /*#__PURE__*/React.createElement(SelectControl$1, _extends({
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

  const {
    __
  } = wp.i18n;
  const {
    Fragment
  } = wp.element;
  const {
    RangeControl,
    SelectControl,
    ToggleControl,
    PanelBody,
    BlockControls,
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
  const pluginSlug = 'mediacontrols';
  const supportedBlocks = ['core/video', 'core/cover'];
  const settingsAttribute = `${pluginSlug}`;
  const componentClass = `is-${pluginSlug}`;
  const updateMessageType = 'updateMediacontrols';
  const {
    settings: globalSettings = {},
    data: settingsData
  } = window[`${pluginSlug}Settings`] || {};
  const settingsSections = Object.keys(settingsData).reduce((acc, key) => {
    const item = settingsData[key];
    const section = item.section || 'general';
    (acc[section] = acc[section] || {})[key] = item; // Initialize section and assign item
    return acc;
  }, {});

  // Helper function to build the controlslist attribute value
  const buildControlsList = (attributes, keys = ['fullscreenButton', 'overlayPlayButton', 'playButton', 'muteButton', 'timeline', 'volumeSlider', 'duration', 'currentTime']) => {
    const controlsList = [];
    keys.forEach(key => {
      // Convert key to camelCase with 'show' prefix
      const prop = `show${key.charAt(0).toUpperCase()}${key.slice(1)}`;

      // If the attribute is falsy, add the corresponding 'no' prefixed control name
      if (!attributes[prop]) {
        controlsList.push(`no${key.toLowerCase()}`);
      }
    });
    return controlsList.join(' ');
  };
  const getWrapperProps = props => {
    const {
      attributes: {
        [settingsAttribute]: settings,
        controls
      }
    } = props;
    const styles = {
      '--x-controls-bg': settings.backgroundColor,
      '--x-controls-bg-opacity': settings.backgroundOpacity / 100,
      '--x-controls-color': settings.textColor,
      '--x-controls-slide': settings.panelAnimation === 'slide' ? '1' : '0',
      '--x-controls-fade': settings.panelAnimation === 'fade' ? '1' : '0'
    };
    return {
      className: componentClass,
      'data-controls': typeof controls !== 'undefined' ? !!controls : undefined,
      'data-controlslist': buildControlsList(settings),
      style: Object.entries(styles).reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {})
    };
  };
  const dispatchUpdateMessage = (enabled, filter) => {
    const iframeWindow = document.querySelector('[name="editor-canvas"]').contentWindow;
    if (iframeWindow) {
      iframeWindow.postMessage({
        type: updateMessageType
      }, '*');
    }
  };

  // Add custom attributes
  const addSettingsAttribute = (settings, name) => {
    if (supportedBlocks.includes(name)) {
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
      const isSupportedBlock = supportedBlocks.includes(blockName);

      // Handle cover block with video background
      const isVideo = blockName === 'core/cover' ? attributes.backgroundType === 'video' : isSupportedBlock;
      if (!isVideo) {
        return /*#__PURE__*/React.createElement(BlockEdit, props);
      }
      const handleBlockRemove = removedBlock => {
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
      return /*#__PURE__*/React.createElement(Fragment, null, /*#__PURE__*/React.createElement(BlockEdit, props), /*#__PURE__*/React.createElement(BlockRemovalListener, {
        onBlockRemove: handleBlockRemove
      }), /*#__PURE__*/React.createElement(InspectorControls, null, /*#__PURE__*/React.createElement(PanelBody, {
        title: __('Media Controls', 'mediacontrols'),
        initialOpen: true
      }, /*#__PURE__*/React.createElement(ToggleControl, {
        label: __('Enable MediaControls', 'mediacontrols'),
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
        // Control type to render
        label,
        // Label for the control
        checked: settings[key],
        onChange: value => updateSetting(key, value)
      })))))), settings.enabled && /*#__PURE__*/React.createElement(InspectorControls, {
        group: "styles"
      }, /*#__PURE__*/React.createElement(ToolsPanel, {
        label: __('Media Controls'),
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
  }, 'withMediaControlsInspector');
  wp.hooks.addFilter('editor.BlockEdit', `${pluginSlug}mediacontrols/controls`, addSettingsControls);
  const withSettingsStyle = createHigherOrderComponent(BlockListBlock => {
    return props => {
      if (!supportedBlocks.includes(props.name)) {
        return /*#__PURE__*/React.createElement(BlockListBlock, props);
      }
      const {
        attributes: {
          [settingsAttribute]: blockSettings,
          controls = false
        }
      } = props;
      const settings = {
        ...globalSettings,
        ...blockSettings
      };
      console.log('add settings style', props.name, settings.enabled, controls);
      if (controls && settings.enabled) {
        return /*#__PURE__*/React.createElement(BlockListBlock, _extends({}, props, {
          wrapperProps: getWrapperProps(props)
        }));
      }
      return /*#__PURE__*/React.createElement(BlockListBlock, props);
    };
  }, 'withMediaControlsSettingsStyle');
  addFilter('editor.BlockListBlock', `${pluginSlug}/settings-style`, withSettingsStyle);

})();
