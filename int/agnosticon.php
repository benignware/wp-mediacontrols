<?php

namespace benignware\wp\mediacontrols;

use benignware\wp\agnosticon\get_icon;
use benignware\wp\agnosticon\get_icon_meta;

/**
 * Example filter function to modify the default properties
 */
function modify_mediacontrols_css($styles) {
  if (function_exists('benignware\wp\agnosticon\get_icon_meta')) {
    
    foreach ($styles as $name => $value) {
      if (strpos($name, '--x-icon-') === 0) {
        $icon_name = substr($name, 9);

        $icon = \benignware\wp\agnosticon\get_icon_meta($icon_name);

        if ($icon) {
          $styles[$name] = '"' . $icon->char . '"';
          $styles[$name . "-font-family"] = $icon->font_family;
          $styles[$name . "-font-weight"] = $icon->font_weight;
        }
      }
    }

  }
  return $styles;
}
add_filter('mediacontrols_css', 'benignware\wp\mediacontrols\modify_mediacontrols_css');
