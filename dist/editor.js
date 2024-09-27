(function () {
  'use strict';

  const {
    addFilter
  } = wp.hooks;
  const {
    Fragment
  } = wp.element;
  const {
    InspectorControls
  } = wp.blockEditor;
  const {
    PanelBody
  } = wp.components;
  const {
    createHigherOrderComponent
  } = wp.compose;
  wp.blockEditor;
  const {
    edit: VideoBlockEdit
  } = wp.blocks.getBlockType('core/video'); // Access the Video block's edit component

  // Add video-related attributes to the core/cover block
  function addVideoAttributes(settings, name) {
    console.log('settings', settings);
    if (name === 'core/cover') {
      settings.attributes = {
        ...settings.attributes,
        controls: {
          type: 'boolean',
          default: false
        },
        autoplay: {
          type: 'boolean',
          default: false
        },
        loop: {
          type: 'boolean',
          default: false
        },
        poster: {
          type: 'string'
        }
      };
    }
    return settings;
  }
  addFilter('blocks.registerBlockType', 'my-plugin/add-video-attributes', addVideoAttributes);

  // Higher Order Component to extend the Cover block
  const withVideoBlockEdit = createHigherOrderComponent(BlockEdit => {
    return props => {
      const {
        attributes,
        setAttributes,
        name
      } = props;

      // Only modify the core/cover block
      if (name !== 'core/cover') {
        return /*#__PURE__*/React.createElement(BlockEdit, props);
      }
      console.log('attributes', attributes);
      return /*#__PURE__*/React.createElement(Fragment, null, /*#__PURE__*/React.createElement(BlockEdit, props), /*#__PURE__*/React.createElement(InspectorControls, null, /*#__PURE__*/React.createElement(PanelBody, {
        title: "Video Settings",
        initialOpen: true
      }, /*#__PURE__*/React.createElement(VideoBlockEdit, {
        attributes: attributes,
        setAttributes: setAttributes,
        context: props.context,
        clientId: props.clientId,
        isSelected: props.isSelected
      }))));
    };
  }, 'withVideoBlockEdit');

  // Hook into BlockEdit for the Cover block.
  addFilter('editor.BlockEdit', 'my-plugin/cover-video-settings', withVideoBlockEdit);

})();
