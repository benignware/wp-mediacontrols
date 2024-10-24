<?php
/**
 * Plugin Name: MediaControls
 * Description: Consistent media controls across browsers
 * Version: 0.0.12
 * Author: Rafael Nowrotek
 * Author URI: https:/benignware.com
 * Network: true
 */
namespace benignware\wp\mediacontrols;

require plugin_dir_path(__FILE__) . 'settings.php';
require plugin_dir_path( __FILE__ ) . 'lib/MediaControls.php';
// require plugin_dir_path( __FILE__ ) . 'functions.php';
require plugin_dir_path( __FILE__ ) . 'int/agnosticon.php';

function get_settings_data() {
    return [
        'enabled' => [
            'label' => __('Enable Media Controls', 'mediacontrols'),
            'description' => __('Enable or disable the media controls for all videos on the site.', 'mediacontrols'),
            'type' => 'boolean',
            'icon' => 'power',
            'default' => true,
            'section' => 'general'
        ],
        'showPlayButton' => [
            'label' => __('Play Button', 'mediacontrols'),
            'type' => 'boolean',
            'icon' => 'play',
            'default' => true,
            'section' => 'controls'
        ],
        'showTimeline' => [
            'label' => __('Timeline', 'mediacontrols'),
            'type' => 'boolean',
            'icon' => 'timeline',
            'default' => true,
            'section' => 'controls'
        ],
        'showCurrentTime' => [
            'label' => __('Current Time', 'mediacontrols'),
            'type' => 'boolean',
            'icon' => 'time',
            'default' => true,
            'section' => 'controls'
        ],
        'showDuration' => [
            'label' => __('Duration', 'mediacontrols'),
            'type' => 'boolean',
            'icon' => 'time',
            'default' => true,
            'section' => 'controls'
        ],
        'showMuteButton' => [
            'label' => __('Mute Button', 'mediacontrols'),
            'type' => 'boolean',
            'icon' => 'speaker',
            'default' => true,
            'section' => 'controls'
        ],
        'showVolumeSlider' => [
            'label' => __('Volume Slider', 'mediacontrols'),
            'type' => 'boolean',
            'icon' => 'volume',
            'default' => true,
            'section' => 'controls'
        ],
        'showFullscreenButton' => [
            'label' => __('Fullscreen Button', 'mediacontrols'),
            'type' => 'boolean',
            'icon' => 'fullscreen',
            'default' => true,
            'section' => 'controls'
        ],
        'backgroundColor' => [
            'label' => __('Background Color', 'mediacontrols'),
            'type' => 'color',
            'default' => '#000000',
            'section' => 'style'
        ],
        'backgroundOpacity' => [
            'label' => __('Background Opacity', 'mediacontrols'),
            'type' => 'number',
            'min' => 0,
            'max' => 100,
            'unit' => '%',
            'default' => 55,
            'section' => 'style'
        ],
        'textColor' => [
            'label' => __('Text Color', 'mediacontrols'),
            'type' => 'color',
            'default' => '#FFFFFF',
            'section' => 'style'
        ],
        'panelAnimation' => [
            'label' => __('Panel Animation', 'mediacontrols'),
            'type' => 'select',
            'options' => [
                ['label' => __('Slide', 'mediacontrols'), 'value' => 'slide'],
                ['label' => __('Fade', 'mediacontrols'), 'value' => 'fade'],
                ['label' => __('None', 'mediacontrols'), 'value' => 'none'],
            ],
            'default' => 'slide',
            'section' => 'style'
        ],
    ];
}

// Function to enqueue block editor assets
function enqueue_block_editor_assets() {
    $localize_data = [
        'settings' => get_settings(),
        'data' => get_settings_data(),
    ];
    
    wp_enqueue_script(
        'mediacontrols-editor',
        plugins_url('dist/mediacontrols-editor.js', __FILE__),
        ['wp-blocks', 'wp-element', 'wp-edit-post', 'wp-compose', 'wp-hooks', 'wp-i18n'],
        filemtime(plugin_dir_path(__FILE__) . 'dist/mediacontrols-editor.js'),
        true
    );

    wp_localize_script('mediacontrols-editor', 'mediacontrolsSettings', $localize_data);
}
add_action('enqueue_block_editor_assets', __NAMESPACE__ . '\\enqueue_block_editor_assets');

// Function to enqueue frontend and editor preview assets
function enqueue_block_assets() {
    wp_enqueue_script(
        'mediacontrols',
        plugins_url('dist/mediacontrols.js', __FILE__),
        [],
        filemtime(plugin_dir_path(__FILE__) . 'dist/mediacontrols.js'),
        true
    );

    wp_enqueue_style(
        'mediacontrols',
        plugins_url('dist/mediacontrols.css', __FILE__),
        [],
        filemtime(plugin_dir_path(__FILE__) . 'dist/mediacontrols.css')
    );
}
add_action('enqueue_block_assets', __NAMESPACE__ . '\\enqueue_block_assets');


// Function to apply media controls to supported blocks
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

    $styles = [
        '--x-controls-bg' => $settings['backgroundColor'],
        '--x-controls-bg-opacity' => $settings['backgroundOpacity'] . '%',
        '--x-controls-color' => $settings['textColor'],
        '--x-controls-fade' => $settings['panelAnimation'] === 'fade' ? '1' : '0',
        '--x-controls-slide' => $settings['panelAnimation'] === 'slide' ? '1' : '0',
    ];

    $style = implode('; ', array_map(function($key, $value) {
        return $key . ': ' . $value;
    }, array_keys($styles), array_values($styles)));

    $component->setAttribute('style', $style);

    $doc->insertBefore($component, $container);

    $block_content = $doc->saveHTML();
    libxml_clear_errors();

    return $block_content;
}
add_filter('render_block', __NAMESPACE__ . '\\render_block', 10, 2);
