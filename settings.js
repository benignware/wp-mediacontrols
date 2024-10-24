(() => {
    const FORM_SELECTOR = '#mediacontrols-settings';
    const INPUT_SELECTOR = '[name^="mediacontrols"]';
    const PREVIEW_SELECTOR = '#mediacontrols-preview';
    const RESET_BUTTON_SELECTOR = '#mediacontrols-reset-button';
    const COMPONENT_CLASS = 'is-mediacontrols';
    const MESSAGE_TYPE = 'updateMediacontrols';

    const updatePreview = () => {
        const form = document.querySelector(FORM_SELECTOR);
        const previewWrapper = document.querySelector(PREVIEW_SELECTOR);

        if (!form || !previewWrapper) {
            return;
        }
        
        const formElements = [...form.querySelectorAll(INPUT_SELECTOR)];
        const enabled = formElements.find(el => el.getAttribute('name').split('[').pop().split(']')[0] === 'enabled')?.value === '1';

        previewWrapper.classList.toggle(COMPONENT_CLASS, enabled);
        window.postMessage({ type: MESSAGE_TYPE }, '*');

        const controlsListString = [];
        const styles = {};

        formElements.forEach(el => {
            const prop = el.getAttribute('name').split('[').pop().split(']')[0];
            const value = ['checkbox', 'radio'].includes(el.type)
                ? el.disabled && el.dataset.default
                : el.value;

            console.log('update preview', prop, value);

            switch (prop) {
                case 'showPlayButton':
                case 'showOverlayPlayButton':
                case 'showMuteButton':
                case 'showTimeline':
                case 'showVolumeSlider':
                case 'showDuration':
                case 'showCurrentTime':
                case 'showFullscreenButton':
                    if (!value) {
                        controlsListString.push(`no${prop.replace(/^show/, '').toLowerCase()}`);
                    }
                    break;
                case 'backgroundColor':
                    styles['--x-controls-bg'] = value;
                    break;
                case 'textColor':
                    styles['--x-controls-color'] = value;
                    break;
                case 'backgroundOpacity':
                    styles['--x-controls-bg-opacity'] = value / 100;
                    break;
                case 'panelAnimation':
                    styles['--x-controls-slide'] = value === 'slide' ? '1' : '0';
                    styles['--x-controls-fade'] = value === 'fade' ? '1' : '0';
                    break;
            }
        });

        previewWrapper.setAttribute('data-controlslist', controlsListString.join(' '));

        Object.entries(styles).forEach(([styleProperty, value]) => {
            previewWrapper.style.setProperty(styleProperty, value);
        });
    };

    // Generic script to handle form sync
    document.addEventListener('DOMContentLoaded', function () {
        const form = document.querySelector(FORM_SELECTOR);
        const previewWrapper = document.querySelector(PREVIEW_SELECTOR);

        if (!form || !previewWrapper) {
            return;
        }

        const formElements = [...form.querySelectorAll(INPUT_SELECTOR)];

        const getRelatedElements = element => [...form.querySelectorAll(`[data-sync="${element.getAttribute('data-sync')}"]`)];

        const handleInput = (event) => {
            const relatedElements = getRelatedElements(event.target)
                .filter(relEl => relEl !== event.target);

            console.log('handle input');

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