<?php

namespace benignware\wp\mediacontrols;

class Settings extends PluginBase {

    public function __construct() {
        parent::__construct();
        add_action('admin_menu', [$this, 'add_settings_page']);
        add_action('admin_init', [$this, 'register_settings']);
        add_action('admin_enqueue_scripts', [$this, 'enqueue_settings_scripts']);
    }

    public function get_settings() {
      return get_settings();
    }

    public function get_settings_schema() {
      return get_settings_schema();
    }

    public function enqueue_settings_scripts($hook) {
      if ($hook !== 'appearance_page_' . $this->get_plugin_slug() . '-settings') {
          return;
      }
  
      $this->enqueue_script(
          $this->get_plugin_slug() . '-settings',
          'dist/' . $this->get_plugin_slug() . '-settings.js',
          [],
          true
      );
  
      $this->enqueue_style(
          $this->get_plugin_slug() . '-settings',
          'dist/' . $this->get_plugin_slug() . '-settings.css',
          [],
          null
      );
    }
  

    public function add_settings_page() {
      add_theme_page(
          $this->get_plugin_name(),
          $this->get_plugin_name(),
          'manage_options',
          $this->get_plugin_slug() . '-settings',
          [$this, 'render_settings_page']
      );
    }

    public function render_settings_page() {
      $plugin_data = $this->get_plugin_data(); // Get plugin data
      $options = $this->get_settings(); // Using get_settings from base
      ?>
      <div class="wrap">
          <h1><?= esc_html($this->get_plugin_name() . ' ' . $this->__('Settings')); ?></h1>
          <form method="post" action="options.php" id="<?= esc_attr($this->get_plugin_slug() . '-settings'); ?>">
              <?php settings_fields($this->get_plugin_slug() . '_settings_group'); ?>
              <?php do_settings_sections($this->get_plugin_slug() . '-settings'); ?>
  
              <p>
                  <?php submit_button('', 'primary', 'submit', false); ?><br/>
                  <!-- Reset Styles Button -->
                  <button
                      type="button"
                      id="<?= esc_attr($this->get_plugin_slug() . '-reset-button'); ?>"
                      class="button button-small"
                      style="margin-top: 0.45rem"
                  >
                      <?= $this->__('Reset'); ?>
                  </button>
              </p>
          </form>
      </div>
      <?php
    }  

    public function register_settings() {
      $plugin_data = $this->get_plugin_data(); // Get plugin data
      $settings_data = $this->get_settings_schema(); // Using get_settings_schema from base
  
      register_setting(
          $this->get_plugin_slug() . '_settings_group', // Dynamic group
          $this->get_plugin_slug() . '_settings', // Dynamic settings
          [
              'sanitize_callback' => __NAMESPACE__ . '\\sanitize_settings',
              'show_in_rest' => true,
          ]
      );
  
      // Loop over the settings data and add fields programmatically
      foreach ($settings_data as $setting_id => $setting) {
          $section = $setting['section'] . '_section'; // Create section ID
          if (!has_action($this->get_plugin_slug() . '-settings', $section)) {
              add_settings_section(
                  $this->get_plugin_slug() . '_' . $setting['section'] . '_section',
                  ucfirst($setting['section']) . ' ' . $this->__('Settings'), // Using the translation method
                  null,
                  $this->get_plugin_slug() . '-settings',
                  isset($setting['section']) && $setting['section'] === 'general' ? [
                    'after_section' => $this->render_preview_section()
                ] : []
              );
          }
  
          add_settings_field(
              $setting_id,
              $this->__($setting['label']), // Using the translation method
              [$this, 'render_field_by_type'],
              $this->get_plugin_slug() . '-settings',
              $this->get_plugin_slug() . '_' . $setting['section'] . '_section',
              ['id' => $setting_id, 'setting' => $setting]
          );
      }
    }

    public function render_field_by_type($args) {
      $setting_id = $args['id'];
      $setting = $args['setting'];
      $options = get_option($this->get_plugin_slug() . '_settings');
      $value = $options[$setting_id] ?? null;

      switch ($setting['type']) {
          case 'boolean':
              $this->render_switch_field(['id' => $setting_id, 'label' => $setting['label'], 'default' => $setting['default'], 'value' => $value]);
              break;
          case 'color':
              $this->render_color_picker(['id' => $setting_id, 'default' => $setting['default'], 'value' => $value]);
              break;
          case 'number':
          case 'range':
              $this->render_range_field([
                  'id' => $setting_id, 
                  'min' => $setting['min'], 
                  'max' => $setting['max'], 
                  'default' => $setting['default'],
                  'unit' => '%',
                  'value' => $value
              ]);
              break;
          case 'select':
              $this->render_select_field([
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
      <input data-sync="<?= $id ?>" type="hidden" data-type="boolean" name="<?php echo $this->get_plugin_slug(); ?>_settings[<?php echo $id; ?>]" id="<?php echo $id; ?>_hidden" value="<?= esc_attr($value) ?>" data-default="<?php echo esc_attr($args['default']); ?>" <?= $disabled ?> />
      <?php
    }

  public function render_color_picker($args) {
      $id = esc_attr($args['id']);
      $custom = $args['value'] ?? null;
      $value = $custom !== null ? $custom : $args['default'];
      $disabled = $custom === null ? 'disabled' : '';
      ?>
      <input data-sync="<?= $id ?>" type="color" id="<?php echo $id; ?>" value="<?php echo esc_attr($value); ?>" />
      <input data-sync="<?= $id ?>" type="hidden" name="<?php echo $this->get_plugin_slug(); ?>_settings[<?php echo $id; ?>]" id="<?php echo $id; ?>_hidden" value="<?php echo esc_attr($custom); ?>" data-default="<?php echo esc_attr($args['default']); ?>" <?= $disabled ?> />
      <?php
  }

  public function render_range_field($args) {
      $id = esc_attr($args['id']);
      $custom = $args['value'] ?? null;
      $value = $custom !== null ? $custom : $args['default'];
      $disabled = $custom === null ? 'disabled' : '';
      ?>
      <input data-sync="<?= $id ?>" type="range" id="<?php echo $id; ?>_range" min="<?php echo esc_attr($args['min']); ?>" max="<?php echo esc_attr($args['max']); ?>" value="<?php echo esc_attr($value); ?>" data-unit="<?php echo esc_attr($args['unit']); ?>" />
      <input data-sync="<?= $id ?>" type="number" id="<?php echo $id; ?>_number" min="<?php echo esc_attr($args['min']); ?>" max="<?php echo esc_attr($args['max']); ?>" value="<?php echo esc_attr($value); ?>" placeholder="<?php echo esc_attr($args['default']); ?>" data-unit="<?php echo esc_attr($args['unit']); ?>" />
      <input data-sync="<?= $id ?>" type="hidden" name="<?php echo $this->get_plugin_slug(); ?>_settings[<?php echo $id; ?>]" id="<?php echo $id; ?>_hidden" value="<?php echo esc_attr($custom); ?>" data-default="<?php echo esc_attr($args['default']); ?>" <?= $disabled ?> />
      <?php
  }

  public function render_select_field($args) {
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
      <input data-sync="<?= $id ?>" type="hidden" name="<?php echo $this->get_plugin_slug(); ?>_settings[<?php echo $id; ?>]" id="<?php echo $id; ?>_hidden" value="<?php echo esc_attr($custom); ?>" data-default="<?php echo esc_attr($args['default']); ?>" <?= $disabled ?> />
      <?php
  }

  public function render_preview_section() {
    $options = $this->get_settings();
    ob_start();
    ?>
    <h2><?php echo $this->__('Preview'); ?></h2>
    <div id="<?= esc_attr($this->get_plugin_slug() . '-preview'); ?>" class="<?= esc_attr($options['enabled'] ? 'is-' . $this->get_plugin_slug() : ''); ?>" style="
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        max-width: 520px;
    ">
        <video
            style="width: 100%; height: auto;"
            src="<?php echo esc_url(plugins_url('assets/example.mp4', $this->get_plugin_file())); ?>"
            controls
        ></video>
    </div>
    <?php
    return ob_get_clean();
  }
}

new Settings();