<?php

namespace benignware\wp\mediacontrols;

class MediaControls extends PluginBase {
    private $handle = 'mediacontrols';
    private $schema = [];
    private $settings = [];

    public function __construct($settings = []) {
        // Hook to enqueue the dynamically generated stylesheet
        add_action('enqueue_block_assets', [$this, 'enqueue_block_assets']);
        add_action('admin_enqueue_scripts', [$this, 'enqueue_block_assets']);
        add_action('enqueue_block_assets', [$this, 'enqueue_global_styles']);
        add_action('wp_enqueue_scripts', [$this, 'enqueue_global_styles']);
        add_action('admin_enqueue_scripts', [$this, 'enqueue_global_styles']);
        add_action('enqueue_block_editor_assets', [$this, 'enqueue_block_editor_assets']);
        add_filter('render_block', [$this, 'render_block'], 10, 2);
    }

    public function get_plugin_file() {
        return dirname(__FILE__) . '/../mediacontrols.php';
    }
    
    
    public function enqueue_block_editor_assets() {
        $this->enqueue_script(
            'editor',
            "dist/{$this->get_plugin_slug()}-editor.js",
            ['wp-blocks', 'wp-element', 'wp-edit-post', 'wp-compose', 'wp-hooks', 'wp-i18n'],
            true
        );
    }

    // Function to enqueue frontend and editor preview assets
    function enqueue_block_assets() {
        $this->enqueue_script('main', "dist/{$this->get_plugin_slug()}-main.js", [], false);
        $this->enqueue_style('main', "dist/{$this->get_plugin_slug()}-main.css", [], false);
    }

    protected function get_styles($settings = []) {
        $styles = [];

        if (isset($settings['panelAnimation'])) {
            $styles['--x-controls-slide'] = $settings['panelAnimation'] === 'slide' ? '1' : '0';
            $styles['--x-controls-fade'] = $settings['panelAnimation'] === 'fade' ? '1' : '0';
        }

        if (isset($settings['backgroundColor'])) {
            $styles['--x-controls-bg'] = $settings['backgroundColor'];
        }

        if (isset($settings['backgroundOpacity'])) {
            $styles['--x-controls-bg-opacity'] = $settings['backgroundOpacity'] / 100;
        }

        if (isset($settings['textColor'])) {
            $styles['--x-controls-color'] = $settings['textColor'];
        }

        return $styles;
    }

    protected function get_css_selector() {
        return 'x-mediacontrols';
    }

    /**
     * Generate the dynamic CSS
     */
    public function get_global_styles($defaults = []) {
        $defaults = array_merge([
            '--x-icon-play' => '"▶"',
            '--x-icon-pause' => '"⏸"',
            '--x-icon-expand' => '"⛶"',
            '--x-icon-collapse' => '"⛶"',
            '--x-icon-speaker' => '"\\1F50A"',
            // '--x-panel-padding-x' => '10px',
            // '--x-panel-padding-y' => '10px',
        ], $defaults);

        return parent::get_global_styles($defaults);
    }

    protected function is_supported_block($block) {
        $supported_blocks = [
            'core/video',
            'core/cover',
        ];

        $is_supported = in_array($block['blockName'], $supported_blocks);

        if ($is_supported) {
            if ($block['blockName'] === 'core/cover') {
                $backgroundType = $block['attrs']['backgroundType'] ?? null;
                
                if ($backgroundType === 'video') {
                    return true;
                }

                return false;
            }
        
            return true;
        }

        return false;
    }

    function render_block($block_content, $block) {
        if (!$this->is_supported_block($block)) {
            return $block_content;
        }
    
        $attrs = $block['attrs'];
    
        $settings_schema = $this->get_plugin_schema()['settings'];
        $global_settings = array_merge($this->get_settings(), []);

        // Remove style properties from global settings
        foreach ($settings_schema as $key => $schema) {
            $section = $schema['section'] ?? null;
            
            if ($section === 'style' ) {
                unset($global_settings[$key]);
            }
        }

        $settings_attribute = $this->get_plugin_id();
        $block_settings = $attrs[$settings_attribute] ?? [];
    
        $settings = array_merge(
            $global_settings,
            $block_settings
        );
    
        if (!$settings['enabled']) {
            return $block_content;
        }
    
        $controls = $attrs['controls'] ?? false;
        
        $control_attrs = ['showPlayButton', 'showTimeline', 'showCurrentTime', 'showDuration', 'showMuteButton', 'showVolumeSlider', 'showFullscreenButton'];
        $controlslist = implode(' ', array_map(function($control_attr) {
            return 'no' . strtolower(preg_replace('/^show/', '', $control_attr));
        },  array_filter($control_attrs, function($control_attr) use ($settings) {
            return !$settings[$control_attr];
        })));

        $doc = new \DOMDocument();
        @$doc->loadHTML('<?xml encoding="utf-8" ?>' . $block_content);
        $xpath = new \DOMXPath($doc);
    
        $body = $xpath->query('//body')->item(0);

        $block_name = preg_replace('/^core\//', '', $block['blockName']);
        $block_class = "wp-block-$block_name";
        $block_element = $xpath->query(".//*[contains(concat(' ', normalize-space(@class), ' '), ' " . $block_class . " ')]")->item(0);
        // $block_element = $block_element ?? $xpath->query(".//*[contains(concat(' ', normalize-space(@class), ' '), ' " . $block_class . "-')]")->item(0);
        
        if (!$block_element) {
            return $block_content;
        }

        $video = $xpath->query(".//video")->item(0);

        if (!$video) {
            return $block_content;
        }
    
        $video->setAttribute('controls', $controls);

        $poster = $attrs['poster'] ?? null;

        if ($poster) {
            $video->setAttribute('poster', $poster);
        }
        
        $id = $block_element->hasAttribute('id') ? $block_element->getAttribute('id') : uniqid('mediacontrols-');
    
        $block_element->setAttribute('id', $id);
    
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
    
        // $block_element->parentNode->insertBefore($component, $block_element);
        // $body->insertBefore($component, $body->firstChild);
        $block_element->parentNode->insertBefore($component, $block_element->nextSibling);
        
        $block_content = $doc->saveHTML();
        $block_content = preg_replace('~(?:<\?[^>]*>|<(?:!DOCTYPE|/?(?:html|body))[^>]*>)\s*~i', '', $block_content);

        $block_content = "<!-- Media Controls -->\n" . $block_content;
    
        return $block_content;
    }
}

new MediaControls();