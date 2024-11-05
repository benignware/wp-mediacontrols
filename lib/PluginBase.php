<?php

namespace benignware\wp\mediacontrols;

class PluginBase {
    public function __construct() {
        add_action('enqueue_block_assets', [$this, 'enqueue_global_styles']);
        add_action('wp_enqueue_scripts', [$this, 'enqueue_global_styles']);
        add_action('admin_enqueue_scripts', [$this, 'enqueue_global_styles']);
    }
    
    public function __call($name, $arguments) {
        $pluginData = PluginData::get_instance();
        
        // Fallback to the PluginData methods if they exist
        if (method_exists($pluginData, $name)) {
            return call_user_func_array([$pluginData, $name], $arguments);
        }
        throw new \BadMethodCallException("Method $name does not exist.");
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
            plugins_url($url, PluginData::get_instance()->get_plugin_file()),
            $deps,
            filemtime(plugin_dir_path(PluginData::get_instance()->get_plugin_file()) . $url),
            $in_footer
        );
        wp_localize_script(
            "{$this->get_plugin_handle()}-{$handle}",
            $this->get_plugin_id() . 'Settings',
            $this->get_json_data()
        );
    }

    protected function enqueue_style($handle, $url, $deps = [], $media = 'all') {
        wp_enqueue_style(
            "{$this->get_plugin_handle()}-{$handle}",
            plugins_url($url, PluginData::get_instance()->get_plugin_file()),
            $deps,
            filemtime(plugin_dir_path(PluginData::get_instance()->get_plugin_file()) . $url),
            $media
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
