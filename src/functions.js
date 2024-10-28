import { PLUGIN_SETTINGS_ID } from './constants';
import { getPluginSettings, mergeSettings } from './pluginUtils.js';

const { componentClass, settingsAttribute } = getPluginSettings(PLUGIN_SETTINGS_ID);

export const isSupportedBlock = (block) => {
  const { name, attributes = null } = block;
  
  if (['core/video', 'core/cover'].includes(name)) {
    if (attributes && name === 'core/cover') {
      return attributes.backgroundType === 'video';
    }

    return true;
  }

  return false;
};

// Helper function to build the controlslist attribute value
export const buildControlsList = (attributes, keys = [
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
    if (attributes[prop] !== undefined && !attributes[prop]) {
      controlsList.push(`no${key.toLowerCase()}`);
    }
  });

  return controlsList.join(' ');
};

export const getWrapperProps = (props, globalSettings = {}) => {
  const { attributes: { [settingsAttribute]: settings, controls } } = props;
  const mergedSettings = mergeSettings(globalSettings, settings);
  
  const styles = {
    '--x-controls-bg': settings.backgroundColor,
    '--x-controls-bg-opacity': settings.backgroundOpacity >= 0 ? settings.backgroundOpacity / 100 : undefined,
    '--x-controls-color': settings.textColor,
    '--x-controls-slide': settings.panelAnimation ? settings.panelAnimation === 'slide' ? '1' : '0' : undefined,
    '--x-controls-fade': settings.panelAnimation ? settings.panelAnimation === 'fade' ? '1' : '0' : undefined,
  }

  const style = Object.entries(styles).reduce((acc, [key, value]) => {
    acc[key] = value;
    return acc;
  }, {})

  const result = {
    className: mergedSettings.enabled ? componentClass : '',
  };

  result['data-controls'] = controls !== undefined && controls ? '' : undefined;

  const controlslist = buildControlsList(mergedSettings);

  result['data-controlslist'] = controlslist || undefined;

  if (Object.keys(style).length) {
    result.style = style;
  }

  return result;
}