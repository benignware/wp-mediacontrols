import { camelCase, kebabCase } from "change-case";

export const getPluginSettings = (globalKey) => {
  if (!window[globalKey]) {
    throw new Error(`Global settings not found: ${globalKey}`);
  }

  const {
    settings: globalSettings = {},
    schema: { settings: settingsSchema = {} } = {},
    plugin: {
      Name: pluginName,
      Version: pluginVersion,
    } = {},
  } = window[globalKey];

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
    defaultSettings: getDefaultSettings(settingsSchema),
    settingsAttribute: pluginId,
    settingsSections: getSettingsSections(settingsSchema),
    updateMessageType: `${pluginId}UpdateMessage`,
    settingsFormSelector: `#${pluginSlug}-settings`,
    settingsInputSelector: `[name^="${pluginSlug}"]`,
    settingsPreviewSelector: `#${pluginSlug}-preview`,
    settingsPreviewComponentSelector: `#${pluginSlug}-preview-component`,
    settingsResetButtonSelector: `#${pluginSlug}-reset-button`,
  };
};

export const getSettingsSections = schema => Object.keys(schema).reduce((acc, key) => {
  const item = schema[key];
  const section = item.section || 'general';
  (acc[section] = acc[section] || {})[key] = item; // Initialize section and assign item
  return acc;
}, {});

export const getDefaultSettings = (settingsSchema) => {
  return Object.entries(settingsSchema).reduce((acc, [key, item]) => {
    acc[key] = item.default;
    return acc;
  }, {});
}

export const mergeSettings = (...settings) => {
  return settings.reduce((merged, current) => {
    for (const key in current) {
      merged[key] = current[key];
    }
    return merged;
  }, {});
};

export const getStyleProps = (settingsSections) => {
  return Object.entries(settingsSections.style).reduce((acc, [key, item]) => {
    if (item.section === 'style') {
      acc[key] = item;
    }

    return acc;
  } , {});
};

export const getCSSText = (styles) => {
  return Object.entries(styles).reduce((acc, [key, value]) => {
    return [...acc, `${key}: ${value}`];
  }, []).join('; ');
}

export const removeStyleProps = (settings, styleProps) => {
  return Object.keys(settings).reduce((acc, key) => {
    if (!styleProps.hasOwnProperty(key)) {
      acc[key] = settings[key];
    }

    return acc;
  }, {});
}

export const getComponentProps = (props) => {
  const componentProps = {};

  Object.entries(props).forEach(([key, value]) => {
    let attr = key.replace(/data-/, '');

    if (attr === 'className') {
      attr = 'class';
    }

    componentProps[attr] = value;
  });

  return componentProps;
};
