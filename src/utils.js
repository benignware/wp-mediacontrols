import { camelCase, kebabCase } from "change-case";

export const getSettingsSections = schema => Object.keys(schema).reduce((acc, key) => {
  const item = schema[key];
  const section = item.section || 'general';
  (acc[section] = acc[section] || {})[key] = item; // Initialize section and assign item
  return acc;
}, {});

export const getStyleProps = (settingsSections) => {
  return Object.entries(settingsSections.style).reduce((acc, [key, item]) => {
    if (item.section === 'style') {
      acc[key] = item;
    }

    return acc;
  } , {});
};

export const removeStyleProps = (settings, styleProps) => {
  return Object.keys(settings).reduce((acc, key) => {
    if (!styleProps.hasOwnProperty(key)) {
      acc[key] = settings[key];
    }

    return acc;
  }, {});
}


export const getPluginSettings = (globalKey) => {
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