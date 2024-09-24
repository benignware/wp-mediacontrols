(function () {
  'use strict';

  wp.blocks;
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
        controls: {
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
          default: 'none'
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
      const showControls = attributes.controls;
      if (props.name === 'core/video' || props.name === 'core/cover') {
        return /*#__PURE__*/React.createElement(Fragment, null, /*#__PURE__*/React.createElement(InspectorControls, null, /*#__PURE__*/React.createElement(PanelBody, {
          title: "Media Controls Settings"
        }, /*#__PURE__*/React.createElement(ToggleControl, {
          label: "Enable Controls",
          checked: showControls,
          onChange: value => setAttributes({
            controls: value
          })
        }), showControls && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(ToggleControl, {
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
        })))), /*#__PURE__*/React.createElement(BlockEdit, props));
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
            console.log('style: ', style);

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
