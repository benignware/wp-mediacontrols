import {
  SETTINGS_ATTRIBUTE,
  COMPONENT_CLASS,
} from './constants';

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

export const getWrapperProps = (props) => {
  const { attributes: { [SETTINGS_ATTRIBUTE]: settings, controls } } = props;
  
  const styles = {
    '--x-controls-bg': settings.backgroundColor || '',
    '--x-controls-bg-opacity': settings.backgroundOpacity ? settings.backgroundOpacity / 100 : '',
    '--x-controls-color': settings.textColor || '',
    '--x-controls-slide': settings.panelAnimation ? settings.panelAnimation === 'slide' ? '1' : '0' : '',
    '--x-controls-fade': settings.panelAnimation ? settings.panelAnimation === 'fade' ? '1' : '0' : '',
  }

  const style = Object.entries(styles).reduce((acc, [key, value]) => {
    acc[key] = value;
    return acc;
  }, {})

  const result = {
    className: COMPONENT_CLASS,
  };

  result['data-controls'] = controls !== undefined && controls ? '' : undefined;

  const controlslist = buildControlsList(settings);

  result['data-controlslist'] = controlslist || undefined;

  if (Object.keys(style).length) {
    result.style = style;
  }

  return result;
}