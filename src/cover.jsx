const { addFilter } = wp.hooks;
const { Fragment, cloneElement, Children } = wp.element;
const { InspectorControls } = wp.blockEditor;
const { PanelBody, Button, BaseControl, ToggleControl, SelectControl } = wp.components;
const { createHigherOrderComponent } = wp.compose;
const { MediaUpload, MediaUploadCheck } = wp.blockEditor;
const { __, _x, sprintf } = wp.i18n;

// Import hooks from wp.element
const { useMemo, useCallback, Platform } = wp.element;

// Preload options
const options = [
    { value: 'auto', label: __( 'Auto' ) },
    { value: 'metadata', label: __( 'Metadata' ) },
    { value: 'none', label: _x( 'None', 'Preload value' ) },
];

// Add video-related attributes to the core/cover block
function addVideoAttributes(settings, name) {
    if (name === 'core/cover') {
        settings.attributes = {
            ...settings.attributes,
            controls: { type: 'boolean', default: false },
            autoplay: { type: 'boolean', default: true },
            loop: { type: 'boolean', default: true },
            muted: { type: 'boolean', default: true },
            playsInline: { type: 'boolean', default: false },
            preload: { type: 'string', default: 'auto' },
            poster: { type: 'string' },
        };
    }
    return settings;
}

// Register the new attributes for the cover block
addFilter(
    'blocks.registerBlockType',
    'mediacontrols/cover-video-settings',
    addVideoAttributes
);

// Video Settings Component
const VideoSettings = ({ setAttributes, attributes }) => {
    const { autoplay, controls, loop, muted, playsInline, preload } = attributes;

    const autoPlayHelpText = __('Autoplay may cause usability issues for some users.');
    const getAutoplayHelp = Platform.select({
        web: useCallback((checked) => (checked ? autoPlayHelpText : null), []),
        native: autoPlayHelpText,
    });

    const toggleFactory = useMemo(() => {
        const toggleAttribute = (attribute) => (newValue) => {
            setAttributes({ [attribute]: newValue });
        };

        return {
            autoplay: toggleAttribute('autoplay'),
            loop: toggleAttribute('loop'),
            muted: toggleAttribute('muted'),
            controls: toggleAttribute('controls'),
            playsInline: toggleAttribute('playsInline'),
        };
    }, [setAttributes]);

    const onChangePreload = useCallback((value) => {
        setAttributes({ preload: value });
    }, [setAttributes]);

    return (
        <>
            <ToggleControl
                label={__('Autoplay')}
                onChange={toggleFactory.autoplay}
                checked={!!autoplay}
                help={getAutoplayHelp}
            />
            <ToggleControl
                label={__('Loop')}
                onChange={toggleFactory.loop}
                checked={!!loop}
            />
            <ToggleControl
                label={__('Muted')}
                onChange={toggleFactory.muted}
                checked={!!muted}
            />
            <ToggleControl
                label={__('Playback controls')}
                onChange={toggleFactory.controls}
                checked={!!controls}
            />
            <ToggleControl
                label={__('Play inline')}
                onChange={toggleFactory.playsInline}
                checked={!!playsInline}
                help={__('When enabled, videos will play directly within the webpage on mobile browsers, instead of opening in a fullscreen player.')}
            />
            <SelectControl
                label={__('Preload')}
                value={preload}
                onChange={onChangePreload}
                options={options}
                hideCancelButton
            />
        </>
    );
};

// Higher Order Component to extend the Cover block
const withVideoSettings = createHigherOrderComponent((BlockEdit) => {
  return (props) => {
      const { attributes, setAttributes, name } = props;

      // Only modify the core/cover block
      if (name !== 'core/cover') {
          return <BlockEdit {...props} />;
      }

      const { backgroundType, hasParallax, controls, autoplay, loop, poster, url } = attributes;

      // Function to handle the selection of the poster image
      const onSelectPoster = (media) => {
          setAttributes({ poster: media.url });
      };

      // Function to remove the selected poster image
      const onRemovePoster = () => {
          setAttributes({ poster: undefined });
      };
      
      const videoPosterDescription = `video-poster-description-${props.clientId}`;
      const isVideoBackground = backgroundType === 'video';

      return (
          <Fragment>
              <BlockEdit {...props} />
              <InspectorControls>
                  <PanelBody title="Video Settings" initialOpen={false}>
                      {/* Only render VideoSettings if a video is selected */}
                      {isVideoBackground && (
                          <>
                              <ToggleControl
                                label={ __( 'Fixed background' ) }
                                checked={hasParallax} // Use the new attribute
                                onChange={(newValue) => setAttributes({ hasParallax: newValue })} // Wire up the toggle control
                              />
                              <VideoSettings setAttributes={setAttributes} attributes={attributes} />
                              <MediaUploadCheck>
                                  <div className="editor-video-poster-control">
                                      <BaseControl.VisualLabel>
                                          {__('Poster image')}
                                      </BaseControl.VisualLabel>
                                      <MediaUpload
                                          title={__('Select poster image')}
                                          onSelect={onSelectPoster}
                                          allowedTypes={['image']}
                                          render={({ open }) => (
                                              <Button
                                                  variant="primary"
                                                  onClick={open}
                                                  aria-describedby={videoPosterDescription}
                                              >
                                                  {!poster ? __('Select') : __('Replace')}
                                              </Button>
                                          )}
                                      />
                                      <p id={videoPosterDescription} hidden>
                                          {poster
                                              ? sprintf(
                                                  /* translators: %s: poster image URL. */
                                                  __('The current poster image URL is %s'),
                                                  poster
                                              )
                                              : __('There is no poster image currently selected')}
                                      </p>
                                      {poster && (
                                          <Button
                                              onClick={onRemovePoster}
                                              variant="tertiary"
                                          >
                                              {__('Remove')}
                                          </Button>
                                      )}
                                  </div>
                              </MediaUploadCheck>
                          </>
                      )}
                  </PanelBody>
              </InspectorControls>
          </Fragment>
      );
  };
}, 'withVideoSettings');

// Hook into BlockEdit for the Cover block.
addFilter('editor.BlockEdit', 'my-plugin/cover-video-settings', withVideoSettings);
