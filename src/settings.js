import './settings.css';
import { getPluginSettings, getComponentProps } from './pluginUtils.js';
import { PLUGIN_SETTINGS_ID } from './constants';
import { getWrapperProps } from './functions';

const {
    pluginId,
    defaultSettings,
    componentClass,
    componentTag,
    updateMessageType,
    settingsAttribute,
    settingsFormSelector,
    settingsInputSelector,
    settingsPreviewSelector,
    settingsResetButtonSelector,
} = getPluginSettings(PLUGIN_SETTINGS_ID);

class Settings {
    constructor() {
        this.form = document.querySelector(settingsFormSelector);
        this.previewWrapper = document.querySelector(settingsPreviewSelector);
        this.formElements = this.form ? [...this.form.querySelectorAll(settingsInputSelector)] : [];
        this.resetButton = document.querySelector(settingsResetButtonSelector);

        if (this.form && this.previewWrapper) {
            this.initSyncElements();
            this.updatePreview();
            this.setupResetButton();
        }
    }

    getRelatedElements(element) {
        return [...this.form.querySelectorAll(`[data-sync="${element.getAttribute('data-sync')}"]`)];
    }

    updatePreview() {
        const settings = {};

        this.formElements
            .filter(el => !el.disabled)
            .forEach(el => {
                const prop = el.name.split('[').pop().split(']')[0];
                const isBool = el.dataset.type === 'boolean';
                
                settings[prop] = isBool ? el.value : el.value || el.dataset.default;
            });

        for (const [key, value] of Object.entries(defaultSettings)) {
            if (settings[key] === undefined) {
                settings[key] = value;
            }
        }

        const { enabled = true } = settings;
        this.previewWrapper.classList.toggle(componentClass, enabled);
        
        window.postMessage({ type: updateMessageType }, '*');

        const props = { attributes: { [settingsAttribute]: settings, controls: true } };
        const wrapperProps = getWrapperProps(props);

        const { className, style, ...attrs } = wrapperProps;

        this.previewWrapper.dataset[pluginId] = JSON.stringify(wrapperProps);

        if (className) {
            this.previewWrapper.classList.add(className);
        }

        Object.entries(style).forEach(([styleProperty, value]) => {
            if (value === undefined) {
                this.previewWrapper.style.removeProperty(styleProperty);
                return;
            }

            this.previewWrapper.style.setProperty(styleProperty, value);
        });

        Object.entries(attrs).forEach(([attr, value]) => {
            if (attr === 'className' || attr === 'style') {
                return;
            }

            if (value === undefined) {
                this.previewWrapper.removeAttribute(attr);
            } else {
                this.previewWrapper.setAttribute(attr, value);
            }
        });

        if (!enabled && this.previewComponent) {
            this.previewComponent.remove();
            this.previewComponent = null;
            return;
        }

        if (!this.previewComponent) {
            this.previewComponent = document.createElement(componentTag);
            this.previewWrapper.parentNode.insertBefore(this.previewComponent, this.previewWrapper);
            this.previewComponent.for = this.previewWrapper.id;
        }

        const componentProps = getComponentProps(wrapperProps);

        Object.entries(componentProps).forEach(([attr, value]) => {
            if (attr === 'style' && typeof value === 'object') {
                for (const [styleProp, styleValue] of Object.entries(value)) {
                    if (styleValue === undefined) {
                        this.previewComponent.style.removeProperty(styleProp);
                        continue;
                    }

                    this.previewComponent.style.setProperty(styleProp, styleValue);
                }

                return;
            }

            if (value === undefined || value === null) {
                this.previewComponent.removeAttribute(attr);
            } else {
                this.previewComponent.setAttribute(attr, value);
            }
        });
    }

    handleInput(event) {
        const relatedElements = this.getRelatedElements(event.target)
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

        this.updatePreview();
    }

    initSyncElements() {
        this.formElements.forEach(el => {
            const relatedElements = this.getRelatedElements(el);
            relatedElements.forEach(relEl => {
                relEl.addEventListener('input', this.handleInput.bind(this));
            });
        });
    }

    setupResetButton() {
        if (this.resetButton) {
            this.resetButton.addEventListener('click', () => {
                const confirmReset = confirm('Are you sure you want to reset all settings to their default values? This action cannot be undone.');

                if (confirmReset) {
                    this.formElements.forEach(hiddenInput => {
                        const defaultValue = hiddenInput.getAttribute('data-default');
                        const relatedElements = this.getRelatedElements(hiddenInput);

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

                    this.updatePreview();
                }
            });
        }
    }
}

// Initialize the Settings class when the DOM content is loaded
document.addEventListener('DOMContentLoaded', () => new Settings());
