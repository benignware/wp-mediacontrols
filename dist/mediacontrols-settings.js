(function () {
  'use strict';

  const COMPONENT_CLASS = 'is-mediacontrols';

  const UPDATE_MESSAGE_TYPE = 'updateMediacontrols';

  const SETTINGS_ATTRIBUTE = 'mediacontrols';

  const FORM_SELECTOR = '#mediacontrols-settings';

  const INPUT_SELECTOR = '[name^="mediacontrols"]';

  const PREVIEW_SELECTOR = '#mediacontrols-preview';

  const RESET_BUTTON_SELECTOR = '#mediacontrols-reset-button';

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
      if (attributes[prop] !== undefined && !attributes[prop]) {
        controlsList.push(`no${key.toLowerCase()}`);
      }
    });

    return controlsList.join(' ');
  };

  const getWrapperProps = (props) => {
    const { attributes: { [SETTINGS_ATTRIBUTE]: settings, controls } } = props;
    
    const styles = {
      '--x-controls-bg': settings.backgroundColor || '',
      '--x-controls-bg-opacity': settings.backgroundOpacity ? settings.backgroundOpacity / 100 : '',
      '--x-controls-color': settings.textColor || '',
      '--x-controls-slide': settings.panelAnimation ? settings.panelAnimation === 'slide' ? '1' : '0' : '',
      '--x-controls-fade': settings.panelAnimation ? settings.panelAnimation === 'fade' ? '1' : '0' : '',
    };

    const style = Object.entries(styles).reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {});

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
  };

  (() => {
      // Generic script to handle form sync
      document.addEventListener('DOMContentLoaded', function () {
          const form = document.querySelector(FORM_SELECTOR);
          const previewWrapper = document.querySelector(PREVIEW_SELECTOR);

          if (!form || !previewWrapper) {
              return;
          }

          const formElements = [...form.querySelectorAll(INPUT_SELECTOR)];

          const getRelatedElements = element => [...form.querySelectorAll(`[data-sync="${element.getAttribute('data-sync')}"]`)];

          const updatePreview = () => {
              const settings = {};
      
              formElements
                  .filter(el => !el.disabled)
                  .forEach(el => {
                      const prop = el.name.split('[').pop().split(']')[0];
                      
                      settings[prop] = el.value;
                  });
              
              const { enabled = true } = settings;
      
              previewWrapper.classList.toggle(COMPONENT_CLASS, enabled);
              window.postMessage({ type: UPDATE_MESSAGE_TYPE }, '*');
      
              const props = { attributes: { [SETTINGS_ATTRIBUTE]: settings, controls: true } };
      
              const { className = COMPONENT_CLASS, style, ...attrs } = getWrapperProps(props);
      
              previewWrapper.classList.add(className);
      
              Object.entries(style).forEach(([styleProperty, value]) => {
                  previewWrapper.style.setProperty(styleProperty, value);
              });
      
              Object.entries(attrs).forEach(([attr, value]) => {
                  if (value === undefined) {
                      previewWrapper.removeAttribute(attr);
                      return;
                  }

                  previewWrapper.setAttribute(attr, value);
              });
          };

          const handleInput = (event) => {
              const relatedElements = getRelatedElements(event.target)
                  .filter(relEl => relEl !== event.target);
              
              relatedElements.forEach(relEl => {
                  let value = event.target.value;
                  
                  if (relEl.type === 'checkbox' || relEl.type === 'radio') {
                      relEl.checked = event.target.checked;
                  } else if (relEl.type === 'hidden') {
                      relEl.disabled = false;

                      if (event.target.type === 'checkbox' || event.target.type === 'radio') {
                          value = event.target.checked ? '1' : '';
                      }
                  }

                  relEl.value = value;
              });

              updatePreview();
          };

          const initSyncElements = () => {
              formElements.forEach(el => {
                  const relatedElements = getRelatedElements(el);
                  relatedElements.forEach(relEl => {
                      relEl.addEventListener('input', handleInput);
                  });
              });
          };

          initSyncElements();
          updatePreview();

          const resetButton = document.querySelector(RESET_BUTTON_SELECTOR);

          if (!resetButton) {
              return;
          }

          resetButton.addEventListener('click', function () {
              const confirmReset = confirm('Are you sure you want to reset all settings to their default values? This action cannot be undone.');

              if (confirmReset) {
                  formElements.forEach(hiddenInput => {
                      const defaultValue = hiddenInput.getAttribute('data-default');
                      const relatedElements = getRelatedElements(hiddenInput);

                      if (hiddenInput.type === 'hidden') {
                          hiddenInput.disabled = true;
                      } else {
                          hiddenInput.value = '';
                      }

                      relatedElements.forEach(el => {
                          if (el.type === 'checkbox' || el.type === 'radio') {
                              el.checked = defaultValue === '1';
                          } else {
                              el.value = defaultValue;
                          }
                      });
                  });

              }

              updatePreview();
          });
      });
  })();

})();
