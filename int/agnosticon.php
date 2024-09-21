<?php

namespace benignware\wp\mediacontrols;

use benignware\wp\agnosticon\get_icon;
use benignware\wp\agnosticon\get_icon_meta;

/**
 * Example filter function to modify the default properties
 */
function modify_mediacontrols_css($properties) {
  if (function_exists('benignware\wp\agnosticon\get_icon_meta')) {
    
    foreach ($properties as $property => $value) {
      // echo 'PROPERTY: ' . $property;
      // echo '<br>';
      if (strpos($property, '--x-icon-') === 0) {
        $icon_name = substr($property, 9);

        // echo 'ICON NAME: ' . $icon_name;
        // echo '<br>';

        // $icon = \benignware\wp\agnosticon\get_icon_meta($icon_name);

        // if ($icon) {
        //   print_r($icon);
        //   exit;
        // }
      }
    }

    // print_r($properties);
    // exit;

  }
  // Optionally modify properties here, for example:
  $properties['icon-play'] = '►'; // Change play icon
  $properties['icon-unmute'] = '🔊'; // Change unmute icon
  return $properties;
}
add_filter('mediacontrols_css', 'benignware\wp\mediacontrols\modify_mediacontrols_css');
