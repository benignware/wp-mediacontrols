import './settings.css';
import { getPluginSettings } from './utils.js';
import { PLUGIN_SETTINGS_ID } from './constants';
import { getWrapperProps } from './functions';

const {
    componentClass,
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
                settings[prop] = el.value;
            });

        const { enabled = true } = settings;
        this.previewWrapper.classList.toggle(componentClass, enabled);
        window.postMessage({ type: updateMessageType }, '*');

        const props = { attributes: { [settingsAttribute]: settings, controls: true } };
        const { className, style, ...attrs } = getWrapperProps(props);

        if (className) {
            this.previewWrapper.classList.add(className);
        }

        Object.entries(style).forEach(([styleProperty, value]) => {
            this.previewWrapper.style.setProperty(styleProperty, value);
        });
        Object.entries(attrs).forEach(([attr, value]) => {
            if (value === undefined) {
                this.previewWrapper.removeAttribute(attr);
            } else {
                this.previewWrapper.setAttribute(attr, value);
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
