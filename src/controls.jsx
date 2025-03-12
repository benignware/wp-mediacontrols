import { pascalCase } from 'change-case';
import { PLUGIN_SETTINGS_ID } from './constants';
import { getPluginSettings, getComponentProps } from "./pluginUtils.js";
import { BlockRemovalListener, renderControl } from "./pluginUtils.jsx";
import { isSupportedBlock, getWrapperProps } from "./functions";

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
const { useEffect } = wp.element;

const {
  pluginName,
  pluginSlug,
  settingsAttribute,
  settingsSections = {},
  updateMessageType,
  globalSettings,
} = getPluginSettings(PLUGIN_SETTINGS_ID);

const dispatchUpdateMessage = () => {
  const iframeWindow = document.querySelector('[name="editor-canvas"]')?.contentWindow;
  
  if (iframeWindow) {
    iframeWindow.postMessage({ type: updateMessageType }, '*');
  }
};

// Add custom attributes
const addSettingsAttribute = (settings, name) => {
  if (isSupportedBlock({ name })) {
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

    if (!isSupportedBlock(props)) {
      return <BlockEdit {...props} />;
    }

    const handleBlockRemove = () => {
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

    const { controls = [], style: styles = [] } = settingsSections;

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

    const enabledLabel = __('Enabled');
 
    return (
      <Fragment>
        <BlockEdit {...props} />
        <BlockRemovalListener onBlockRemove={handleBlockRemove} />
        <InspectorControls>
          <PanelBody title={pluginName} initialOpen={true}>
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
              label={__(pluginName)}
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
}, `with${pascalCase(pluginName)}Inspector`);

wp.hooks.addFilter(
  'editor.BlockEdit',
  `${pluginSlug}/controls`,
  addSettingsControls
);

const withSettingsStyle = createHigherOrderComponent((BlockListBlock) => {
  return (props) => {
    const { attributes } = props;
    const { [settingsAttribute]: settings } = attributes;

    useEffect(() => {
      dispatchUpdateMessage();

      window.requestAnimationFrame(() => {
        dispatchUpdateMessage();
      });
    }, [props]);
    
    if (!isSupportedBlock(props) || !settings) {
        return <BlockListBlock {...props} />;
    }

    if (!globalSettings.editor) {
      return <BlockListBlock {...props} />;
    }

    const wrapperProps = getWrapperProps(props, globalSettings, settings);
    const componentProps = getComponentProps(wrapperProps);

    return (
      <Fragment>
        <x-mediacontrols for={'block-' + props.clientId} {...componentProps} />
        <BlockListBlock {...props}/>
      </Fragment>
    );
  };
}, `with${pascalCase(pluginName)}Styles`);


addFilter(
  'editor.BlockListBlock',
  `${pluginSlug}/settings-style`,
  withSettingsStyle
);
