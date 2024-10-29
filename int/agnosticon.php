<?php

namespace benignware\wp\mediacontrols\agnosticon;

use benignware\wp\agnosticon\get_icon;
use benignware\wp\agnosticon\get_icon_meta;

/**
 * Example filter function to modify the default properties
 */
function get_global_styles($styles) {
  if (function_exists('benignware\wp\agnosticon\get_icon_meta')) {
    foreach ($styles as $name => $value) {
      if (strpos($name, '--x-icon-') === 0) {
        $icon_name = substr($name, 9);

        $query = [$icon_name];

        if ($icon_name === 'expand') {
          $query = ['fullscreen', 'expand', 'maximize'];
        }

        if ($icon_name === 'collapse') {
          $query = ['fullscreen', 'compress', 'minimize', 'collapse'];
        }

        if ($icon_name === 'speaker') {
          $query = ['volume-high', 'volume', 'speaker'];
        }

        $result = \benignware\wp\agnosticon\get_icons($query);

        $icon = $result[0] ?? null;

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
add_filter('mediacontrols/get_global_styles', 'benignware\wp\mediacontrols\agnosticon\get_global_styles');
