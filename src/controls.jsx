import { IMAGE_FORMATS } from "./constants";
import { BlockRemovalListener, renderControl } from "./utils.jsx";

const { __ } = wp.i18n;
const { Fragment } = wp.element;
const {
  RangeControl,
  SelectControl,
  ToggleControl,
  PanelBody,
  BlockControls,
  __experimentalToolsPanel: ToolsPanel,
  __experimentalToolsPanelItem: ToolsPanelItem,
} = wp.components;
const { InspectorControls } = wp.blockEditor;
const { createHigherOrderComponent } = wp.compose;
const { addFilter } = wp.hooks;

const pluginSlug = 'mediacontrols';

const supportedBlocks = ['core/video', 'core/cover'];
const settingsAttribute = `${pluginSlug}`;
const componentClass = `is-${pluginSlug}`;
const updateMessageType = 'updateMediacontrols';

const { settings: globalSettings = {}, data: settingsData } = window[`${pluginSlug}Settings`] || {};

const settingsSections = Object.keys(settingsData).reduce((acc, key) => {
  const item = settingsData[key];
  const section = item.section || 'general';
  (acc[section] = acc[section] || {})[key] = item; // Initialize section and assign item
  return acc;
}, {});

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
    if (!attributes[prop]) {
      controlsList.push(`no${key.toLowerCase()}`);
    }
  });

  return controlsList.join(' ');
};

const getWrapperProps = (props) => {
  const { attributes: { [settingsAttribute]: settings, controls } } = props;
  const styles = {
    '--x-controls-bg': settings.backgroundColor,
    '--x-controls-bg-opacity': settings.backgroundOpacity / 100,
    '--x-controls-color': settings.textColor,
    '--x-controls-slide': settings.panelAnimation === 'slide' ? '1' : '0',
    '--x-controls-fade': settings.panelAnimation === 'fade' ? '1' : '0',
  }

  return {
    className: componentClass,
    'data-controls': typeof controls !== 'undefined' ? !!controls : undefined,
    'data-controlslist': buildControlsList(settings),
    style: Object.entries(styles).reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {}),
  }
}

const dispatchUpdateMessage = (enabled, filter) => {
  const iframeWindow = document.querySelector('[name="editor-canvas"]').contentWindow;
  if (iframeWindow) {
      iframeWindow.postMessage({ type: updateMessageType }, '*');
  }
};

// Add custom attributes
const addSettingsAttribute = (settings, name) => {
  if (supportedBlocks.includes(name)) {
    settings.attributes = {
      ...settings.attributes,
      [settingsAttribute]: { type: 'object', default: {} },
    };
  }

  return settings;
};

// Add filter to include the custom attributes
wp.hooks.addFilter(
  'blocks.registerBlockType',
  `${pluginSlug}/settings`,
  addSettingsAttribute
);

// Extend BlockEdit to add custom controls to the sidebar
const addSettingsControls = createHigherOrderComponent((BlockEdit) => {
  return (props) => {
    const { attributes, setAttributes, name: blockName } = props;
    const { url } = attributes;

    const isSupportedBlock = supportedBlocks.includes(blockName);

    // Handle cover block with video background
    const isVideo = blockName === 'core/cover' ? attributes.backgroundType === 'video' : isSupportedBlock;

    if (!isVideo) {
      return <BlockEdit {...props} />;
    }

    const handleBlockRemove = (removedBlock) => {
      dispatchUpdateMessage();
    };

    const updateSetting = (key, value) => {
      if (value === null) {
          const { [key]: _, ...newSettings } = attributes[settingsAttribute];

          setAttributes({ ...attributes, [settingsAttribute]: newSettings });
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

    const { controls, style: styles } = settingsSections;

    const resetAllStyles = () => {
      const newSettings = Object.keys(settings).reduce((acc, key) => {
          // Skip style properties
          if (!settingsSections.style.hasOwnProperty(key)) {
              acc[key] = settings[key]; // Keep the other fields intact
          }
          return acc;
      }, {});
  
      setAttributes({
          [settingsAttribute]: newSettings,
      });
  
      dispatchUpdateMessage();
    };

    const settings = {
      ...globalSettings, 
      ...attributes[settingsAttribute],
    }
 
    return (
      <Fragment>
        <BlockEdit {...props} />
        <BlockRemovalListener onBlockRemove={handleBlockRemove} />
        <InspectorControls>
          <PanelBody title={__('Media Controls', 'mediacontrols')} initialOpen={true}>
            <ToggleControl
              label={__('Enable MediaControls', 'mediacontrols')}
              checked={settings.enabled}
              onChange={(value) => updateSetting('enabled', value)}
            />

            {/* Only show these controls if "enabled" is true */}
            {settings.enabled && (
              <Fragment>
                {Object.entries(controls).map(([key, { name, label, type }]) => (
                  <div key={name} style={{ marginBottom: '10px' }}>
                    {renderControl({
                      type, // Control type to render
                      label, // Label for the control
                      checked: settings[key],
                      onChange: (value) => updateSetting(key, value),
                    })}
                  </div>
                ))}
              </Fragment>
            )}
          </PanelBody>
        </InspectorControls>
        {settings.enabled && (
          <InspectorControls group="styles">
            <ToolsPanel
              label={__('Media Controls')}
              resetAll={resetAllStyles}
            >
              {Object.entries(styles).map(([key, { name, label, type, min, max, unit, options = [] }]) => (
                <ToolsPanelItem
                  key={name}
                  hasValue={() => attributes[settingsAttribute][key] !== undefined}
                  label={label}
                  onDeselect={() => updateSetting(key, null)} // Clear value when deselected
                  onSelect={() => updateSetting(key, globalSettings[key])} // Set to global value when selected
                >
                  {renderControl({
                    type,
                    label,
                    value: settings[key],
                    options,
                    onChange: (value) => updateSetting(key, value),
                    min,
                    max,
                    unit,
                  })}
                </ToolsPanelItem>
              ))}
            </ToolsPanel>
          </InspectorControls>
        )}
      </Fragment>
    );
  };
}, 'withMediaControlsInspector');

wp.hooks.addFilter(
  'editor.BlockEdit',
  `${pluginSlug}mediacontrols/controls`,
  addSettingsControls
);

const withSettingsStyle = createHigherOrderComponent((BlockListBlock) => {
  return (props) => {
      if (!supportedBlocks.includes(props.name)) {
          return <BlockListBlock {...props} />;
      }

      const { attributes: { [settingsAttribute]: blockSettings, controls = false } } = props;
      const settings = {
        ...globalSettings,
        ...blockSettings
      }

      console.log('add settings style', props.name, settings.enabled, controls);

      if (controls && settings.enabled) {
        return (
          <BlockListBlock {...props} wrapperProps={getWrapperProps(props)} />
        );
      }

      return <BlockListBlock {...props} />;
  };
}, 'withMediaControlsSettingsStyle');


addFilter(
  'editor.BlockListBlock',
  `${pluginSlug}/settings-style`,
  withSettingsStyle
);
