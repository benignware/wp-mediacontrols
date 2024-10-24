<?php

namespace benignware\wp\mediacontrols;

add_action('admin_menu', __NAMESPACE__ . '\\add_settings_page');
add_action('admin_init', __NAMESPACE__ . '\\register_settings');
add_action('admin_enqueue_scripts', __NAMESPACE__ . '\\enqueue_settings_scripts');

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
        'showFullscreenButton' => [
            'label' => __('Fullscreen Button', 'mediacontrols'),
            'type' => 'boolean',
            'icon' => 'fullscreen',
            'default' => true,
            'section' => 'controls'
        ],
        'showPlayButton' => [
            'label' => __('Play Button', 'mediacontrols'),
            'type' => 'boolean',
            'icon' => 'play',
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
        'backgroundColor' => [
            'label' => __('Background Color', 'mediacontrols'),
            'type' => 'color',
            'default' => '#000000',
            'section' => 'style'
        ],
        'backgroundOpacity' => [
            'label' => __('Background Opacity', 'mediacontrols'),
            'type' => 'range',
            'min' => 0,
            'max' => 100,
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
            'options' => ['slide' => 'Slide', 'fade' => 'Fade', 'none' => 'None'],
            'default' => 'slide',
            'section' => 'style'
        ],
    ];
}

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
    $options = get_settings();

    print_r($options);
    ?>
    <div class="wrap">
        <h1><?php _e('Media Controls Settings', 'text-domain'); ?></h1>
        <form method="post" action="options.php" id="mediacontrols-settings-form">
            <?php settings_fields('mediacontrols_settings_group'); ?>
            <?php do_settings_sections('mediacontrols-settings'); ?>

            <!-- Preview Section -->
            <h2><?php _e('Preview', 'mediacontrols'); ?></h2>
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
     // Get default settings for style
    $defaults = get_default_settings();

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
        __NAMESPACE__ . '\\render_switch_field',
        'mediacontrols-settings',
        'mediacontrols_general_section',
        ['id' => 'enabled', 'default' => $defaults['enabled']]
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
    
    add_settings_field(
        'backgroundColor',
        __('Background Color', 'text-domain'),
        __NAMESPACE__ . '\\render_native_color_picker',
        'mediacontrols-settings',
        'mediacontrols_style_section',
        ['id' => 'backgroundColor', 'default' => $defaults['backgroundColor']]
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
            'default' => $defaults['backgroundOpacity'],
            'unit' => '%' // Add unit for clarity
        ]
    );

    add_settings_field(
        'textColor',
        __('Text Color', 'text-domain'),
        __NAMESPACE__ . '\\render_native_color_picker',
        'mediacontrols-settings',
        'mediacontrols_style_section',
        ['id' => 'textColor', 'default' => $defaults['textColor']]
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
            'default' => $defaults['panelAnimation']
        ]
    );
}

function sanitize_settings($input) {
    // print_r($input);
    // exit;
    $output = [];

    foreach ($input as $key => $value) {
        if ($value === 'null') {
            continue;  // Skip this filter, don't include it in the output
        }

        $output[$key] = sanitize_text_field($input[$key]);
    }

    return $output;
}

function get_settings() {
    $defaults = get_default_settings();
    return get_option('mediacontrols_settings', $defaults);
}

function get_default_settings() {
    $controls = get_controls();
    $default_controls = array_reduce(array_keys($controls), function($acc, $key) use ($controls) {
        $acc[$key] = $controls[$key]['default'];
        return $acc;
    }, []);

    $defaults = array_merge([
        'enabled' => true,
        'backgroundColor' => '#000000',
        'backgroundOpacity' => 55,
        'textColor' => '#FFFFFF',
        'panelAnimation' => 'slide',
    ],  $default_controls);

    return $defaults;
}

function render_switch_field($args) {
    $options = get_option('mediacontrols_settings', get_default_settings());
    $value = isset($options[$args['id']]) ? $options[$args['id']] : $args['default'];
    $checked = $value ? 'checked' : '';
    $id = esc_attr($args['id']);
    ?>
    <label class="mc-switch-wrapper" for="<?php echo esc_attr($args['id']); ?>">
        <input data-sync="<?= $id ?>" type="checkbox" id="<?php echo esc_attr($args['id']); ?>"  value="1" <?php echo esc_attr($checked); ?> class="mc-switch-input" />
        <span class="mc-switch-slider"></span>
        <?php echo esc_html($args['label']); ?>
    </label>
    <input data-sync="<?= $id ?>" type="hidden" name="mediacontrols_settings[<?php echo esc_attr($args['id']); ?>]" id="<?php echo esc_attr($args['id']); ?>_hidden" value="<?php echo esc_attr($args['default']); ?>" data-default="<?php echo esc_attr($args['default']); ?>" />
    <?php
}

function render_native_color_picker($args) {
    $options = get_option('mediacontrols_settings', get_default_settings());
    $value = isset($options[$args['id']]) ? $options[$args['id']] : $args['default'];
    $id = esc_attr($args['id']); 
    ?>
    <input data-sync="<?= $id ?>" type="color" id="<?php echo esc_attr($args['id']); ?>" name="mediacontrols_settings[<?php echo esc_attr($args['id']); ?>]" value="<?php echo esc_attr($value); ?>" />
    <input data-sync="<?= $id ?>" type="hidden" name="mediacontrols_settings[<?php echo esc_attr($args['id']); ?>]" id="<?php echo esc_attr($args['id']); ?>_hidden" value="<?php echo esc_attr($value); ?>" data-default="<?php echo esc_attr($args['default']); ?>" />
    <?php
}

function render_range_field($args) {
    $options = get_option('mediacontrols_settings', get_default_settings());
    $value = isset($options[$args['id']]) ? $options[$args['id']] : $args['default'];
    $id = esc_attr($args['id']);
    ?>
    <input data-sync="<?= $id ?>" type="range" id="<?php echo esc_attr($args['id']); ?>_range" min="<?php echo esc_attr($args['min']); ?>" max="<?php echo esc_attr($args['max']); ?>" value="<?php echo esc_attr($value); ?>" data-unit="<?php echo esc_attr($args['unit']); ?>" />
    <input data-sync="<?= $id ?>" type="number" id="<?php echo esc_attr($args['id']); ?>_number" min="<?php echo esc_attr($args['min']); ?>" max="<?php echo esc_attr($args['max']); ?>" value="<?php echo esc_attr($value); ?>" placeholder="<?php echo esc_attr($args['default']); ?>" data-unit="<?php echo esc_attr($args['unit']); ?>" />
    <input data-sync="<?= $id ?>" type="hidden" name="mediacontrols_settings[<?php echo esc_attr($args['id']); ?>]" id="<?php echo esc_attr($args['id']); ?>_hidden" value="<?php echo esc_attr($value); ?>" data-default="<?php echo esc_attr($args['default']); ?>" />
    <?php
}

function render_select_field($args) {
    $options = get_option('mediacontrols_settings', get_default_settings());
    $value = isset($options[$args['id']]) ? $options[$args['id']] : $args['default'];
    $id = esc_attr($args['id']);
    ?>
    <select data-sync="<?= $id ?>" id="<?php echo esc_attr($args['id']); ?>" name="mediacontrols_settings[style][<?php echo esc_attr($args['id']); ?>]">
        <?php foreach ($args['options'] as $key => $label) : ?>
            <option value="<?php echo esc_attr($key); ?>" <?php selected($value, $key); ?>><?php echo esc_html($label); ?></option>
        <?php endforeach; ?>
    </select>
    <input data-sync="<?= $id ?>" type="hidden" name="mediacontrols_settings[<?php echo esc_attr($args['id']); ?>]" id="<?php echo esc_attr($args['id']); ?>_hidden" value="<?php echo esc_attr($value); ?>" data-default="<?php echo esc_attr($args['default']); ?>" />
    <?php
}

function enqueue_settings_scripts($hook) {
    // if ($hook !== 'mediacontrols-settings') {
    //     return;
    // }
    wp_enqueue_script('mediacontrols-settings', plugins_url('settings.js', __FILE__), [], null, true);
    wp_enqueue_style('mediacontrols-settings', plugins_url('settings.css', __FILE__), [], null);

    wp_enqueue_script('mediacontrols', plugins_url('dist/mediacontrols.js', __FILE__), [], null, true);
    wp_enqueue_style('mediacontrols', plugins_url('dist/mediacontrols.css', __FILE__), [], null);
}