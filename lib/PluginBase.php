<?php

namespace benignware\wp\mediacontrols;

class PluginBase {
  public function __construct() {
      // Ensure the plugin file is determined
      PluginData::get_instance()->get_plugin_file();
  }

  public function __call($name, $arguments) {
      $pluginData = PluginData::get_instance();
      
      // Fallback to the PluginData methods if they exist
      if (method_exists($pluginData, $name)) {
          return call_user_func_array([$pluginData, $name], $arguments);
      }
      throw new \BadMethodCallException("Method $name does not exist.");
  }

  protected function __($text, $domain = null) {
        return __($text, $domain ?? $this->get_plugin_text_domain());
  }

  protected function enqueue_script($handle, $url, $deps = [], $in_footer = true) {
      wp_enqueue_script(
          $handle,
          plugins_url($url, PluginData::get_instance()->get_plugin_file()),
          $deps,
          filemtime(plugin_dir_path(PluginData::get_instance()->get_plugin_file()) . $url),
          $in_footer
      );
  }

  protected function enqueue_style($handle, $url, $deps = [], $in_footer = true) {
      wp_enqueue_style(
          $handle,
          plugins_url($url, PluginData::get_instance()->get_plugin_file()),
          $deps,
          filemtime(plugin_dir_path(PluginData::get_instance()->get_plugin_file()) . $url),
          $in_footer
      );
  }

  protected function enqueue_inline_style($handle, $css) {
      wp_register_style($handle, false);
      wp_add_inline_style($handle, $css);
      wp_enqueue_style($handle);
  }
}
