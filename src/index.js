import './MediaControls.mjs';
import './index.css';

// Self-invoking function to handle ambience instances on the page
(() => {
  return;
  // Static registry to store instances
  const registry = new Map();
  const isBlockEditor = !!document.querySelector('.block-editor');

  if (isBlockEditor) {
      // Prevent running in the block editor host since it will run in the iframe
      return;
  }

  const handleMediacontrolsUpdate = () => {
    const targetNodes = [...document.querySelectorAll('.is-mediacontrols')];

    let addedNodes = targetNodes.filter((node) => !registry.has(node));
    const removedNodes = [...registry.keys()].filter((node) => !targetNodes.includes(node));
    const unchangedNodes = targetNodes.filter((node) => registry.has(node));
    
    // Process added nodes
    addedNodes.forEach((node) => {
      const instance = document.createElement('x-mediacontrols');
      instance.forElement = node;
      node.parentElement.insertBefore(instance, node);
      registry.set(node, instance);
    });

    // Process unchanged nodes
    unchangedNodes.forEach((node) => {
      const instance = registry.get(node);
      instance.render();
    });

    // Process removed nodes
    removedNodes.forEach((node) => {
      const instance = registry.get(node);

      if (instance.dispose) {
        instance.dispose();
      }

      if (instance instanceof HTMLElement) {
        instance.remove();
      }
      
      registry.delete(node);
    });
  };

  // MutationObserver to detect DOM changes (nodes added or removed)
  const observer = new MutationObserver((mutationsList) => {
    mutationsList.forEach((mutation) => {
      if (mutation.type === 'childList') {
        mutation.removedNodes.forEach((removedNode) => {
          // Check if the removed node or its children have class 'is-mediacontrols'
          if (removedNode.classList && removedNode.classList.contains('is-mediacontrols')) {
            handleMediacontrolsUpdate();
          } else if (removedNode.querySelector && removedNode.querySelector('.is-mediacontrols')) {
            handleMediacontrolsUpdate();
          }
        });
      }
    });
  });

  // Start observing the document for changes (additions/removals)
  observer.observe(document.body, {
    childList: true, // Observes changes to the direct children of the target
    subtree: true,   // Observes changes to all descendants of the target
  });

  window.addEventListener('message', (event) => {
    if (event.data.type === 'updateMediacontrols') {
      handleMediacontrolsUpdate();
    }
  });

  document.addEventListener('DOMContentLoaded', handleMediacontrolsUpdate);

  handleMediacontrolsUpdate();
})();
