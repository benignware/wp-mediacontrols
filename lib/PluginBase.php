<?php

namespace benignware\wp\mediacontrols;

class PluginBase {
    public function __call($name, $arguments) {
        $pluginData = PluginData::get_instance();
        
        // Fallback to the PluginData methods if they exist
        if (method_exists($pluginData, $name)) {
            return call_user_func_array([$pluginData, $name], $arguments);
        }
        throw new \BadMethodCallException("Method $name does not exist.");
    }

    function get_default_settings() {
        $schema = $this->get_plugin_schema();
        $settings_data = $schema['settings'];
        
        return array_reduce(array_keys($settings_data), function($defaults, $key) use ($settings_data) {
            $defaults[$key] = $settings_data[$key]['default'];
            return $defaults;
        }, []);
    }

    function get_settings() {
        $settings = get_option(get_plugin_slug() . '_settings', []);
        $defaults = $this->get_default_settings();

        return array_merge($defaults, $settings);
    }

    protected function get_custom_settings() {
        return get_option('mediacontrols_settings', []);
    }

    protected function get_json_data() {
        return [
            'schema' => $this->get_plugin_schema(),
            'settings' => $this->get_settings(),
            'plugin' => $this->get_plugin_data(),
        ];
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
        wp_localize_script($handle, $this->get_plugin_id() . 'Settings', $this->get_json_data());
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
