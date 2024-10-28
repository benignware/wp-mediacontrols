const {
  RangeControl,
  SelectControl,
  ToggleControl,
  ColorPicker,
  Dropdown,
  ColorIndicator,
  Popover,
  Button,
  __experimentalHStack: HStack,
  FlexItem
} = wp.components;
const { __ } = wp.i18n;
const { withState } = wp.compose;

export const BlockRemovalListener = ({ onBlockRemove }) => {
  const { select } = wp.data;
  const { useEffect, useState } = wp.element;
  const { store: blockEditorStore } = wp.blockEditor;

  const blocks = select(blockEditorStore).getBlocks();
  const [prevBlocks, setPrevBlocks] = useState(blocks);

  useEffect(() => {
    if (prevBlocks.length > blocks.length) {
      const removedBlocks = prevBlocks.filter(
        (prevBlock) => !blocks.some((block) => block.clientId === prevBlock.clientId)
      );

      if (removedBlocks.length && typeof onBlockRemove === 'function') {
        // Execute the callback for each removed block
        removedBlocks.forEach((block) => onBlockRemove(block));
      }
    }

    // Update the previous blocks state to the current state
    setPrevBlocks(blocks);
  }, [blocks, prevBlocks, onBlockRemove]);

  return null;
};


export const renderControl = ({ type, label, value, onChange, ...props }) => {
  switch (type) {
    case 'boolean':
      return (
        <ToggleControl
          label={label}
          checked={value}
          onChange={onChange}
          {...props}
        />
      );
    case 'number':
      return (
        <RangeControl
          label={label}
          value={value}
          onChange={onChange}
          {...props}
        />
      );
    case 'select':
      return (
        <SelectControl
          label={label}
          value={value}
          options={props.options}
          onChange={onChange}
          {...props}
        />
      );
    case 'color':
      return (
        <ColorPickerControl
          label={label}
          value={value}
          onChange={onChange}
          __experimentalIsRenderedInSidebar={true} 
        />
      );
    default:
      return null;
  }
};

// ColorPickerControl component
const ColorPickerControl = withState({ isOpen: false })(
  ({ label, value, onChange, isOpen, setState, __experimentalIsRenderedInSidebar }) => {
    return (
      <div>
        <Dropdown
          contentClassName="color-picker-dropdown"
          renderToggle={({ onToggle }) => (
            <Button
              className="components-color-picker-button"
              style={{ padding: 0 }}
              onClick={() => {
                onToggle();
                setState({ isOpen: !isOpen }); // Toggle dropdown visibility
              }}
              aria-expanded={isOpen}
            >
              <HStack justify="flex-start">
                <ColorIndicator
                  className="block-editor-panel-color-gradient-settings__color-indicator"
                  colorValue={ value }
                />
                <FlexItem
                  className="block-editor-panel-color-gradient-settings__color-name"
                  title={ label }
                >
                  { label }
                </FlexItem>
              </HStack>
             
            </Button>
          )}
          renderContent={() => (
            <Popover position="middle center" onClose={() => setState({ isOpen: false })}>
              <ColorPicker
                color={value} // Pass the current color
                onChangeComplete={(newColor) => {
                  onChange(newColor.hex); // Use the hex value
                  setState({ isOpen: false }); // Close dropdown on color selection
                }}
                __experimentalIsRenderedInSidebar={__experimentalIsRenderedInSidebar} // Pass down the prop
              />
            </Popover>
          )}
        />
      </div>
    );
  }
);
