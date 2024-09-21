<?php

namespace benignware\wp\mediacontrols;

/**
 * Enqueue the editor script and localize settings.
 */
function add_mediacontrols_block_attribute() {
  wp_enqueue_script(
      'mediacontrols-script-editor',
      plugin_dir_url( __FILE__ ) . 'dist/editor.js',
      array( 'wp-blocks', 'wp-element', 'wp-editor' ),
      filemtime( plugin_dir_path( __FILE__ ) . 'dist/editor.js' ), // Version based on file modification time
      true // Load in footer
  );

  // Localize the settings so they can be used in JavaScript
  // wp_localize_script('mediacontrols-script-editor', 'mediacontrolsSettings', array(
  //     'post_thumbnail' => get_option('mediacontrols_post_thumbnail', false), // Pass the post thumbnail setting to JS
  //     'content' => get_option('ambience_content', false), // Pass the content setting to JS
  // ));
}
add_action( 'enqueue_block_editor_assets', 'benignware\wp\mediacontrols\add_mediacontrols_block_attribute' );


// function enqueue_mediacontrols_block_assets() {
//   // Enqueue the web component script for both frontend and block preview (iframe)
//   wp_enqueue_script(
//       'mediacontrols-script',
//       plugin_dir_url( __FILE__ ) . 'dist/mediacontrols.js',
//       array( 'wp-element' ), // Add any dependencies
//       filemtime( plugin_dir_path( __FILE__ ) . 'dist/mediacontrols.js' ), // Version based on file modification time
//       true // Load in footer
//   );
// }

// add_action( 'enqueue_block_assets', 'benignware\wp\mediacontrols\enqueue_mediacontrols_block_assets' );

/**
 * Enqueue the frontend script.
 */
function enqueue_mediacontrols_frontend_script() {
    wp_enqueue_script(
        'mediacontrols-script-frontend',
        plugin_dir_url( __FILE__ ) . 'dist/mediacontrols.js',
        array( 'wp-element' ), // Add any dependencies the frontend script might have
        filemtime( plugin_dir_path( __FILE__ ) . 'dist/mediacontrols.js' ), // Version based on file modification time
        true // Load in footer
    );

    wp_enqueue_style(
      'mediacontrols-style-frontend',
      plugin_dir_url( __FILE__ ) . 'dist/mediacontrols.css',
      filemtime( plugin_dir_path( __FILE__ ) . 'dist/mediacontrols.js' ), // Version based on file modification time
  );
}
add_action( 'wp_enqueue_scripts', 'benignware\wp\mediacontrols\enqueue_mediacontrols_frontend_script' );



add_filter('render_block', function($content, $block)  {
  return $content;
    global $__sitekick_mediacontrols_inc;
  
    if (!isset($__sitekick_mediacontrols_inc)) {
      $__sitekick_mediacontrols_inc = 1;
    }
  
    $name = $block['blockName'];
    $attrs = $block['attrs'];
  
    $mediacontrols_block_types = ['core/video', 'core/cover'];
  
    if (in_array($name, $mediacontrols_block_types)) {
      $doc = new \DOMDocument();
      @$doc->loadHTML('<?xml encoding="utf-8" ?>' . $content);
      $doc_xpath = new \DOMXPath($doc);
  
      // $elements = $doc_xpath->query('.//video[@controls]');
      $elements = $doc_xpath->query('.//video');

      $controls_attrs = array_filter($attrs, function($value, $key) {
        return strpos($key, 'show') === 0;
      }, ARRAY_FILTER_USE_BOTH);

      $controls_list = array_map(function($value, $key) {
        // Remove 'show' prefix
        $control_key = substr($key, 4); // 4 is the length of 'show'
        
        // If the value is empty, return 'no-' prefixed version
        if (empty($value)) {
            return 'no' . strtolower($control_key);
        }
        
        // Otherwise, return the original key without 'show'
        return strtolower($control_key);
      }, $controls_attrs, array_keys($controls_attrs));

      $controls_list_attr = implode(' ', $controls_list);

      foreach ($elements as $element) {
        

        // $wrapper = $element->parentNode ?? $element;
        $wrapper = $doc->createElement('div');
        $element->parentNode->insertBefore($wrapper, $element);
        $wrapper->appendChild($element);
        $wrapper->setAttribute('style', 'position: relative; display: flex');
  
        if (!$wrapper->hasAttribute('id')) {
          $wrapper->setAttribute('id', "mediacontrols-" . $__sitekick_mediacontrols_inc++);
        }
    
        $id = $wrapper->getAttribute('id');
  
        $has_query = "//x-media-controls[@for='{$wrapper->getAttribute('id')}']";
        
        $mediacontrols = $doc_xpath->query($has_query)->item(0);
    
        if (!$mediacontrols) {
          $mediacontrols = $doc->createElement('x-media-controls');
          $element->parentNode->insertBefore($mediacontrols, $element->nextSibling);
        }

        

        $mediacontrols->setAttribute('controlslist', $controls_list_attr);
        $mediacontrols->setAttribute('style', 'width: 100%; height: 100%; position: absolute');
        $mediacontrols->setAttribute('for', $wrapper->getAttribute('id'));
        
      }
     
      $content = preg_replace('~(?:<\?[^>]*>|<(?:!DOCTYPE|/?(?:html|head|body))[^>]*>)\s*~i', '', $doc->saveHTML());
    }
  
    return $content;
  }, 100, 2);
  