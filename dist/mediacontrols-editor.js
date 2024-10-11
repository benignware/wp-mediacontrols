(function () {
  'use strict';

  // Define supported image formats
  const IMAGE_FORMATS = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff', '.svg', '.webp'];

  /**
   * WordPress dependencies
   */
  const {
    addFilter
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
    Button,
    BaseControl,
    ToggleControl: ToggleControl$1,
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
    __,
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
    label: __('Auto')
  }, {
    value: 'metadata',
    label: __('Metadata')
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
  addFilter('blocks.registerBlockType', 'my-plugin/add-video-attributes', addVideoAttributes);

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
    const autoPlayHelpText = __('Autoplay may cause usability issues for some users.');
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
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(ToggleControl$1, {
      label: __('Autoplay'),
      onChange: toggleFactory.autoplay,
      checked: !!autoplay,
      help: getAutoplayHelp
    }), /*#__PURE__*/React.createElement(ToggleControl$1, {
      label: __('Loop'),
      onChange: toggleFactory.loop,
      checked: !!loop
    }), /*#__PURE__*/React.createElement(ToggleControl$1, {
      label: __('Muted'),
      onChange: toggleFactory.muted,
      checked: !!muted
    }), /*#__PURE__*/React.createElement(ToggleControl$1, {
      label: __('Playback controls'),
      onChange: toggleFactory.controls,
      checked: !!controls
    }), /*#__PURE__*/React.createElement(ToggleControl$1, {
      label: __('Play inline'),
      onChange: toggleFactory.playsInline,
      checked: !!playsInline,
      help: __('When enabled, videos will play directly within the webpage on mobile browsers, instead of opening in a fullscreen player.')
    }), /*#__PURE__*/React.createElement(SelectControl$1, {
      label: __('Preload'),
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
        controls,
        autoplay,
        loop,
        poster,
        url,
        hasParallax
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

      // Create a unique ID for the poster description
      const videoPosterDescription = `video-poster-description-${props.clientId}`;

      // Check if the URL points to an image
      const isImageSelected = url && IMAGE_FORMATS.some(format => url.endsWith(format));
      const isVideoSelected = url && !isImageSelected;
      return /*#__PURE__*/React.createElement(Fragment$1, null, /*#__PURE__*/React.createElement(BlockEdit, props), /*#__PURE__*/React.createElement(InspectorControls$1, null, /*#__PURE__*/React.createElement(PanelBody$1, {
        title: "Video Settings",
        initialOpen: false
      }, isVideoSelected && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(ToggleControl$1, {
        label: __('Fixed background'),
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
      }, /*#__PURE__*/React.createElement(BaseControl.VisualLabel, null, __('Poster image')), /*#__PURE__*/React.createElement(MediaUpload, {
        title: __('Select poster image'),
        onSelect: onSelectPoster,
        allowedTypes: ['image'],
        render: ({
          open
        }) => /*#__PURE__*/React.createElement(Button, {
          variant: "primary",
          onClick: open,
          "aria-describedby": videoPosterDescription
        }, !poster ? __('Select') : __('Replace'))
      }), /*#__PURE__*/React.createElement("p", {
        id: videoPosterDescription,
        hidden: true
      }, poster ? sprintf(/* translators: %s: poster image URL. */
      __('The current poster image URL is %s'), poster) : __('There is no poster image currently selected')), poster && /*#__PURE__*/React.createElement(Button, {
        onClick: onRemovePoster,
        variant: "tertiary"
      }, __('Remove'))))))));
    };
  }, 'withVideoSettings');

  // Hook into BlockEdit for the Cover block.
  addFilter('editor.BlockEdit', 'my-plugin/cover-video-settings', withVideoSettings);

  /*
  // Add video properties to the save function
  function addVideoPropsToSave(settings, name) {
      if (name === 'core/cover') {
          const originalSave = settings.save;

            // Helper function to strip out unnecessary whitespace in the children
            const cleanChildren = (children) =>
                Children.map(children, (child) => {
            if (!child) return null;

              // If child is a string, trim whitespace
              if (typeof child === 'string') {
                  const trimmedChild = child.trim();
                  return trimmedChild.length > 0 ? trimmedChild : null;
              }

              // If child has children, recursively clean them
              if (child.props && child.props.children) {
                  const cleanedChild = cloneElement(child, {
                      children: cleanChildren(child.props.children),
                  });
                  return cleanedChild;
              }

              // Return the child unchanged if no further cleaning is necessary
              return child;
            });

        // Modify the save function to clean children and strip whitespace
        settings.save = (props) => {
          const { attributes } = props;
          const { controls, autoplay, loop, muted, playsInline, preload, poster, url, hasParallax } = attributes;
      
          // Extract the original save output
          const originalElement = originalSave(props);
      
          // Clean the children of the original save element
          const cleanedChildren = cleanChildren(originalElement.props.children);
      
          // Map through children and modify the video tag if necessary
          const modifiedChildren = Children.map(cleanedChildren, (child) => {
              if (!child) {
                  return null;
              }
      
              // Modify video tag settings
              if (child.type === 'video') {
                  return cloneElement(child, {
                      poster,
                      controls,
                      autoPlay: autoplay,
                      loop,
                      muted,
                      playsInline,
                      preload,
                      src: url || child.props.src,
                      style: hasParallax ? { position: 'fixed' } : {}, // Apply fixed position if hasParallax is true
                  });
              }
      
              // Leave image or other elements unmodified
              return child;
          });
      
          // Return the modified save output with the cleaned children
          return cloneElement(originalElement, {}, modifiedChildren);
      };
      

        
      }
      return settings;
  }

  // Hook into BlockType to modify the save function
  addFilter(
      'blocks.registerBlockType',
      'my-plugin/add-video-props-to-save',
      addVideoPropsToSave
  );
  */

  const {
    createHigherOrderComponent
  } = wp.compose;
  const {
    ToggleControl,
    PanelBody,
    SelectControl,
    RangeControl
  } = wp.components;
  const {
    InspectorControls
  } = wp.blockEditor;
  const {
    Fragment
  } = wp.element;
  const {
    select
  } = wp.data;

  // Helper function to retrieve theme button colors from settings
  const getButtonStylesFromSettings = () => {
    const settings = select('core/block-editor').getSettings();
    const buttonStyles = settings.styles?.blocks?.['core/button']?.default?.color || {};
    const defaultBackground = buttonStyles.background || '#000000'; // Fallback to black
    const defaultTextColor = buttonStyles.text || '#FFFFFF'; // Fallback to white
    return {
      defaultBackground,
      defaultTextColor
    };
  };

  // Function to check if a color is a valid CSS color or theme preset
  const getColorValue = color => {
    if (!color) {
      return undefined;
    }
    if (color.startsWith('var(--wp--preset--color--')) {
      return color; // Already in the correct format
    }
    const isCssColor = /^#[0-9A-F]{6}$|^#[0-9A-F]{3}$|^rgb\(|^rgba\(/i.test(color);
    return isCssColor ? color : `var(--wp--preset--color--${color})`;
  };

  // Add custom attributes for video controls
  const addVideoControlAttributes = (settings, name) => {
    if (name === 'core/video' || name === 'core/cover') {
      settings.attributes = {
        ...settings.attributes,
        showFullscreenButton: {
          type: 'boolean',
          default: true
        },
        showPlayButton: {
          type: 'boolean',
          default: true
        },
        showOverlayPlayButton: {
          type: 'boolean',
          default: true
        },
        showMuteButton: {
          type: 'boolean',
          default: true
        },
        showTimeline: {
          type: 'boolean',
          default: true
        },
        showVolumeSlider: {
          type: 'boolean',
          default: true
        },
        showDuration: {
          type: 'boolean',
          default: true
        },
        showCurrentTime: {
          type: 'boolean',
          default: true
        },
        backgroundColor: {
          type: 'string',
          default: 'var(--wp--preset--color--primary)'
        },
        textColor: {
          type: 'string',
          default: 'var(--wp--preset--color--white)'
        },
        panelAnimation: {
          type: 'string',
          default: 'slide'
        },
        panelOpacity: {
          type: 'number',
          default: 55
        }
      };

      // settings.supports = {
      //   ...(settings.supports || {}),
      //   color: { background: true, text: true },
      // };
    }
    return settings;
  };

  // Add filter to include the custom attributes
  wp.hooks.addFilter('blocks.registerBlockType', 'custom/video-controls-attributes', addVideoControlAttributes);

  // Helper function to build the controlslist attribute value
  const buildControlsList = attributes => {
    const {
      showFullscreenButton,
      showOverlayPlayButton,
      showPlayButton,
      showMuteButton,
      showTimeline,
      showVolumeSlider,
      showDuration,
      showCurrentTime
    } = attributes;
    const controlsList = [];
    if (!showFullscreenButton) controlsList.push('nofullscreen');
    if (!showOverlayPlayButton) controlsList.push('nooverlayplaybutton');
    if (!showPlayButton) controlsList.push('noplaybutton');
    if (!showMuteButton) controlsList.push('nomutebutton');
    if (!showTimeline) controlsList.push('notimeline');
    if (!showVolumeSlider) controlsList.push('novolumeslider');
    if (!showDuration) controlsList.push('noduration');
    if (!showCurrentTime) controlsList.push('nocurrenttime');
    return controlsList.join(' ');
  };

  // Extend BlockEdit to add custom controls to the sidebar
  const addVideoControlInspector = createHigherOrderComponent(BlockEdit => {
    return props => {
      const {
        attributes,
        setAttributes
      } = props;
      const {
        url
      } = attributes;
      const isSupportedBlock = props.name === 'core/video' || props.name === 'core/cover';
      const isVideoSelected = props.name === 'core/video' || url && !IMAGE_FORMATS.includes(url.split('.').pop());
      const showControls = attributes.controls && isVideoSelected;
      if (isSupportedBlock) {
        return /*#__PURE__*/React.createElement(Fragment, null, /*#__PURE__*/React.createElement(BlockEdit, props), showControls && /*#__PURE__*/React.createElement(InspectorControls, null, /*#__PURE__*/React.createElement(PanelBody, {
          title: "Media Controls Settings",
          initialOpen: false
        }, /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(ToggleControl, {
          label: "Fullscreen Button",
          checked: attributes.showFullscreenButton,
          onChange: value => setAttributes({
            showFullscreenButton: value
          })
        }), /*#__PURE__*/React.createElement(ToggleControl, {
          label: "Play Button",
          checked: attributes.showPlayButton,
          onChange: value => setAttributes({
            showPlayButton: value
          })
        }), /*#__PURE__*/React.createElement(ToggleControl, {
          label: "Overlay Play Button",
          checked: attributes.showOverlayPlayButton,
          onChange: value => setAttributes({
            showOverlayPlayButton: value
          })
        }), /*#__PURE__*/React.createElement(ToggleControl, {
          label: "Mute Button",
          checked: attributes.showMuteButton,
          onChange: value => setAttributes({
            showMuteButton: value
          })
        }), /*#__PURE__*/React.createElement(ToggleControl, {
          label: "Timeline",
          checked: attributes.showTimeline,
          onChange: value => setAttributes({
            showTimeline: value
          })
        }), /*#__PURE__*/React.createElement(ToggleControl, {
          label: "Volume Slider",
          checked: attributes.showVolumeSlider,
          onChange: value => setAttributes({
            showVolumeSlider: value
          })
        }), /*#__PURE__*/React.createElement(ToggleControl, {
          label: "Duration",
          checked: attributes.showDuration,
          onChange: value => setAttributes({
            showDuration: value
          })
        }), /*#__PURE__*/React.createElement(ToggleControl, {
          label: "Current Time",
          checked: attributes.showCurrentTime,
          onChange: value => setAttributes({
            showCurrentTime: value
          })
        }), /*#__PURE__*/React.createElement(SelectControl, {
          label: "Panel Animation",
          value: attributes.panelAnimation,
          options: [{
            value: 'none',
            label: 'None'
          }, {
            value: 'slide',
            label: 'Slide'
          }, {
            value: 'fade',
            label: 'Fade'
          }, {
            value: 'slide-and-fade',
            label: 'Slide and Fade'
          }],
          onChange: value => setAttributes({
            panelAnimation: value
          })
        }), /*#__PURE__*/React.createElement(RangeControl, {
          label: "Panel Opacity",
          value: attributes.panelOpacity,
          onChange: value => setAttributes({
            panelOpacity: value
          }),
          min: 0,
          max: 100,
          step: 1
        })))));
      }
      return /*#__PURE__*/React.createElement(BlockEdit, props);
    };
  }, 'withVideoControlInspector');
  wp.hooks.addFilter('editor.BlockEdit', 'custom/video-controls-inspector', addVideoControlInspector);
  const addSaveVideoElement = settings => {
    if (settings.name === 'core/video' || settings.name === 'core/cover') {
      const originalSave = settings.save;
      settings.save = props => {
        const {
          attributes
        } = props;
        const controlsList = buildControlsList(attributes);

        // Get theme's default button colors
        const {
          defaultBackground,
          defaultTextColor
        } = getButtonStylesFromSettings();
        // const backgroundColor = getColorValue(attributes.backgroundColor) || getColorValue(defaultBackground);
        // const textColor = getColorValue(attributes.textColor) || getColorValue(defaultTextColor);
        const backgroundColor = getColorValue(defaultBackground);
        const textColor = getColorValue(defaultTextColor);
        const {
          panelAnimation,
          panelOpacity
        } = attributes;
        // Inline styles for x-mediacontrols
        const style = {
          '--x-controls-bg': backgroundColor,
          '--x-controls-color': textColor,
          '--x-controls-bg-opacity': String(panelOpacity / 100),
          // Normalized to 0-1 for CSS
          '--x-controls-slide': panelAnimation === 'slide' || panelAnimation === 'slide-and-fade' ? '1' : '0',
          '--x-controls-fade': panelAnimation === 'fade' || panelAnimation === 'slide-and-fade' ? '1' : '0'
        };

        // Get the original save output
        const originalOutput = originalSave({
          ...props,
          attributes: {
            ...props.attributes,
            // backgroundColor: undefined, // Exclude from saved attributes
            // textColor: undefined,       // Exclude from saved attributes
            controls: false // Disable default controls to avoid conflicts
          }
        });

        // Clone the video element and wrap it in x-mediacontrols with overlay
        const wrappedVideo = React.Children.map(originalOutput.props.children, child => {
          // Check if the child is the video tag
          if (React.isValidElement(child) && child.type === 'video') {
            // Find the overlay (wp-block-cover__background) in the children
            const overlay = React.Children.toArray(originalOutput.props.children).find(overlayChild => React.isValidElement(overlayChild) && overlayChild.props.className && overlayChild.props.className.includes('wp-block-cover__background'));

            // Return the wrapped video
            return /*#__PURE__*/React.createElement("x-mediacontrols", {
              controls: attributes.controls,
              controlslist: controlsList,
              style: style,
              className: "wp-block-video" // Ensure class matches expected output
            }, overlay, child);
          }
          return child; // Return other children as they are
        });

        // Return the updated output
        return React.cloneElement(originalOutput, {}, wrappedVideo);
      };
    }
    return settings;
  };
  wp.hooks.addFilter('blocks.registerBlockType', 'custom/video-controls-save', addSaveVideoElement);

})();
