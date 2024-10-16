import { IMAGE_FORMATS } from "./constants";
/**
 * WordPress dependencies
 */
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
    'my-plugin/add-video-attributes',
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

      const { controls, autoplay, loop, poster, url, hasParallax } = attributes;

      // Function to handle the selection of the poster image
      const onSelectPoster = (media) => {
          setAttributes({ poster: media.url });
      };

      // Function to remove the selected poster image
      const onRemovePoster = () => {
          setAttributes({ poster: undefined });
      };

      // Create a unique ID for the poster description
      const videoPosterDescription = `video-poster-description-${props.clientId}`;

      // Check if the URL points to an image
      const isImageSelected = url && IMAGE_FORMATS.some((format) => url.endsWith(format));
      const isVideoSelected = url && !isImageSelected;

      return (
          <Fragment>
              <BlockEdit {...props} />
              <InspectorControls>
                  <PanelBody title="Video Settings" initialOpen={false}>
                      {/* Only render VideoSettings if a video is selected */}
                      {isVideoSelected && (
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


/*
// Add video properties to the save function
function addVideoPropsToSave(settings, name) {
    if (name === 'core/cover') {
        const originalSave = settings.save;

          // Helper function to strip out unnecessary whitespace in the children
          const cleanChildren = (children) =>
              Children.map(children, (child) => {
          if (!child) return null;

            // If child is a string, trim whitespace
            if (typeof child === 'string') {
                const trimmedChild = child.trim();
                return trimmedChild.length > 0 ? trimmedChild : null;
            }

            // If child has children, recursively clean them
            if (child.props && child.props.children) {
                const cleanedChild = cloneElement(child, {
                    children: cleanChildren(child.props.children),
                });
                return cleanedChild;
            }

            // Return the child unchanged if no further cleaning is necessary
            return child;
          });

      // Modify the save function to clean children and strip whitespace
      settings.save = (props) => {
        const { attributes } = props;
        const { controls, autoplay, loop, muted, playsInline, preload, poster, url, hasParallax } = attributes;
    
        // Extract the original save output
        const originalElement = originalSave(props);
    
        // Clean the children of the original save element
        const cleanedChildren = cleanChildren(originalElement.props.children);
    
        // Map through children and modify the video tag if necessary
        const modifiedChildren = Children.map(cleanedChildren, (child) => {
            if (!child) {
                return null;
            }
    
            // Modify video tag settings
            if (child.type === 'video') {
                return cloneElement(child, {
                    poster,
                    controls,
                    autoPlay: autoplay,
                    loop,
                    muted,
                    playsInline,
                    preload,
                    src: url || child.props.src,
                    style: hasParallax ? { position: 'fixed' } : {}, // Apply fixed position if hasParallax is true
                });
            }
    
            // Leave image or other elements unmodified
            return child;
        });
    
        // Return the modified save output with the cleaned children
        return cloneElement(originalElement, {}, modifiedChildren);
    };
    

      
    }
    return settings;
}

// Hook into BlockType to modify the save function
addFilter(
    'blocks.registerBlockType',
    'my-plugin/add-video-props-to-save',
    addVideoPropsToSave
);
*/