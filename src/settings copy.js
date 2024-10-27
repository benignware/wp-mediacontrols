import './settings.css';
import {
    FORM_SELECTOR,
    INPUT_SELECTOR,
    PREVIEW_SELECTOR,
    RESET_BUTTON_SELECTOR,
    COMPONENT_CLASS,
    SETTINGS_ATTRIBUTE,
    UPDATE_MESSAGE_TYPE,
} from './constants';
import { getWrapperProps } from './functions';

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