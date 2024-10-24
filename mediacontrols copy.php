<?php

namespace benignware\wp\mediacontrols;

add_action('admin_menu', __NAMESPACE__ . '\\add_settings_page');
add_action('admin_init', __NAMESPACE__ . '\\register_settings');
add_action('admin_enqueue_scripts', __NAMESPACE__ . '\\enqueue_settings_scripts');

function add_settings_page() {
    add_theme_page(
        __('Media Controls Settings', 'text-domain'),
        __('Media Controls', 'text-domain'),
        'manage_options',
        'mediacontrols-settings',
        __NAMESPACE__ . '\\render_settings_page'
    );
}

function render_settings_page() {
    $options = get_option('mediacontrols_settings', get_default_settings());
    ?>
    <div class="wrap">
        <h1><?php _e('Media Controls Settings', 'text-domain'); ?></h1>
        <form method="post" action="options.php">
            <?php settings_fields('mediacontrols_settings_group'); ?>
            <?php do_settings_sections('mediacontrols-settings'); ?>

            <!-- Preview Section -->
            <h2><?php _e('Preview', 'text-domain'); ?></h2>
            <div class="is-mediacontrols">
                <video src="<?php echo esc_url(plugins_url('assets/example.mp4', __FILE__)); ?>" controls></video>
            </div>

            <!-- Reset Styles Button -->
            <button type="button" id="reset-settings" class="button"><?php _e('Reset', 'text-domain'); ?></button>
            
            <?php submit_button(); ?>
        </form>
    </div>
    <?php
}

function register_settings() {
    register_setting(
        'mediacontrols_settings_group',
        'mediacontrols_settings',
        [
            'sanitize_callback' => __NAMESPACE__ . '\\sanitize_settings',
            'show_in_rest' => true,
        ]
    );

    add_settings_section(
        'mediacontrols_general_section',
        __('General Settings', 'text-domain'),
        null,
        'mediacontrols-settings'
    );

    add_settings_field(
        'enabled',
        __('Enable Media Controls', 'text-domain'),
        __NAMESPACE__ . '\\render_toggle_field',
        'mediacontrols-settings',
        'mediacontrols_general_section',
        ['id' => 'enabled']
    );

    add_settings_section(
        'mediacontrols_controls_section',
        __('Control Visibility', 'text-domain'),
        null,
        'mediacontrols-settings'
    );

    $controls = get_controls();
    foreach ($controls as $control_name => $control) {
        add_settings_field(
            $control_name,
            $control['label'], // Set label for the left column
            __NAMESPACE__ . '\\render_switch_field',
            'mediacontrols-settings',
            'mediacontrols_controls_section',
            ['id' => $control_name, 'default' => $control['default']] // Pass the default value here
        );
    }

    add_settings_section(
        'mediacontrols_style_section',
        __('Style Settings', 'text-domain'),
        null,
        'mediacontrols-settings'
    );

    // Get default settings for style
    $defaults = get_default_settings();
    
    add_settings_field(
        'backgroundColor',
        __('Background Color', 'text-domain'),
        __NAMESPACE__ . '\\render_native_color_picker',
        'mediacontrols-settings',
        'mediacontrols_style_section',
        ['id' => 'backgroundColor', 'default' => $defaults['style']['backgroundColor']]
    );

    add_settings_field(
        'backgroundOpacity',
        __('Background Opacity', 'text-domain'),
        __NAMESPACE__ . '\\render_range_field',
        'mediacontrols-settings',
        'mediacontrols_style_section',
        [
            'id' => 'backgroundOpacity', 
            'min' => 0, 
            'max' => 100, 
            'default' => $defaults['style']['backgroundOpacity'],
            'unit' => '%' // Add unit for clarity
        ]
    );

    add_settings_field(
        'textColor',
        __('Text Color', 'text-domain'),
        __NAMESPACE__ . '\\render_native_color_picker',
        'mediacontrols-settings',
        'mediacontrols_style_section',
        ['id' => 'textColor', 'default' => $defaults['style']['textColor']]
    );

    add_settings_field(
        'panelAnimation',
        __('Panel Animation', 'text-domain'),
        __NAMESPACE__ . '\\render_select_field',
        'mediacontrols-settings',
        'mediacontrols_style_section',
        [
            'id' => 'panelAnimation', 
            'options' => ['slide' => 'Slide', 'fade' => 'Fade', 'none' => 'None'], 
            'default' => $defaults['style']['panelAnimation']
        ]
    );
}

function sanitize_settings($input) {
    $output = [];
    $output['enabled'] = isset($input['enabled']) ? (bool) $input['enabled'] : false;

    $controls = get_controls();
    foreach ($controls as $control_name => $control) {
        $output['controls'][$control_name] = isset($input['controls'][$control_name]) ? (bool) $input['controls'][$control_name] : $control['default'];
    }

    $output['style'] = [
        'backgroundColor' => sanitize_hex_color($input['style']['backgroundColor']),
        'backgroundOpacity' => intval($input['style']['backgroundOpacity']),
        'textColor' => sanitize_hex_color($input['style']['textColor']),
        'panelAnimation' => sanitize_text_field($input['style']['panelAnimation']),
    ];

    return $output;
}

function get_default_settings() {
    $controls = get_controls();
    $default_controls = array_reduce(array_keys($controls), function($acc, $key) use ($controls) {
        $acc[$key] = $controls[$key]['default'];
        return $acc;
    }, []);

    $defaults = [
        'enabled' => true,
        'controls' => $default_controls,
        'style' => [
            'backgroundColor' => '#000000',
            'backgroundOpacity' => 55,
            'textColor' => '#FFFFFF',
            'panelAnimation' => 'slide',
        ]
    ];

    return $defaults;
}

function get_controls() {
    return [
        'fullscreenButton' => ['label' => __('Fullscreen Button', 'text-domain'), 'default' => true],
        'playButton' => ['label' => __('Play Button', 'text-domain'), 'default' => true],
        'overlayPlayButton' => ['label' => __('Overlay Play Button', 'text-domain'), 'default' => true],
        'muteButton' => ['label' => __('Mute Button', 'text-domain'), 'default' => true],
        'timeline' => ['label' => __('Timeline', 'text-domain'), 'default' => true],
        'volumeSlider' => ['label' => __('Volume Slider', 'text-domain'), 'default' => true],
        'duration' => ['label' => __('Duration', 'text-domain'), 'default' => true],
        'currentTime' => ['label' => __('Current Time', 'text-domain'), 'default' => true],
    ];
}

function render_toggle_field($args) {
    $options = get_option('mediacontrols_settings', get_default_settings());
    $checked = isset($options[$args['id']]) && $options[$args['id']] ? 'checked' : '';
    ?>
    <label class="mc-switch-wrapper" for="<?php echo esc_attr($args['id']); ?>">
        <input type="checkbox" id="<?php echo esc_attr($args['id']); ?>" name="mediacontrols_settings[<?php echo esc_attr($args['id']); ?>]" value="1" <?php echo esc_attr($checked); ?> class="mc-switch-input" />
        <span class="mc-switch-slider"></span>
        <?php echo esc_html(__('Enable Media Controls Globally', 'text-domain')); ?>
    </label>
    <?php
}

function render_switch_field($args) {
    $options = get_option('mediacontrols_settings', get_default_settings());
    $checked = isset($options['controls'][$args['id']]) && $options['controls'][$args['id']] ? 'checked' : '';
    ?>
    <label class="mc-switch-wrapper" for="<?php echo esc_attr($args['id']); ?>">
        <input type="checkbox" id="<?php echo esc_attr($args['id']); ?>" name="mediacontrols_settings[controls][<?php echo esc_attr($args['id']); ?>]" value="1" <?php echo esc_attr($checked); ?> class="mc-switch-input" />
        <span class="mc-switch-slider"></span>
        <?php echo esc_html($args['label']); ?>
    </label>
    <input type="hidden" name="mediacontrols_settings[controls][<?php echo esc_attr($args['id']); ?>]" id="<?php echo esc_attr($args['id']); ?>_hidden" value="<?php echo esc_attr($args['default']); ?>" data-default="<?php echo esc_attr($args['default']); ?>" />
    <?php
}

function render_native_color_picker($args) {
    $options = get_option('mediacontrols_settings', get_default_settings());
    $value = isset($options['style'][$args['id']]) ? $options['style'][$args['id']] : $args['default'];
    ?>
    <input type="color" id="<?php echo esc_attr($args['id']); ?>" name="mediacontrols_settings[style][<?php echo esc_attr($args['id']); ?>]" value="<?php echo esc_attr($value); ?>" />
    <input type="hidden" name="mediacontrols_settings[style][<?php echo esc_attr($args['id']); ?>]" id="<?php echo esc_attr($args['id']); ?>_hidden" value="<?php echo esc_attr($value); ?>" data-default="<?php echo esc_attr($args['default']); ?>" />
    <?php
}

function render_range_field($args) {
    $options = get_option('mediacontrols_settings', get_default_settings());
    $value = isset($options['style'][$args['id']]) ? $options['style'][$args['id']] : $args['default'];
    ?>
    <input type="range" id="<?php echo esc_attr($args['id']); ?>_range" min="<?php echo esc_attr($args['min']); ?>" max="<?php echo esc_attr($args['max']); ?>" value="<?php echo esc_attr($value); ?>" data-unit="<?php echo esc_attr($args['unit']); ?>" />
    <input type="number" id="<?php echo esc_attr($args['id']); ?>_number" min="<?php echo esc_attr($args['min']); ?>" max="<?php echo esc_attr($args['max']); ?>" value="<?php echo esc_attr($value); ?>" placeholder="<?php echo esc_attr($args['default']); ?>" data-unit="<?php echo esc_attr($args['unit']); ?>" />
    <input type="hidden" name="mediacontrols_settings[style][<?php echo esc_attr($args['id']); ?>]" id="<?php echo esc_attr($args['id']); ?>_hidden" value="<?php echo esc_attr($value); ?>" data-default="<?php echo esc_attr($args['default']); ?>" />
    <?php
}

function render_select_field($args) {
    $options = get_option('mediacontrols_settings', get_default_settings());
    $value = isset($options['style'][$args['id']]) ? $options['style'][$args['id']] : $args['default'];
    ?>
    <select id="<?php echo esc_attr($args['id']); ?>" name="mediacontrols_settings[style][<?php echo esc_attr($args['id']); ?>]">
        <?php foreach ($args['options'] as $key => $label) : ?>
            <option value="<?php echo esc_attr($key); ?>" <?php selected($value, $key); ?>><?php echo esc_html($label); ?></option>
        <?php endforeach; ?>
    </select>
    <input type="hidden" name="mediacontrols_settings[style][<?php echo esc_attr($args['id']); ?>]" id="<?php echo esc_attr($args['id']); ?>_hidden" value="<?php echo esc_attr($value); ?>" data-default="<?php echo esc_attr($args['default']); ?>" />
    <?php
}

function enqueue_settings_scripts($hook) {
    // if ($hook !== 'theme_page_mediacontrols-settings') {
    //     return;
    // }

    wp_enqueue_style('mediacontrols-settings', plugin_dir_url(__FILE__) . '/settings.css');
    wp_enqueue_script('mediacontrols-settings', plugin_dir_url(__FILE__) . '/settings.js', [], null, true);
}
