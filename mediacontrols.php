<?php
/**
 * Plugin Name: Mediacontrols
 * Plugin URI: https://benignware.com
 * Plugin Slug: mediacontrols
 * Description: Consistent media controls across browsers
 * Version: 0.1.1
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
