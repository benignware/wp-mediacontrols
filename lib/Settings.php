<?php

namespace benignware\wp\mediacontrols;

class Settings extends PluginBase {
    private $options = [];

    public function __construct($options = []) {
      $this->options = $options;
      
      add_action('admin_menu', [$this, 'add_settings_page']);
      add_action('admin_init', [$this, 'register_settings']);
      add_action('admin_enqueue_scripts', [$this, 'enqueue_settings_scripts']);
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
      $plugin_schema = $this->get_plugin_schema(); // Using get_settings_schema from base
      $settings_data = $plugin_schema['settings']; // Get settings data
  
      register_setting(
          $this->get_plugin_slug() . '_settings_group', // Dynamic group
          $this->get_plugin_slug() . '_settings', // Dynamic settings
          [
              'sanitize_callback' => [$this,'sanitize_settings'],
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
                  isset($setting['section'])
                  && $setting['section'] === 'general'
                  && function_exists(__NAMESPACE__ . '\\render_preview_section')
                    ? [ 'after_section' => render_preview_section($this->get_settings()) ] : []
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

    public function sanitize_settings($input) {
      $output = [];
      $settings_data = $this->get_plugin_schema()['settings'];
  
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
}

new Settings();