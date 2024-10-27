<?php

namespace benignware\wp\mediacontrols;

class PluginData {
    private static $instance = null;
    private $plugin_file; // Caches the plugin file path
    private $plugin_data; // Caches the plugin data
    private $plugin_schema; // Caches the plugin schema

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
    
        // Define headers to parse including custom fields like Plugin Slug and Network.
        $headers = [
            'Name'        => 'Plugin Name',
            'PluginURI'   => 'Plugin URI',
            'PluginSlug'  => 'Plugin Slug',
            'Version'     => 'Version',
            'Description' => 'Description',
            'Author'      => 'Author',
            'AuthorURI'   => 'Author URI',
            'TextDomain'  => 'Text Domain',
            'DomainPath'  => 'Domain Path',
            'Network'     => 'Network',
        ];
    
        $data = [];
        
        foreach ($headers as $field => $label) {
            if (preg_match('/^[\s\*#@]*' . preg_quote($label, '/') . ':\s*(.+)$/mi', $plugin_data, $matches)) {
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
        $slug = $data['PluginSlug'] ?? $data['Name'];
        
        return sanitize_title($slug);
    }

    public function get_plugin_name() {
        $data = $this->get_plugin_data();
        return isset($data['Name']) ? $data['Name'] : '';
    }

    public function get_plugin_text_domain() {
        $data = $this->get_plugin_data();
        return isset($data['TextDomain']) ? $data['TextDomain'] : '';
    }

    public function get_plugin_id() {
        $slug = $this->get_plugin_slug();
        $camelized = lcfirst(str_replace(' ', '', ucwords(preg_replace('/[^a-zA-Z0-9\x7f-\xff]++/', ' ', $slug))));

        return $camelized;
    }

    public function get_plugin_schema() {
        if (isset($this->plugin_schema)) {
            return $this->plugin_schema;
        }

        $plugin_file = PluginData::get_instance()->get_plugin_file();
        $json_file_path = plugin_dir_path($plugin_file) . 'plugin.json';

        
      
        if (file_exists($json_file_path)) {
            $json_content = file_get_contents($json_file_path);
            $json_data = json_decode($json_content, true);

            if (!isset($json_data['settings'])) {
                $json_data['settings'] = [];
            }
      
            $this->plugin_schema = $json_data;
            
            return $this->plugin_schema;
        } else {
            error_log("Settings JSON file not found: " . $json_file_path);
        }

        return [];
    }
}
