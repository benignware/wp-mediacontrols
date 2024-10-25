<?php

namespace benignware\wp\mediacontrols;

function get_plugin_name() {
  return 'Media Controls';
}

function get_plugin_slug() {
  return 'mediacontrols';
}

function get_plugin_textdomain() {
  return get_plugin_slug();
}

function get_settings_schema() {
  $json_file_path = plugin_dir_path(__FILE__) . 'settings.json';

  if (file_exists($json_file_path)) {
      $json_content = file_get_contents($json_file_path);
      $settings_data = json_decode($json_content, true);

      return $settings_data;
  } else {
      error_log("Settings JSON file not found: " . $json_file_path);
      return [];
  }
}

function get_settings() {
  $settings = get_option(get_plugin_slug() . '_settings', []);
  $defaults = get_default_settings();

  return array_merge($defaults, $settings);
}

function get_custom_settings() {
  return get_option('mediacontrols_settings', []);
}

function get_default_settings() {
  $settings_data = get_settings_schema();
  return array_reduce(array_keys($settings_data), function($defaults, $key) use ($settings_data) {
      $defaults[$key] = $settings_data[$key]['default'];
      return $defaults;
  }, []);
}