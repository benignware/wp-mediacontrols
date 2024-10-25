<?php

namespace benignware\wp\mediacontrols;

function add_settings_page() {
    add_theme_page(
        __('Media Controls Settings', get_plugin_textdomain()), // Replaced 'text-domain'
        __(get_plugin_name(), get_plugin_textdomain()), // Replaced 'Media Controls' text
        'manage_options',
        get_plugin_slug() . '-settings', // Replaced 'mediacontrols-settings'
        __NAMESPACE__ . '\\render_settings_page'
    );
}
add_action('admin_menu', __NAMESPACE__ . '\\add_settings_page');

function render_settings_page() {
    $options = get_settings();
    ?>
    <div class="wrap">
        <h1><?= esc_html(get_plugin_name() . ' ' . __('Settings', get_plugin_textdomain())); ?></h1>
        <form method="post" action="options.php" id="<?= esc_attr(get_plugin_slug() . '-settings'); ?>">
            <?php settings_fields(get_plugin_slug() . '_settings_group'); ?>
            <?php do_settings_sections(get_plugin_slug() . '-settings'); ?>

            <p>
                <?php submit_button('', 'primary', 'submit', false); ?><br/>
                <!-- Reset Styles Button -->
                <button
                    type="button"
                    id="<?= esc_attr(get_plugin_slug() . '-reset-button'); ?>"
                    class="button button-small"
                    style="margin-top: 0.45rem"
                >
                    <?php _e('Reset', get_plugin_textdomain()); ?>
                </button>
            </p>
        </form>
    </div>
    <?php
}

function register_settings() {
    $settings_data = get_settings_schema();

    register_setting(
        get_plugin_slug() . '_settings_group', // Replaced 'mediacontrols_settings_group'
        get_plugin_slug() . '_settings', // Replaced 'mediacontrols_settings'
        [
            'sanitize_callback' => __NAMESPACE__ . '\\sanitize_settings',
            'show_in_rest' => true,
        ]
    );

    // Loop over the settings data and add fields programmatically
    foreach ($settings_data as $setting_id => $setting) {
        $section = $setting['section'] . '_section'; // Create section ID
        if (!has_action(get_plugin_slug() . '-settings', $section)) {
            
            add_settings_section(
                get_plugin_slug() . '_' . $setting['section'] . '_section',
                ucfirst($setting['section']) . ' ' . __('Settings', get_plugin_textdomain()),
                null,
                get_plugin_slug() . '-settings',
                isset($setting['section']) && $setting['section'] === 'general' ? [
                    'after_section' => render_preview_section()
                ] : []
            );
        }

        $callback = __NAMESPACE__ . '\\render_field_by_type';
        add_settings_field(
            $setting_id,
            $setting['label'],
            $callback,
            get_plugin_slug() . '-settings',
            get_plugin_slug() . '_' . $setting['section'] . '_section',
            ['id' => $setting_id, 'setting' => $setting]
        );
    }
}
add_action('admin_init', __NAMESPACE__ . '\\register_settings');

function sanitize_settings($input) {
    $output = [];
    $settings_data = get_settings_schema();

    foreach ($settings_data as $setting_id => $setting) {
        $type = $setting['type'];

        $is_value = isset($input[$setting_id]);
        
        if (!$is_value) {
            continue;
        }

        $value = $input[$setting_id];

        switch ($type) {
            case 'boolean':
                $output[$setting_id] = $value ? '1' : '';
                break;
            case 'color':
                $output[$setting_id] = sanitize_hex_color($value);
                break;
            case 'range':
            case 'number':
                $output[$setting_id] = intval($value);
                break;
            case 'select':
                $output[$setting_id] = sanitize_text_field($value);
                break;
        }
    }

    return $output;
}

// Render field by type
function render_field_by_type($args) {
    $setting_id = $args['id'];
    $setting = $args['setting'];
    $options = get_option(get_plugin_slug() . '_settings');
    $value = $options[$setting_id] ?? null;

    switch ($setting['type']) {
        case 'boolean':
            render_switch_field(['id' => $setting_id, 'label' => $setting['label'], 'default' => $setting['default'], 'value' => $value]);
            break;
        case 'color':
            render_color_picker(['id' => $setting_id, 'default' => $setting['default'], 'value' => $value]);
            break;
        case 'number':
        case 'range':
            render_range_field([
                'id' => $setting_id, 
                'min' => $setting['min'], 
                'max' => $setting['max'], 
                'default' => $setting['default'],
                'unit' => '%',
                'value' => $value
            ]);
            break;
        case 'select':
            render_select_field([
                'id' => $setting_id,
                'options' => $setting['options'],
                'default' => $setting['default'],
                'value' => $value
            ]);
            break;
    }
}


function render_switch_field($args) {
    $id = esc_attr($args['id']);
    $custom = $args['value'] ?? null;
    $value = $custom !== null ? $custom : $args['default'];
    $disabled = $custom === null ? 'disabled' : '';
    $checked = $value ? 'checked' : '';
    ?>
    <label class="mc-switch-wrapper" for="<?php echo $id; ?>">
        <input data-sync="<?= $id ?>" type="checkbox" id="<?php echo $id; ?>" value="1" <?php echo esc_attr($checked); ?> class="mc-switch-input" />
        <span class="mc-switch-slider"></span>
        <?php echo esc_html($args['label']); ?>
    </label>
    <input data-sync="<?= $id ?>" type="hidden" data-type="boolean" name="<?php echo get_plugin_slug(); ?>_settings[<?php echo $id; ?>]" id="<?php echo $id; ?>_hidden" value="<?= esc_attr($value) ?>" data-default="<?php echo esc_attr($args['default']); ?>" <?= $disabled ?> />
    <?php
}

function render_color_picker($args) {
    $id = esc_attr($args['id']);
    $custom = $args['value'] ?? null;
    $value = $custom !== null ? $custom : $args['default'];
    $disabled = $custom === null ? 'disabled' : '';
    ?>
    <input data-sync="<?= $id ?>" type="color" id="<?php echo $id; ?>" value="<?php echo esc_attr($value); ?>" />
    <input data-sync="<?= $id ?>" type="hidden" name="<?php echo get_plugin_slug(); ?>_settings[<?php echo $id; ?>]" id="<?php echo $id; ?>_hidden" value="<?php echo esc_attr($custom); ?>" data-default="<?php echo esc_attr($args['default']); ?>" <?= $disabled ?> />
    <?php
}

function render_range_field($args) {
    $id = esc_attr($args['id']);
    $custom = $args['value'] ?? null;
    $value = $custom !== null ? $custom : $args['default'];
    $disabled = $custom === null ? 'disabled' : '';
    ?>
    <input data-sync="<?= $id ?>" type="range" id="<?php echo $id; ?>_range" min="<?php echo esc_attr($args['min']); ?>" max="<?php echo esc_attr($args['max']); ?>" value="<?php echo esc_attr($value); ?>" data-unit="<?php echo esc_attr($args['unit']); ?>" />
    <input data-sync="<?= $id ?>" type="number" id="<?php echo $id; ?>_number" min="<?php echo esc_attr($args['min']); ?>" max="<?php echo esc_attr($args['max']); ?>" value="<?php echo esc_attr($value); ?>" placeholder="<?php echo esc_attr($args['default']); ?>" data-unit="<?php echo esc_attr($args['unit']); ?>" />
    <input data-sync="<?= $id ?>" type="hidden" name="<?php echo get_plugin_slug(); ?>_settings[<?php echo $id; ?>]" id="<?php echo $id; ?>_hidden" value="<?php echo esc_attr($custom); ?>" data-default="<?php echo esc_attr($args['default']); ?>" <?= $disabled ?> />
    <?php
}

function render_select_field($args) {
    $id = esc_attr($args['id']);
    $custom = $args['value'] ?? null;
    $value = $custom !== null ? $custom : $args['default'];
    $disabled = $custom === null ? 'disabled' : '';
    ?>
    <select data-sync="<?= $id ?>" id="<?php echo $id; ?>">
        <?php foreach ($args['options'] as $option) : ?>
            <option value="<?php echo esc_attr($option['value']); ?>" <?php selected($value, $option['value']); ?>><?php echo esc_html($option['label']); ?></option>
        <?php endforeach; ?>
    </select>
    <input data-sync="<?= $id ?>" type="hidden" name="<?php echo get_plugin_slug(); ?>_settings[<?php echo $id; ?>]" id="<?php echo $id; ?>_hidden" value="<?php echo esc_attr($custom); ?>" data-default="<?php echo esc_attr($args['default']); ?>" <?= $disabled ?> />
    <?php
}

function enqueue_settings_scripts($hook) {
    if ($hook !== 'appearance_page_' . get_plugin_slug() . '-settings') {
        return;
    }

    wp_enqueue_script(
        get_plugin_slug() . '-settings',
        plugins_url('dist/' . get_plugin_slug() . '-settings.js', __FILE__),
        [],
        null,
        true
    );

    wp_enqueue_style(
        get_plugin_slug() . '-settings',
        plugins_url('dist/' . get_plugin_slug() . '-settings.css', __FILE__),
        [],
        null
    );

    wp_enqueue_script(
        get_plugin_slug(),
        plugins_url('dist/' . get_plugin_slug() . '.js', __FILE__),
        [],
        null,
        true
    );

    wp_enqueue_style(
        get_plugin_slug(),
        plugins_url('dist/' . get_plugin_slug() . '.css', __FILE__),
        [],
        null
    );

    wp_enqueue_script(
        get_plugin_slug() . '-preview',
        plugins_url('dist/' . get_plugin_slug() . '-preview.js', __FILE__),
        [],
        null,
        true
    );
}
add_action('admin_enqueue_scripts', __NAMESPACE__ . '\\enqueue_settings_scripts');

function render_preview_section() {
    $options = get_settings();
    $output = '';

    ob_start();
    ?>
    <!-- Preview Section -->
    <h2><?php _e('Preview', get_plugin_textdomain()); ?></h2>
    <div id="<?= get_plugin_slug() ?>-preview" class="<?= $options['enabled'] ? 'is-' . get_plugin_slug() : '' ?> " style="
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        max-width: 520px;
    ">
        <video
            style="width: 100%; height: auto;"
            src="<?php echo esc_url(plugins_url('assets/example.mp4', __FILE__)); ?>"
            controls
        ></video>
    </div>
    <?php

    $output = ob_get_clean();

    return $output;
}
