<?php

namespace benignware\wp_mediacontrols;


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
}
add_action( 'wp_enqueue_scripts', 'benignware\wp_mediacontrols\enqueue_mediacontrols_frontend_script' );



add_filter('render_block', function($content, $block)  {
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
  
      foreach ($elements as $element) {
        $mediacontrols = $doc->createElement('x-media-controls');

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
        $has_mediacontrols = $doc_xpath->query($has_query)->item(0);
    
        if ($has_mediacontrols) {
          continue;
        }

        $mediacontrols->setAttribute('controls', '');
        $element->removeAttribute('controls');

        $mediacontrols->setAttribute('style', 'width: 100%; height: 100%; position: absolute');
    
        $mediacontrols->setAttribute('for', $wrapper->getAttribute('id'));
        $element->parentNode->insertBefore($mediacontrols, $element->nextSibling);
      }
     
      $content = preg_replace('~(?:<\?[^>]*>|<(?:!DOCTYPE|/?(?:html|head|body))[^>]*>)\s*~i', '', $doc->saveHTML());
    }
  
    return $content;
  }, 100, 2);
  