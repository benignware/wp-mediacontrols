<?php

namespace benignware\wp\mediacontrols;

class MediaControls {
    
    public function __construct() {
        // Hook to enqueue the dynamically generated stylesheet
        add_action('wp_enqueue_scripts', [$this, 'enqueue_dynamic_stylesheet']);
    }

    /**
     * Generate the dynamic CSS and enqueue it
     */
    public function enqueue_dynamic_stylesheet() {
        // Register the style and attach the generated CSS file
        $handle = 'mediacontrols-dynamic-styles';
        wp_register_style($handle, false); // Register without a file URL
        
        // Add inline style with dynamically generated CSS
        wp_add_inline_style($handle, $this->generate_css());

        // Enqueue the style
        wp_enqueue_style($handle);
    }

    /**
     * Generate the dynamic CSS
     */
    private function generate_css() {
        // Define default properties for x-mediacontrols
        $default_properties = [
            '--x-icon-play' => '▶',
            '--x-icon-pause' => '⏸',
            '--x-icon-expand' => '⛶',
            '--x-icon-collapse' => '⛶',
            '--x-icon-unmute' => '\\1F50A',
        ];

        // Apply the filter to allow modifications
        $properties = apply_filters('mediacontrols_css', $default_properties);

        // Generate the CSS string
        $css = 'x-mediacontrols {';
        foreach ($properties as $property => $value) {
            $css .= "--{$property}: {$value};";
        }
        $css .= '}';

        return $css;
    }
}

// Initialize the MediaControls class
new MediaControls();

