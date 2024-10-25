<?php

namespace benignware\wp\mediacontrols;

class PluginData {
    private static $instance = null;
    private $plugin_file; // Caches the plugin file path
    private $plugin_data; // Caches the plugin data

    private function __construct() {
        // Private constructor to prevent direct instantiation
    }

    public static function get_instance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function get_plugin_file() {
        if (isset($this->plugin_file)) {
            return $this->plugin_file;
        }

        // Logic to determine the plugin file path
        $current_file = __FILE__;
        $current_file_dir = dirname($current_file);
        $active_plugins = get_option('active_plugins');
        $plugin_dir = WP_PLUGIN_DIR;

        // Loop through active plugins to find the plugin directory
        foreach ($active_plugins as $plugin) {
            $plugin_path = $plugin_dir . '/' . $plugin;
            $plugin_base_dir = dirname($plugin_path);

            if (strpos($current_file_dir, $plugin_base_dir) === 0) {
                $this->plugin_file = $plugin_path;
                return $this->plugin_file; 
            }
        }

        $this->plugin_file = $current_file; 
        return $this->plugin_file;
    }

    public function get_plugin_data() {
        if (isset($this->plugin_data)) {
            return $this->plugin_data; // Return cached plugin data
        }

        // Use original function if in admin area
        if (is_admin() && function_exists('get_plugin_data')) {
            $this->plugin_data = get_plugin_data($this->get_plugin_file());
            return $this->plugin_data; // Return the plugin data using original function
        }

        // Read the plugin file contents
        $plugin_data = file_get_contents($this->get_plugin_file());

        // Define headers to parse like get_plugin_data().
        $headers = [
            'Name'        => 'Plugin Name',
            'PluginURI'   => 'Plugin URI',
            'Version'     => 'Version',
            'Description' => 'Description',
            'Author'      => 'Author',
            'AuthorURI'   => 'Author URI',
            'TextDomain'  => 'Text Domain',
            'DomainPath'  => 'Domain Path',
        ];

        $data = [];
        foreach ($headers as $field => $label) {
            if (preg_match('/^' . preg_quote($label, '/') . ':\s*(.+)$/mi', $plugin_data, $matches)) {
                $data[$field] = trim($matches[1]); // Extract header value
            } else {
                $data[$field] = ''; // Default to empty if not found
            }
        }

        // Cache the data
        $this->plugin_data = $data;

        return $data;
    }

    public function get_plugin_slug() {
        $data = $this->get_plugin_data();
        return isset($data['TextDomain']) ? $data['TextDomain'] : '';
    }

    public function get_plugin_name() {
        $data = $this->get_plugin_data();
        return isset($data['Name']) ? $data['Name'] : '';
    }

    public function get_plugin_text_domain() {
        $data = $this->get_plugin_data();
        return isset($data['TextDomain']) ? $data['TextDomain'] : '';
    }
}
