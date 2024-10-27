<?php
/**
 * Plugin Name: Mediacontrols
 * Plugin URI: https://benignware.com
 * Plugin Slug: mediacontrols
 * Description: Consistent media controls across browsers
 * Version: 0.0.12
 * Author: Rafael Nowrotek
 * Author URI: https:/benignware.com
 * Network: true
 */
namespace benignware\wp\mediacontrols;

require plugin_dir_path( __FILE__ ) . 'lib/PluginData.php';
require plugin_dir_path( __FILE__ ) . 'lib/PluginBase.php';
require plugin_dir_path( __FILE__ ) . 'lib/Settings.php';
require plugin_dir_path( __FILE__ ) . 'lib/MediaControls.php';
require plugin_dir_path( __FILE__ ) . 'int/agnosticon.php';

function render_preview_section($options) {
    ob_start();
    ?>
    <h2><?php echo __('Preview', 'mediacontrols'); ?></h2>
    <div id="<?= esc_attr('mediacontrols-preview'); ?>" class="<?= esc_attr($options['enabled'] ? 'is-mediacontrols' : ''); ?>" style="
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
    return ob_get_clean();
  }

return;
// Function to enqueue block editor assets
function enqueue_block_editor_assets() {
    $localize_data = [
        'settings' => get_settings(),
        'data' => get_settings_schema(),
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

    wp_enqueue_script(
        'mediacontrols-preview',
        plugins_url('dist/mediacontrols-preview.js', __FILE__),
        [ 'wp-i18n'],
        filemtime(plugin_dir_path(__FILE__) . 'dist/mediacontrols-preview.js'),
        true
    );
}
add_action('enqueue_block_assets', __NAMESPACE__ . '\\enqueue_block_assets');

