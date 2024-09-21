const { registerBlockType } = wp.blocks;
const { createHigherOrderComponent } = wp.compose;
const { ToggleControl, PanelBody } = wp.components;
const { InspectorControls } = wp.blockEditor;
const { Fragment } = wp.element;
const { select } = wp.data;

// Helper function to retrieve theme button colors from settings
const getButtonStylesFromSettings = () => {
  const settings = select('core/block-editor').getSettings();
  const buttonStyles = settings.styles?.blocks?.['core/button']?.default?.color || {};
  const defaultBackground = buttonStyles.background || '#000000'; // Fallback to black
  const defaultTextColor = buttonStyles.text || '#FFFFFF'; // Fallback to white
  return { defaultBackground, defaultTextColor };
};

// Function to check if a color is a valid CSS color or theme preset
const getColorValue = (color) => {
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
  if (name === 'core/video') {
    settings.attributes = {
      ...settings.attributes,
      showFullscreenButton: { type: 'boolean', default: true },
      showPlayButton: { type: 'boolean', default: true },
      showOverlayPlayButton: { type: 'boolean', default: true },
      showMuteButton: { type: 'boolean', default: true },
      showTimeline: { type: 'boolean', default: true },
      showVolumeSlider: { type: 'boolean', default: true },
      showDuration: { type: 'boolean', default: true },
      showCurrentTime: { type: 'boolean', default: true },
      controls: { type: 'boolean', default: true },
      backgroundColor: { type: 'string', default: 'var(--wp--preset--color--primary)' },
      textColor: { type: 'string', default: 'var(--wp--preset--color--white)' },
    };

    settings.supports = {
      ...(settings.supports || {}),
      color: { background: true, text: true },
    };
  }
  return settings;
};

// Add filter to include the custom attributes
wp.hooks.addFilter(
  'blocks.registerBlockType',
  'custom/video-controls-attributes',
  addVideoControlAttributes
);

// Helper function to build the controlslist attribute value
const buildControlsList = (attributes) => {
  const {
    showFullscreenButton,
    showOverlayPlayButton,
    showPlayButton,
    showMuteButton,
    showTimeline,
    showVolumeSlider,
    showDuration,
    showCurrentTime,
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
const addVideoControlInspector = createHigherOrderComponent((BlockEdit) => {
  return (props) => {
    const { attributes, setAttributes } = props;

    if (props.name === 'core/video' && attributes.controls) {
      return (
        <Fragment>
          <InspectorControls>
            <PanelBody title="Media Controls Settings">
              <ToggleControl
                label="Fullscreen Button"
                checked={attributes.showFullscreenButton}
                onChange={(value) => setAttributes({ showFullscreenButton: value })}
              />
              <ToggleControl
                label="Play Button"
                checked={attributes.showPlayButton}
                onChange={(value) => setAttributes({ showPlayButton: value })}
              />
              <ToggleControl
                label="Overlay Play Button"
                checked={attributes.showOverlayPlayButton}
                onChange={(value) => setAttributes({ showOverlayPlayButton: value })}
              />
              <ToggleControl
                label="Mute Button"
                checked={attributes.showMuteButton}
                onChange={(value) => setAttributes({ showMuteButton: value })}
              />
              <ToggleControl
                label="Timeline"
                checked={attributes.showTimeline}
                onChange={(value) => setAttributes({ showTimeline: value })}
              />
              <ToggleControl
                label="Volume Slider"
                checked={attributes.showVolumeSlider}
                onChange={(value) => setAttributes({ showVolumeSlider: value })}
              />
              <ToggleControl
                label="Duration"
                checked={attributes.showDuration}
                onChange={(value) => setAttributes({ showDuration: value })}
              />
              <ToggleControl
                label="Current Time"
                checked={attributes.showCurrentTime}
                onChange={(value) => setAttributes({ showCurrentTime: value })}
              />
            </PanelBody>
          </InspectorControls>
          <BlockEdit {...props} />
        </Fragment>
      );
    }

    return <BlockEdit {...props} />;
  };
}, 'withVideoControlInspector');

wp.hooks.addFilter(
  'editor.BlockEdit',
  'custom/video-controls-inspector',
  addVideoControlInspector
);

// Save function for the video block
const addSaveVideoElement = (settings) => {
  if (settings.name === 'core/video') {
    const originalSave = settings.save;

    settings.save = (props) => {
      const { attributes } = props;
      const controlsList = buildControlsList(attributes);

      // Get theme's default button colors
      const { defaultBackground, defaultTextColor } = getButtonStylesFromSettings();
      const backgroundColor = getColorValue(attributes.backgroundColor) || getColorValue(defaultBackground);
      const textColor = getColorValue(attributes.textColor) || getColorValue(defaultTextColor);

      // Inline styles for x-mediacontrols
      const style = {
        '--x-controls-bg': backgroundColor,
        '--x-controls-color': textColor,
      };

      return (
        <x-mediacontrols
          controls={attributes.controls}
          controlslist={controlsList}
          style={style}
        >
          {originalSave({
            ...props,
            attributes: {
              ...props.attributes,
              backgroundColor: undefined, // Exclude from saved attributes
              textColor: undefined,       // Exclude from saved attributes
              controls: false,            // Disable default controls to avoid conflicts
            }
          })}
        </x-mediacontrols>
      );
    };
  }
  return settings;
};

wp.hooks.addFilter(
  'blocks.registerBlockType',
  'custom/video-controls-save',
  addSaveVideoElement
);
