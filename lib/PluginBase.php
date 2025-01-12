<?php

namespace benignware\wp\mediacontrols;

class PluginBase {
    private $plugin_file; // Caches the plugin file path
    private $plugin_data; // Caches the plugin data
    private $plugin_schema; // Caches the plugin schema

    public function __construct() {
        add_action('enqueue_block_assets', [$this, 'enqueue_global_styles', 1]);
        // add_action('wp_enqueue_scripts', [$this, 'enqueue_global_styles'], 1);
        add_action('admin_enqueue_scripts', [$this, 'enqueue_global_styles']);
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
        $slug = $data['Name'] ?? null;

        if ($slug === null) {
            $file = $this->get_plugin_file();
            $name = basename($file, '.php');
            $slug = preg_replace('/\d/', '', $name);
        }

        return sanitize_title($slug);
    }

    public function get_plugin_name() {
        $data = $this->get_plugin_data();
        $name = $data['Name'] ?? '';

        if (!$name) {
            $file = $this->get_plugin_file();
            $name = ucfirst(basename($file, '.php'));
        }

        return $name;
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

        $plugin_file = $this->get_plugin_file();
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

    protected function get_plugin_hook() {
        return str_replace('-', '_', $this->get_plugin_slug());
    }

    protected function apply_filters($hook, $value, ...$args) {
        return apply_filters("{$this->get_plugin_hook()}/$hook", $value, ...$args);
    }

    protected function get_plugin_handle() {
        return $this->get_plugin_slug();
    }

    protected function enqueue_script($handle, $url, $deps = [], $in_footer = true) {
        wp_enqueue_script(
            "{$this->get_plugin_handle()}-{$handle}",
            plugins_url($url, $this->get_plugin_file()),
            $deps,
            filemtime(plugin_dir_path($this->get_plugin_file()) . $url),
            $in_footer
        );
        wp_localize_script(
            "{$this->get_plugin_handle()}-{$handle}",
            $this->get_plugin_id() . 'Settings',
            $this->get_json_data()
        );
    }

    protected function enqueue_style($handle, $url, $deps = [], $in_footer = false) {
        wp_enqueue_style(
            "{$this->get_plugin_handle()}-{$handle}",
            plugins_url($url, $this->get_plugin_file()),
            $deps,
            filemtime(plugin_dir_path($this->get_plugin_file()) . $url),
            $in_footer
        );
    }

    protected function enqueue_inline_style($handle, $css) {
        $handle = "{$this->get_plugin_handle()}-{$handle}";

        wp_register_style($handle, false);
        wp_add_inline_style($handle, $css);
        wp_enqueue_style($handle);
    }

    public function get_default_settings() {
        $schema = $this->get_plugin_schema();
        $settings_data = $schema['settings'] ?? [];
        
        return array_reduce(array_keys($settings_data), function($defaults, $key) use ($settings_data) {
            $defaults[$key] = $settings_data[$key]['default'];
            return $defaults;
        }, []);
    }

    public function get_settings() {
        $defaults = $this->get_default_settings();
        $settings = get_option($this->get_plugin_slug() . '_settings', []);
        
        return array_merge($defaults, $settings);
    }

    public function get_custom_settings() {
        return get_option($this->get_plugin_slug() . '_settings', []);
    }

    protected function get_json_data() {
        return [
            'schema' => $this->get_plugin_schema(),
            'settings' => $this->get_settings(),
            'plugin' => $this->get_plugin_data(),
        ];
    }

    protected function get_styles($settings = []) {
        $styles = $this->apply_filters('get_styles', [], $settings);

        return $styles;
    }

    protected function get_css_selector() {
        return ".is-{$this->get_plugin_slug()}";
    }

    public function get_global_styles($defaults = []) {
        $styles = $this->get_styles($this->get_settings());
        $styles = array_merge($defaults, $styles);
        $styles = $this->apply_filters('get_global_styles', $styles);

        return $styles;
    }

    protected function get_css_rule($selector, $styles = []) {
        $css = $selector . ' {';
        foreach ($styles as $name => $value) {
            $css .= "{$name}: {$value};";
        }
        $css .= '}';
        $css = $this->apply_filters('get_css_rule', $css, $selector, $styles);

        return $css;
    }

    public function get_global_css() {
        $css = $this->get_css_rule($this->get_css_selector(), $this->get_global_styles());
        $css = $this->apply_filters('get_global_css', $css);

        return $css;
    }

    public function enqueue_global_styles() {
        $this->enqueue_inline_style("{$this->get_plugin_handle()}-global-styles", $this->get_global_css());
    }

    protected function __($text, $domain = null) {
        return __($text, $domain ?? $this->get_plugin_text_domain());
    }
}
