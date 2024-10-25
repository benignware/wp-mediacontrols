<?php

namespace benignware\wp\mediacontrols;

class MediaControls extends PluginBase {
    private $handle = 'mediacontrols';
    private $schema = [];
    private $settings = [];

    public function __construct($settings = []) {
        parent::__construct();
        $this->schema = get_settings_schema();
        $this->settings = get_settings();

        // Hook to enqueue the dynamically generated stylesheet
        add_action('enqueue_block_assets', [$this, 'enqueue_block_assets']);
        add_action('admin_enqueue_scripts', [$this, 'enqueue_block_assets']);
        add_action('enqueue_block_assets', [$this, 'enqueue_global_styles']);
        add_action('wp_enqueue_scripts', [$this, 'enqueue_global_styles']);
        add_action('admin_enqueue_scripts', [$this, 'enqueue_global_styles']);
        add_action('enqueue_block_editor_assets', [$this, 'enqueue_block_editor_assets']);
        add_filter('render_block', [$this, 'render_block'], 10, 2);
    }
    
    public function enqueue_block_editor_assets() {
        $data = [
            'schema' => $this->schema,
            'settings' => $this->settings,
            'plugin' => $this->get_plugin_data(),
        ];

        $this->enqueue_script(
            "{$this->handle}-editor",
            "dist/{$this->handle}-editor.js",
            ['wp-blocks', 'wp-element', 'wp-edit-post', 'wp-compose', 'wp-hooks', 'wp-i18n'],
            true
        );

        wp_localize_script("{$this->handle}-editor", $this->handle . 'Settings', $data);
    }

    // Function to enqueue frontend and editor preview assets
    function enqueue_block_assets() {
        $this->enqueue_script($this->handle, "dist/{$this->handle}.js");
        $this->enqueue_style($this->handle, "dist/{$this->handle}.css");

        if (is_admin()) {
            $this->enqueue_script("{$this->handle}-preview", "dist/{$this->handle}-preview.js", ['wp-i18n']);
        }
    }

    /**
     * Generate the dynamic CSS and enqueue it
     */
    public function enqueue_global_styles() {
        $this->enqueue_inline_style("{$this->handle}-global-styles", $this->get_global_styles());
    }

    private function get_styles($settings = []) {
        $styles = [];

        if (isset($settings['panelAnimation'])) {
            $styles['--x-controls-slide'] = $settings['panelAnimation'] === 'slide' ? '1' : '0';
            $styles['--x-controls-fade'] = $settings['panelAnimation'] === 'fade' ? '1' : '0';
        }

        if (isset($settings['backgroundColor'])) {
            $styles['--x-controls-bg'] = $settings['backgroundColor'];
        }

        if (isset($settings['backgroundOpacity'])) {
            $styles['--x-controls-bg-opacity'] = $settings['backgroundOpacity'];
        }

        if (isset($settings['textColor'])) {
            $styles['--x-controls-color'] = $settings['textColor'];
        }

        return $styles;
    }

    /**
     * Generate the dynamic CSS
     */
    private function get_global_styles() {
        $styles = apply_filters('mediacontrols_css', array_merge([
            '--x-icon-play' => '"▶"',
            '--x-icon-pause' => '"⏸"',
            '--x-icon-expand' => '"⛶"',
            '--x-icon-collapse' => '"⛶"',
            '--x-icon-speaker' => '"\\1F50A"',
            // '--x-panel-padding-x' => '10px',
            // '--x-panel-padding-y' => '10px',
        ], $this->get_styles($this->settings)));

        // Generate the CSS string
        $css = 'x-mediacontrols {';
        foreach ($styles as $name => $value) {
            $css .= "{$name}: {$value};";
        }
        $css .= '}';

        return $css;
    }

    function render_block($block_content, $block) {
        $supported_blocks = [
            'core/video',
            'core/cover',
        ];
    
        if (!in_array($block['blockName'], $supported_blocks)) {
            return $block_content;
        }
    
        $attrs = $block['attrs'];
    
        $global_settings = get_settings();
        $block_settings = $attrs['mediacontrols'] ?? [];
    
        $settings = array_merge($global_settings, $block_settings);
    
        if (!$settings['enabled']) {
            return $block_content;
        }
    
        $controls = $attrs['controls'];
        $control_attrs = ['showPlayButton', 'showTimeline', 'showCurrentTime', 'showDuration', 'showMuteButton', 'showVolumeSlider', 'showFullscreenButton'];
        $controlslist = implode(' ', array_map(function($control_attr) {
            return 'no' . strtolower(preg_replace('/^show/', '', $control_attr));
        },  array_filter($control_attrs, function($control_attr) use ($settings) {
            return !$settings[$control_attr];
        })));
    
        // Construct the controls list from enabled controls
        $controls_list = [];
        foreach ($controls as $control => $is_enabled) {
            if (!$is_enabled) {
                $controls_list[] = 'no' . strtolower(preg_replace('/([A-Z])/', '-$1', $control));
            }
        }
        $controls_list_str = trim(implode(' ', $controls_list));
    
        // Add class and attribute for mediacontrols
        $doc = new \DOMDocument();
        libxml_use_internal_errors(true);
        $doc->loadHTML(mb_convert_encoding($block_content, 'HTML-ENTITIES'), LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);
        $xpath = new \DOMXPath($doc);
        
        $video = $xpath->query("//video")->item(0);
    
        if (!$video) {
            return $block_content;
        }
    
        $video->setAttribute('controls', $controls);
    
        $container = $xpath->query("//*")->item(0);
        
        if (!$container) {
            return $block_content;
        }
        
        $container->setAttribute('class', trim($container->getAttribute('class') . ' is-mediacontrols'));
        // $container->setAttribute('controlslist', esc_attr($controls_list_str));
        
        $id = $container->hasAttribute('id') ? $container->getAttribute('id') : uniqid('mediacontrols-');
    
        $container->setAttribute('id', $id);
    
        $component = $doc->createElement('x-mediacontrols');
        $component->setAttribute('for', $id);
    
        if ($controlslist) {
            $component->setAttribute('controlslist', esc_attr($controlslist));
        }
    
        if ($controls) {
            $component->setAttribute('controls', '');
        }
    
        $styles = $this->get_styles($settings);
    
        $style = implode('; ', array_map(function($key, $value) {
            return $key . ': ' . $value;
        }, array_keys($styles), array_values($styles)));
    
        $component->setAttribute('style', $style);
    
        $doc->insertBefore($component, $container);
    
        $block_content = $doc->saveHTML();
        libxml_clear_errors();
    
        return $block_content;
    }
}

new MediaControls();