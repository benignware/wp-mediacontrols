import {
  PLUGIN_SLUG,
  SUPPORTED_BLOCKS,
  SETTINGS_ATTRIBUTE,
  SETTINGS_LABEL,
  UPDATE_MESSAGE_TYPE
} from "./constants";
import { BlockRemovalListener, renderControl } from "./utils.jsx";
import { getWrapperProps } from "./functions";

const { __ } = wp.i18n;
const { Fragment } = wp.element;
const {
  ToggleControl,
  PanelBody,
  __experimentalToolsPanel: ToolsPanel,
  __experimentalToolsPanelItem: ToolsPanelItem,
} = wp.components;
const { InspectorControls } = wp.blockEditor;
const { createHigherOrderComponent } = wp.compose;
const { addFilter } = wp.hooks;

const { settings: globalSettings = {}, schema: settingsData } = window[`${PLUGIN_SLUG}Settings`] || {};

const settingsSections = Object.keys(settingsData).reduce((acc, key) => {
  const item = settingsData[key];
  const section = item.section || 'general';
  (acc[section] = acc[section] || {})[key] = item; // Initialize section and assign item
  return acc;
}, {});

const dispatchUpdateMessage = (enabled, filter) => {
  const iframeWindow = document.querySelector('[name="editor-canvas"]').contentWindow;
  if (iframeWindow) {
      iframeWindow.postMessage({ type: UPDATE_MESSAGE_TYPE }, '*');
  }
};

// Add custom attributes
const addSettingsAttribute = (settings, name) => {
  if (SUPPORTED_BLOCKS.includes(name)) {
    settings.attributes = {
      ...settings.attributes,
      [SETTINGS_ATTRIBUTE]: { type: 'object', default: {} },
    };
  }

  return settings;
};

// Add filter to include the custom attributes
wp.hooks.addFilter(
  'blocks.registerBlockType',
  `${PLUGIN_SLUG}/settings`,
  addSettingsAttribute
);

// Extend BlockEdit to add custom controls to the sidebar
const addSettingsControls = createHigherOrderComponent((BlockEdit) => {
  return (props) => {
    const { attributes, setAttributes, name: blockName } = props;

    const isSupportedBlock = SUPPORTED_BLOCKS.includes(blockName);

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
          const { [key]: _, ...newSettings } = attributes[SETTINGS_ATTRIBUTE];

          setAttributes({ ...attributes, [SETTINGS_ATTRIBUTE]: newSettings });
          dispatchUpdateMessage();
      } else {
          setAttributes({
            ...attributes,
            [SETTINGS_ATTRIBUTE]: {
              ...attributes[SETTINGS_ATTRIBUTE],
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
          [SETTINGS_ATTRIBUTE]: newSettings,
      });
  
      dispatchUpdateMessage();
    };

    const settings = {
      ...globalSettings, 
      ...attributes[SETTINGS_ATTRIBUTE],
    }

    const enabledLabel = settings.enabled ? __('Enabled') : __('Disabled');
 
    return (
      <Fragment>
        <BlockEdit {...props} />
        <BlockRemovalListener onBlockRemove={handleBlockRemove} />
        <InspectorControls>
          <PanelBody title={SETTINGS_LABEL} initialOpen={true}>
            <ToggleControl
              label={enabledLabel}
              checked={settings.enabled}
              onChange={(value) => updateSetting('enabled', value)}
            />

            {/* Only show these controls if "enabled" is true */}
            {settings.enabled && (
              <Fragment>
                {Object.entries(controls).map(([key, { name, label, type }]) => (
                  <div key={name} style={{ marginBottom: '10px' }}>
                    {renderControl({
                      type,
                      label,
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
              label={__(SETTINGS_LABEL)}
              resetAll={resetAllStyles}
            >
              {Object.entries(styles).map(([key, { name, label, type, min, max, unit, options = [] }]) => (
                <ToolsPanelItem
                  key={name}
                  hasValue={() => attributes[SETTINGS_ATTRIBUTE][key] !== undefined}
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
  `${PLUGIN_SLUG}mediacontrols/controls`,
  addSettingsControls
);

const withSettingsStyle = createHigherOrderComponent((BlockListBlock) => {
  return (props) => {
      if (!SUPPORTED_BLOCKS.includes(props.name)) {
          return <BlockListBlock {...props} />;
      }

      const { attributes: { [SETTINGS_ATTRIBUTE]: blockSettings, controls = false } } = props;
      const settings = {
        // ...globalSettings,
        ...blockSettings
      }

      const wrapperProps = getWrapperProps(props);

      console.log('wrapper props', wrapperProps);

      if (settings.enabled) {
        return (
          <BlockListBlock {...props} wrapperProps={wrapperProps} />
        );
      }

      return <BlockListBlock {...props} />;
  };
}, 'withMediaControlsSettingsStyle');


addFilter(
  'editor.BlockListBlock',
  `${PLUGIN_SLUG}/settings-style`,
  withSettingsStyle
);
